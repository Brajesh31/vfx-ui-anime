import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { spawn, execFile } from "node:child_process";
import { promisify } from "node:util";
import { extname, resolve, sep } from "node:path";
import { existsSync } from "node:fs";

const execFileAsync = promisify(execFile);
const root = process.cwd();
const browserCandidates = [
  process.env.CHROME_BIN,
  "google-chrome",
  "google-chrome-stable",
  "chromium",
  "chromium-browser"
].filter(Boolean);

async function findBrowser() {
  for (const candidate of browserCandidates) {
    if (candidate.includes(sep) && existsSync(candidate)) return candidate;
    try {
      const { stdout } = await execFileAsync("which", [candidate]);
      const path = stdout.trim();
      if (path) return path;
    } catch {
      // Try the next supported browser executable name.
    }
  }
  throw new Error("Chromium was not found. Install Chromium or set CHROME_BIN to its executable path.");
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8"
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const target = resolve(root, "." + pathname);
    if (target !== root && !target.startsWith(root + sep)) {
      response.writeHead(403).end("Forbidden");
      return;
    }
    const content = await readFile(target);
    response.writeHead(200, {
      "content-type": mimeTypes[extname(target)] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(content);
  } catch {
    response.writeHead(404).end("Not found");
  }
});

let browserProcess;
try {
  const browser = await findBrowser();
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/tests/browser.html`;
  const args = [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    "--disable-dev-shm-usage",
    "--disable-background-networking",
    "--disable-extensions",
    "--no-first-run",
    "--no-default-browser-check",
    "--virtual-time-budget=1500",
    "--dump-dom",
    url
  ];

  browserProcess = spawn(browser, args, { stdio: ["ignore", "pipe", "pipe"] });
  let stdout = "";
  let stderr = "";
  browserProcess.stdout.setEncoding("utf8");
  browserProcess.stderr.setEncoding("utf8");
  browserProcess.stdout.on("data", (chunk) => { stdout += chunk; });
  browserProcess.stderr.on("data", (chunk) => { stderr += chunk; });

  const exitCode = await new Promise((resolveExit, rejectExit) => {
    const timeout = setTimeout(() => {
      browserProcess.kill("SIGKILL");
      rejectExit(new Error("Chromium browser tests exceeded the 45-second timeout."));
    }, 45000);
    browserProcess.once("error", (error) => {
      clearTimeout(timeout);
      rejectExit(error);
    });
    browserProcess.once("close", (code) => {
      clearTimeout(timeout);
      resolveExit(code ?? 1);
    });
  });

  if (exitCode !== 0) {
    process.stderr.write(stderr);
    throw new Error(`Chromium exited with status ${exitCode}.`);
  }

  const status = stdout.match(/<body[^>]*data-browser-test-status="(passed|failed)"/)?.[1];
  const reportText = stdout.match(/<pre id="browser-test-results">([\s\S]*?)<\/pre>/)?.[1];
  if (!status || !reportText) {
    process.stderr.write(stderr);
    throw new Error("Chromium did not return the browser test report. Check the browser output and page scripts.");
  }

  let report;
  try {
    report = JSON.parse(reportText);
  } catch {
    throw new Error("The browser test report was not valid JSON.");
  }

  console.log(`Chromium ${report.browser}`);
  for (const result of report.results) {
    console.log(`${result.status === "passed" ? "PASS" : "FAIL"}  ${result.name}`);
    if (result.message) console.error(`      ${result.message}`);
  }
  if (report.errors.length) {
    console.error("Uncaught browser errors:", report.errors.join("; "));
  }
  console.log(`Browser interaction tests: ${report.passed} passed, ${report.failed} failed.`);

  if (status !== "passed" || report.failed || report.errors.length) process.exitCode = 1;
} finally {
  browserProcess?.kill("SIGTERM");
  await new Promise((resolveClose) => {
    if (!server.listening) return resolveClose();
    server.close(resolveClose);
  });
}
