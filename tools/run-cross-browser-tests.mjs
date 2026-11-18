import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";
import { chromium, firefox, webkit } from "playwright";

const root = process.cwd();
const engines = [
  ["Firefox", firefox],
  ["WebKit", webkit]
];
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

let failed = false;
const launched = [];
try {
  await new Promise((resolveListen, rejectListen) => {
    server.once("error", rejectListen);
    server.listen(0, "127.0.0.1", resolveListen);
  });
  const address = server.address();
  const url = `http://127.0.0.1:${address.port}/tests/browser.html`;

  for (const [name, engine] of engines) {
    let browser;
    try {
      browser = await engine.launch({ headless: true });
      launched.push(browser);
      const page = await browser.newPage();
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") pageErrors.push(message.text());
      });

      await page.goto(url, { waitUntil: "load" });
      await page.waitForFunction(
        () => ["passed", "failed"].includes(document.body.dataset.browserTestStatus),
        null,
        { timeout: 30000 }
      );

      const report = await page.evaluate(() => ({
        status: document.body.dataset.browserTestStatus,
        text: document.querySelector("#browser-test-results")?.textContent || ""
      }));
      const result = JSON.parse(report.text);
      console.log(`\n${name} ${result.browser}`);

      for (const test of result.results) {
        console.log(`${test.status === "passed" ? "PASS" : "FAIL"}  ${test.name}`);
        if (test.message) console.error(`      ${test.message}`);
      }

      if (pageErrors.length) {
        failed = true;
        console.error(`${name} uncaught page/console errors:`, pageErrors.join("; "));
      }
      console.log(`${name} interaction tests: ${result.passed} passed, ${result.failed} failed.`);

      if (report.status !== "passed" || result.failed || pageErrors.length) failed = true;
    } catch (error) {
      failed = true;
      console.error(`\n${name} browser run failed: ${error?.stack || error}`);
    } finally {
      await browser?.close();
    }
  }
} finally {
  await Promise.all(launched.map((browser) => browser.close().catch(() => {})));
  await new Promise((resolveClose) => {
    if (!server.listening) return resolveClose();
    server.close(resolveClose);
  });
}

if (failed) process.exitCode = 1;
