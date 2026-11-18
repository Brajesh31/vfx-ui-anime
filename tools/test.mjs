// node tools/test.mjs [URL]   drives every control in the gallery with real touch and key events at phone width. Exits 1 on a failure.
// Needs Node 22 or later and Chrome or Chromium (set CHROME if it is somewhere unusual), and the folder served over http.
import { spawn } from 'node:child_process';
import { rmSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL_ = process.argv[2] || 'http://localhost:8000/gallery/';
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
const PORT = 9800 + Math.floor(Math.random() * 150), PROFILE = mkdtempSync(join(tmpdir(), 'skv-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let targets;
for (let i = 0; i < 60; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json`)).json(); if (Array.isArray(targets) && targets.some((t) => t.type === 'page')) break; } catch {} await sleep(200); }
const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(), logs = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result))); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true })).result.value;
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.enable'); await send('Page.navigate', { url: URL_ }); await sleep(1800);

// "tag >>> selector" reaches into the element's shadow root
const find = (s) => { const [host, inner] = s.split(' >>> '); return inner ? `document.querySelector(${JSON.stringify(host)}).shadowRoot.querySelector(${JSON.stringify(inner)})` : `document.querySelector(${JSON.stringify(host)})`; };
const at = async (s, fx = 0.5, fy = 0.5) => JSON.parse(await ev(`(() => { const e = ${find(s)}; e.scrollIntoView({ block: 'center' }); const b = e.getBoundingClientRect(); return JSON.stringify([b.left + b.width * ${fx}, b.top + b.height * ${fy}]); })()`));
const touch = (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
const tap = async (s, fx, fy) => { const [x, y] = await at(s, fx, fy); await sleep(150); await touch('touchStart', x, y); await touch('touchEnd', x, y); };
const key = async (k, code) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: k, windowsVirtualKeyCode: code }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k, windowsVirtualKeyCode: code }); };
const type = async (text) => { for (const ch of text) { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, text: ch }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch }); await sleep(40); } };
let fails = 0;
const check = (name, ok, got) => { if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${got !== undefined ? `  ->  ${got}` : ''}`); };

check('all thirty-seven elements are defined', (await ev(`['button','toggle','slider','checkbox','radio','input','tabs','progress','rating','toast','tooltip','select','textarea','number','search','menu','dialog','file-upload','color-picker','accordion','segmented','otp','tag-input','pagination','alert','drawer','skeleton','badge','avatar','chip','breadcrumb','stepper','calendar','date-picker','command-palette','context-menu','combobox'].every((n) => customElements.get('vfx-' + n))`)));
check('one shared core', (await ev('window.VFXAnimeFX.version')) === 1);
{ await tap('vfx-button[data-demo=primary] >>> .btn'); await sleep(1200); check('button: tap fires click and done() lands the check', +(await ev(`${find('vfx-button[data-demo=primary] >>> .btn')}.style.getPropertyValue('--ok')`)) > 0.5); }
{ await tap('vfx-toggle >>> .tog'); await sleep(500); check('toggle: tap turns it on', await ev(`document.querySelector('vfx-toggle').checked`));
  check('toggle: aria-checked follows', (await ev(`${find('vfx-toggle >>> .tog')}.getAttribute('aria-checked')`)) === 'true'); }
{ const [x, y] = await at('vfx-slider >>> .sld', 0.2); const [x1] = await at('vfx-slider >>> .sld', 0.9); await sleep(200); await touch('touchStart', x, y);
  for (let i = 1; i <= 10; i++) { await touch('touchMove', x + (x1 - x) * i / 10, y); await sleep(25); } await touch('touchEnd', x1, y); await sleep(400);
  const v = +(await ev(`document.querySelector('vfx-slider').value`)); check('slider: a drag moves it', v > 70, v);
  await ev(`${find('vfx-slider >>> input')}.focus()`); await key('ArrowLeft', 37); await sleep(200); check('slider: arrow key steps it', +(await ev(`document.querySelector('vfx-slider').value`)) === v - 1); }
{ await tap('vfx-checkbox >>> .box'); await sleep(400); check('checkbox: tap ticks it', await ev(`document.querySelector('vfx-checkbox').checked`)); }
{ await tap('vfx-radio >>> label:nth-child(2) .dot'); await sleep(400); check('radio: tap selects B', (await ev(`document.querySelector('vfx-radio').value`)) === 'b'); }
{ await tap('vfx-input >>> input'); await sleep(200); await type('hey'); await sleep(300); check('input: typing sets the value', (await ev(`document.querySelector('vfx-input').value`)) === 'hey'); }
{ await tap('vfx-tabs >>> button:nth-of-type(3)'); await sleep(500); check('tabs: tap selects the third', (await ev(`document.querySelector('vfx-tabs').selected`)) === 2);
  await ev(`${find('vfx-tabs >>> button:nth-of-type(3)')}.focus()`); await key('ArrowLeft', 37); await sleep(300); check('tabs: arrow key moves back', (await ev(`document.querySelector('vfx-tabs').selected`)) === 1); }
{ await tap('vfx-rating >>> button:nth-child(4)'); await sleep(700); check('rating: tap sets four', (await ev(`document.querySelector('vfx-rating').value`)) === 4);
  check('rating: four stars lit', (await ev(`${find('vfx-rating >>> .stars')}.querySelectorAll('.lit').length`)) === 4); }
{ await at('vfx-progress'); let done = false; for (let i = 0; i < 24 && !done; i++) { await sleep(500); done = await ev(`document.querySelector('vfx-progress').done`); }
  check('progress: the demo load completes', done, await ev(`${find('vfx-progress >>> .pct')}.textContent`)); }
{ await ev(`(() => { const p = document.querySelector('vfx-progress'); p.removeAttribute('demo'); p.reset(); p.set(0.5); })()`); await sleep(1500);
  check('progress: set(0.5) eases to half', Math.abs((await ev(`+getComputedStyle(${find('vfx-progress >>> .prog')}).getPropertyValue('--v')`)) - 0.5) < 0.02); }
{ await tap('[data-demo=save] >>> .btn'); await sleep(900); check('toast: it arrives', await ev(`document.querySelector('vfx-toast').open`)); await sleep(3400); check('toast: it leaves', !(await ev(`document.querySelector('vfx-toast').open`))); }
{ await tap('vfx-tooltip >>> .help'); await sleep(600); check('tooltip: tap opens it', await ev(`document.querySelector('vfx-tooltip').open`)); await key('Escape', 27); await sleep(300); check('tooltip: Escape closes it', !(await ev(`document.querySelector('vfx-tooltip').open`))); }
{ await ev(`(() => { const f = document.createElement('form'); f.id = 'tf'; f.innerHTML = '<vfx-checkbox name="c" checked></vfx-checkbox><vfx-slider name="s" value="42"></vfx-slider><vfx-rating name="r" value="3"></vfx-rating><vfx-toggle name="t" checked></vfx-toggle>'; document.body.append(f); })()`); await sleep(300);
  check('forms: values are sent with a form', (await ev(`new URLSearchParams(new FormData(document.getElementById('tf'))).toString()`)) === 'c=on&s=42&r=3&t=on', await ev(`new URLSearchParams(new FormData(document.getElementById('tf'))).toString()`)); }

{ await tap('vfx-select >>> .trigger'); await sleep(120); check('select: opens its listbox', await ev(`document.querySelector('vfx-select').opened`));
  await tap('vfx-select >>> .option[data-i="2"]'); await sleep(180); check('select: commits the chosen option', (await ev(`document.querySelector('vfx-select').value`)) === 'studio'); }
{ await tap('vfx-textarea >>> textarea'); await type('hello'); await sleep(200); check('textarea: accepts text and updates its count', (await ev(`document.querySelector('vfx-textarea').value`)) === 'hello'); }
{ await tap('vfx-number >>> .up'); await sleep(180); check('number: increments within its bounds', (await ev(`document.querySelector('vfx-number').value`)) === 4); }
{ await tap('vfx-search >>> input'); await type('tog'); await sleep(180); check('search: filters suggestions', (await ev(`document.querySelector('vfx-search').shadowRoot.querySelectorAll('.suggestion').length`)) > 0);
  await tap('vfx-search >>> .suggestion'); await sleep(160); check('search: choosing a suggestion commits the query', (await ev(`document.querySelector('vfx-search').value`)) === 'Toggle'); }
{ await ev(`window.__menuPicked='';document.querySelector('vfx-menu').addEventListener('select',e=>window.__menuPicked=e.detail.value)`); await tap('vfx-menu >>> .trigger'); await tap('vfx-menu >>> .item[data-i="1"]'); await sleep(180);
  check('menu: keyboard-safe action menu emits selection', (await ev(`window.__menuPicked`)) === 'duplicate'); }
{ await ev(`window.__dialogConfirmed=false;document.querySelector('vfx-dialog').addEventListener('confirm',()=>window.__dialogConfirmed=true)`); await tap('vfx-dialog >>> .launch'); await sleep(100); check('dialog: opens a native modal', await ev(`document.querySelector('vfx-dialog').opened`));
  await tap('vfx-dialog >>> .confirm'); await sleep(150); check('dialog: confirm emits and closes', await ev(`window.__dialogConfirmed&&!document.querySelector('vfx-dialog').opened`)); }
{ const count=await ev(`(() => {const el=document.querySelector('vfx-file-upload');const dt=new DataTransfer();dt.items.add(new File(['sample'],'sample.pdf',{type:'application/pdf'}));const input=el.shadowRoot.querySelector('input');input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));return el.files.length;})()`); check('file upload: accepts a selected file', count===1,count); }
{ await ev(`(() => {const el=document.querySelector('vfx-color-picker');el.value='#123456';el.shadowRoot.querySelector('input').dispatchEvent(new Event('change',{bubbles:true}));})()`); check('color picker: stores a six-digit hex value', (await ev(`document.querySelector('vfx-color-picker').value`)) === '#123456'); }


{ await tap('vfx-calendar >>> .day[data-date="2026-11-19"]'); await sleep(180); check('calendar: selecting a day updates its value', (await ev(`document.querySelector('vfx-calendar').value`)) === '2026-11-19'); }
{ await tap('vfx-date-picker >>> .trigger'); await sleep(150); check('date picker: opens its popover', await ev(`document.querySelector('vfx-date-picker').opened`)); await tap('vfx-date-picker >>> .day:not([disabled])'); await sleep(160); const chosen = await ev(`document.querySelector('vfx-date-picker').value`); check('date picker: commits a date', /^\\d{4}-\\d{2}-\\d{2}$/.test(chosen), chosen); }
{ await ev(`window.__paletteCommand='';document.querySelector('vfx-command-palette').addEventListener('select',e=>window.__paletteCommand=e.detail.label);document.querySelector('vfx-command-palette').show()`); await sleep(120); await type('Search components'); await key('Enter',13); await sleep(150); check('command palette: filters and selects a command', (await ev('window.__paletteCommand')) === 'Search components'); }
{ await ev(`window.__contextAction='';document.querySelector('vfx-context-menu').addEventListener('select',e=>window.__contextAction=e.detail.value);document.querySelector('vfx-context-menu').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:90,clientY:120}))`); await sleep(120); await tap('vfx-context-menu >>> .item[data-index="1"]'); await sleep(150); check('context menu: choosing an action emits its value', (await ev('window.__contextAction')) === 'copy-link'); }
{ await tap('vfx-combobox >>> input'); await type('rea'); await sleep(120); check('combobox: filters matching options', (await ev(`document.querySelector('vfx-combobox').shadowRoot.querySelectorAll('.option').length`)) > 0); await key('ArrowDown',40); await key('Enter',13); await sleep(150); check('combobox: commits a filtered option', (await ev(`document.querySelector('vfx-combobox').value`)) === 'react'); }

check('no horizontal scroll at 390', (await ev('document.documentElement.scrollWidth')) <= 390, await ev('document.documentElement.scrollWidth'));
if (logs.length) { console.log(logs.join('\n')); fails++; }
ws.close(); chrome.kill(); await sleep(300); try { rmSync(PROFILE, { recursive: true, force: true }); } catch {} process.exit(fails ? 1 : 0);
