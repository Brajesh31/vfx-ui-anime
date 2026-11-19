import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { createReadStream, existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve, sep } from 'node:path';
import { createRequire } from 'node:module';

const root = process.cwd();
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const names = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8')).items.map((item) => item.name);
const indexSource = readFileSync(join(root, 'index.js'), 'utf8');
const namesMatch = indexSource.match(/export const componentNames = Object\.freeze\(\[([\s\S]*?)\]\);/);
assert.ok(namesMatch, 'index.js must export componentNames');
const entryNames = [...namesMatch[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]);
assert.deepEqual(entryNames, names, 'package entry point and registry lists must match');
assert.equal(manifest.private, undefined);
assert.equal(manifest.exports?.['.'], './index.js');
assert.equal(manifest.exports?.['./*'], './components/*/index.js');
assert.equal(manifest.exports?.['./components/*'], './components/*/index.js');
assert.equal(manifest.sideEffects, true);

function parsePackJson(output) {
  const start = output.indexOf('[');
  if (start < 0) throw new Error('npm pack --json returned no JSON output: ' + output.slice(0, 500));
  return JSON.parse(output.slice(start));
}

console.log('Inspecting npm pack --dry-run...');
const dryRun = parsePackJson(execFileSync('npm', ['pack', '--dry-run', '--json'], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
assert.equal(dryRun[0].name, manifest.name);
assert.equal(dryRun[0].version, manifest.version);
const packedPaths = new Set(dryRun[0].files.map((file) => file.path));
const required = ['package.json', 'README.md', 'LICENSE', 'index.js', 'docs/COMPONENTS.md'];
for (const name of names) {
  required.push('components/' + name + '/index.js');
  required.push('components/' + name + '/README.md');
}
for (const path of required) assert.ok(packedPaths.has(path), 'tarball is missing ' + path);
for (const path of packedPaths) assert.ok(!/^(gallery|tools|art|\.github)\//.test(path), 'unexpected development/site file in tarball: ' + path);
console.log('Tarball includes all 82 scripts and API READMEs, without gallery or development tooling.');

const temp = mkdtempSync(join(tmpdir(), 'vfx-ui-anime-package-'));
let chrome;
let server;
let ws;
let profile;
try {
  const tarballDir = join(temp, 'tarball');
  const consumerDir = join(temp, 'consumer');
  const fixtureDir = join(consumerDir, 'fixtures');
  const consumerPackage = join(consumerDir, 'package.json');
  const { mkdir } = await import('node:fs/promises');
  await mkdir(tarballDir, { recursive: true });
  await mkdir(fixtureDir, { recursive: true });
  writeFileSync(consumerPackage, JSON.stringify({ name: 'vfx-ui-anime-consumer-smoke', version: '1.0.0', private: true, type: 'module' }));
  const packed = parsePackJson(execFileSync('npm', ['pack', '--json', '--pack-destination', tarballDir], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }));
  const tarball = join(tarballDir, packed[0].filename);
  assert.ok(existsSync(tarball));

  console.log('Installing the tarball offline into an empty consumer...');
  execFileSync('npm', ['install', '--offline', '--ignore-scripts', '--no-audit', '--no-fund', tarball], { cwd: consumerDir, encoding: 'utf8', stdio: 'pipe' });
  const installed = join(consumerDir, 'node_modules', manifest.name);
  const requireFromConsumer = createRequire(consumerPackage);
  assert.equal(requireFromConsumer.resolve(manifest.name), join(installed, 'index.js'));
  for (const name of names) assert.equal(requireFromConsumer.resolve(manifest.name + '/' + name), join(installed, 'components', name, 'index.js'), 'unresolved export: ' + name);

  const imports = { [manifest.name]: '/node_modules/' + manifest.name + '/index.js' };
  for (const name of names) {
    imports[manifest.name + '/' + name] = '/node_modules/' + manifest.name + '/components/' + name + '/index.js';
    imports[manifest.name + '/components/' + name] = '/node_modules/' + manifest.name + '/components/' + name + '/index.js';
  }
  const map = '<script type="importmap">' + JSON.stringify({ imports }) + '</script>';
  const rootHtml = '<!doctype html><html><head>' + map + '</head><body><script type="module">' +
    'try{const api=await import(' + JSON.stringify(manifest.name) + ');' +
    'const missing=api.componentTags.filter(tag=>!customElements.get(tag));let subpaths=0;' +
    'for(const name of api.componentNames){await import(' + JSON.stringify(manifest.name + '/') + '+name);subpaths++;}' +
    'const button=document.createElement("vfx-button");document.body.append(button);' +
    'await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));' +
    'document.body.dataset.packageSmoke=JSON.stringify({status:"ok",version:api.version,count:api.componentNames.length,tags:api.componentTags.length,missing,subpaths,coreVersion:window.VFXAnimeFX&&window.VFXAnimeFX.version,buttonShadow:!!button.shadowRoot});' +
    '}catch(error){document.body.dataset.packageSmoke=JSON.stringify({status:"error",error:error.stack||error.message});}</script></body></html>';
  const singleHtml = '<!doctype html><html><head>' + map + '</head><body><script type="module">' +
    'try{await import(' + JSON.stringify(manifest.name + '/button') + ');' +
    'const button=document.createElement("vfx-button");document.body.append(button);' +
    'await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));' +
    'document.body.dataset.singleSmoke=JSON.stringify({status:"ok",button:!!customElements.get("vfx-button"),toggle:!!customElements.get("vfx-toggle"),coreVersion:window.VFXAnimeFX&&window.VFXAnimeFX.version,shadow:!!button.shadowRoot});' +
    '}catch(error){document.body.dataset.singleSmoke=JSON.stringify({status:"error",error:error.stack||error.message});}</script></body></html>';
  writeFileSync(join(fixtureDir, 'index.html'), rootHtml);
  writeFileSync(join(fixtureDir, 'single.html'), singleHtml);

  server = createServer((request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname); } catch { response.writeHead(400).end(); return; }
    if (pathname === '/') pathname = '/fixtures/index.html';
    if (pathname === '/single') pathname = '/fixtures/single.html';
    const filePath = resolve(consumerDir, '.' + pathname);
    if (filePath !== consumerDir && !filePath.startsWith(consumerDir + sep)) { response.writeHead(403).end(); return; }
    try {
      if (!statSync(filePath).isFile()) throw new Error('not a file');
      const type = extname(filePath) === '.js' ? 'text/javascript; charset=utf-8' : 'text/html; charset=utf-8';
      response.writeHead(200, { 'Content-Type': type, 'Cache-Control': 'no-store' });
      createReadStream(filePath).pipe(response);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise((resolveListen, rejectListen) => { server.once('error', rejectListen); server.listen(0, '127.0.0.1', resolveListen); });
  const port = server.address().port;
  const chromePath = process.env.CHROME || ['/usr/bin/google-chrome','/usr/bin/chromium','/usr/bin/chromium-browser','/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(existsSync);
  assert.ok(chromePath, 'Chrome/Chromium required for package smoke test; set CHROME to its executable.');
  const debugPort = 20000 + Math.floor(Math.random() * 40000);
  profile = mkdtempSync(join(tmpdir(), 'vfx-ui-anime-chrome-'));
  chrome = spawn(chromePath, ['--headless=new','--disable-dev-shm-usage','--remote-debugging-address=127.0.0.1','--remote-allow-origins=*','--remote-debugging-port='+debugPort,'--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','about:blank'], { stdio: 'ignore' });
  let launchError;
  let exitInfo;
  chrome.once('error', error => { launchError = error; });
  chrome.once('exit', (code, signal) => { exitInfo = { code, signal }; });
  const sleep = ms => new Promise(resolveSleep => setTimeout(resolveSleep, ms));
  let target = null;
  const startDeadline = Date.now() + 45000;
  while (!target && Date.now() < startDeadline && !launchError && !exitInfo) {
    try {
      const response = await fetch('http://127.0.0.1:' + debugPort + '/json/list');
      if (response.ok) target = (await response.json()).find(item => item.type === 'page') || null;
    } catch {}
    if (!target) await sleep(200);
  }
  if (!target) throw new Error(launchError ? launchError.message : exitInfo ? JSON.stringify(exitInfo) : 'Chromium DevTools did not start within 45 seconds.');

  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => { ws.addEventListener('open', resolveOpen, { once: true }); ws.addEventListener('error', rejectOpen, { once: true }); });
  let commandId = 0;
  const pending = new Map();
  let exceptions = [];
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const entry = pending.get(message.id); pending.delete(message.id); clearTimeout(entry.timer);
      if (message.error) entry.reject(new Error(message.error.message)); else entry.resolve(message);
    }
    if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
  });
  const command = (method, params = {}) => new Promise((resolveCommand, rejectCommand) => {
    const id = ++commandId;
    const timer = setTimeout(() => { pending.delete(id); rejectCommand(new Error('Chromium command timed out: ' + method)); }, 15000);
    pending.set(id, { resolve: resolveCommand, reject: rejectCommand, timer });
    ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const response = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (response.result.exceptionDetails) throw new Error(response.result.exceptionDetails.exception?.description || response.result.exceptionDetails.text);
    return response.result.result?.value;
  };
  await command('Runtime.enable'); await command('Page.enable');
  const readSmoke = async (path, key) => {
    exceptions = [];
    await command('Page.navigate', { url: 'http://127.0.0.1:' + port + path });
    const deadline = Date.now() + 20000;
    let data = null;
    while (!data && Date.now() < deadline) {
      data = await evaluate('document.body && document.body.dataset[' + JSON.stringify(key) + '] || null').catch(() => null);
      if (!data) await sleep(100);
    }
    if (!data) throw new Error('Browser fixture did not set ' + key + ' within 20 seconds.');
    const result = JSON.parse(data);
    if (exceptions.length) throw new Error('Uncaught page exception(s): ' + exceptions.join('\n'));
    assert.equal(result.status, 'ok', result.error || 'Browser fixture failed.');
    return result;
  };

  console.log('Testing aggregate package import and all 82 subpath exports...');
  const aggregate = await readSmoke('/', 'packageSmoke');
  assert.equal(aggregate.version, manifest.version);
  assert.equal(aggregate.count, names.length);
  assert.equal(aggregate.tags, names.length);
  assert.deepEqual(aggregate.missing, []);
  assert.equal(aggregate.subpaths, names.length);
  assert.equal(aggregate.coreVersion, 1);
  assert.equal(aggregate.buttonShadow, true);

  console.log('Testing an isolated single-component import...');
  const single = await readSmoke('/single', 'singleSmoke');
  assert.equal(single.button, true);
  assert.equal(single.toggle, false);
  assert.equal(single.coreVersion, 1);
  assert.equal(single.shadow, true);
  console.log('Tarball, clean offline install, Node export resolution, aggregate import, and single-component import passed.');
} finally {
  if (ws) { try { ws.close(); } catch {} }
  if (chrome && !chrome.killed) { try { chrome.kill(); } catch {} }
  if (server) await new Promise(resolveClose => server.close(resolveClose));
  if (profile) { try { rmSync(profile, { recursive: true, force: true }); } catch {} }
  try { rmSync(temp, { recursive: true, force: true }); } catch {}
}
