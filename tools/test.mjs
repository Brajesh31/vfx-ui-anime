// node tools/test.mjs [URL]   drives every control in the gallery with real touch and key events at phone width. Exits 1 on a failure.
// Needs Node 22 or later and Chrome or Chromium (set CHROME if it is somewhere unusual), and the folder served over http.
import { spawn } from 'node:child_process';
import { rmSync, mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const URL_ = process.argv[2] || 'http://localhost:8000/gallery/';
const CHROME = process.env.CHROME || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser'].find(existsSync);
if (!CHROME) throw new Error('Chrome or Chromium was not found. Set CHROME to the browser executable path.');
const PORT = 20000 + Math.floor(Math.random() * 40000), PROFILE = mkdtempSync(join(tmpdir(), 'skv-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-dev-shm-usage', `--remote-debugging-address=127.0.0.1`, `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFILE}`, '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let pageTarget = null, launchError = null, exitInfo = null;
chrome.once('error', (error) => { launchError = error; });
chrome.once('exit', (code, signal) => { exitInfo = { code, signal }; });

// Hosted CI runners can take longer to launch Chromium under load. Retry the DevTools
// endpoint for up to 45 seconds rather than treating a slow startup as a component failure.
const startupDeadline = Date.now() + 45000;
while (!pageTarget && Date.now() < startupDeadline && !launchError && !exitInfo) {
  try {
    const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
    if (response.ok) {
      const targets = await response.json();
      if (Array.isArray(targets)) pageTarget = targets.find((t) => t.type === 'page') || null;
    }
  } catch {}
  // Some Chromium builds do not publish the initial about:blank target until one is explicitly created.
  if (!pageTarget) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' });
      if (response.ok) pageTarget = await response.json();
    } catch {}
  }
  if (!pageTarget) await sleep(200);
}
if (!pageTarget?.webSocketDebuggerUrl) {
  chrome.kill();
  rmSync(PROFILE, { recursive: true, force: true });
  const reason = launchError ? `launch error: ${launchError.message}`
    : exitInfo ? `process exited with code ${exitInfo.code}, signal ${exitInfo.signal}`
      : 'DevTools endpoint did not become available within 45 seconds';
  throw new Error(`Could not initialize Chromium at ${CHROME} on debugging port ${PORT}: ${reason}.`);
}
const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0; const pending = new Map(), logs = [];
ws.addEventListener('message', (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); });
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, (m) => (m.error ? rej(new Error(`${method}: ${m.error.message}`)) : res(m.result))); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => {
  const response = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  if (response.exceptionDetails) {
    const detail = response.exceptionDetails.exception?.description || response.exceptionDetails.text || 'Unknown page evaluation error';
    throw new Error(`Runtime.evaluate failed: ${detail}\nExpression: ${expr}`);
  }
  return response.result?.value;
};
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 900, deviceScaleFactor: 2, mobile: true });
await send('Emulation.setTouchEmulationEnabled', { enabled: true });
await send('Page.enable'); await send('Page.navigate', { url: URL_ }); await sleep(1800);

// Keep selector values in the CDP argument channel, never in generated JavaScript source.
const documentRemote = await send('Runtime.evaluate', { expression: 'document', returnByValue: false });
const documentObjectId = documentRemote.result?.objectId;
if (!documentObjectId) throw new Error('Chromium did not expose the page document object.');
const callPage = async (functionDeclaration, values = []) => {
  const response = await send('Runtime.callFunctionOn', {
    objectId: documentObjectId,
    functionDeclaration,
    arguments: values.map((value) => ({ value })),
    returnByValue: true,
    awaitPromise: true
  });
  if (response.exceptionDetails) {
    const detail = response.exceptionDetails.exception?.description || response.exceptionDetails.text || 'Unknown page function error';
    throw new Error(`Runtime.callFunctionOn failed: ${detail}`);
  }
  return response.result?.value;
};
const at = async (selector, fx = 0.5, fy = 0.5) => {
  const [host, inner] = selector.split(' >>> ');
  const xFactor = Number(fx), yFactor = Number(fy);
  if (!Number.isFinite(xFactor) || !Number.isFinite(yFactor)) throw new TypeError('Touch coordinates must be finite numbers.');
  return callPage(
    `function(host, inner, xFactor, yFactor) {
      const root = document.querySelector(host);
      const element = inner ? root?.shadowRoot?.querySelector(inner) : root;
      if (!element) throw new Error('Target element was not found: ' + host);
      element.scrollIntoView({ block: 'center' });
      const bounds = element.getBoundingClientRect();
      return [bounds.left + bounds.width * xFactor, bounds.top + bounds.height * yFactor];
    }`,
    [host, inner || null, xFactor, yFactor]
  );
};
const touch = (type, x, y) => send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
const tap = async (s, fx, fy) => { const [x, y] = await at(s, fx, fy); await sleep(150); await touch('touchStart', x, y); await touch('touchEnd', x, y); };
const key = async (k, virtualKeyCode) => { const code = k === ' ' ? 'Space' : k; await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: virtualKeyCode }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: virtualKeyCode }); };
const type = async (text) => { for (const ch of text) { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: ch, text: ch }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: ch }); await sleep(40); } };
let fails = 0;
const check = (name, ok, got) => { if (!ok) fails++; console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${got !== undefined ? `  ->  ${got}` : ''}`); };

check('all eighty-two elements are defined', (await ev(`['button','toggle','slider','checkbox','radio','input','tabs','progress','rating','toast','tooltip','select','textarea','number','search','menu','dialog','file-upload','color-picker','accordion','segmented','otp','tag-input','pagination','alert','drawer','skeleton','badge','avatar','chip','breadcrumb','stepper','calendar','date-picker','command-palette','context-menu','combobox','drag-drop','carousel','timeline','radial-menu','image-cropper','kanban','data-grid','tree-view','signature-pad','before-after','multi-select','time-picker','transfer-list','split-pane','lightbox-gallery','password-field','date-range-picker','notification-center','rich-text-editor','gradient-picker','wizard','guided-tour','stopwatch','emoji-picker','copy-code','bar-chart','donut-chart','sparkline','kpi-card','gauge','heatmap','treemap','drawing-canvas','color-palette','audio-player','video-player','markdown-editor','json-editor','tilt-card','flip-card','particle-field','marquee','scroll-reveal','animated-counter','confetti-button'].every((n) => customElements.get('vfx-' + n))`)));
check('one shared core', (await ev('window.VFXAnimeFX.version')) === 1);
{ await tap('vfx-button[data-demo=primary] >>> .btn'); await sleep(1200); check('button: tap fires click and done() lands the check', +(await callPage("function(){return document.querySelector('vfx-button[data-demo=primary]').shadowRoot.querySelector('.btn').style.getPropertyValue('--ok')}")) > 0.5); }
{ await tap('vfx-toggle >>> .tog'); await sleep(500); check('toggle: tap turns it on', await ev(`document.querySelector('vfx-toggle').checked`));
  check('toggle: aria-checked follows', (await callPage("function(){return document.querySelector('vfx-toggle').shadowRoot.querySelector('.tog').getAttribute('aria-checked')}")) === 'true'); }
{ const [x, y] = await at('vfx-slider >>> .sld', 0.2); const [x1] = await at('vfx-slider >>> .sld', 0.9); await sleep(200); await touch('touchStart', x, y);
  for (let i = 1; i <= 10; i++) { await touch('touchMove', x + (x1 - x) * i / 10, y); await sleep(25); } await touch('touchEnd', x1, y); await sleep(400);
  const v = +(await ev(`document.querySelector('vfx-slider').value`)); check('slider: a drag moves it', v > 70, v);
  await callPage("function(){document.querySelector('vfx-slider').shadowRoot.querySelector('input').focus();return true}"); await key('ArrowLeft', 37); await sleep(200); check('slider: arrow key steps it', +(await ev(`document.querySelector('vfx-slider').value`)) === v - 1); }
{ await tap('vfx-checkbox >>> .box'); await sleep(400); check('checkbox: tap ticks it', await ev(`document.querySelector('vfx-checkbox').checked`)); }
{ await tap('vfx-radio >>> label:nth-child(2) .dot'); await sleep(400); check('radio: tap selects B', (await ev(`document.querySelector('vfx-radio').value`)) === 'b'); }
{ await tap('vfx-input >>> input'); await sleep(200); await type('hey'); await sleep(300); check('input: typing sets the value', (await ev(`document.querySelector('vfx-input').value`)) === 'hey'); }
{ await tap('vfx-tabs >>> button:nth-of-type(3)'); await sleep(500); check('tabs: tap selects the third', (await ev(`document.querySelector('vfx-tabs').selected`)) === 2);
  await callPage("function(){document.querySelector('vfx-tabs').shadowRoot.querySelector('button:nth-of-type(3)').focus();return true}"); await key('ArrowLeft', 37); await sleep(300); check('tabs: arrow key moves back', (await ev(`document.querySelector('vfx-tabs').selected`)) === 1); }
{ await tap('vfx-rating >>> button:nth-child(4)'); await sleep(700); check('rating: tap sets four', (await ev(`document.querySelector('vfx-rating').value`)) === 4);
  check('rating: four stars lit', (await callPage("function(){return document.querySelector('vfx-rating').shadowRoot.querySelectorAll('.stars .lit').length}")) === 4); }
{ await at('vfx-progress'); let done = false; for (let i = 0; i < 24 && !done; i++) { await sleep(500); done = await ev(`document.querySelector('vfx-progress').done`); }
  check('progress: the demo load completes', done, await callPage("function(){return document.querySelector('vfx-progress').shadowRoot.querySelector('.pct').textContent}")); }
{ await ev(`(() => { const p = document.querySelector('vfx-progress'); p.removeAttribute('demo'); p.reset(); p.set(0.5); })()`); await sleep(1500);
  check('progress: set(0.5) eases to half', Math.abs((await callPage("function(){return +getComputedStyle(document.querySelector('vfx-progress').shadowRoot.querySelector('.prog')).getPropertyValue('--v')}")) - 0.5) < 0.02); }
{ await tap('[data-demo=save] >>> .btn'); await sleep(900); check('toast: it arrives', await ev(`document.querySelector('vfx-toast').open`)); await sleep(3400); check('toast: it leaves', !(await ev(`document.querySelector('vfx-toast').open`))); }
{ await tap('vfx-tooltip >>> .help'); await sleep(600); check('tooltip: tap opens it', await ev(`document.querySelector('vfx-tooltip').open`)); await key('Escape', 27); await sleep(300); check('tooltip: Escape closes it', !(await ev(`document.querySelector('vfx-tooltip').open`))); }
{ await ev(`(() => { const f = document.createElement('form'); f.id = 'tf'; f.innerHTML = '<vfx-checkbox name="c" checked></vfx-checkbox><vfx-slider name="s" value="42"></vfx-slider><vfx-rating name="r" value="3"></vfx-rating><vfx-toggle name="t" checked></vfx-toggle>'; document.body.append(f); })()`); await sleep(300);
  check('forms: values are sent with a form', (await ev(`new URLSearchParams(new FormData(document.getElementById('tf'))).toString()`)) === 'c=on&s=42&r=3&t=on', await ev(`new URLSearchParams(new FormData(document.getElementById('tf'))).toString()`)); }


{ await ev(`(() => { const f=document.createElement('form'); f.id='phase2-reset'; f.innerHTML='<vfx-checkbox name="c" checked></vfx-checkbox><vfx-toggle name="t" checked label="Toggle"></vfx-toggle><vfx-slider name="s" value="42"></vfx-slider><vfx-rating name="r" value="3"></vfx-rating><vfx-input name="q" value="seed" label="Query"></vfx-input><vfx-radio name="p" label="Plan" value="pro"><option value="free">Free</option><option value="pro">Pro</option></vfx-radio>'; document.body.append(f); })()`); await sleep(180);
  await ev(`(() => { const f=document.querySelector('#phase2-reset'); f.querySelector('vfx-checkbox').checked=false; f.querySelector('vfx-toggle').checked=false; f.querySelector('vfx-slider').value=91; f.querySelector('vfx-rating').value=1; f.querySelector('vfx-input').value='changed'; f.querySelector('vfx-radio').value='free'; f.reset(); })()`); await sleep(180);
  const resetState=await ev(`(() => { const f=document.querySelector('#phase2-reset'); return [f.querySelector('vfx-checkbox').checked,f.querySelector('vfx-toggle').checked,f.querySelector('vfx-slider').value,f.querySelector('vfx-rating').value,f.querySelector('vfx-input').value,f.querySelector('vfx-radio').value].join('|'); })()`); check('Phase 2: form reset restores all six signature controls',resetState==='true|true|42|3|seed|pro',resetState);
}
{ await ev(`(() => { const el=document.createElement('vfx-input'); el.id='phase2-validity-input'; el.setAttribute('type','email'); el.setAttribute('required',''); el.setAttribute('label','Email'); document.body.append(el); })()`); await sleep(120);
  check('Phase 2: input exposes required and email validity',await ev(`(() => { const el=document.querySelector('#phase2-validity-input'); const missing=!el.checkValidity(); el.value='not-an-email'; const mismatch=!el.checkValidity(); el.value='person@example.com'; return missing&&mismatch&&el.checkValidity(); })()`));
}
{ await ev(`(() => { const el=document.createElement('vfx-radio'); el.id='phase2-dynamic-radio'; el.setAttribute('required',''); el.innerHTML='<option value="a">A</option><option value="b">B</option>'; document.body.append(el); })()`); await sleep(100); const initial=await ev(`document.querySelector('#phase2-dynamic-radio').shadowRoot.querySelector('.rad').getAttribute('aria-required')==='true'`); await ev(`document.querySelector('#phase2-dynamic-radio').removeAttribute('required')`); const updated=await ev(`document.querySelector('#phase2-dynamic-radio').shadowRoot.querySelector('.rad').getAttribute('aria-required')==='false'`); check('Phase 2: radio required state updates dynamically',initial&&updated); }
{ const ok=await ev(`(() => { const el=document.querySelector('vfx-slider'); let seen=0; el.addEventListener('input',()=>seen++); const r=el.shadowRoot.querySelector('input'); r.value='61'; r.dispatchEvent(new Event('input',{bubbles:true,composed:true})); return seen===1&&el.value==='61'; })()`); check('Phase 2: slider input event bubbles from its native range control',ok); }
{ await ev(`(() => { const el=document.querySelector('vfx-rating'); el.value=5; setTimeout(()=>{el.value=1;},45); })()`); await sleep(520); check('Phase 2: rating ignores stale delayed star animations',await ev(`document.querySelector('vfx-rating').shadowRoot.querySelectorAll('.lit').length===1`)); }
{ const tabsRestored=await ev(`(() => { const t=document.querySelector('vfx-tabs'),p=t.parentNode,n=t.nextSibling; t.remove(); const cleaned=!t.ro; if(n)p.insertBefore(t,n);else p.append(t); return cleaned&&!!t.ro; })()`); check('Phase 2: tabs disconnects and restores its resize observer',tabsRestored); }
{ await ev(`(() => { const t=document.querySelector('vfx-toast'); window.__phase2Toast=[]; t.addEventListener('show',e=>window.__phase2Toast.push('show:'+e.detail.type)); t.addEventListener('hide',e=>window.__phase2Toast.push('hide:'+e.detail.type)); t.show('Network unavailable',{type:'error',duration:0}); })()`); await sleep(180); const role=await ev(`document.querySelector('vfx-toast').shadowRoot.querySelector('.toast').getAttribute('role')==='alert'&&document.querySelector('vfx-toast').shadowRoot.querySelector('.toast').dataset.kind==='error'`); await ev(`document.querySelector('vfx-toast').hide()`); await sleep(500); const hidden=await ev(`window.__phase2Toast.join('|')==='show:error|hide:error'&&document.querySelector('vfx-toast').shadowRoot.querySelector('.toast').inert`); check('Phase 2: toast error type, lifecycle events and dismissal',role&&hidden); }
{ await tap('vfx-tooltip >>> .help'); await sleep(320); await tap('vfx-tooltip >>> .help'); await sleep(320); check('Phase 2: tooltip tap toggles closed while the trigger remains focused',!(await ev(`document.querySelector('vfx-tooltip').open`))); }
{ const hidden=await ev(`(() => { const t=document.querySelector('vfx-tooltip'); t.show(); t.show(false); return !t.open; })()`); check('Phase 2: show(false) always dismisses a pinned tooltip',hidden); }
{ const guarded=await ev(`(() => { const sec=document.querySelector('vfx-button[variant=secondary]'); const before=sec.seq; sec.impact(); return sec.seq===before; })()`); check('Phase 2: signature impact is restricted to the primary button',guarded); }

{ await ev(`(() => { const f=document.createElement('fieldset'); f.id='phase2-disabled-fieldset'; f.disabled=true; f.innerHTML='<vfx-checkbox name="c">Check</vfx-checkbox><vfx-toggle name="t" label="Toggle"></vfx-toggle><vfx-slider name="s"></vfx-slider><vfx-rating name="r"></vfx-rating><vfx-input name="i" label="Input"></vfx-input><vfx-radio name="p" label="Plan"><option value="a">A</option><option value="b">B</option></vfx-radio>'; document.body.append(f); })()`); await sleep(220);
  const before = await ev(`(() => { const f=document.querySelector('#phase2-disabled-fieldset'); for (const el of f.querySelectorAll('vfx-checkbox,vfx-toggle,vfx-slider,vfx-rating,vfx-input,vfx-radio')) { el.setAttribute('disabled',''); el.removeAttribute('disabled'); } const get=(tag,sel)=>f.querySelector(tag).shadowRoot.querySelector(sel).disabled; return get('vfx-checkbox','input')&&get('vfx-toggle','.tog')&&get('vfx-slider','input')&&get('vfx-rating','button')&&get('vfx-input','input')&&get('vfx-radio','input'); })()`);
  await ev(`document.querySelector('#phase2-disabled-fieldset').disabled=false`); await sleep(180);
  const after = await ev(`(() => { const f=document.querySelector('#phase2-disabled-fieldset'); const get=(tag,sel)=>f.querySelector(tag).shadowRoot.querySelector(sel).disabled; return !get('vfx-checkbox','input')&&!get('vfx-toggle','.tog')&&!get('vfx-slider','input')&&!get('vfx-rating','button')&&!get('vfx-input','input')&&!get('vfx-radio','input'); })()`);
  check('Phase 2: fieldset disabled state survives component attribute changes and clears correctly',before&&after);
}
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
{ await tap('vfx-date-picker >>> .trigger'); await sleep(150); check('date picker: opens its popover', await ev(`document.querySelector('vfx-date-picker').opened`)); await tap('vfx-date-picker >>> .day:not([disabled])'); await sleep(160); const chosen = await ev(`document.querySelector('vfx-date-picker').value`); check('date picker: commits a date', typeof chosen === 'string' && chosen.length === 10 && chosen[4] === '-' && chosen[7] === '-', chosen); }
{ await ev(`window.__paletteCommand='';document.querySelector('vfx-command-palette').addEventListener('select',e=>window.__paletteCommand=e.detail.label);document.querySelector('vfx-command-palette').show()`); await sleep(120); await type('Search components'); await key('Enter',13); await sleep(150); check('command palette: filters and selects a command', (await ev('window.__paletteCommand')) === 'Search components'); }
{ await ev(`window.__contextAction='';document.querySelector('vfx-context-menu').addEventListener('select',e=>window.__contextAction=e.detail.value);document.querySelector('vfx-context-menu').dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true,clientX:90,clientY:120}))`); await sleep(120); await tap('vfx-context-menu >>> .item[data-index="1"]'); await sleep(150); check('context menu: choosing an action emits its value', (await ev('window.__contextAction')) === 'copy-link'); }
{ await tap('vfx-combobox >>> input'); await type('rea'); await sleep(120); check('combobox: filters matching options', (await ev(`document.querySelector('vfx-combobox').shadowRoot.querySelectorAll('.option').length`)) > 0); await key('ArrowDown',40); await key('Enter',13); await sleep(150); check('combobox: commits a filtered option', (await ev(`document.querySelector('vfx-combobox').value`)) === 'react'); }

{ await ev(`(() => { window.__dragMoved=false; const el=document.querySelector('vfx-drag-drop'); el.addEventListener('change',()=>window.__dragMoved=true); el.move(0,2); })()`); await sleep(120); const order=await ev(`document.querySelector('vfx-drag-drop').items.join('|')`); check('drag and drop: move() reorders and emits change',order==='Prototype|Build|Research|Launch'&&await ev('window.__dragMoved'),order); }
{ await ev(`(() => document.querySelector('vfx-carousel').goTo(2))()`); await sleep(120); check('carousel: goTo updates the active slide',await ev(`document.querySelector('vfx-carousel').activeIndex===2&&document.querySelector('vfx-carousel').shadowRoot.querySelector('.count').textContent==='3/4'`)); await ev(`(() => document.querySelector('vfx-carousel').next())()`); check('carousel: next reaches the final slide',await ev(`document.querySelector('vfx-carousel').activeIndex===3`)); await ev(`(() => document.querySelector('vfx-carousel').next())()`); check('carousel: next wraps to the beginning',await ev(`document.querySelector('vfx-carousel').activeIndex===0`)); }
{ await ev(`(() => { window.__timelineIndex=-1; const el=document.querySelector('vfx-timeline'); el.addEventListener('select',e=>window.__timelineIndex=e.detail.index); el.select(1); })()`); check('timeline: selecting a milestone updates active state',await ev(`document.querySelector('vfx-timeline').activeIndex===1&&window.__timelineIndex===1`)); }
{ await ev(`(() => { window.__radialChoice=''; const el=document.querySelector('vfx-radial-menu'); el.addEventListener('select',e=>window.__radialChoice=e.detail.label); el.show(); })()`); check('radial menu: opens and reports expanded state',await ev(`document.querySelector('vfx-radial-menu').opened&&document.querySelector('vfx-radial-menu').shadowRoot.querySelector('.toggle').getAttribute('aria-expanded')==='true'`)); await ev(`(() => document.querySelector('vfx-radial-menu').choose(2))()`); check('radial menu: action selection emits and closes',await ev(`window.__radialChoice==='Share'&&!document.querySelector('vfx-radial-menu').opened`)); }
{ await ev(`(() => { window.__cropEvents={loaded:false,cropped:false}; const el=document.querySelector('vfx-image-cropper'); el.addEventListener('image-load',()=>window.__cropEvents.loaded=true); el.addEventListener('crop',e=>{window.__cropEvents.cropped=true;window.__cropEvents.bytes=e.detail.blob.size;}); const svg='<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="320" height="240" fill="#ff5fa8"/><circle cx="160" cy="120" r="80" fill="#b8b3ff"/></svg>'; el.load(new File([svg],'fixture.svg',{type:'image/svg+xml'})); })()`); await sleep(500); check('image cropper: loads a local image file',await ev('window.__cropEvents.loaded')); await ev(`(() => document.querySelector('vfx-image-cropper').exportCrop().then(b=>{window.__cropEvents.bytes=b?b.size:0}))()`); await sleep(400); check('image cropper: exports a PNG blob',await ev('window.__cropEvents.bytes>0&&window.__cropEvents.cropped'),await ev('window.__cropEvents.bytes')); }


{ await ev(`(() => { window.__kanbanChange=false; const el=document.querySelector('vfx-kanban'); el.addEventListener('change',()=>window.__kanbanChange=true); el.move('brief',2); })()`); check('kanban: moves a card between lanes and emits change',await ev(`document.querySelector('vfx-kanban').cards.find(x=>x.id==='brief').lane===2&&window.__kanbanChange`)); }
{ await tap('vfx-data-grid >>> .next'); await sleep(100); check('data grid: pagination advances to page two',await ev(`document.querySelector('vfx-data-grid').page===2&&document.querySelector('vfx-data-grid').shadowRoot.querySelector('.range').textContent.startsWith('5')`)); await tap('vfx-data-grid >>> [data-sort="name"]'); await sleep(100); check('data grid: sortable header changes sort state',await ev(`document.querySelector('vfx-data-grid').shadowRoot.querySelector('[data-sort="name"]').getAttribute('aria-sort')==='ascending'`)); await tap('vfx-data-grid >>> tbody [data-row-check]'); await sleep(100); check('data grid: row selection updates selectedRows',await ev(`document.querySelector('vfx-data-grid').selectedRows.length===1`)); }
{ await ev(`(() => document.querySelector('vfx-tree-view').select('brief'))()`); check('tree view: selects a nested file',await ev(`document.querySelector('vfx-tree-view').value==='brief'`)); await ev(`(() => document.querySelector('vfx-tree-view').toggle('root'))()`); check('tree view: collapses a folder and hides descendants',await ev(`(() => { const el=document.querySelector('vfx-tree-view'); const root=el.shadowRoot.querySelector('li[data-id="root"]'); return root.querySelector(':scope > .children').hidden; })()`)); }
{ const [x,y]=await at('vfx-signature-pad >>> canvas',0.3,0.5); await touch('touchStart',x,y); for(let i=1;i<=5;i++){await touch('touchMove',x+i*12,y-(i%2)*10);await sleep(25);} await touch('touchEnd',x+60,y-10); await sleep(100); check('signature pad: draws a pointer stroke',await ev(`document.querySelector('vfx-signature-pad').hasSignature`)); await ev(`(() => document.querySelector('vfx-signature-pad').undo())()`); check('signature pad: undo removes the last stroke',!(await ev(`document.querySelector('vfx-signature-pad').hasSignature`))); }
{ await ev(`(() => { const el=document.querySelector('vfx-before-after'); el.value=73; })()`); check('before/after: slider value updates the split position',await ev(`document.querySelector('vfx-before-after').value===73&&document.querySelector('vfx-before-after').shadowRoot.querySelector('.stage').style.getPropertyValue('--split')==='73%'`)); }


{ await tap('vfx-multi-select >>> .trigger'); await sleep(80); check('multi select: opens its option panel',await ev(`document.querySelector('vfx-multi-select').opened`)); await tap('vfx-multi-select >>> [data-value="svelte"]'); check('multi select: toggles a third value',await ev(`document.querySelector('vfx-multi-select').value.join(',')==='react,vue,svelte'`)); }
{ await tap('vfx-time-picker >>> [data-time="12:00"]'); check('time picker: preset sets the selected time',await ev(`document.querySelector('vfx-time-picker').value==='12:00'`)); await tap('vfx-time-picker >>> .up'); check('time picker: increment button applies minute step',await ev(`document.querySelector('vfx-time-picker').value==='12:15'`)); }
{ await tap('vfx-transfer-list >>> [data-id="react"]'); await tap('vfx-transfer-list >>> .add'); check('transfer list: moves a marked item to selected',await ev(`document.querySelector('vfx-transfer-list').value.includes('react')`)); await tap('vfx-transfer-list >>> [data-id="vue"]'); await tap('vfx-transfer-list >>> .remove'); check('transfer list: moves a marked item back',!(await ev(`document.querySelector('vfx-transfer-list').value.includes('vue')`))); }
{ await ev(`(() => { const el=document.querySelector('vfx-split-pane'); el.shadowRoot.querySelector('.divider').focus(); })()`); const before=await ev(`document.querySelector('vfx-split-pane').value`); await key('ArrowRight',39); const after=await ev(`document.querySelector('vfx-split-pane').value`); check('split pane: keyboard resizes the primary panel',after===before+2,before+' → '+after); }
{ await tap('vfx-lightbox-gallery >>> [data-index="1"]'); await sleep(100); check('lightbox gallery: opens its native modal',await ev(`document.querySelector('vfx-lightbox-gallery').shadowRoot.querySelector('.viewer').open`)); await tap('vfx-lightbox-gallery >>> .next'); check('lightbox gallery: next advances the image',await ev(`document.querySelector('vfx-lightbox-gallery').activeIndex===2`)); await key('Escape',27); await sleep(100); check('lightbox gallery: Escape closes the viewer',!(await ev(`document.querySelector('vfx-lightbox-gallery').shadowRoot.querySelector('.viewer').open`))); }


{ await ev(`(() => { const el=document.querySelector('vfx-password-field'); el.value='Abc123!xyz'; })()`); check('password field: computes strength from configured rules',await ev(`document.querySelector('vfx-password-field').strength===4`)); await tap('vfx-password-field >>> .reveal'); check('password field: reveal control toggles input visibility',await ev(`document.querySelector('vfx-password-field').shadowRoot.querySelector('input').type==='text'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-date-range-picker'); el.value={start:'2026-11-22',end:'2026-11-20'}; })()`); check('date range picker: rejects reversed date ranges',!(await ev(`document.querySelector('vfx-date-range-picker').valid`))); await ev(`(() => { const el=document.querySelector('vfx-date-range-picker'); el.value={start:'2026-11-20',end:'2026-11-22'}; })()`); check('date range picker: accepts chronological ranges',await ev(`document.querySelector('vfx-date-range-picker').valid&&document.querySelector('vfx-date-range-picker').value.start==='2026-11-20'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-notification-center'); el.markRead('welcome'); })()`); check('notification center: marks notification read and updates unread count',await ev(`document.querySelector('vfx-notification-center').unreadCount===1`)); await ev(`(() => document.querySelector('vfx-notification-center').dismiss('review'))()`); check('notification center: dismisses an item',await ev(`!document.querySelector('vfx-notification-center').items.some(x=>x.id==='review')`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-rich-text-editor'); el.value='<p>Safe <strong>formatted</strong><script>alert(1)</script></p>'; })()`); check('rich text editor: sanitizes unsupported HTML elements',await ev(`!document.querySelector('vfx-rich-text-editor').value.includes('<script')&&document.querySelector('vfx-rich-text-editor').value.includes('<strong>')`)); check('rich text editor: exposes plain text from edited content',await ev(`document.querySelector('vfx-rich-text-editor').text.includes('Safe')`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-gradient-picker'); el.value='linear-gradient(210deg, #123456, #abcdef)'; })()`); check('gradient picker: parses CSS gradient values',await ev(`document.querySelector('vfx-gradient-picker').angle===210&&document.querySelector('vfx-gradient-picker').from==='#123456'&&document.querySelector('vfx-gradient-picker').to==='#abcdef'`)); }


{ await ev(`(() => { document.querySelector('vfx-wizard').querySelector('input').value='Test user'; })()`); check('wizard: initializes the first step',await ev(`document.querySelector('vfx-wizard').activeIndex===0&&document.querySelector('vfx-wizard').totalSteps===3`)); await tap('vfx-wizard >>> .next'); check('wizard: advances to the next step',await ev(`document.querySelector('vfx-wizard').activeIndex===1`)); await tap('vfx-wizard >>> .back'); check('wizard: navigates back',await ev(`document.querySelector('vfx-wizard').activeIndex===0`)); }
{ await ev(`(() => document.querySelector('vfx-guided-tour').start())()`); check('guided tour: starts and activates overlay',await ev(`document.querySelector('vfx-guided-tour').active&& !document.querySelector('vfx-guided-tour').shadowRoot.querySelector('.overlay').hidden`)); await ev(`(() => document.querySelector('vfx-guided-tour').next())()`); check('guided tour: moves to the next step',await ev(`document.querySelector('vfx-guided-tour').currentIndex===1`)); await ev(`(() => document.querySelector('vfx-guided-tour').finish('test'))()`); check('guided tour: finishes and hides overlay',!(await ev(`document.querySelector('vfx-guided-tour').active`))); }
{ await tap('vfx-stopwatch >>> .start'); await sleep(120); await tap('vfx-stopwatch >>> .lap'); await tap('vfx-stopwatch >>> .start'); check('stopwatch: records elapsed time and a lap',await ev(`document.querySelector('vfx-stopwatch').elapsed>0&&document.querySelector('vfx-stopwatch').laps.length===1`)); await tap('vfx-stopwatch >>> .reset'); check('stopwatch: reset clears elapsed time and laps',await ev(`document.querySelector('vfx-stopwatch').elapsed===0&&document.querySelector('vfx-stopwatch').laps.length===0`)); }
{ await tap('vfx-emoji-picker >>> [data-emoji="😀"]'); check('emoji picker: selecting an emoji updates its value',await ev(`document.querySelector('vfx-emoji-picker').value==='😀'`)); }
{ const state=await ev(`(() => {const el=document.querySelector('vfx-copy-code');return JSON.stringify({lineCount:el.lineCount,value:el.value,code:el.shadowRoot.querySelector('code').textContent});})()`); const data=JSON.parse(state); check('copy code: reads source text and counts lines',data.lineCount===2&&data.value.includes('console.log'),state); check('copy code: renders source as text without executing it',data.code.includes('Hello, world!'),state); }

{ check('bar chart: renders six bars',await ev(`document.querySelector('vfx-bar-chart').shadowRoot.querySelectorAll('.bar').length===6`)); }
{ check('donut chart: renders segments',await ev(`document.querySelector('vfx-donut-chart').shadowRoot.querySelectorAll('circle').length===5`)); }
{ check('sparkline: renders trend points',await ev(`document.querySelector('vfx-sparkline').shadowRoot.querySelector('polyline').getAttribute('points').split(' ').length===8`)); }
{ await ev(`(() => { document.querySelector('vfx-kpi-card').value='13,000'; })()`); check('KPI card: updates its value',await ev(`document.querySelector('vfx-kpi-card').shadowRoot.querySelector('.value').textContent==='13,000'`)); }
{ await ev(`(() => { document.querySelector('vfx-gauge').value=80; })()`); check('gauge: accepts value changes',await ev(`document.querySelector('vfx-gauge').value===80`)); }
{ check('heatmap: renders selectable cells',await ev(`document.querySelector('vfx-heatmap').shadowRoot.querySelectorAll('.cell').length===35`)); }
{ await tap('vfx-treemap >>> [data-id="app"]'); check('treemap: renders selectable tiles',await ev(`document.querySelector('vfx-treemap').shadowRoot.querySelectorAll('.tile').length===4`)); }
{ await tap('vfx-drawing-canvas >>> .clear'); check('drawing canvas: clear action is available',await ev(`!!document.querySelector('vfx-drawing-canvas').shadowRoot.querySelector('.save')`)); }
{ await tap('vfx-color-palette >>> [data-color="#ff6fae"]'); check('color palette: selects a color',await ev(`document.querySelector('vfx-color-palette').value==='#ff6fae'`)); }
{ check('audio player: initializes safely without a source',await ev(`document.querySelector('vfx-audio-player').playing===false`)); }
{ check('video player: initializes without source',await ev(`document.querySelector('vfx-video-player').playing===false`)); }
{ await ev(`(() => { document.querySelector('vfx-json-editor').value='{"ok":true}'; })()`); check('JSON editor: accepts valid JSON',await ev(`document.querySelector('vfx-json-editor').valid===true`)); await ev(`(() => { document.querySelector('vfx-json-editor').value='{bad'; })()`); check('JSON editor: rejects invalid JSON',await ev(`document.querySelector('vfx-json-editor').valid===false`)); }
{ await ev(`(() => document.querySelector('vfx-flip-card').toggle())()`); check('flip card: toggles state',await ev(`document.querySelector('vfx-flip-card').flipped===true`)); }
{ check('Markdown editor: has preview surface',await ev(`!!document.querySelector('vfx-markdown-editor').shadowRoot.querySelector('.preview')`)); }
{ check('tilt card: has perspective stage',await ev(`getComputedStyle(document.querySelector('vfx-tilt-card')).perspective!=='none'`)); }
{ check('particle field: renders animated canvas',await ev(`!!document.querySelector('vfx-particle-field').shadowRoot.querySelector('canvas')`)); }
{ check('marquee: includes duplicate content track',await ev(`!!document.querySelector('vfx-marquee').shadowRoot.querySelector('.copy[aria-hidden=true]')`)); }
{ check('scroll reveal: wraps slotted content',await ev(`!!document.querySelector('vfx-scroll-reveal').shadowRoot.querySelector('slot')`)); }
{ await ev(`(() => document.querySelector('vfx-animated-counter').setValue(456,false))()`); check('animated counter: updates to target',await ev(`document.querySelector('vfx-animated-counter').value===456`)); }
{ await tap('vfx-confetti-button >>> button'); check('confetti button: has trigger control',await ev(`!!document.querySelector('vfx-confetti-button').shadowRoot.querySelector('button')`)); }

{ await ev(`(() => { const el=document.querySelector('vfx-select'); el.setAttribute('value','starter'); })()`); check('phase 3: select reflects external value changes',await ev(`document.querySelector('vfx-select').value==='starter'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-textarea'); el.setAttribute('required',''); el.value=''; })()`); check('phase 3: textarea tracks required and value attributes',await ev(`document.querySelector('vfx-textarea').shadowRoot.querySelector('textarea').required&&document.querySelector('vfx-textarea').value==='' `)); }
{ await ev(`(() => { const el=document.querySelector('vfx-number'); el.setAttribute('max','5'); el.value=9; })()`); check('phase 3: number control clamps against updated bounds',await ev(`document.querySelector('vfx-number').value===5`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-file-upload'); el._files=[]; el.setAttribute('accept','.pdf'); el.acceptFiles([new File(['x'],'blocked.txt',{type:'text/plain'})]); })()`); check('phase 3: file upload rejects unsupported dropped file types',await ev(`document.querySelector('vfx-file-upload').files.length===0`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-segmented'); el.setAttribute('value','Settings'); })()`); check('phase 3: segmented control tracks external value changes',await ev(`document.querySelector('vfx-segmented').value==='Settings'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-otp'); let n=0; el.addEventListener('complete',()=>n++); el.value='123456'; el.update(); el.update(); window.__otpCompleteCount=n; })()`); check('phase 3: OTP completion fires once per completed value',await ev(`window.__otpCompleteCount===1`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-stepper'); el.value=7; el.setAttribute('disabled',''); })()`); check('phase 3: stepper synchronizes disabled state and displayed value',await ev(`document.querySelector('vfx-stepper').shadowRoot.querySelector('.down').disabled&&document.querySelector('vfx-stepper').shadowRoot.querySelector('.value').textContent==='7'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-pagination'); el.setAttribute('pages','3'); el.setAttribute('page','3'); })()`); check('phase 3: pagination clamps and redraws dynamic page attributes',await ev(`document.querySelector('vfx-pagination').shadowRoot.querySelector('.next').disabled&&document.querySelector('vfx-pagination').shadowRoot.querySelector('[aria-current="page"]').textContent==='3'`)); }
{ await ev(`(() => { document.querySelector('vfx-color-picker').setAttribute('value','#123456'); })()`); check('phase 3: color picker reflects external value changes',await ev(`document.querySelector('vfx-color-picker').value==='#123456'`)); }
{ await ev(`(() => { document.querySelector('vfx-search').setAttribute('suggestions','Alpha|Beta'); })()`); check('phase 3: search refreshes dynamic suggestions',await ev(`document.querySelector('vfx-search').items.join('|')==='Alpha|Beta'`)); }
{ await ev(`(() => { document.querySelector('vfx-badge').setAttribute('label','Ready'); })()`); check('phase 3: badge updates its accessible status label',await ev(`document.querySelector('vfx-badge').shadowRoot.querySelector('.label').textContent==='Ready'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-chip'); el.setAttribute('disabled',''); })()`); check('phase 3: chip mirrors dynamic disabled state',await ev(`document.querySelector('vfx-chip').shadowRoot.querySelector('.chip').disabled`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-tag-input'); el.setAttribute('value','alpha,beta'); })()`); check('phase 3: tag input reflects external value changes',await ev(`document.querySelector('vfx-tag-input').value==='alpha, beta'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-alert'); el.setAttribute('tone','error'); el.setAttribute('dismissible',''); })()`); check('phase 3: alert updates tone semantics and dismissal control',await ev(`document.querySelector('vfx-alert').shadowRoot.querySelector('.panel').getAttribute('role')==='alert'&&!!document.querySelector('vfx-alert').shadowRoot.querySelector('.close')`)); }
{ await ev(`(() => { document.querySelector('vfx-skeleton').setAttribute('loading','false'); })()`); check('phase 3: skeleton exposes completed loading state',await ev(`document.querySelector('vfx-skeleton').getAttribute('aria-busy')==='false'`)); }
{ await ev(`(() => { document.querySelector('vfx-breadcrumb').setAttribute('label','Your location'); })()`); check('phase 3: breadcrumb updates its navigation landmark label',await ev(`document.querySelector('vfx-breadcrumb').shadowRoot.querySelector('nav').getAttribute('aria-label')==='Your location'`)); }


{ await ev(`(() => { const el=document.querySelector('vfx-select'); el.openList(); el.setAttribute('disabled',''); const before=el.value; el.choose(1); window.__phase3SelectGuard=!el.opened&&el.value===before; el.removeAttribute('disabled'); })()`); check('phase 3 review: disabled select closes and rejects pending choices',await ev(`window.__phase3SelectGuard`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-textarea'); el.value=''; el.setAttribute('required',''); const required=el.internals.validity.valueMissing; el.removeAttribute('required'); el.setAttribute('label','Project notes'); window.__phase3TextareaLabel=el.shadowRoot.querySelector('textarea').getAttribute('aria-label'); window.__phase3TextareaValidity=required&&!el.internals.validity.valueMissing; })()`); check('phase 3 review: textarea updates required validity and accessible label',await ev(`window.__phase3TextareaValidity&&window.__phase3TextareaLabel==='Project notes'`)); }
{ await ev(`(() => { const el=document.createElement('vfx-stepper'); const form=document.createElement('form'); const fieldset=document.createElement('fieldset'); el.setAttribute('name','quantity'); el.setAttribute('value','2'); fieldset.disabled=true; fieldset.append(el); form.append(fieldset); document.body.append(form); el.change(1); fieldset.disabled=false; setTimeout(()=>{form.reset();window.__phase3StepperReset=el.value===2&&!el.shadowRoot.querySelector('.up').disabled;form.remove();},80); window.__phase3StepperEnabled=false; setTimeout(()=>{window.__phase3StepperEnabled=!el.shadowRoot.querySelector('.up').disabled;},30); })()`); await sleep(180); check('phase 3 review: stepper recovers from fieldset disabled and resets to its default',await ev(`window.__phase3StepperReset&&window.__phase3StepperEnabled`)); }
{ await ev(`(() => { const el=document.createElement('vfx-file-upload'); el.setAttribute('accept','.pdf'); el.setAttribute('multiple',''); document.body.append(el); el.acceptFiles([new File(['a'],'good.pdf',{type:'application/pdf'}),new File(['b'],'bad.txt',{type:'text/plain'})]); window.__phase3FileMixed=el.shadowRoot.querySelector('.status').textContent; el.remove(); })()`); check('phase 3 review: mixed file batches retain both ready and rejection feedback',await ev(`window.__phase3FileMixed.includes('ready')&&window.__phase3FileMixed.includes('rejected')`)); }
{ await ev(`(() => { const el=document.createElement('vfx-alert'); document.body.append(el); el.setAttribute('tone','error'); window.__phase3AlertTitle=el.shadowRoot.querySelector('.title').textContent; el.remove(); })()`); check('phase 3 review: alert default title follows the selected tone',await ev(`window.__phase3AlertTitle==='Something went wrong'`)); }
{ await ev(`(() => { const el=document.createElement('vfx-otp'); let completions=0; el.addEventListener('complete',()=>completions++); document.body.append(el); el.value='123456'; el.update(); el.value='123456'; el.update(); window.__phase3OtpLatch=completions===1; el.remove(); })()`); check('phase 3 review: repeated OTP assignment does not re-emit completion',await ev(`window.__phase3OtpLatch`)); }
{ await ev(`(() => { const el=document.createElement('vfx-tag-input'); document.body.append(el); el.setAttribute('label','Search terms'); window.__phase3TagLabel=el.shadowRoot.querySelector('.entry').getAttribute('aria-label'); el.remove(); })()`); check('phase 3 review: tag input accessible name follows its label',await ev(`window.__phase3TagLabel==='Search terms'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-search'); el.setAttribute('suggestions','Alpha|Beta'); el.setAttribute('value','Al'); window.__phase3SearchQuery=el.shadowRoot.querySelector('.suggestions').hidden===false&&el.shadowRoot.querySelector('.suggestion')?.textContent==='Alpha'; })()`); check('phase 3 review: external search value refreshes an open matching suggestion list',await ev(`window.__phase3SearchQuery`)); }


{ await ev(`(() => { const el=document.createElement('vfx-combobox'); el.innerHTML='<option value="vue">Vue</option>'; el.setAttribute('value','vue'); document.body.append(el); el.setAttribute('value',''); el.setAttribute('disabled',''); el.choose(0); window.__phase4ComboGuard=el.value===''&&el.shadowRoot.querySelector('input').value===''; el.remove(); })()`); check('phase 4: combobox clears removed values and rejects disabled programmatic choices',await ev(`window.__phase4ComboGuard`)); }
{ await ev(`(() => { const el=document.createElement('vfx-date-picker'); el.setAttribute('disabled',''); document.body.append(el); el.formDisabledCallback(true); el.formDisabledCallback(false); window.__phase4DatePickerDisabled=el.hasAttribute('disabled')&&el.shadowRoot.querySelector('.trigger').disabled; el.remove(); })()`); check('phase 4: date picker preserves its own disabled attribute after fieldset re-enables',await ev(`window.__phase4DatePickerDisabled`)); }
{ await ev(`(() => { const el=document.createElement('vfx-calendar'); el.setAttribute('disabled',''); document.body.append(el); el.value='2026-11-20'; el.formDisabledCallback(true); el.formDisabledCallback(false); el.choose(''); window.__phase4CalendarDisabled=el.value==='2026-11-20'&&el.shadowRoot.querySelector('.clear').disabled; el.remove(); })()`); check('phase 4: calendar preserves disabled state and blocks its clear action',await ev(`window.__phase4CalendarDisabled`)); }

{ await ev(`(() => { const el=document.querySelector('vfx-menu'); el.setAttribute('items','Open project|Copy|Archive'); el.setAttribute('label','More options'); })()`); check('phase 4: menu rebuilds dynamic actions and label',await ev(`document.querySelector('vfx-menu').shadowRoot.querySelectorAll('.item').length===3&&document.querySelector('vfx-menu').shadowRoot.querySelector('.trigger span').textContent==='More options'&&document.querySelector('vfx-menu').items[0].value==='open-project'`)); await tap('vfx-menu >>> .trigger'); const menuOpened=await ev(`document.querySelector('vfx-menu').opened`); check('phase 4: menu opens from its trigger',menuOpened); await ev(`(() => { const m=document.querySelector('vfx-menu'); const item=m.shadowRoot.querySelector('.item'); item.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,composed:true,cancelable:true})); window.__phase4MenuEscapeState=[m.opened,m.shadowRoot.querySelector('.trigger').getAttribute('aria-expanded'),m.shadowRoot.querySelector('.panel').hidden].join('|'); })()`); check('phase 4: menu closes with Escape and resets expanded state',await ev(`!document.querySelector('vfx-menu').opened&&document.querySelector('vfx-menu').shadowRoot.querySelector('.trigger').getAttribute('aria-expanded')==='false'`),await ev(`window.__phase4MenuEscapeState`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-dialog'); el.setAttribute('title','Updated title'); el.setAttribute('confirm-label','Apply changes'); })()`); check('phase 4: dialog synchronizes title and confirm label attributes',await ev(`document.querySelector('vfx-dialog').shadowRoot.querySelector('.title').textContent==='Updated title'&&document.querySelector('vfx-dialog').shadowRoot.querySelector('.confirm').textContent==='Apply changes'`)); }
{ await ev(`(() => { const el=document.createElement('vfx-drawer'); el.innerHTML='<span slot="trigger">Open test drawer</span><p>Drawer test content</p>'; el.setAttribute('title','Test drawer'); document.body.append(el); window.__drawerFixture=el; })()`); await ev(`window.__drawerFixture.shadowRoot.querySelector('.launch').click()`); await sleep(120); check('phase 4: drawer opens as a native modal dialog',await ev(`window.__drawerFixture.opened&&window.__drawerFixture.shadowRoot.querySelector('dialog').getAttribute('aria-labelledby')!==null`)); await ev(`window.__drawerFixture.setAttribute('placement','left')`); check('phase 4: drawer synchronizes placement',await ev(`window.__drawerFixture.shadowRoot.querySelector('dialog').dataset.placement==='left'`)); await ev(`window.__drawerFixture.shadowRoot.querySelector('.close').click()`); await sleep(100); check('phase 4: drawer closes and restores its trigger',await ev(`!window.__drawerFixture.opened&&window.__drawerFixture.shadowRoot.activeElement===window.__drawerFixture.shadowRoot.querySelector('.launch')`)); await ev(`window.__drawerFixture.remove(); window.__drawerFixture=null`); }
{ await ev(`(() => { const el=document.querySelector('vfx-command-palette'); el.setAttribute('disabled',''); el.show(); })()`); check('phase 4: disabled command palette refuses to open',await ev(`!document.querySelector('vfx-command-palette').opened`)); await ev(`(() => document.querySelector('vfx-command-palette').removeAttribute('disabled'))()`); }
{ await ev(`(() => { const el=document.querySelector('vfx-context-menu'); el.setAttribute('items','Open|Copy|Rename'); el.setAttribute('label','Item actions'); })()`); check('phase 4: context menu refreshes items and accessible label',await ev(`document.querySelector('vfx-context-menu').shadowRoot.querySelectorAll('.item').length===3&&document.querySelector('vfx-context-menu').shadowRoot.querySelector('.menu').getAttribute('aria-label')==='Item actions'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-combobox'); el.value='vue'; })()`); check('phase 4: combobox external value updates its input label',await ev(`document.querySelector('vfx-combobox').shadowRoot.querySelector('input').value==='Vue'`)); }
{ await ev(`(() => { const el=document.querySelector('vfx-calendar'); el.value=''; el.setAttribute('min','2026-11-20'); el.choose('2026-11-19'); })()`); check('phase 4: calendar blocks programmatic dates outside bounds',await ev(`document.querySelector('vfx-calendar').value===''`)); await ev(`document.querySelector('vfx-calendar').removeAttribute('min')`); }
{ await ev(`(() => { const el=document.querySelector('vfx-date-picker'); el.setAttribute('disabled',''); el.show(); })()`); check('phase 4: disabled date picker refuses to open',await ev(`!document.querySelector('vfx-date-picker').opened&&document.querySelector('vfx-date-picker').shadowRoot.querySelector('.trigger').disabled`)); await ev(`document.querySelector('vfx-date-picker').removeAttribute('disabled')`); }

{ await ev(`(() => { const el=document.createElement('vfx-drag-drop');el.id='phase5-drag';el.setAttribute('items','Alpha|Beta|Gamma');document.body.append(el);window.__phase5DragEvents=0;el.addEventListener('change',()=>window.__phase5DragEvents++); })()`); await sleep(80);
  const moved=await ev(`(() => { const el=document.querySelector('#phase5-drag');const ok=el.move(0,2);return ok&&el.items.join('|')==='Beta|Gamma|Alpha'&&window.__phase5DragEvents===1; })()`);
  await ev(`document.querySelector('#phase5-drag').setAttribute('items','One|Two')`); const dynamic=await ev(`document.querySelector('#phase5-drag').items.join('|')==='One|Two'`);
  await ev(`(() => {const el=document.querySelector('#phase5-drag');const row=el.shadowRoot.querySelector('.item[data-index="0"]');const button=row.querySelector('[data-move="1"]');button.focus();button.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',altKey:true,bubbles:true,composed:true,cancelable:true}));window.__phase5DragFocus=el.shadowRoot.activeElement?.closest('.item')?.dataset.index==='1'&&!!el.shadowRoot.activeElement?.matches('button');})()`);
  const focusResult=await ev(`window.__phase5DragFocus`);const dragSnapshot=await ev(`(() => {const el=document.querySelector('#phase5-drag');return JSON.stringify({items:el.items,focus:el.shadowRoot.activeElement?.outerHTML,activeIndex:el.shadowRoot.activeElement?.closest('.item')?.dataset.index,activeTag:el.shadowRoot.activeElement?.tagName,activeClass:el.shadowRoot.activeElement?.className});})()`);check('phase 5: drag list emits ordered changes, syncs new items and preserves keyboard focus',moved&&dynamic&&focusResult,JSON.stringify({moved,dynamic,focusResult,dragSnapshot}));
  await ev(`document.querySelector('#phase5-drag').setAttribute('items','')`);const dragEmpty=await ev(`document.querySelector('#phase5-drag').shadowRoot.querySelector('.empty')?.textContent.includes('No items')`);check('phase 5: drag list renders a safe empty state',dragEmpty,await ev(`document.querySelector('#phase5-drag').shadowRoot.querySelector('.list').innerHTML`));await ev(`document.querySelector('#phase5-drag').remove()`);
}
{ await ev(`(() => {const el=document.createElement('vfx-carousel');el.id='phase5-carousel';el.setAttribute('slides','First|Second|Third');document.body.append(el);window.__phase5CarouselChanges=0;el.addEventListener('change',()=>window.__phase5CarouselChanges++);})()`);await sleep(80);
  const changed=await ev(`(() => {const el=document.querySelector('#phase5-carousel');el.activeIndex=2;return el.activeIndex===2&&el.shadowRoot.querySelector('.slide[aria-hidden="false"] strong').textContent==='Third'&&window.__phase5CarouselChanges===1;})()`);
  await ev(`document.querySelector('#phase5-carousel').setAttribute('slides','Only')`);const single=await ev(`(() => {const el=document.querySelector('#phase5-carousel');el.next();return el.activeIndex===0&&el.shadowRoot.querySelector('.next').disabled&&el.shadowRoot.querySelector('.count').textContent==='1/1';})()`);
  await ev(`document.querySelector('#phase5-carousel').setAttribute('slides','')`);const empty=await ev(`(() => {const el=document.querySelector('#phase5-carousel');el.next();return el.activeIndex===0&&el.shadowRoot.querySelector('.count').textContent==='0/0'&&el.shadowRoot.querySelector('.next').disabled;})()`);check('phase 5: carousel synchronizes slides and handles single and empty states',changed&&single&&empty);await ev(`document.querySelector('#phase5-carousel').remove()`);
}
{ await ev(`(() => {const el=document.createElement('vfx-timeline');el.id='phase5-timeline';el.setAttribute('items','Plan::Define scope|Build::Create it|Ship::Release it');document.body.append(el);window.__phase5TimelineSelects=0;el.addEventListener('select',()=>window.__phase5TimelineSelects++);})()`);await sleep(80);
  const selected=await ev(`(() => {const el=document.querySelector('#phase5-timeline');el.activeIndex=2;return el.activeIndex===2&&el.shadowRoot.querySelector('.entry[aria-current="step"] .title').textContent==='Ship'&&window.__phase5TimelineSelects===1;})()`);
  await ev(`document.querySelector('#phase5-timeline').setAttribute('items','Revised::Updated milestone|Final::Complete')`);const synced=await ev(`document.querySelector('#phase5-timeline').items.map(x=>x.title).join('|')==='Revised|Final'&&document.querySelector('#phase5-timeline').activeIndex===1`);
  await ev(`document.querySelector('#phase5-timeline').setAttribute('items','')`);const empty=await ev(`(() => {const el=document.querySelector('#phase5-timeline');return el.items.length===0&&el.shadowRoot.querySelector('.empty')!==null&&!el.select(0);})()`);check('phase 5: timeline supports programmatic selection, live item updates and empty data',selected&&synced&&empty);await ev(`document.querySelector('#phase5-timeline').remove()`);
}
{ await ev(`(() => {const el=document.createElement('vfx-radial-menu');el.id='phase5-radial';el.setAttribute('items','Create|Edit|Share');document.body.append(el);window.__phase5RadialSelected='';el.addEventListener('select',e=>window.__phase5RadialSelected=e.detail.label);})()`);await sleep(80);
  const opened=await ev(`(() => {const el=document.querySelector('#phase5-radial');el.show();return el.opened&&el.shadowRoot.activeElement===el.shadowRoot.querySelector('.choice')&&el.shadowRoot.querySelector('.choices').inert===false;})()`);
  await ev(`(() => {const el=document.querySelector('#phase5-radial');el.shadowRoot.querySelector('.well').dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true,composed:true,cancelable:true}));})()`);const keys=await ev(`document.querySelector('#phase5-radial').shadowRoot.activeElement?.dataset.index==='2'`);
  await ev(`document.querySelector('#phase5-radial').hide()`);const returned=await ev(`(() => {const el=document.querySelector('#phase5-radial');return !el.opened&&el.shadowRoot.activeElement===el.shadowRoot.querySelector('.toggle')&&el.shadowRoot.querySelector('.choices').inert;})()`);
  await ev(`document.querySelector('#phase5-radial').setAttribute('items','')`);const empty=await ev(`(() => {const el=document.querySelector('#phase5-radial');return el.items.length===0&&!el.show()&&el.shadowRoot.querySelectorAll('.choice').length===0;})()`);check('phase 5: radial menu manages focus, keyboard navigation and dynamic empty states',opened&&keys&&returned&&empty,JSON.stringify({opened,keys,returned,empty,focus:await ev(`document.querySelector('#phase5-radial').shadowRoot.activeElement?.outerHTML`),expanded:await ev(`document.querySelector('#phase5-radial').shadowRoot.querySelector('.toggle').outerHTML`),choices:await ev(`document.querySelector('#phase5-radial').shadowRoot.querySelector('.choices').outerHTML`)}));await ev(`document.querySelector('#phase5-radial').remove()`);
}
{ await ev(`(() => {const el=document.createElement('vfx-image-cropper');el.id='phase5-cropper';document.body.append(el);window.__phase5CropLoaded=false;window.__phase5CropResult=null;el.addEventListener('image-load',()=>window.__phase5CropLoaded=true,{once:true});el.addEventListener('error',()=>window.__phase5CropError=true);const source=document.createElement('canvas');source.width=400;source.height=300;const c=source.getContext('2d');c.fillStyle='#ff5fa8';c.fillRect(0,0,400,300);c.fillStyle='#1d1a4a';c.fillRect(100,70,200,160);source.toBlob(blob=>el.load(new File([blob],'phase5.png',{type:'image/png'})),'image/png');})()`);await sleep(500);
  let loaded=await ev(`window.__phase5CropLoaded===true`);for(let i=0;i<12&&!loaded;i++){await sleep(120);loaded=await ev(`window.__phase5CropLoaded===true`);}
  const controls=await ev(`(() => {const el=document.querySelector('#phase5-cropper');return !!el.image&&el.image.naturalWidth===400&&el.shadowRoot.querySelector('.export').disabled===false&&!el.imageUrl;})()`);
  const keyboard=await ev(`(() => {const el=document.querySelector('#phase5-cropper'),box=el.shadowRoot.querySelector('.selection'),before=el.crop.left;box.focus();box.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true,cancelable:true}));const moved=el.crop.left>before;const size=el.crop.size;box.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true,composed:true,cancelable:true}));return moved&&el.crop.size>size;})()`);
  await ev(`document.querySelector('#phase5-cropper').exportCrop().then(async blob=>{if(blob){const bmp=await createImageBitmap(blob);window.__phase5CropResult={type:blob.type,width:bmp.width,height:bmp.height};bmp.close();}}).catch(e=>window.__phase5CropError=String(e))`);
  let result=await ev(`window.__phase5CropResult`);for(let i=0;i<20&&!result;i++){await sleep(100);result=await ev(`window.__phase5CropResult`);}
  const exported=!!result&&result.type==='image/png'&&result.width===result.height&&result.width>50;
  await ev(`(() => {const el=document.querySelector('#phase5-cropper');const observer=!!el.resizeObserver;el.remove();const disconnected=el.resizeObserver===null;document.body.append(el);window.__phase5CropReconnect=observer&&disconnected&&!!el.resizeObserver;el.remove();})()`);
  check('phase 5: cropper handles local image loading, keyboard crop geometry, source-resolution export and reconnect',loaded&&controls&&keyboard&&exported&&await ev(`window.__phase5CropReconnect`),JSON.stringify(result));
  await ev(`document.querySelector('#phase5-cropper')?.remove()`);
}


{ await ev("(() => {const el=document.createElement('vfx-kanban');el.id='phase6-kanban';el.setAttribute('lanes','Todo|Doing|Done');el.setAttribute('items','a::Draft::0|b::Review::1');document.body.append(el);window.__phase6KanbanChanges=0;el.addEventListener('change',()=>window.__phase6KanbanChanges++);})()"); await sleep(80);
  const moved=await ev("(() => {const el=document.querySelector('#phase6-kanban');return el.move('a',2)&&el.cards.find(x=>x.id==='a').lane===2&&window.__phase6KanbanChanges===1;})()");
  const added=await ev("(() => {const el=document.querySelector('#phase6-kanban'),card=el.addCard('Ship',1,'c');let duplicate=false;try{el.addCard('Duplicate',0,'c');}catch{duplicate=true;}return card.id==='c'&&el.cards.length===3&&duplicate;})()");
  await ev("document.querySelector('#phase6-kanban').setAttribute('items','')"); const emptyCards=await ev("document.querySelector('#phase6-kanban').cards.length===0");
  await ev("document.querySelector('#phase6-kanban').setAttribute('lanes','')"); const emptyLanes=await ev("document.querySelector('#phase6-kanban').shadowRoot.querySelector('.empty')?.textContent.includes('No lanes')");
  await ev("document.querySelector('#phase6-kanban').setAttribute('lanes','Backlog|Done')"); const restored=await ev("document.querySelector('#phase6-kanban').shadowRoot.querySelectorAll('.lane').length===2");
  check('phase 6: Kanban moves/adds cards, rejects duplicate ids and handles live empty/replaced data',moved&&added&&emptyCards&&emptyLanes&&restored,JSON.stringify({moved,added,emptyCards,emptyLanes,restored})); await ev("document.querySelector('#phase6-kanban').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-data-grid');el.id='phase6-grid';el.setAttribute('columns','name:Name|role:Role');el.setAttribute('rows','1::Ari::Designer|2::Bea::Engineer|3::Cy::Artist|4::Dee::Writer');el.setAttribute('page-size','2');document.body.append(el);window.__phase6GridSelection=0;el.addEventListener('selection',()=>window.__phase6GridSelection++);})()"); await sleep(80);
  const page=await ev("(() => {const el=document.querySelector('#phase6-grid');el.page=2;return el.page===2&&el.shadowRoot.querySelector('.range').textContent==='3–4 of 4 rows';})()");
  await ev("(() => {const el=document.querySelector('#phase6-grid'),c=el.shadowRoot.querySelector('[data-row-check]');c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}));})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase6-grid');return el.selectedRows.length===1&&el.shadowRoot.querySelector('.selected').textContent==='1 selected'&&window.__phase6GridSelection===1;})()");
  await ev("document.querySelector('#phase6-grid').setAttribute('columns','name:Display Name|status:State')");
  const columns=await ev("(() => {const el=document.querySelector('#phase6-grid');return el.shadowRoot.querySelectorAll('thead [data-sort]').length===2&&el.shadowRoot.querySelector('thead').textContent.includes('Display Name')&&el.shadowRoot.querySelector('thead').textContent.includes('State');})()");
  await ev("document.querySelector('#phase6-grid').setAttribute('rows','9::Eli::Analyst')");
  const pruned=await ev("(() => {const el=document.querySelector('#phase6-grid');return el.selectedRows.length===0&&el.shadowRoot.querySelector('.selected').textContent==='0 selected'&&el.page===1;})()");
  await ev("document.querySelector('#phase6-grid').setAttribute('rows','')");
  const empty=await ev("(() => {const el=document.querySelector('#phase6-grid');return el.rows.length===0&&el.shadowRoot.querySelector('.range').textContent==='0 rows'&&el.shadowRoot.querySelector('.empty').textContent==='No matching rows';})()");
  check('phase 6: Data Grid synchronizes columns/rows, selection, pagination and empty states',page&&selected&&columns&&pruned&&empty,JSON.stringify({page,selected,columns,pruned,empty})); await ev("document.querySelector('#phase6-grid').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-tree-view');el.id='phase6-tree';el.setAttribute('items','root::Project::-|src::Source::root|app::App.js::src');document.body.append(el);window.__phase6TreeSelects=0;el.addEventListener('select',()=>window.__phase6TreeSelects++);})()"); await sleep(80);
  const right=await ev("(() => {const el=document.querySelector('#phase6-tree');el.collapseAll();const root=[...el.shadowRoot.querySelectorAll('.node')].find(x=>x.dataset.id==='root');root.focus();root.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true,cancelable:true}));return el.shadowRoot.activeElement?.dataset.id==='src'&&[...el.shadowRoot.querySelectorAll('.node')].find(x=>x.dataset.id==='root').getAttribute('aria-expanded')==='true';})()");
  await ev("(() => {const el=document.querySelector('#phase6-tree'),src=[...el.shadowRoot.querySelectorAll('.node')].find(x=>x.dataset.id==='src');src.focus();src.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true,cancelable:true}));})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase6-tree'),node=[...el.shadowRoot.querySelectorAll('.node')].find(x=>x.dataset.id==='app');node.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,composed:true,cancelable:true}));return el.value==='app'&&window.__phase6TreeSelects===1;})()");
  await ev("document.querySelector('#phase6-tree').setAttribute('items','')"); const empty=await ev("(() => {const el=document.querySelector('#phase6-tree');return el.items.length===0&&el.value===''&&el.shadowRoot.querySelector('.empty')!==null;})()");
  await ev("document.querySelector('#phase6-tree').items=[{id:'root',label:'Root',parent:'-'},{id:'leaf',label:'Leaf',parent:'root'}]");
  const property=await ev("(() => {const el=document.querySelector('#phase6-tree');return el.select('leaf')&&el.value==='leaf';})()");
  check('phase 6: Tree View expands to its first child, selects by keyboard and handles empty/property data',right&&selected&&empty&&property,JSON.stringify({right,selected,empty,property})); await ev("document.querySelector('#phase6-tree').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-signature-pad');el.id='phase6-signature';document.body.append(el);window.__phase6SignatureExport=false;})()"); await sleep(80);
  const drawn=await ev("(() => {const el=document.querySelector('#phase6-signature'),canvas=el.shadowRoot.querySelector('canvas');canvas.focus();for(const [key,code] of [[' ','Space'],['ArrowRight','ArrowRight'],['ArrowDown','ArrowDown'],['ArrowRight','ArrowRight'],[' ','Space']])canvas.dispatchEvent(new KeyboardEvent('keydown',{key,code,bubbles:true,composed:true,cancelable:true}));return el.hasSignature&&el.strokes[0].length>=3;})()");
  await ev("document.querySelector('#phase6-signature').exportPNG().then(blob=>window.__phase6SignatureExport=!!blob&&blob.type==='image/png'&&blob.size>0)");
  let exported=await ev("window.__phase6SignatureExport"); for(let i=0;i<15&&!exported;i++){await sleep(80);exported=await ev("window.__phase6SignatureExport");}
  const undone=await ev("(() => {const el=document.querySelector('#phase6-signature');return el.undo()&&!el.hasSignature&&!el.undo();})()");
  const cleared=await ev("(() => {const el=document.querySelector('#phase6-signature');el.strokes=[[{x:1,y:1}]];el._draw();return el.clear()&&!el.hasSignature&&!el.clear();})()");
  check('phase 6: Signature Pad supports keyboard pen drawing, PNG export, undo and safe clearing',drawn&&exported&&undone&&cleared,JSON.stringify({drawn,exported,undone,cleared})); await ev("document.querySelector('#phase6-signature').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-before-after');el.id='phase6-comparison';document.body.append(el);window.__phase6CompareInputs=0;el.addEventListener('input',()=>window.__phase6CompareInputs++);window.__phase6CompareLoaded=false;el.addEventListener('image-load',()=>window.__phase6CompareLoaded=true);})()"); await sleep(80);
  const value=await ev("(() => {const el=document.querySelector('#phase6-comparison'),range=el.shadowRoot.querySelector('input');range.value='72';range.dispatchEvent(new Event('input',{bubbles:true}));el.setAttribute('before-label','Original');el.setAttribute('after-label','Enhanced');el.value=NaN;return el.value===50&&window.__phase6CompareInputs===1&&el.shadowRoot.querySelector('.before-label').textContent==='Original'&&el.shadowRoot.querySelector('.after-label').textContent==='Enhanced';})()");
  await ev("document.querySelector('#phase6-comparison').setAttribute('before-src','data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%228%22%20height%3D%228%22%3E%3Crect%20width%3D%228%22%20height%3D%228%22%20fill%3D%22red%22%2F%3E%3C%2Fsvg%3E')");
  let loaded=await ev("window.__phase6CompareLoaded"); for(let i=0;i<20&&!loaded;i++){await sleep(80);loaded=await ev("window.__phase6CompareLoaded");}
  const image=await ev("(() => {const el=document.querySelector('#phase6-comparison');return !!el.shadowRoot.querySelector('.before .comparison-image')&&el.shadowRoot.querySelector('.before .scene').hidden;})()");
  await ev("document.querySelector('#phase6-comparison').removeAttribute('before-src')");
  const fallback=await ev("(() => {const el=document.querySelector('#phase6-comparison');return !el.shadowRoot.querySelector('.before .comparison-image')&&!el.shadowRoot.querySelector('.before .scene').hidden;})()");
  check('phase 6: Before/After handles live labels and values, asynchronous image loading and fallback',value&&loaded&&image&&fallback,JSON.stringify({value,loaded,image,fallback})); await ev("document.querySelector('#phase6-comparison').remove()");
}


{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-multi-select');el.id='phase7-multi';el.setAttribute('name','frameworks');el.setAttribute('options','a::Alpha|b::Beta|c::Gamma');el.setAttribute('value','a');el.setAttribute('required','');form.append(el);document.body.append(form);window.__phase7Multi=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase7-multi'),form=window.__phase7Multi;return el.value.join('|')==='a'&&new FormData(form).get('frameworks')==='a'&&form.checkValidity();})()");
  await ev("document.querySelector('#phase7-multi').setAttribute('options','b::Beta|d::Delta|b::Duplicate')");
  const pruned=await ev("(() => {const el=document.querySelector('#phase7-multi');return el.value.length===0&&el.selectedOptions.length===0&&el.shadowRoot.querySelectorAll('.option').length===2;})()");
  await ev("document.querySelector('#phase7-multi').setAttribute('value','b')");
  const liveValue=await ev("(() => {const el=document.querySelector('#phase7-multi');return el.value.join('|')==='b'&&new FormData(window.__phase7Multi).get('frameworks')==='b'&&window.__phase7Multi.checkValidity();})()");
  await ev("(() => {const el=document.querySelector('#phase7-multi');el.open();el.shadowRoot.querySelector('.search').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,composed:true,cancelable:true}));el.shadowRoot.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true,composed:true,cancelable:true}));el.shadowRoot.activeElement.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,composed:true,cancelable:true}));})()");
  const keyboard=await ev("(() => {const el=document.querySelector('#phase7-multi');return el.value.join('|')==='b|d'&&el.shadowRoot.querySelector('[data-value=\"d\"]').getAttribute('aria-selected')==='true';})()");
  await ev("document.querySelector('#phase7-multi').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase7-multi');return !el.open()&&!el.toggleValue('b')&&el.shadowRoot.querySelector('.trigger').disabled;})()");
  check('phase 7: Multi Select synchronizes options and values, filters duplicate ids, supports keyboard selection, form validity and disabled guards',initial&&pruned&&liveValue&&keyboard&&disabled,JSON.stringify({initial,pruned,liveValue,keyboard,disabled}));
  await ev("window.__phase7Multi.remove();window.__phase7Multi=null");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-time-picker');el.id='phase7-time';el.setAttribute('name','meeting');el.setAttribute('value','09:30');el.setAttribute('min','09:00');el.setAttribute('max','10:00');el.setAttribute('step','15');el.setAttribute('required','');form.append(el);document.body.append(form);window.__phase7Time=form;})()"); await sleep(80);
  const inRange=await ev("(() => {const el=document.querySelector('#phase7-time');return el.value==='09:30'&&el.adjust(-15)&&el.value==='09:15'&&new FormData(window.__phase7Time).get('meeting')==='09:15';})()");
  const bounded=await ev("(() => {const el=document.querySelector('#phase7-time'),blocked=el.adjust(-30);return blocked===false&&el.value==='09:15';})()");
  await ev("document.querySelector('#phase7-time').setTime('10:15',false)");
  const overflow=await ev("(() => {const el=document.querySelector('#phase7-time');return !window.__phase7Time.checkValidity()&&el.internals?.validity?.rangeOverflow===true;})()");
  await ev("document.querySelector('#phase7-time').setAttribute('max','10:30')");
  const liveBounds=await ev("(() => {const el=document.querySelector('#phase7-time');return window.__phase7Time.checkValidity()&&new FormData(window.__phase7Time).get('meeting')==='10:15';})()");
  await ev("document.querySelector('#phase7-time').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase7-time');return el.shadowRoot.querySelector('input').disabled&&el.shadowRoot.querySelector('.up').disabled;})()");
  await ev("document.querySelector('#phase7-time').removeAttribute('disabled');window.__phase7Time.reset()");
  const reset=await ev("document.querySelector('#phase7-time').value==='09:30'");
  check('phase 7: Time Picker enforces bounds and minute steps, updates form values, synchronizes attributes and resets safely',inRange&&bounded&&overflow&&liveBounds&&disabled&&reset,JSON.stringify({inRange,bounded,overflow,liveBounds,disabled,reset}));
  await ev("window.__phase7Time.remove();window.__phase7Time=null");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-transfer-list');el.id='phase7-transfer';el.setAttribute('name','frameworks');el.setAttribute('items','a::Alpha|b::Beta|a::Duplicate|c::Gamma');el.setAttribute('value','b');form.append(el);document.body.append(form);window.__phase7Transfer=form;})()"); await sleep(80);
  const normalised=await ev("(() => {const el=document.querySelector('#phase7-transfer');return el.items.length===3&&el.value.join('|')==='b'&&new FormData(window.__phase7Transfer).get('frameworks')==='b';})()");
  await ev("(() => {const el=document.querySelector('#phase7-transfer');el.shadowRoot.querySelector('.left [data-id=\"a\"]').click();el.shadowRoot.querySelector('.add').click();})()");
  const moved=await ev("(() => {const el=document.querySelector('#phase7-transfer');return el.value.join('|')==='a|b'&&new FormData(window.__phase7Transfer).get('frameworks')==='a,b';})()");
  await ev("document.querySelector('#phase7-transfer').setAttribute('items','b::Beta|d::Delta')");
  const dynamic=await ev("(() => {const el=document.querySelector('#phase7-transfer');return el.items.length===2&&el.value.join('|')==='b';})()");
  await ev("document.querySelector('#phase7-transfer').items=[{id:'x',label:'Ex'},{id:'x',label:'Duplicate'},{id:'y',label:'Why'}];document.querySelector('#phase7-transfer').value=['y','missing']");
  const property=await ev("(() => {const el=document.querySelector('#phase7-transfer');return el.items.length===2&&el.value.join('|')==='y';})()");
  await ev("document.querySelector('#phase7-transfer').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase7-transfer'),before=el.value.join('|');return el.moveToSelected(true)===false&&el.value.join('|')===before&&el.shadowRoot.querySelector('.search').disabled;})()");
  await ev("document.querySelector('#phase7-transfer').setAttribute('items','')");
  const empty=await ev("(() => {const el=document.querySelector('#phase7-transfer');return el.items.length===0&&el.shadowRoot.querySelectorAll('.empty').length===2;})()");
  check('phase 7: Transfer List normalizes items, synchronizes form and live data, moves selections, rejects stale ids and guards disabled/empty states',normalised&&moved&&dynamic&&property&&disabled&&empty,JSON.stringify({normalised,moved,dynamic,property,disabled,empty}));
  await ev("window.__phase7Transfer.remove();window.__phase7Transfer=null");
}
{ await ev("(() => {const el=document.createElement('vfx-split-pane');el.id='phase7-split';el.setAttribute('value','42');el.setAttribute('min','30');document.body.append(el);})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase7-split'),d=el.shadowRoot.querySelector('.divider');return el.value===42&&d.getAttribute('aria-valuemin')==='30'&&d.getAttribute('aria-valuemax')==='70';})()");
  await ev("document.querySelector('#phase7-split').value=95");
  const clamped=await ev("document.querySelector('#phase7-split').value===70");
  await ev("(() => {const el=document.querySelector('#phase7-split'),d=el.shadowRoot.querySelector('.divider');d.focus();d.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true,cancelable:true}));d.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true,composed:true,cancelable:true}));})()");
  const keyboard=await ev("document.querySelector('#phase7-split').value===70");
  await ev("document.querySelector('#phase7-split').value=42;document.querySelector('#phase7-split').setAttribute('min','20');");
  const shifted=await ev("document.querySelector('#phase7-split').value===42");
  await ev("(() => {const el=document.querySelector('#phase7-split'),d=el.shadowRoot.querySelector('.divider');d.focus();d.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true,cancelable:true}));d.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',shiftKey:true,bubbles:true,composed:true,cancelable:true}));})()");
  const keySteps=await ev("document.querySelector('#phase7-split').value===54");
  await ev("document.querySelector('#phase7-split').setAttribute('orientation','horizontal')");
  const orientation=await ev("(() => {const el=document.querySelector('#phase7-split');return el.shadowRoot.querySelector('.layout').classList.contains('horizontal')&&el.shadowRoot.querySelector('.divider').getAttribute('aria-orientation')==='horizontal';})()");
  await ev("document.querySelector('#phase7-split').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase7-split'),d=el.shadowRoot.querySelector('.divider'),before=el.value;d.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowDown',bubbles:true,composed:true,cancelable:true}));return d.tabIndex===-1&&el.value===before;})()");
  check('phase 7: Split Pane clamps symmetric limits, synchronizes orientation, supports keyboard step sizes and blocks disabled resizing',initial&&clamped&&keyboard&&shifted&&keySteps&&orientation&&disabled,JSON.stringify({initial,clamped,keyboard,shifted,keySteps,orientation,disabled}));
  await ev("document.querySelector('#phase7-split').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-lightbox-gallery');el.id='phase7-lightbox';el.setAttribute('items','Sun::|Cloud::|Night::');document.body.append(el);window.__phase7CloseEvents=0;el.addEventListener('close',()=>window.__phase7CloseEvents++);})()"); await sleep(80);
  const rendered=await ev("document.querySelector('#phase7-lightbox').shadowRoot.querySelectorAll('.thumb').length===3");
  await ev("(() => {const el=document.querySelector('#phase7-lightbox'),thumb=el.shadowRoot.querySelector('.thumb[data-index=\"1\"]');thumb.focus();el.open(1);})()");
  const opened=await ev("(() => {const el=document.querySelector('#phase7-lightbox');return el.shadowRoot.querySelector('.viewer').open&&el.activeIndex===1&&el.shadowRoot.activeElement===el.shadowRoot.querySelector('.close');})()");
  const navigation=await ev("(() => {const el=document.querySelector('#phase7-lightbox'),viewer=el.shadowRoot.querySelector('.viewer');el.next();const next=el.activeIndex===2;viewer.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,composed:true,cancelable:true}));return next&&el.activeIndex===1&&el.previous();})()");
  await ev("document.querySelector('#phase7-lightbox').close()"); await sleep(100);
  const focusReturn=await ev("(() => {const el=document.querySelector('#phase7-lightbox');return !el.shadowRoot.querySelector('.viewer').open&&el.shadowRoot.activeElement===el.shadowRoot.querySelector('.thumb[data-index=\"1\"]')&&window.__phase7CloseEvents===1;})()");
  await ev("document.querySelector('#phase7-lightbox').open(2);document.querySelector('#phase7-lightbox').setAttribute('items','Only::')");
  const liveClamp=await ev("(() => {const el=document.querySelector('#phase7-lightbox');return el.activeIndex===0&&el.shadowRoot.querySelectorAll('.thumb').length===1&&el.shadowRoot.querySelector('.viewer').open;})()");
  await ev("document.querySelector('#phase7-lightbox').setAttribute('items','')");
  const empty=await ev("(() => {const el=document.querySelector('#phase7-lightbox');return el.items.length===0&&!el.next()&&!el.previous()&&!el.shadowRoot.querySelector('.viewer').open&&!!el.shadowRoot.querySelector('.empty');})()");
  check('phase 7: Lightbox Gallery handles live gallery updates, bounded navigation, keyboard controls, empty data and focus return',rendered&&opened&&navigation&&focusReturn&&liveClamp&&empty,JSON.stringify({rendered,opened,navigation,focusReturn,liveClamp,empty}));
  await ev("document.querySelector('#phase7-lightbox').remove()");
}


{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-password-field');el.id='phase8-password';el.setAttribute('name','accountPassword');el.setAttribute('value','StrongPassword1!');el.setAttribute('minlength','10');el.setAttribute('required','');form.append(el);document.body.append(form);window.__phase8PasswordForm=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-password'),form=window.__phase8PasswordForm;return el.value==='StrongPassword1!'&&el.strength===4&&form.checkValidity()&&new FormData(form).get('accountPassword')==='StrongPassword1!';})()");
  await ev("document.querySelector('#phase8-password').setAttribute('minlength','20')");
  const minimum=await ev("(() => {const el=document.querySelector('#phase8-password'),form=window.__phase8PasswordForm;return el.shadowRoot.querySelector('[data-rule=length]').textContent.includes('20')&&!form.checkValidity()&&el.internals.validity.tooShort===true;})()");
  await ev("document.querySelector('#phase8-password').value='StrongPassword1!Long'");
  const recovered=await ev("window.__phase8PasswordForm.checkValidity()&&document.querySelector('#phase8-password').strength===4");
  const reveal=await ev("(() => {const el=document.querySelector('#phase8-password');return el.toggleVisibility()===true&&el.shadowRoot.querySelector('input').type==='text'&&el.shadowRoot.querySelector('.reveal').getAttribute('aria-pressed')==='true'&&el.toggleVisibility()===false&&el.shadowRoot.querySelector('input').type==='password';})()");
  await ev("document.querySelector('#phase8-password').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-password');return el.shadowRoot.querySelector('input').disabled&&el.shadowRoot.querySelector('.reveal').disabled;})()");
  await ev("document.querySelector('#phase8-password').removeAttribute('disabled');window.__phase8PasswordForm.reset()");
  const reset=await ev("document.querySelector('#phase8-password').value==='StrongPassword1!'");
  check('phase 8: Password Field synchronizes strength rules, form validity, reveal state, disabled state and reset',initial&&minimum&&recovered&&reveal&&disabled&&reset,JSON.stringify({initial,minimum,recovered,reveal,disabled,reset}));
  await ev("window.__phase8PasswordForm.remove();window.__phase8PasswordForm=null");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-date-range-picker');el.id='phase8-dates';el.setAttribute('name','booking');el.setAttribute('start','2026-11-20');el.setAttribute('end','2026-11-27');el.setAttribute('required','');form.append(el);document.body.append(form);window.__phase8DateForm=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-dates'),form=window.__phase8DateForm;return el.valid&&form.checkValidity()&&new FormData(form).get('booking')==='2026-11-20/2026-11-27';})()");
  await ev("document.querySelector('#phase8-dates').value={start:'2026-11-29',end:'2026-11-21'}");
  const ordering=await ev("(() => {const el=document.querySelector('#phase8-dates'),form=window.__phase8DateForm;return !el.valid&&!form.checkValidity()&&el.shadowRoot.querySelector('.summary').classList.contains('invalid');})()");
  await ev("(() => {const el=document.querySelector('#phase8-dates');el.setAttribute('min','2026-11-01');el.setAttribute('max','2026-12-31');el.value={start:'2026-11-22',end:'2026-11-25'};})()");
  const bounds=await ev("(() => {const el=document.querySelector('#phase8-dates');return el.valid&&el.shadowRoot.querySelector('#end').min==='2026-11-22'&&window.__phase8DateForm.checkValidity();})()");
  await ev("document.querySelector('#phase8-dates').preset('7')");
  const preset=await ev("(() => {const el=document.querySelector('#phase8-dates'),v=el.value;return el.valid&&(Date.parse(v.end)-Date.parse(v.start))===6*86400000;})()");
  await ev("document.querySelector('#phase8-dates').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-dates');return el.shadowRoot.querySelector('#start').disabled&&el.shadowRoot.querySelector('.clear').disabled&&el.clear()===false;})()");
  await ev("document.querySelector('#phase8-dates').removeAttribute('disabled');window.__phase8DateForm.reset()");
  const reset=await ev("(() => {const el=document.querySelector('#phase8-dates');return el.value.start==='2026-11-20'&&el.value.end==='2026-11-27';})()");
  check('phase 8: Date Range Picker enforces ordering and bounds, serializes forms, applies inclusive presets and resets',initial&&ordering&&bounds&&preset&&disabled&&reset,JSON.stringify({initial,ordering,bounds,preset,disabled,reset}));
  await ev("window.__phase8DateForm.remove();window.__phase8DateForm=null");
}
{ await ev("(() => {const el=document.createElement('vfx-notification-center');el.id='phase8-notifications';document.body.append(el);window.__phase8Changes=0;el.addEventListener('change',()=>window.__phase8Changes++);el.setAttribute('items',JSON.stringify([{id:'a',title:'Build ready',message:'The build passed.',read:false},{id:'a',title:'Duplicate id',read:true},{id:'b',title:'Review',message:'Needs attention.',read:true}]));})()"); await sleep(80);
  const normalised=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.items.length===2&&el.unreadCount===1&&el.shadowRoot.querySelectorAll('.item').length===2;})()");
  const read=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.markRead('a')&&el.unreadCount===0&&!el.markRead('a');})()");
  await ev("document.querySelector('#phase8-notifications').items=[{id:'c',title:'<img src=x onerror=alert(1)>',message:'New item',read:false},{id:'d',title:'Another',read:false}]");
  const property=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.items.length===2&&el.unreadCount===2&&el.shadowRoot.querySelectorAll('.item img').length===0&&el.shadowRoot.querySelector('.item-title').textContent.includes('<img');})()");
  const bulk=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.markAllRead()&&el.unreadCount===0&&el.shadowRoot.querySelector('.empty')===null;})()");
  const dismissed=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.dismiss('c')&&el.items.length===1&&!el.dismiss('missing');})()");
  await ev("document.querySelector('#phase8-notifications').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-notifications');return !el.markRead('d')&&!el.dismiss('d')&&el.shadowRoot.querySelector('.mark-all').disabled;})()");
  const changes=await ev('window.__phase8Changes');
  check('phase 8: Notification Center normalizes data, synchronizes properties, handles read/dismiss state and blocks unsafe/disabled actions',normalised&&read&&property&&bulk&&dismissed&&disabled&&changes>=4,JSON.stringify({normalised,read,property,bulk,dismissed,disabled,changes}));
  await ev("document.querySelector('#phase8-notifications').remove()");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-rich-text-editor');el.id='phase8-editor';el.setAttribute('name','description');el.setAttribute('required','');form.append(el);document.body.append(form);window.__phase8EditorForm=form;})()"); await sleep(80);
  const required=await ev("!window.__phase8EditorForm.checkValidity()");
  await ev("document.querySelector('#phase8-editor').value='<p>Hello <strong>world</strong></p><img src=x onerror=alert(1)><script>alert(1)</script><a href=\"javascript:alert(1)\" onclick=\"x()\">Unsafe link</a><a href=\"https://example.com\" onclick=\"x()\">Safe link</a>'");
  const sanitised=await ev("(() => {const el=document.querySelector('#phase8-editor'),v=el.value;return v.includes('<strong>world</strong>')&&!v.includes('<script')&&!v.includes('<img')&&!v.includes('javascript:')&&!v.includes('onclick')&&v.includes('rel=\"noopener noreferrer\"')&&new FormData(window.__phase8EditorForm).get('description')===v;})()");
  await ev("document.querySelector('#phase8-editor').value='<p>Safe</p><svg onload=alert(1)><script>alert(2)</script></svg><style>body{display:none}</style><iframe srcdoc=\"<script>alert(3)</script>\"></iframe><a href=\"//example.com\">protocol-relative</a>'");
  const dangerousMarkupRemoved=await ev("(() => {const v=document.querySelector('#phase8-editor').value;return v.includes('Safe')&&!/<svg|<script|<style|<iframe/i.test(v)&&!v.includes('onload')&&v.includes('https://example.com/');})()");
  const pasteCleaned=await ev("(() => {const el=document.querySelector('#phase8-editor'),editor=el.shadowRoot.querySelector('.editor');editor.focus();const range=document.createRange();range.selectNodeContents(editor);range.collapse(false);const selection=document.getSelection();selection.removeAllRanges();selection.addRange(range);const data=new DataTransfer();data.setData('text/html','<p><strong>Pasted</strong><img src=x onerror=alert(4)><a href=\"javascript:alert(5)\">unsafe</a></p>');const event=new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true});editor.dispatchEvent(event);const value=el.value;return value.includes('<strong>Pasted</strong>')&&!value.includes('<img')&&!value.includes('onerror')&&!value.includes('javascript:');})()");
  check('phase 8: Rich Text Editor drops dangerous subtrees, reconstructs allowlisted DOM nodes, normalizes safe URLs and sanitizes clipboard paste without HTML-string insertion',dangerousMarkupRemoved&&pasteCleaned,{dangerousMarkupRemoved,pasteCleaned});
  const text=await ev("document.querySelector('#phase8-editor').text.includes('Hello world')");
  await ev("document.querySelector('#phase8-editor').setAttribute('readonly','')");
  const readonly=await ev("(() => {const el=document.querySelector('#phase8-editor');return el.shadowRoot.querySelector('.editor').contentEditable==='false'&&[...el.shadowRoot.querySelectorAll('.tool')].every(b=>b.disabled)&&el.clear()===false;})()");
  await ev("document.querySelector('#phase8-editor').removeAttribute('readonly');document.querySelector('#phase8-editor').clear()");
  const invalid=await ev("!window.__phase8EditorForm.checkValidity()&&document.querySelector('#phase8-editor').shadowRoot.querySelector('.editor').getAttribute('aria-invalid')==='true'");
  await ev("document.querySelector('#phase8-editor').setAttribute('disabled','')");
  const disabled=await ev("document.querySelector('#phase8-editor').shadowRoot.querySelector('.editor').contentEditable==='false'");
  check('phase 8: Rich Text Editor sanitizes HTML, preserves safe formatting, reports text/word values and enforces required/readonly/disabled states',required&&sanitised&&text&&readonly&&invalid&&disabled,JSON.stringify({required,sanitised,text,readonly,invalid,disabled}));
  await ev("window.__phase8EditorForm.remove();window.__phase8EditorForm=null");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-gradient-picker');el.id='phase8-gradient';el.setAttribute('name','background');el.setAttribute('from','#ff5fa8');el.setAttribute('to','#8f8df7');el.setAttribute('angle','135');form.append(el);document.body.append(form);window.__phase8GradientForm=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-gradient'),v=new FormData(window.__phase8GradientForm).get('background');return el.stops.length===2&&el.value.includes('135deg')&&v===el.value;})()");
  const added=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.addStop()&&el.stops.length===3&&el.stops[1].position===50&&el.value.includes('50%');})()");
  const removed=await ev("(() => {const el=document.querySelector('#phase8-gradient'),id=el.stops[1].id;return el.removeStop(id)&&el.stops.length===2&&!el.removeStop(el.stops[0].id);})()");
  await ev("document.querySelector('#phase8-gradient').setAttribute('stops',JSON.stringify([{id:'a',color:'#000000',position:0},{id:'b',color:'#00ff00',position:42},{id:'c',color:'#ffffff',position:100}]));");
  const dynamic=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.stops.length===3&&el.shadowRoot.querySelectorAll('.stop-chip').length===3;})()");
  await ev("document.querySelector('#phase8-gradient').value='linear-gradient(90deg, #000000 0%, #ff0000 50%, #ffffff 100%)'");
  const parsed=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.angle===90&&el.stops.length===3&&el.stops[1].color==='#ff0000'&&el.value.includes('90deg');})()");
  await ev("document.querySelector('#phase8-gradient').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-gradient');return !el.addStop()&&el.shadowRoot.querySelector('#stop-color').disabled&&el.shadowRoot.querySelector('.add').disabled;})()");
  check('phase 8: Gradient Picker supports multi-stop editing, CSS parsing, dynamic stops, form serialization and disabled guards',initial&&added&&removed&&dynamic&&parsed&&disabled,JSON.stringify({initial,added,removed,dynamic,parsed,disabled}));
  await ev("window.__phase8GradientForm.remove();window.__phase8GradientForm=null");
}


// Phase 8: productivity and content controls
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-password-field');el.id='phase8-password';el.setAttribute('name','password');el.setAttribute('label','Account password');el.setAttribute('placeholder','Enter a secure password');el.setAttribute('minlength','10');el.setAttribute('required','');el.setAttribute('value','Abcdef123!');form.append(el);document.body.append(form);window.__phase8Password=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-password');return el.value==='Abcdef123!'&&el.strength===4&&new FormData(window.__phase8Password).get('password')==='Abcdef123!'&&window.__phase8Password.checkValidity();})()");
  await ev("document.querySelector('#phase8-password').setAttribute('minlength','12')");
  const minimum=await ev("(() => {const el=document.querySelector('#phase8-password');return el.shadowRoot.querySelector('[data-rule=length]').textContent.includes('12')&&!window.__phase8Password.checkValidity();})()");
  await ev("document.querySelector('#phase8-password').setAttribute('label','New account password');document.querySelector('#phase8-password').setAttribute('placeholder','New placeholder')");
  const labels=await ev("(() => {const el=document.querySelector('#phase8-password');return el.shadowRoot.querySelector('.label').textContent==='New account password'&&el.shadowRoot.querySelector('input').placeholder==='New placeholder';})()");
  const reveal=await ev("(() => {const el=document.querySelector('#phase8-password'),b=el.shadowRoot.querySelector('.reveal');b.click();const shown=el.shadowRoot.querySelector('input').type==='text'&&b.getAttribute('aria-pressed')==='true';b.click();return shown&&el.shadowRoot.querySelector('input').type==='password';})()");
  await ev("document.querySelector('#phase8-password').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-password');return el.shadowRoot.querySelector('input').disabled&&el.toggleVisibility()===false;})()");
  await ev("document.querySelector('#phase8-password').removeAttribute('disabled');window.__phase8Password.reset()");
  const reset=await ev("document.querySelector('#phase8-password').value==='Abcdef123!'");
  check('phase 8: Password Field syncs attributes, scores strength, toggles visibility, validates forms, disables and resets',initial&&minimum&&labels&&reveal&&disabled&&reset,JSON.stringify({initial,minimum,labels,reveal,disabled,reset}));
  await ev("window.__phase8Password.remove();window.__phase8Password=null");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-date-range-picker');el.id='phase8-range';el.setAttribute('name','period');el.setAttribute('start','2026-11-20');el.setAttribute('end','2026-11-25');el.setAttribute('min','2026-11-19');el.setAttribute('max','2026-12-15');el.setAttribute('required','');form.append(el);document.body.append(form);window.__phase8Range=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-range');return el.valid&&new FormData(window.__phase8Range).get('period')==='2026-11-20/2026-11-25'&&window.__phase8Range.checkValidity();})()");
  await ev("document.querySelector('#phase8-range').value={start:'2026-11-28',end:'2026-11-25'}");
  const ordering=await ev("(() => {const el=document.querySelector('#phase8-range');return !el.valid&&!window.__phase8Range.checkValidity()&&el.shadowRoot.querySelector('.summary').classList.contains('invalid');})()");
  await ev("document.querySelector('#phase8-range').value={start:'2026-11-28',end:'2026-12-05'};document.querySelector('#phase8-range').setAttribute('max','2026-12-01')");
  const maximum=await ev("!document.querySelector('#phase8-range').valid&&window.__phase8Range.checkValidity()===false");
  await ev("document.querySelector('#phase8-range').setAttribute('max','2026-12-15');document.querySelector('#phase8-range').preset('7')");
  const preset=await ev("(() => {const el=document.querySelector('#phase8-range');return el.valid&&el.value.end>el.value.start&&new FormData(window.__phase8Range).get('period')===el.value.start+'/'+el.value.end;})()");
  await ev("document.querySelector('#phase8-range').clear()");
  const required=await ev("!window.__phase8Range.checkValidity()&&new FormData(window.__phase8Range).get('period')===''");
  await ev("document.querySelector('#phase8-range').setAttribute('disabled','')");
  const disabled=await ev("document.querySelector('#phase8-range').shadowRoot.querySelector('#start').disabled&&!document.querySelector('#phase8-range').clear()");
  await ev("document.querySelector('#phase8-range').removeAttribute('disabled');window.__phase8Range.reset()");
  const reset=await ev("(() => {const el=document.querySelector('#phase8-range');return el.value.start==='2026-11-20'&&el.value.end==='2026-11-25';})()");
  check('phase 8: Date Range Picker validates order and bounds, supports presets, required form values, disabled state and reset',initial&&ordering&&maximum&&preset&&required&&disabled&&reset,JSON.stringify({initial,ordering,maximum,preset,required,disabled,reset}));
  await ev("window.__phase8Range.remove();window.__phase8Range=null");
}
{ await ev("(() => {const el=document.createElement('vfx-notification-center');el.id='phase8-notifications';el.setAttribute('items',JSON.stringify([{id:'a',title:'Alpha',message:'First',read:false},{id:'b',title:'Beta',message:'Second',read:true},{id:'a',title:'Duplicate',message:'Ignored',read:false},{title:'Missing id',message:'Ignored'}]));document.body.append(el);window.__phase8Changes=0;el.addEventListener('change',()=>window.__phase8Changes++);})()"); await sleep(80);
  const normalised=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.items.length===2&&el.unreadCount===1&&el.shadowRoot.querySelectorAll('.item').length===2;})()");
  const read=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.markRead('a')&&el.unreadCount===0&&!el.markRead('a')&&window.__phase8Changes===1;})()");
  await ev("document.querySelector('#phase8-notifications').items=[{id:'c',title:'Gamma',message:'Third',read:false},{id:'d',title:'Delta',message:'Fourth',read:false}]");
  const property=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.items.length===2&&el.unreadCount===2&&el.shadowRoot.querySelectorAll('.item').length===2;})()");
  await ev("document.querySelector('#phase8-notifications').setAttribute('items','[]')");
  const empty=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.items.length===0&&el.unreadCount===0&&el.shadowRoot.querySelector('.empty')!==null;})()");
  await ev("document.querySelector('#phase8-notifications').items=[{id:'x',title:'X',read:false},{id:'y',title:'Y',read:false}]");
  const bulk=await ev("(() => {const el=document.querySelector('#phase8-notifications');return el.markAllRead()&&el.unreadCount===0;})()");
  const dismiss=await ev("document.querySelector('#phase8-notifications').dismiss('x')&&document.querySelector('#phase8-notifications').items.length===1");
  await ev("document.querySelector('#phase8-notifications').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-notifications');return !el.markRead('y')&&!el.dismiss('y')&&el.shadowRoot.querySelector('.mark-all').disabled;})()");
  check('phase 8: Notification Center normalizes IDs, syncs data, filters empty states and emits guarded read/bulk/dismiss changes',normalised&&read&&property&&empty&&bulk&&dismiss&&disabled,JSON.stringify({normalised,read,property,empty,bulk,dismiss,disabled}));
  await ev("document.querySelector('#phase8-notifications').remove()");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-rich-text-editor');el.id='phase8-editor';el.setAttribute('name','content');el.setAttribute('required','');el.setAttribute('value','<p>Initial <strong>content</strong></p>');form.append(el);document.body.append(form);window.__phase8Editor=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-editor'),value=el.value;return value.includes('<strong>content</strong>')&&new FormData(window.__phase8Editor).get('content')===value&&window.__phase8Editor.checkValidity();})()");
  await ev("document.querySelector('#phase8-editor').value='<p onclick=\"alert(1)\"><strong>Safe</strong><a href=\"javascript:alert(1)\">bad</a><a href=\"https://example.com\">link</a><script>alert(2)</script></p>'");
  const sanitize=await ev("(() => {const value=document.querySelector('#phase8-editor').value;return !/<script|onclick|javascript:/i.test(value)&&value.includes('Safe')&&value.includes('https://example.com');})()");
  await ev("document.querySelector('#phase8-editor').value=''");
  const required=await ev("!window.__phase8Editor.checkValidity()&&new FormData(window.__phase8Editor).get('content')===''");
  await ev("document.querySelector('#phase8-editor').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-editor');return el.shadowRoot.querySelector('.editor').contentEditable==='false'&&[...el.shadowRoot.querySelectorAll('.tool')].every(b=>b.disabled);})()");
  await ev("document.querySelector('#phase8-editor').removeAttribute('disabled');window.__phase8Editor.reset()");
  const reset=await ev("document.querySelector('#phase8-editor').value.includes('Initial')");
  const focus=await ev("(() => {const el=document.querySelector('#phase8-editor');el.focus();return el.shadowRoot.activeElement===el.shadowRoot.querySelector('.editor');})()");
  check('phase 8: Rich Text Editor sanitizes unsafe markup, serializes forms, validates required content, disables, focuses and resets',initial&&sanitize&&required&&disabled&&reset&&focus,JSON.stringify({initial,sanitize,required,disabled,reset,focus}));
  await ev("window.__phase8Editor.remove();window.__phase8Editor=null");
}
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-gradient-picker');el.id='phase8-gradient';el.setAttribute('name','background');el.setAttribute('from','#ff5fa8');el.setAttribute('to','#8f8df7');el.setAttribute('angle','135');form.append(el);document.body.append(form);window.__phase8Gradient=form;})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.stops.length===2&&el.value.includes('135deg')&&new FormData(window.__phase8Gradient).get('background')===el.value;})()");
  const add=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.addStop()&&el.stops.length===3&&el.value.includes('%');})()");
  const edit=await ev("(() => {const el=document.querySelector('#phase8-gradient'),stops=el.stops;stops[1].color='#22aa88';stops[1].position=42;el.stops=stops;return el.stops[1].color==='#22aa88'&&el.stops[1].position===42&&el.value.includes('#22aa88 42%');})()");
  const remove=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.removeStop(1)&&el.stops.length===2&&!el.removeStop(0);})()");
  await ev("document.querySelector('#phase8-gradient').value='linear-gradient(45deg, #112233 0%, #445566 50%, #778899 100%)'");
  const parse=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.angle===45&&el.stops.length===3&&el.to==='#778899';})()");
  await ev("document.querySelector('#phase8-gradient').angle=999");
  const angle=await ev("document.querySelector('#phase8-gradient').angle===360");
  await ev("document.querySelector('#phase8-gradient').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase8-gradient'),count=el.stops.length;return !el.addStop()&&!el.removeStop(0)&&el.shadowRoot.querySelector('.add').disabled&&el.stops.length===count;})()");
  await ev("document.querySelector('#phase8-gradient').removeAttribute('disabled');window.__phase8Gradient.reset()");
  const reset=await ev("(() => {const el=document.querySelector('#phase8-gradient');return el.stops.length===2&&el.angle===135;})()");
  check('phase 8: Gradient Picker edits 2–8 stops, parses CSS, clamps angle, supports form serialization and disabled/reset states',initial&&add&&edit&&remove&&parse&&angle&&disabled&&reset,JSON.stringify({initial,add,edit,remove,parse,angle,disabled,reset}));
  await ev("window.__phase8Gradient.remove();window.__phase8Gradient=null");
}

// Phase 9: workflow and utility controls
{ await ev("(() => {const form=document.createElement('form'),el=document.createElement('vfx-wizard');el.id='phase9-wizard';el.innerHTML='<section data-step data-title=\"Account\"><h3>Account</h3><input name=\"account\" required></section><section data-step data-title=\"Review\"><h3>Review</h3><input name=\"reviewer\" required></section><section data-step data-title=\"Finish\"><h3>Finish</h3></section>';form.append(el);document.body.append(form);window.__phase9WizardForm=form;window.__phase9WizardInvalid=0;el.addEventListener('invalid',()=>window.__phase9WizardInvalid++);})()"); await sleep(80);
  const initial=await ev("(() => {const el=document.querySelector('#phase9-wizard');return el.totalSteps===3&&el.activeIndex===0&&el.shadowRoot.querySelector('.step[aria-current=\"step\"]')?.textContent==='Account';})()");
  const blockedFirst=await ev("(() => {const el=document.querySelector('#phase9-wizard');return !el.goTo(2)&&el.activeIndex===0&&window.__phase9WizardInvalid===1;})()");
  await ev("document.querySelector('#phase9-wizard').querySelector('[name=account]').value='Brajesh'");
  const blockedMiddle=await ev("(() => {const el=document.querySelector('#phase9-wizard');return !el.goTo(2)&&el.activeIndex===1&&window.__phase9WizardInvalid===2&&el.shadowRoot.querySelector('.title').textContent==='Review';})()");
  await ev("document.querySelector('#phase9-wizard').querySelector('[name=reviewer]').value='Reviewer'");
  const advanced=await ev("(() => {const el=document.querySelector('#phase9-wizard');return el.goTo(2)&&el.activeIndex===2;})()");
  const completed=await ev("(() => {const el=document.querySelector('#phase9-wizard');return el.next()&&el.complete&&!el.next()&&el.shadowRoot.querySelector('.next').disabled;})()");
  const returned=await ev("(() => {const el=document.querySelector('#phase9-wizard');return el.previous()&&el.activeIndex===1&&!el.complete&&el.reset()&&el.activeIndex===0;})()");
  await ev("(() => {const el=document.querySelector('#phase9-wizard'),p=document.createElement('section');p.setAttribute('data-step','');p.setAttribute('data-title','New step');el.append(p);})()"); await sleep(100);
  const dynamic=await ev("document.querySelector('#phase9-wizard').totalSteps===4");
  await ev("document.querySelector('#phase9-wizard').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase9-wizard');return !el.next()&&el.shadowRoot.querySelector('.next').disabled;})()");
  await ev("document.querySelector('#phase9-wizard').removeAttribute('disabled');window.__phase9WizardForm.reset()");
  const formReset=await ev("document.querySelector('#phase9-wizard').activeIndex===0");
  check('phase 9: Wizard validates every skipped step, reveals invalid panels, completes once, resets and syncs dynamic/disabled state',initial&&blockedFirst&&blockedMiddle&&advanced&&completed&&returned&&dynamic&&disabled&&formReset,JSON.stringify({initial,blockedFirst,blockedMiddle,advanced,completed,returned,dynamic,disabled,formReset}));
  await ev("window.__phase9WizardForm.remove();window.__phase9WizardForm=null");
}
{ await ev("(() => {const trigger=document.createElement('button');trigger.id='phase9-tour-trigger';trigger.textContent='Launch tour';document.body.append(trigger);trigger.focus();const a=document.createElement('button');a.id='phase9-tour-a';a.textContent='Target A';document.body.append(a);const b=document.createElement('button');b.id='phase9-tour-b';b.textContent='Target B';document.body.append(b);const el=document.createElement('vfx-guided-tour');el.id='phase9-tour';el.setAttribute('steps','#phase9-missing::Missing::This target is absent.|#phase9-tour-a::First::First detail.|#phase9-tour-b::Second::Second detail.');document.body.append(el);window.__phase9TourTrigger=trigger;window.__phase9TourMissing=0;el.addEventListener('target-missing',()=>window.__phase9TourMissing++);window.__phase9TourFinishes=0;el.addEventListener('finish',()=>window.__phase9TourFinishes++);})()"); await sleep(100);
  const started=await ev("(() => {const el=document.querySelector('#phase9-tour');return el.start()&&el.active&&el.currentIndex===1&&!el.shadowRoot.querySelector('.overlay').hidden;})()");
  await sleep(50);
  const focusState=await ev("(() => {const el=document.querySelector('#phase9-tour');return JSON.stringify({active:el.shadowRoot.activeElement?.className,activeText:el.shadowRoot.activeElement?.textContent,missing:window.__phase9TourMissing,nextDisabled:el.shadowRoot.querySelector('.next').disabled});})()"); const focusData=JSON.parse(focusState);const focus=focusData.active==='next'&&focusData.missing===1&&!focusData.nextDisabled;
  await ev("(() => {const el=document.querySelector('#phase9-tour'),next=el.shadowRoot.querySelector('.next');next.focus();next.dispatchEvent(new KeyboardEvent('keydown',{key:'Tab',bubbles:true,composed:true,cancelable:true}));})()");
  const trap=await ev("document.querySelector('#phase9-tour').shadowRoot.activeElement===document.querySelector('#phase9-tour').shadowRoot.querySelector('.skip')");
  const advanced=await ev("(() => {const el=document.querySelector('#phase9-tour');return el.next()&&el.currentIndex===2&&el.previous()&&el.currentIndex===1;})()");
  await ev("document.querySelector('#phase9-tour').finish('test')"); await sleep(80);
  const restored=await ev("(() => {const el=document.querySelector('#phase9-tour');return !el.active&&el.shadowRoot.querySelector('.overlay').hidden&&document.activeElement===window.__phase9TourTrigger&&window.__phase9TourFinishes===1;})()");
  await ev("document.querySelector('#phase9-tour').setAttribute('disabled','')");
  const disabled=await ev("!document.querySelector('#phase9-tour').start()");
  await ev("document.querySelector('#phase9-tour').remove();window.__phase9TourTrigger.remove();document.querySelector('#phase9-tour-a').remove();document.querySelector('#phase9-tour-b').remove()");
  check('phase 9: Guided Tour skips missing targets, traps keyboard focus, navigates both directions, restores focus and respects disabled state',started&&focus&&trap&&advanced&&restored&&disabled,JSON.stringify({started,focus,focusState,trap,advanced,restored,disabled}));
}
{ await ev("(() => {const el=document.createElement('vfx-stopwatch');el.id='phase9-stopwatch';document.body.append(el);window.__phase9StopwatchEvents=[];for(const type of ['start','stop','lap','reset'])el.addEventListener(type,e=>window.__phase9StopwatchEvents.push(type));})()"); await sleep(80);
  const started=await ev("(() => {const el=document.querySelector('#phase9-stopwatch');return el.start()&&!el.start()&&el.running;})()");
  await sleep(120);
  const lap=await ev("(() => {const el=document.querySelector('#phase9-stopwatch'),v=el.lap();return !!v&&v.number===1&&v.elapsed>=v.split&&el.laps.length===1;})()");
  const stopped=await ev("(() => {const el=document.querySelector('#phase9-stopwatch');return el.stop()&&!el.running;})()");
  const frozen=await ev("(() => {const el=document.querySelector('#phase9-stopwatch'),v=el.elapsed;window.__phase9StopwatchFrozen=v;return v>0;})()"); await sleep(60);
  const stable=await ev("Math.abs(document.querySelector('#phase9-stopwatch').elapsed-window.__phase9StopwatchFrozen)<10");
  await ev("(() => {const el=document.querySelector('#phase9-stopwatch');el.start();el.remove();document.body.append(el);})()"); await sleep(90);
  const reconnect=await ev("(() => {const el=document.querySelector('#phase9-stopwatch');return el.running&&el.elapsed>window.__phase9StopwatchFrozen;})()");
  await ev("document.querySelector('#phase9-stopwatch').stop();document.querySelector('#phase9-stopwatch')._elapsed=3720000;document.querySelector('#phase9-stopwatch')._paint()");
  const longTime=await ev("document.querySelector('#phase9-stopwatch').shadowRoot.querySelector('.clock').textContent==='01:02:00.00'");
  await ev("document.querySelector('#phase9-stopwatch').reset()");
  const reset=await ev("(() => {const el=document.querySelector('#phase9-stopwatch');return el.elapsed===0&&el.laps.length===0&&el.shadowRoot.querySelector('.reset').disabled;})()");
  await ev("document.querySelector('#phase9-stopwatch').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase9-stopwatch');return !el.start()&&el.shadowRoot.querySelector('.start').disabled;})()");
  const events=await ev("window.__phase9StopwatchEvents.join('|')");
  check('phase 9: Stopwatch preserves monotonic elapsed time, splits laps, resumes rendering after reconnect, formats hours and guards disabled state',started&&lap&&stopped&&frozen&&stable&&reconnect&&longTime&&reset&&disabled,JSON.stringify({started,lap,stopped,frozen,stable,reconnect,longTime,reset,disabled,events}));
  await ev("document.querySelector('#phase9-stopwatch').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-emoji-picker');el.id='phase9-emoji';document.body.append(el);window.__phase9EmojiSelect='';el.addEventListener('select',e=>window.__phase9EmojiSelect=e.detail.emoji);})()"); await sleep(80);
  await ev("(() => {const el=document.querySelector('#phase9-emoji'),s=el.shadowRoot.querySelector('.search');s.value='rocket';s.dispatchEvent(new Event('input',{bubbles:true}));})()");
  const search=await ev("(() => {const el=document.querySelector('#phase9-emoji');return el.shadowRoot.querySelectorAll('.emoji').length===1&&el.shadowRoot.querySelector('.emoji').dataset.emoji==='🚀';})()");
  await ev("(() => {const el=document.querySelector('#phase9-emoji');el.shadowRoot.querySelector('.search').value='';el.shadowRoot.querySelector('.search').dispatchEvent(new Event('input',{bubbles:true}));el.shadowRoot.querySelector('[data-category=People]').click();})()");
  const category=await ev("(() => {const el=document.querySelector('#phase9-emoji');return el.shadowRoot.querySelector('.category[aria-pressed=true]').dataset.category==='People'&&el.shadowRoot.querySelectorAll('.emoji').length>0;})()");
  await ev("(() => {const el=document.querySelector('#phase9-emoji'),first=el.shadowRoot.querySelector('.emoji');first.focus();first.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,composed:true,cancelable:true}));})()");
  const keyboard=await ev("document.querySelector('#phase9-emoji').shadowRoot.activeElement?.classList.contains('emoji')");
  const selected=await ev("document.querySelector('#phase9-emoji').selectEmoji('👋')&&document.querySelector('#phase9-emoji').value==='👋'&&window.__phase9EmojiSelect==='👋'");
  await ev("document.querySelector('#phase9-emoji').setAttribute('value','✨')");
  const sync=await ev("document.querySelector('#phase9-emoji').value==='✨'&&document.querySelector('#phase9-emoji').shadowRoot.querySelector('.chosen').textContent==='✨'");
  await ev("(() => {const el=document.querySelector('#phase9-emoji');el.shadowRoot.querySelector('.search').value='not-a-real-emoji';el.shadowRoot.querySelector('.search').dispatchEvent(new Event('input',{bubbles:true}));})()");
  const empty=await ev("!!document.querySelector('#phase9-emoji').shadowRoot.querySelector('.empty')");
  await ev("document.querySelector('#phase9-emoji').setAttribute('disabled','')");
  const disabled=await ev("(() => {const el=document.querySelector('#phase9-emoji');return !el.selectEmoji('😀')&&el.shadowRoot.querySelector('.search').disabled;})()");
  check('phase 9: Emoji Picker searches names and keywords, filters categories, supports arrow keys, syncs values and exposes empty/disabled states',search&&category&&keyboard&&selected&&sync&&empty&&disabled,JSON.stringify({search,category,keyboard,selected,sync,empty,disabled}));
  await ev("document.querySelector('#phase9-emoji').remove()");
}
{ await ev("(() => {const el=document.createElement('vfx-copy-code');el.id='phase9-copy';el.textContent='const x = 1;\\nconsole.log(x);\\n';document.body.append(el);window.__phase9Copied='';el.addEventListener('copy',e=>window.__phase9Copied=e.detail.value);})()"); await sleep(80);
  const initialState=await ev("(() => {const el=document.querySelector('#phase9-copy');return JSON.stringify({lineCount:el.lineCount,value:JSON.stringify(el.value),code:JSON.stringify(el.shadowRoot.querySelector('code').textContent),light:JSON.stringify(el.textContent)});})()"); const initialData=JSON.parse(initialState),source=JSON.parse(initialData.value);const initial=initialData.lineCount===3&&source.endsWith('\n')&&JSON.parse(initialData.code)===source;
  await ev("document.querySelector('#phase9-copy').setAttribute('language','javascript')");
  const language=await ev("document.querySelector('#phase9-copy').shadowRoot.querySelector('.lang').textContent==='javascript'");
  await ev("document.querySelector('#phase9-copy').setAttribute('code','<script>window.__unsafeExecuted=true</script>')");
  const safe=await ev("(() => {const el=document.querySelector('#phase9-copy');return el.value.includes('<script>')&&el.shadowRoot.querySelector('code').textContent.includes('<script>')&&!window.__unsafeExecuted;})()");
  await ev("(() => {const el=document.querySelector('#phase9-copy');el.value='one\\ntwo';})()");
  const property=await ev("document.querySelector('#phase9-copy').lineCount===2&&document.querySelector('#phase9-copy').value==='one\\ntwo'");
  await ev("(() => {const el=document.querySelector('#phase9-copy');el.removeAttribute('code');el.textContent='alpha\\nbeta\\ngamma';})()"); await sleep(80);
  const dynamic=await ev("document.querySelector('#phase9-copy').lineCount===3&&document.querySelector('#phase9-copy').value.includes('gamma')");
  await ev("(() => {const d=Object.getOwnPropertyDescriptor(navigator,'clipboard');window.__phase9ClipboardDescriptor=d;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async value=>{window.__phase9Copied=value;}}});document.querySelector('#phase9-copy').shadowRoot.querySelector('.copy').click();})()"); await sleep(50);
  const copied=await ev("(() => {const el=document.querySelector('#phase9-copy');return window.__phase9Copied===el.value&&el.shadowRoot.querySelector('.copy').textContent.includes('Copied');})()");
  await ev("document.querySelector('#phase9-copy').setAttribute('disabled','')");
  const disabled=await ev("document.querySelector('#phase9-copy').shadowRoot.querySelector('.copy').disabled");
  await ev("(() => {const d=window.__phase9ClipboardDescriptor;if(d)Object.defineProperty(navigator,'clipboard',d);else delete navigator.clipboard;})()");
  check('phase 9: Copy Code preserves whitespace, safely renders dynamic source, syncs language, copies through Clipboard API and disables cleanly',initial&&language&&safe&&property&&dynamic&&copied&&disabled,JSON.stringify({initial,initialState,language,safe,property,dynamic,copied,disabled}));
  await ev("document.querySelector('#phase9-copy').remove()");
}

// Phase 10: charts and dashboard components
{
  await ev("(() => {const el=document.createElement('vfx-bar-chart');el.id='phase10-bar';el.setAttribute('values','5,-5,10,bad');el.setAttribute('labels','A,B,C,D');document.body.append(el);window.__phase10Bar=null;el.addEventListener('select',e=>window.__phase10Bar=e.detail);})()");
  await sleep(70);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-bar');return el.shadowRoot.querySelectorAll('rect[data-index]').length===3&&el.shadowRoot.querySelector('svg').getAttribute('role')==='group'&&el.shadowRoot.querySelector('rect').getAttribute('tabindex')==='0';})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase10-bar');return el.select(1)&&el.selectedIndex===1&&window.__phase10Bar.index===1&&window.__phase10Bar.value===-5;})()");
  await ev("(() => {const el=document.querySelector('#phase10-bar');el.values=[2,4];el.labels=['One','Two'];})()");
  const live=await ev("(() => {const el=document.querySelector('#phase10-bar');return el.shadowRoot.querySelectorAll('rect[data-index]').length===2&&el.shadowRoot.querySelector('rect[data-index=\"1\"]').getAttribute('aria-label')==='Two: 4';})()");
  await ev("document.querySelector('#phase10-bar').setAttribute('values','bad,NaN')");
  const empty=await ev("(() => {const el=document.querySelector('#phase10-bar');return el.shadowRoot.querySelectorAll('rect[data-index]').length===0&&el.shadowRoot.querySelector('.empty')?.textContent==='No chart data';})()");
  check('phase 10: Bar Chart handles positive/negative and invalid values, keyboard-operable bars, selection events, live attributes and empty data',initial&&selected&&live&&empty,JSON.stringify({initial,selected,live,empty}));
  await ev("document.querySelector('#phase10-bar').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-donut-chart');el.id='phase10-donut';el.setAttribute('values','0,10,30,bad');el.setAttribute('labels','Zero,Search,Direct,Invalid');document.body.append(el);window.__phase10Donut=null;el.addEventListener('select',e=>window.__phase10Donut=e.detail);})()");
  await sleep(60);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-donut');return el.shadowRoot.querySelectorAll('circle[data-index]').length===2&&el.shadowRoot.querySelectorAll('.item').length===3&&el.shadowRoot.querySelector('desc').textContent.includes('Search: 10 (25.0%)');})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase10-donut');return el.select(1)&&window.__phase10Donut.label==='Search'&&window.__phase10Donut.percent===25&&el.shadowRoot.querySelector('.item[data-index=\"1\"]').getAttribute('aria-pressed')==='true';})()");
  await ev("document.querySelector('#phase10-donut').values=[0,0,0]");
  const empty=await ev("(() => {const el=document.querySelector('#phase10-donut');return el.shadowRoot.querySelectorAll('circle[data-index]').length===0&&el.shadowRoot.querySelector('.empty')?.textContent==='No data'&&el.shadowRoot.querySelector('.legend').textContent.includes('No categories');})()");
  check('phase 10: Donut Chart normalizes invalid and zero slices, synchronizes legend selection, reports percentages and renders an all-zero empty state',initial&&selected&&empty,JSON.stringify({initial,selected,empty}));
  await ev("document.querySelector('#phase10-donut').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-sparkline');el.id='phase10-spark';el.setAttribute('label','Weekly trend');el.setAttribute('values','4,7,5');document.body.append(el);})()");
  await sleep(50);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-spark');return el.shadowRoot.querySelector('.line').getAttribute('points').split(' ').length===3&&el.shadowRoot.querySelector('svg').getAttribute('aria-label').includes('from 4 to 5');})()");
  await ev("document.querySelector('#phase10-spark').values=[2,2,2]");
  const flat=await ev("(() => {const el=document.querySelector('#phase10-spark');return el.shadowRoot.querySelector('.line').getAttribute('points').split(' ').every(p=>p.endsWith(',22'))&&el.shadowRoot.querySelector('.delta').classList.contains('neutral');})()");
  await ev("document.querySelector('#phase10-spark').setAttribute('values','invalid')");
  const empty=await ev("(() => {const el=document.querySelector('#phase10-spark');return el.values.length===0&&el.shadowRoot.querySelector('.delta').textContent==='No data'&&el.shadowRoot.querySelector('svg').getAttribute('aria-label').includes('no trend data');})()");
  check('phase 10: Sparkline handles changing and flat series, updates accessible descriptions, and provides a no-data state for invalid input',initial&&flat&&empty,JSON.stringify({initial,flat,empty}));
  await ev("document.querySelector('#phase10-spark').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-kpi-card');el.id='phase10-kpi';el.setAttribute('label','Monthly revenue');el.setAttribute('value','₹24,800');el.setAttribute('delta','+8.4%');document.body.append(el);})()");
  await sleep(50);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-kpi');return el.shadowRoot.querySelector('.value').textContent==='₹24,800'&&el.shadowRoot.querySelector('.delta').classList.contains('positive')&&el.shadowRoot.querySelector('.box').getAttribute('aria-label').includes('Monthly revenue');})()");
  await ev("(() => {const el=document.querySelector('#phase10-kpi');el.value='0';el.delta='-2.1%';el.setAttribute('label','Net change');})()");
  const live=await ev("(() => {const el=document.querySelector('#phase10-kpi');return el.shadowRoot.querySelector('.value').textContent==='0'&&el.shadowRoot.querySelector('.delta').classList.contains('negative')&&el.shadowRoot.querySelector('.label').textContent==='Net change';})()");
  await ev("document.querySelector('#phase10-kpi').setAttribute('trend','neutral')");
  const override=await ev("document.querySelector('#phase10-kpi').shadowRoot.querySelector('.delta').classList.contains('neutral')");
  check('phase 10: KPI Card synchronizes value/label/delta properties, derives trend direction, supports explicit trend override and exposes an accessible summary',initial&&live&&override,JSON.stringify({initial,live,override}));
  await ev("document.querySelector('#phase10-kpi').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-gauge');el.id='phase10-gauge';el.setAttribute('label','Quality score');el.setAttribute('min','10');el.setAttribute('max','30');el.setAttribute('value','40');el.setAttribute('unit',' pts');document.body.append(el);window.__phase10Gauge=0;el.addEventListener('change',()=>window.__phase10Gauge++);})()");
  await sleep(50);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-gauge');return el.value===30&&el.getAttribute('role')==='meter'&&el.getAttribute('aria-valuemin')==='10'&&el.getAttribute('aria-valuemax')==='30'&&el.getAttribute('aria-valuenow')==='30'&&el.shadowRoot.querySelector('.num').textContent==='30 pts';})()");
  await ev("document.querySelector('#phase10-gauge').value=-9");
  const clamped=await ev("(() => {const el=document.querySelector('#phase10-gauge');return el.value===10&&el.getAttribute('aria-valuenow')==='10'&&window.__phase10Gauge===1;})()");
  await ev("document.querySelector('#phase10-gauge').setAttribute('max','5')");
  const range=await ev("(() => {const el=document.querySelector('#phase10-gauge');return el.getAttribute('aria-valuemin')==='0'&&el.getAttribute('aria-valuemax')==='100'&&el.value===0;})()");
  check('phase 10: Gauge clamps values to valid ranges, updates SVG arc and meter semantics, emits value changes and recovers from invalid bounds',initial&&clamped&&range,JSON.stringify({initial,clamped,range}));
  await ev("document.querySelector('#phase10-gauge').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-heatmap');el.id='phase10-heatmap';el.setAttribute('values','0,1,2,3,4,99,-3,bad');el.setAttribute('labels','Mon,Tue,Wed,Thu,Fri,Sat,Sun,Extra');el.setAttribute('columns','3');document.body.append(el);window.__phase10Heat=null;el.addEventListener('select',e=>window.__phase10Heat=e.detail);})()");
  await sleep(50);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-heatmap'),cells=el.shadowRoot.querySelectorAll('.cell');return cells.length===8&&cells[5].dataset.level==='4'&&cells[6].dataset.level==='0'&&el.shadowRoot.querySelector('.grid').style.getPropertyValue('--columns')==='3'&&cells[0].getAttribute('aria-label').startsWith('Mon');})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase10-heatmap');return el.select(4)&&el.selectedIndex===4&&window.__phase10Heat.label==='Fri'&&window.__phase10Heat.level===4;})()");
  await ev("document.querySelector('#phase10-heatmap').values=[]");
  const empty=await ev("(() => {const el=document.querySelector('#phase10-heatmap');return el.shadowRoot.querySelectorAll('.cell').length===0&&el.shadowRoot.querySelector('.empty')?.textContent==='No activity data';})()");
  check('phase 10: Heatmap clamps intensity levels, labels cells accessibly, supports configurable columns, selection events and empty data',initial&&selected&&empty,JSON.stringify({initial,selected,empty}));
  await ev("document.querySelector('#phase10-heatmap').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-treemap');el.id='phase10-treemap';el.setAttribute('items','apps::Apps::6|web::Web::3|ops::Operations::1|empty::Zero::0');document.body.append(el);window.__phase10Tree=null;el.addEventListener('select',e=>window.__phase10Tree=e.detail);})()");
  await sleep(50);
  const initial=await ev("(() => {const el=document.querySelector('#phase10-treemap'),tiles=[...el.shadowRoot.querySelectorAll('.tile')],areas=tiles.map(t=>{const r=t.querySelector('rect');return +r.getAttribute('width')*+r.getAttribute('height')});return tiles.length===3&&Math.abs(areas[0]/areas.reduce((a,b)=>a+b,0)-0.6)<0.02&&tiles[0].getAttribute('role')==='button'&&tiles[0].getAttribute('tabindex')==='0';})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase10-treemap');return el.select('apps')&&el.selectedId==='apps'&&window.__phase10Tree.label==='Apps'&&Math.round(window.__phase10Tree.percent)===60;})()");
  await ev("document.querySelector('#phase10-treemap').items=[{id:'design',label:'Design',value:2},{id:'build',label:'Build',value:8}]");
  const property=await ev("(() => {const el=document.querySelector('#phase10-treemap');return el.shadowRoot.querySelectorAll('.tile').length===2&&el.items[1].value===8&&el.shadowRoot.querySelector('.tile[data-id=\"build\"] .name').textContent==='Build';})()");
  await ev("document.querySelector('#phase10-treemap').setAttribute('items','invalid::Broken::NaN')");
  const empty=await ev("(() => {const el=document.querySelector('#phase10-treemap');return el.shadowRoot.querySelectorAll('.tile').length===0&&el.shadowRoot.querySelector('.empty')?.textContent==='No items to display';})()");
  check('phase 10: Treemap allocates proportional tile areas, supports keyboard-operable selection, object-array updates, accessible labels and invalid-data fallback',initial&&selected&&property&&empty,JSON.stringify({initial,selected,property,empty}));
  await ev("document.querySelector('#phase10-treemap').remove()");
}

// Phase 11: creative tools and audio controls
{
  await ev("(() => {const el=document.createElement('vfx-drawing-canvas');el.id='phase11-drawing';el.label='Sketch pad';el.color='#123456';el.size=7;window.__phase11DrawEvents=[];['change','clear','undo','export','export-error'].forEach(type=>el.addEventListener(type,event=>window.__phase11DrawEvents.push({type,input:event.detail?.input,mimeType:event.detail?.mimeType})));window.__phase11PixelCount=canvas=>{const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;let count=0;for(let i=3;i<data.length;i+=4)if(data[i])count++;return count;};document.body.append(el);})()");
  await sleep(80);
  const accessible=await ev("(() => {const el=document.querySelector('#phase11-drawing'),canvas=el.shadowRoot.querySelector('.canvas');return canvas.getAttribute('aria-label')==='Sketch pad'&&canvas.getAttribute('aria-describedby')==='canvas-status'&&el.shadowRoot.querySelector('.color').value==='#123456'&&el.shadowRoot.querySelector('.size').value==='7';})()");
  const [drawX,drawY]=await at('#phase11-drawing >>> .canvas',0.3,0.45);
  await touch('touchStart',drawX,drawY);
  await touch('touchMove',drawX+38,drawY+20);
  await touch('touchEnd',drawX+38,drawY+20);
  await sleep(50);
  const pointer=await ev("(() => {const el=document.querySelector('#phase11-drawing'),canvas=el.shadowRoot.querySelector('.canvas');return window.__phase11PixelCount(canvas)>0&&window.__phase11DrawEvents.some(item=>item.type==='change'&&item.input==='pointer');})()");
  const undo=await ev("(() => {const el=document.querySelector('#phase11-drawing'),canvas=el.shadowRoot.querySelector('.canvas');return el.undo()&&window.__phase11PixelCount(canvas)===0&&window.__phase11DrawEvents.some(item=>item.type==='undo');})()");
  await ev("(() => {const el=document.querySelector('#phase11-drawing'),canvas=el.shadowRoot.querySelector('.canvas');canvas.focus();canvas.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));canvas.dispatchEvent(new KeyboardEvent('keyup',{key:'ArrowRight',bubbles:true,cancelable:true}));})()");
  const keyboard=await ev("(() => {const el=document.querySelector('#phase11-drawing');return window.__phase11PixelCount(el.shadowRoot.querySelector('.canvas'))>0&&window.__phase11DrawEvents.some(item=>item.type==='change'&&item.input==='keyboard');})()");
  const clear=await ev("(() => {const el=document.querySelector('#phase11-drawing'),canvas=el.shadowRoot.querySelector('.canvas');return el.clear()&&window.__phase11PixelCount(canvas)===0&&window.__phase11DrawEvents.some(item=>item.type==='clear')&&window.__phase11DrawEvents.some(item=>item.type==='change'&&item.input==='clear');})()");
  await ev("(() => {const el=document.querySelector('#phase11-drawing');el.label='Updated sketch';el.color='#abcdef';el.size=12;})()");
  const updates=await ev("(() => {const el=document.querySelector('#phase11-drawing');return el.shadowRoot.querySelector('.canvas').getAttribute('aria-label')==='Updated sketch'&&el.shadowRoot.querySelector('.color').value==='#abcdef'&&el.shadowRoot.querySelector('.size').value==='12'&&el.toDataURL().startsWith('data:image/png');})()");
  const [resizeX,resizeY]=await at('#phase11-drawing >>> .canvas',0.35,0.5);
  await touch('touchStart',resizeX,resizeY);
  await touch('touchMove',resizeX+22,resizeY+14);
  await touch('touchEnd',resizeX+22,resizeY+14);
  await ev("document.querySelector('#phase11-drawing').style.width='280px'");
  await sleep(120);
  const resize=await ev("(() => {const el=document.querySelector('#phase11-drawing');return window.__phase11PixelCount(el.shadowRoot.querySelector('.canvas'))>0;})()");
  const download=await ev("(() => {const el=document.querySelector('#phase11-drawing');return el.download()&&window.__phase11DrawEvents.some(item=>item.type==='export'&&item.mimeType==='image/png');})()");
  await ev("(() => {const el=document.querySelector('#phase11-drawing');el.disabled=true;window.__phase11DisabledDrawing=!el.clear()&&el.shadowRoot.querySelector('.clear').disabled&&el.shadowRoot.querySelector('.canvas').getAttribute('aria-disabled')==='true';el.disabled=false;el.remove();document.body.append(el);})()");
  await sleep(50);
  const reconnect=await ev("(() => {const el=document.querySelector('#phase11-drawing');return window.__phase11DisabledDrawing&&el.isConnected&&(!('ResizeObserver' in window)||!!el._resizeObserver);})()");
  check('phase 11: Drawing Canvas preserves responsive pixels, supports pointer and keyboard strokes, emits clear/change/undo/export events, syncs attributes and reconnects cleanly',accessible&&pointer&&undo&&keyboard&&clear&&updates&&resize&&download&&reconnect,JSON.stringify({accessible,pointer,undo,keyboard,clear,updates,resize,download,reconnect}));
  await ev("document.querySelector('#phase11-drawing').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-color-palette');el.id='phase11-palette';el.setAttribute('colors','red, rgb(0, 128, 255), hsl(120 100% 50%), #ff6fae');window.__phase11PaletteEvents=[];['select','change','copy','copy-error'].forEach(type=>el.addEventListener(type,event=>window.__phase11PaletteEvents.push({type,value:event.detail?.value,index:event.detail?.index})));document.body.append(el);})()");
  await sleep(60);
  const parsed=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.colors.length===4&&buttons.length===4&&buttons[0].tabIndex===0&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await ev("(() => {const el=document.querySelector('#phase11-palette'),first=el.shadowRoot.querySelector('.swatch');first.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true,cancelable:true}));})()");
  const keyboard=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.shadowRoot.activeElement===buttons[1]&&buttons[0].tabIndex===-1&&buttons[1].tabIndex===0&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await key('Enter',13);
  const selectedState=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return JSON.stringify({value:el.value,index:el.selectedIndex,events:window.__phase11PaletteEvents,active:el.shadowRoot.activeElement?.dataset.color,tabIndex:el.shadowRoot.activeElement?.tabIndex,tabStops:buttons.filter(button=>button.tabIndex===0).length});})()");
  const selected=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.value==='rgb(0, 128, 255)'&&el.selectedIndex===1&&window.__phase11PaletteEvents.filter(item=>item.type==='select').length===1&&window.__phase11PaletteEvents.filter(item=>item.type==='change').length===1&&window.__phase11PaletteEvents.some(item=>item.type==='select'&&item.index===1)&&window.__phase11PaletteEvents.some(item=>item.type==='change'&&item.value==='rgb(0, 128, 255)')&&el.shadowRoot.activeElement===buttons[1]&&buttons[1].tabIndex===0&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];buttons[1].dispatchEvent(new KeyboardEvent('keydown',{key:'Home',bubbles:true,cancelable:true}));})()");
  const home=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.shadowRoot.activeElement===buttons[0]&&buttons[0].tabIndex===0&&buttons[1].tabIndex===-1&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];buttons[0].dispatchEvent(new KeyboardEvent('keydown',{key:'End',bubbles:true,cancelable:true}));})()");
  const end=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.shadowRoot.activeElement===buttons[3]&&buttons[3].tabIndex===0&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await key(' ',32);
  const space=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.value==='#ff6fae'&&el.selectedIndex===3&&window.__phase11PaletteEvents.filter(item=>item.type==='select').length===2&&window.__phase11PaletteEvents.filter(item=>item.type==='change').length===2&&window.__phase11PaletteEvents.some(item=>item.type==='select'&&item.index===3)&&el.shadowRoot.activeElement===buttons[3]&&buttons[3].tabIndex===0&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await ev("(() => {const el=document.querySelector('#phase11-palette');el.colors=['#111111','rgb(1, 2, 3)','#abcdef'];el.value='#abcdef';el.value='#999999';})()");
  const properties=await ev("(() => {const el=document.querySelector('#phase11-palette'),buttons=[...el.shadowRoot.querySelectorAll('.swatch')];return el.colors.length===3&&el.colors[1]==='rgb(1, 2, 3)'&&el.value==='#abcdef'&&el.selectedIndex===2&&el.shadowRoot.activeElement===buttons[0]&&buttons[0].tabIndex===0&&buttons[2].getAttribute('aria-pressed')==='true'&&buttons.filter(button=>button.tabIndex===0).length===1;})()");
  await ev("(() => {const el=document.querySelector('#phase11-palette');window.__phase11ClipboardDescriptor=Object.getOwnPropertyDescriptor(navigator,'clipboard');window.__phase11ExecCommand=document.execCommand;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:()=>Promise.reject(new Error('permission denied'))}});document.execCommand=()=>true;window.__phase11CopyResult=null;el.copy().then(result=>window.__phase11CopyResult=result);})()");
  await sleep(60);
  const copied=await ev("(() => {const el=document.querySelector('#phase11-palette');return window.__phase11CopyResult===true&&window.__phase11PaletteEvents.some(item=>item.type==='copy'&&item.value==='#abcdef')&&document.body.querySelectorAll('textarea').length===0;})()");
  await ev("(() => {const el=document.querySelector('#phase11-palette');el.disabled=true;window.__phase11BlockedSelect=el.select('#111111')===false&&[...el.shadowRoot.querySelectorAll('.swatch')].every(button=>button.disabled);el.disabled=false;document.execCommand=window.__phase11ExecCommand;if(window.__phase11ClipboardDescriptor)Object.defineProperty(navigator,'clipboard',window.__phase11ClipboardDescriptor);else delete navigator.clipboard;})()");
  const disabled=await ev("window.__phase11BlockedSelect===true");
  check('phase 11: Color Palette parses CSS functional colors, preserves focus and exactly one roving Tab stop through Arrow/Home/End and selection, synchronizes dynamic values, emits selection events and falls back when clipboard permission is denied',parsed&&keyboard&&selected&&home&&end&&properties&&copied&&disabled,JSON.stringify({parsed,keyboard,selected,selectedState,home,end,properties,copied,disabled}));
  await ev("document.querySelector('#phase11-palette').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-audio-player');el.id='phase11-audio';el.title='Sample tone';el.artist='Local test';el.preload='metadata';el.loop=true;window.__phase11AudioEvents=[];['loadedmetadata','durationchange','seek','play','pause','ended','error'].forEach(type=>el.addEventListener(type,event=>window.__phase11AudioEvents.push({type,detail:event.detail})));document.body.append(el);})()");
  const sampleUrl=await ev("(() => {const rate=8000,count=rate,buffer=new ArrayBuffer(44+count),view=new DataView(buffer),write=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i));};write(0,'RIFF');view.setUint32(4,36+count,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,rate,true);view.setUint32(28,rate,true);view.setUint16(32,1,true);view.setUint16(34,8,true);write(36,'data');view.setUint32(40,count,true);for(let i=0;i<count;i++){const fade=Math.min(1,i/160,(count-i)/160);view.setUint8(44+i,128+Math.round(42*fade*Math.sin(2*Math.PI*440*i/rate)));}return URL.createObjectURL(new Blob([buffer],{type:'audio/wav'}));})()");
  await ev("document.querySelector('#phase11-audio').src="+JSON.stringify(sampleUrl));
  let metadataReady=false;
  for(let attempt=0;attempt<30&&!metadataReady;attempt++){
    metadataReady=await ev("(() => {const el=document.querySelector('#phase11-audio');return el.duration>0.9&&el.duration<1.1&&window.__phase11AudioEvents.some(item=>item.type==='loadedmetadata');})()");
    if(!metadataReady) await sleep(100);
  }
  const metadata=await ev("(() => {const el=document.querySelector('#phase11-audio');return el.duration>0.9&&el.duration<1.1&&window.__phase11AudioEvents.filter(item=>item.type==='loadedmetadata').length===1&&window.__phase11AudioEvents.some(item=>item.type==='durationchange')&&!el.shadowRoot.querySelector('.seek input').disabled;})()");
  await ev("(() => {const el=document.querySelector('#phase11-audio');el.seekTime(9);window.__phase11SeekEnd=el.currentTime;el.seek(-3);window.__phase11SeekStart=el.currentTime;el.currentTime=0.35;el.title='Updated tone';el.artist='Updated artist';el.preload='invalid';el.loop=false;})()");
  const api=await ev("(() => {const el=document.querySelector('#phase11-audio');return Math.abs(window.__phase11SeekEnd-el.duration)<0.02&&window.__phase11SeekStart===0&&Math.abs(el.currentTime-0.35)<0.02&&el.title==='Updated tone'&&el.shadowRoot.querySelector('.title').textContent==='Updated tone'&&el.shadowRoot.querySelector('.artist').textContent==='Updated artist'&&el.preload==='metadata'&&el.loop===false&&window.__phase11AudioEvents.some(item=>item.type==='seek');})()");
  const mediaDiagnostics=await ev("(() => {const el=document.querySelector('#phase11-audio');return JSON.stringify({duration:el.duration,readyState:el.audio.readyState,networkState:el.audio.networkState,error:el.audio.error?.code||0,events:window.__phase11AudioEvents.map(item=>item.type)});})()");
  await ev("(() => {const el=document.querySelector('#phase11-audio');el.disabled=true;window.__phase11DisabledPlay=null;el.play().then(result=>window.__phase11DisabledPlay=result);})()");
  await sleep(30);
  const disabled=await ev("(() => {const el=document.querySelector('#phase11-audio');return window.__phase11DisabledPlay===false&&el.shadowRoot.querySelector('.play').disabled&&el.shadowRoot.querySelector('.seek input').disabled;})()");
  await ev("(() => {const el=document.querySelector('#phase11-audio');el.disabled=false;el.src='';return el.src===''&&el.shadowRoot.querySelector('.status').textContent==='Add a media source to play audio.';})()");
  const sourceReset=await ev("document.querySelector('#phase11-audio').src===''");
  await ev("(() => {const el=document.querySelector('#phase11-audio');el.remove();URL.revokeObjectURL("+JSON.stringify(sampleUrl)+");})()");
  check('phase 11: Audio Player loads a local WAV source, separates metadata/duration events, updates live properties, clamps seeks, normalizes preload, reflects loop/disabled state and clears sources',metadata&&api&&disabled&&sourceReset,JSON.stringify({metadata,api,mediaDiagnostics,disabled,sourceReset}));
}

// Phase 12: media, editors, and 3D cards
{
  await ev("(() => {const el=document.createElement('vfx-video-player');el.id='phase12-video';el.setAttribute('label','Preview film');el.setAttribute('loop','');el.setAttribute('preload','nonsense');window.__phase12VideoEvents=[];['loadedmetadata','durationchange','seek','volumechange','fullscreenchange','error'].forEach(type=>el.addEventListener(type,event=>window.__phase12VideoEvents.push({type,detail:event.detail})));document.body.append(el);})()");
  const initial=await ev("(() => {const el=document.querySelector('#phase12-video');return el.label==='Preview film'&&el.loop===true&&el.preload==='metadata'&&el.video.preload==='metadata'&&el.video.loop===true&&el.video.getAttribute('aria-label')==='Preview film'&&el.playing===false;})()");
  await ev("(() => {const el=document.querySelector('#phase12-video');window.__phase12VideoReady=false;window.__phase12VideoFailed='';if(!window.MediaRecorder||!HTMLCanvasElement.prototype.captureStream){window.__phase12VideoFailed='MediaRecorder/captureStream unavailable';return;}const canvas=document.createElement('canvas');canvas.width=160;canvas.height=90;const ctx=canvas.getContext('2d');const stream=canvas.captureStream(12);const mime=['video/webm;codecs=vp8','video/webm'].find(type=>MediaRecorder.isTypeSupported(type));if(!mime){window.__phase12VideoFailed='No WebM recording type';stream.getTracks().forEach(track=>track.stop());return;}const recorder=new MediaRecorder(stream,{mimeType:mime}),chunks=[];recorder.addEventListener('dataavailable',event=>{if(event.data.size)chunks.push(event.data)});recorder.addEventListener('stop',()=>{stream.getTracks().forEach(track=>track.stop());window.__phase12VideoUrl=URL.createObjectURL(new Blob(chunks,{type:mime}));el.src=window.__phase12VideoUrl;window.__phase12VideoReady=true;});let started=0;function draw(timestamp){if(!started)started=timestamp;const t=(timestamp-started)/1000;ctx.fillStyle='#211d3b';ctx.fillRect(0,0,160,90);ctx.fillStyle='#ff70b0';ctx.fillRect((t*70)%140,25,20,20);if(t<1.2)requestAnimationFrame(draw);else recorder.stop();}recorder.start();requestAnimationFrame(draw);})()");
  for(let i=0;i<35;i++){if(await ev("window.__phase12VideoReady&&document.querySelector('#phase12-video').duration>0"))break;await sleep(100);}
  const metadata=await ev("(() => {const el=document.querySelector('#phase12-video');return window.__phase12VideoReady&&el.duration>0.7&&el.duration<2&&window.__phase12VideoEvents.filter(item=>item.type==='loadedmetadata').length===1&&window.__phase12VideoEvents.some(item=>item.type==='durationchange')&&!el.shadowRoot.querySelector('.seek').disabled&&el.shadowRoot.querySelector('.seek').getAttribute('aria-valuetext')==='0:00 of '+el.fmt(el.duration);})()");
  await ev("(() => {const el=document.querySelector('#phase12-video');el.seekTime(10);window.__phase12VideoEnd=el.currentTime;el.seek(-2);window.__phase12VideoStart=el.currentTime;el.seek(0.5);window.__phase12VideoMiddle=el.currentTime;el.poster='preview-poster.jpg';el.label='Updated preview';el.preload='auto';el.loop=false;})()");
  const api=await ev("(() => {const el=document.querySelector('#phase12-video'),duration=el.duration;return Math.abs(window.__phase12VideoEnd-duration)<0.03&&window.__phase12VideoStart===0&&Math.abs(window.__phase12VideoMiddle-duration*.5)<0.08&&el.video.poster.endsWith('/preview-poster.jpg')&&el.video.getAttribute('aria-label')==='Updated preview'&&el.video.preload==='auto'&&!el.video.loop&&window.__phase12VideoEvents.some(item=>item.type==='seek');})()");
  await ev("(() => {const el=document.querySelector('#phase12-video');el.muted=true;window.__phase12MutedResult=el.toggleMuted();el.disabled=true;window.__phase12PlayResult=null;el.play().then(result=>window.__phase12PlayResult=result);})()");
  await sleep(40);
  const states=await ev("(() => {const el=document.querySelector('#phase12-video');return window.__phase12MutedResult===true&&el.muted===false&&!el.hasAttribute('muted')&&window.__phase12VideoEvents.some(item=>item.type==='volumechange'&&item.detail.muted===false)&&window.__phase12PlayResult===false&&el.shadowRoot.querySelectorAll('.bar button').length===3&&[...el.shadowRoot.querySelectorAll('.bar button')].every(button=>button.disabled)&&el.seekTime(0.2)===false;})()");
  await ev("(() => {const el=document.querySelector('#phase12-video');el.disabled=false;el.src='';window.__phase12VideoCleared=el.src===''&&el.shadowRoot.querySelector('.status').textContent==='Add a media source to play video.';el.remove();window.__phase12FullscreenCleanup=el._onFullscreenChange===null;document.body.append(el);})()");
  await sleep(40);
  const lifecycle=await ev("(() => {const el=document.querySelector('#phase12-video');const ok=window.__phase12VideoCleared&&window.__phase12FullscreenCleanup&&typeof el._onFullscreenChange==='function';el.remove();if(window.__phase12VideoUrl)URL.revokeObjectURL(window.__phase12VideoUrl);return ok;})()");
  check('phase 12: Video Player separates media metadata and duration events, loads a generated local clip, clamps seeking, syncs poster/label/preload/loop/mute, guards disabled state and restores fullscreen observation on reconnect',initial&&metadata&&api&&states&&lifecycle,JSON.stringify({initial,metadata,api,states,lifecycle,mediaError:await ev("window.__phase12VideoFailed")}));
}
{
  await ev("(() => {const el=document.createElement('vfx-markdown-editor');el.id='phase12-markdown';el.setAttribute('value','# Safe preview\\n\\n<script>window.__phase12Xss=1</script>\\n\\n[unsafe](javascript:alert(1)) and [external](https://example.com/docs)');window.__phase12MarkdownEvents=[];['input','change'].forEach(type=>el.addEventListener(type,event=>window.__phase12MarkdownEvents.push({type,value:event.detail.value})));document.body.append(el);})()");
  await sleep(50);
  const safe=await ev("(() => {const el=document.querySelector('#phase12-markdown'),preview=el.shadowRoot.querySelector('.preview');return preview.querySelector('h1')?.textContent==='Safe preview'&&preview.textContent.includes('<script>window.__phase12Xss=1</script>')&&preview.querySelectorAll('script,img').length===0&&![...preview.querySelectorAll('a')].some(link=>link.protocol==='javascript:')&&preview.querySelector('a[href=\"https://example.com/docs\"]')?.rel==='noopener noreferrer';})()");
  await ev("(() => {const el=document.querySelector('#phase12-markdown');el.setAttribute('value','# Reset source\\n\\nOriginal value');el.editor.value='Unsaved text';el.value='# Reset source\\n\\nOriginal value';})()");
  const reset=await ev("(() => {const el=document.querySelector('#phase12-markdown');return el.value==='# Reset source\\n\\nOriginal value'&&el.shadowRoot.querySelector('.preview').textContent.includes('Original value');})()");
  await ev("(() => {const el=document.querySelector('#phase12-markdown');el.editor.value='# User change';el.editor.dispatchEvent(new Event('input',{bubbles:true}));el.mode='preview';})()");
  const input=await ev("(() => {const el=document.querySelector('#phase12-markdown'),panel=el.shadowRoot.querySelector('.body'),tabs=[...el.shadowRoot.querySelectorAll('[role=tab]')];return window.__phase12MarkdownEvents.some(item=>item.type==='input'&&item.value==='# User change')&&window.__phase12MarkdownEvents.some(item=>item.type==='change'&&item.value==='# User change')&&el.mode==='preview'&&el.editor.hidden&&!el.shadowRoot.querySelector('.preview').hidden&&panel.getAttribute('aria-labelledby')==='markdown-tab-preview'&&tabs.find(tab=>tab.dataset.mode==='preview').getAttribute('aria-selected')==='true';})()");
  await ev("(() => {const el=document.querySelector('#phase12-markdown'),write=el.shadowRoot.querySelector('[data-mode=write]');write.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true,cancelable:true}));})()");
  const keyboard=await ev("(() => {const el=document.querySelector('#phase12-markdown');return el.mode==='split'&&el.shadowRoot.activeElement?.dataset.mode==='split';})()");
  await ev("(() => {const el=document.querySelector('#phase12-markdown');el.readOnly=true;window.__phase12ReadOnly=el.editor.readOnly&&!el.shadowRoot.querySelector('[data-mode=write]').disabled;el.disabled=true;})()");
  const disabled=await ev("(() => {const el=document.querySelector('#phase12-markdown');return window.__phase12ReadOnly&&el.editor.disabled&&[...el.shadowRoot.querySelectorAll('[role=tab]')].every(tab=>tab.disabled);})()");
  check('phase 12: Markdown Editor renders text safely, rejects unsafe link protocols, preserves external link protections, resets same-valued attributes, emits input/change events, manages tab panel relationships and honors read-only/disabled states',safe&&reset&&input&&keyboard&&disabled,JSON.stringify({safe,reset,input,keyboard,disabled}));
  await ev("document.querySelector('#phase12-markdown').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-json-editor');el.id='phase12-json';el.setAttribute('required','');el.setAttribute('value','{\"initial\":true}');window.__phase12JsonEvents=[];['input','change','format','minify','format-error'].forEach(type=>el.addEventListener(type,event=>window.__phase12JsonEvents.push({type,detail:event.detail})));document.body.append(el);})()");
  await sleep(50);
  const initial=await ev("(() => {const el=document.querySelector('#phase12-json');return el.valid&&el.error===''&&el.input.required&&el.input.getAttribute('aria-invalid')==='false'&&el.shadowRoot.querySelector('pre').textContent.includes('initial');})()");
  await ev("(() => {const el=document.querySelector('#phase12-json');el.value='{\"items\":[1,2,3],\"label\":\"sample\"}';el.format();})()");
  const format=await ev("(() => {const el=document.querySelector('#phase12-json');return el.valid&&el.value.includes('\\n  \"items\"')&&window.__phase12JsonEvents.some(item=>item.type==='format');})()");
  await ev("document.querySelector('#phase12-json').minify()");
  const minify=await ev("(() => {const el=document.querySelector('#phase12-json');return el.valid&&!el.value.includes('\\n')&&window.__phase12JsonEvents.some(item=>item.type==='minify');})()");
  await ev("(() => {const el=document.querySelector('#phase12-json');el.value='{broken';el.parse();})()");
  const invalid=await ev("(() => {const el=document.querySelector('#phase12-json');return !el.valid&&!!el.error&&el.input.getAttribute('aria-invalid')==='true'&&el.shadowRoot.querySelector('pre').textContent==='Preview unavailable until the JSON is valid.';})()");
  await ev("(() => {const el=document.querySelector('#phase12-json');el.setAttribute('value','{\"reset\":true}');el.input.value='{\"edited\":true}';el.value='{\"reset\":true}';})()");
  const reset=await ev("(() => {const el=document.querySelector('#phase12-json');return el.value==='{\"reset\":true}'&&el.valid&&el.shadowRoot.querySelector('pre').textContent.includes('reset');})()");
  await ev("(() => {const el=document.querySelector('#phase12-json');el.value='{\"html\":\"<img src=x onerror=alert(1)>\"}';})()");
  const safe=await ev("(() => {const el=document.querySelector('#phase12-json');return el.valid&&el.shadowRoot.querySelector('pre').textContent.includes('<img src=x onerror=alert(1)>')&&!el.shadowRoot.querySelector('img');})()");
  await ev("(() => {const el=document.querySelector('#phase12-json');el.value='   ';el.required=true;el.parse();window.__phase12RequiredEmpty=!el.valid;el.readOnly=true;window.__phase12ReadOnly=el.input.readOnly&&el.shadowRoot.querySelector('.format').disabled&&el.shadowRoot.querySelector('.minify').disabled;el.readOnly=false;el.disabled=true;})()");
  const states=await ev("(() => {const el=document.querySelector('#phase12-json');return window.__phase12RequiredEmpty&&window.__phase12ReadOnly&&el.input.disabled&&el.shadowRoot.querySelector('.format').disabled&&el.shadowRoot.querySelector('.minify').disabled;})()");
  check('phase 12: JSON Editor validates live input, formats/minifies valid data, preserves invalid source, restores a same-valued property, renders HTML-like strings as text and synchronizes required/read-only/disabled states',initial&&format&&minify&&invalid&&reset&&safe&&states,JSON.stringify({initial,format,minify,invalid,reset,safe,states}));
  await ev("document.querySelector('#phase12-json').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-tilt-card');el.id='phase12-tilt';el.setAttribute('title','Dynamic title');el.setAttribute('description','Dynamic description');document.body.append(el);})()");
  const content=await ev("(() => {const el=document.querySelector('#phase12-tilt');return el.shadowRoot.querySelector('strong').textContent==='Dynamic title'&&el.shadowRoot.querySelector('.desc').textContent==='Dynamic description';})()");
  await ev("(() => {const el=document.querySelector('#phase12-tilt'),rect=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:rect.left+rect.width*.9,clientY:rect.top+rect.height*.1,pointerType:'mouse'}));})()");
  const tilt=await ev("(() => {const el=document.querySelector('#phase12-tilt');return el.shadowRoot.querySelector('.card').style.transform.includes('rotateX')&&el.shadowRoot.querySelector('.shine').style.getPropertyValue('--x')!=='50%';})()");
  await ev("(() => {const el=document.querySelector('#phase12-tilt');el.setAttribute('title','<img src=x>');el.dispatchEvent(new PointerEvent('pointerleave',{bubbles:true}));})()");
  const reset=await ev("(() => {const el=document.querySelector('#phase12-tilt');return el.shadowRoot.querySelector('strong').textContent==='<img src=x>'&&!el.shadowRoot.querySelector('img')&&el.shadowRoot.querySelector('.card').style.transform.includes('0deg')&&el.shadowRoot.querySelector('.shine').style.getPropertyValue('--x')==='50%';})()");
  await ev("(() => {const el=document.querySelector('#phase12-tilt'),rect=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:rect.left+rect.width*.9,clientY:rect.top+rect.height*.1,pointerType:'touch'}));})()");
  const touch=await ev("(() => document.querySelector('#phase12-tilt').shadowRoot.querySelector('.card').style.transform.includes('0deg'))()");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await ev("(() => {const el=document.querySelector('#phase12-tilt'),rect=el.getBoundingClientRect();el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,clientX:rect.left+rect.width*.8,clientY:rect.top+rect.height*.2,pointerType:'mouse'}));})()");
  const reduced=await ev("(() => {const el=document.querySelector('#phase12-tilt');return el.shadowRoot.querySelector('.card').style.transform.includes('0deg')&&getComputedStyle(el.shadowRoot.querySelector('.card')).transitionDuration==='0s';})()");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  check('phase 12: 3D Tilt Card updates text safely, clamps mouse/pen tilt, restores neutral state on pointer leave/touch, and suppresses movement under reduced motion',content&&tilt&&reset&&touch&&reduced,JSON.stringify({content,tilt,reset,touch,reduced}));
  await ev("document.querySelector('#phase12-tilt').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-flip-card');el.id='phase12-flip';el.setAttribute('front','Prompt');el.setAttribute('back','Reveal');window.__phase12FlipEvents=[];el.addEventListener('change',event=>window.__phase12FlipEvents.push(event.detail));document.body.append(el);})()");
  const initial=await ev("(() => {const el=document.querySelector('#phase12-flip'),button=el.shadowRoot.querySelector('.inner');return !el.flipped&&button.getAttribute('aria-pressed')==='false'&&button.getAttribute('aria-label')==='Show back: Reveal'&&el.shadowRoot.querySelector('.front').getAttribute('aria-hidden')==='false'&&el.shadowRoot.querySelector('.back').getAttribute('aria-hidden')==='true';})()");
  await ev("document.querySelector('#phase12-flip').shadowRoot.querySelector('.inner').click()");
  const click=await ev("(() => {const el=document.querySelector('#phase12-flip'),button=el.shadowRoot.querySelector('.inner');return el.flipped&&button.getAttribute('aria-pressed')==='true'&&button.getAttribute('aria-label')==='Show front: Prompt'&&el.shadowRoot.querySelector('.front').getAttribute('aria-hidden')==='true'&&el.shadowRoot.querySelector('.back').getAttribute('aria-hidden')==='false'&&window.__phase12FlipEvents.length===1;})()");
  await ev("document.querySelector('#phase12-flip').shadowRoot.querySelector('.inner').focus()");
  await key('Enter',13);
  const keyboard=await ev("(() => {const el=document.querySelector('#phase12-flip'),button=el.shadowRoot.querySelector('.inner');window.__phase12FlipKeyboardDebug={focused:el.shadowRoot.activeElement===button,documentFocused:document.activeElement===el,flipped:el.flipped,pressed:button.getAttribute('aria-pressed'),events:window.__phase12FlipEvents.length};return !el.flipped&&button.getAttribute('aria-pressed')==='false'&&window.__phase12FlipEvents.length===2;})()");
  await key(' ',32);
  const space=await ev("(() => {const el=document.querySelector('#phase12-flip');return el.flipped&&el.shadowRoot.querySelector('.inner').getAttribute('aria-pressed')==='true'&&window.__phase12FlipEvents.length===3;})()");
  await ev("(() => {const el=document.querySelector('#phase12-flip');el.front='Updated prompt';el.back='Updated answer';el.toggle(true);window.__phase12NoDuplicate=el.toggle(true)===true&&window.__phase12FlipEvents.length===3;})()");
  const props=await ev("(() => {const el=document.querySelector('#phase12-flip'),button=el.shadowRoot.querySelector('.inner');return el.flipped&&el.shadowRoot.querySelector('.front b').textContent==='Updated prompt'&&el.shadowRoot.querySelector('.back b').textContent==='Updated answer'&&button.getAttribute('aria-label')==='Show front: Updated prompt'&&window.__phase12NoDuplicate;})()");
  await ev("(() => {const el=document.querySelector('#phase12-flip');el.removeAttribute('flipped');el.setAttribute('flipped','');})()");
  const attribute=await ev("(() => {const el=document.querySelector('#phase12-flip');return el.flipped&&el.shadowRoot.querySelector('.inner').getAttribute('aria-pressed')==='true';})()");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const reduced=await ev("getComputedStyle(document.querySelector('#phase12-flip').shadowRoot.querySelector('.inner')).transitionDuration==='0s'");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await ev("document.querySelector('#phase12-flip').remove()");
  check('phase 12: 3D Flip Card activates by click and keyboard, exposes aria-pressed and next-face name, hides the inactive face, updates front/back properties, avoids duplicate state events and removes transitions for reduced motion',initial&&click&&keyboard&&space&&props&&attribute&&reduced,JSON.stringify({initial,click,keyboard,space,keyboardDebug:await ev("JSON.stringify(window.__phase12FlipKeyboardDebug)"),props,attribute,reduced}));
}

// Phase 13: advanced motion and celebration components
{
  await ev("(() => {const el=document.createElement('vfx-particle-field');el.id='phase13-particles';document.body.append(el);})()");
  const defaults=await ev("(() => {const el=document.querySelector('#phase13-particles');return el.count===48&&el.speed===1&&el._particles.length===48&&el.color==='rgba(224,215,255,.7)'&&el.shadowRoot.querySelector('canvas').getAttribute('aria-hidden')==='true';})()");
  await ev("(() => {const el=document.querySelector('#phase13-particles');el.count=12;el.speed=0.5;el.color='#ff0000';})()");
  const properties=await ev("(() => {const el=document.querySelector('#phase13-particles');return el.count===12&&el._particles.length===12&&el.speed===0.5&&el.color==='#ff0000'&&(el.ctx.fillStyle.toLowerCase().includes('255, 0, 0')||el.ctx.fillStyle==='#ff0000');})()");
  await ev("(() => {const el=document.querySelector('#phase13-particles');el.speed=0;const y=el._particles[0].y;el.frame(0.5);window.__phase13StaticParticle=el._particles[0].y===y;el.speed=1;el.paused=true;const paused=el._particles[0].y;el.frame(0.5);window.__phase13PausedParticle=el._particles[0].y===paused;el.paused=false;})()");
  const staticState=await ev("window.__phase13StaticParticle&&window.__phase13PausedParticle");
  await ev("document.querySelector('#phase13-particles').count=500");
  const bounds=await ev("document.querySelector('#phase13-particles').count===160");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await ev("(() => {const el=document.querySelector('#phase13-particles');const y=el._particles[0].y;el.frame(0.5);window.__phase13ReducedParticle=el.reducedMotion&&el._particles[0].y===y;})()");
  const reduced=await ev("window.__phase13ReducedParticle===true");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await ev("(() => {const el=document.querySelector('#phase13-particles');el.style.width='240px';el.resize();window.__phase13ParticleWidth=el.canvas.width;el.remove();window.__phase13ObserverClean=!el._resizeObserver;document.body.append(el);})()");
  const lifecycle=await ev("(() => {const el=document.querySelector('#phase13-particles');return window.__phase13ParticleWidth>0&&window.__phase13ObserverClean&&el.isConnected&&(!('ResizeObserver'in window)||!!el._resizeObserver);})()");
  check('phase 13: Particle Field defaults, clamps, CSS color updates, static/paused/reduced-motion behavior, resize, and observer reconnect',defaults&&properties&&staticState&&bounds&&reduced&&lifecycle,JSON.stringify({defaults,properties,staticState,bounds,reduced,lifecycle}));
  await ev("document.querySelector('#phase13-particles').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-marquee');el.id='phase13-marquee';const item=document.createElement('span');item.id='marquee-source';item.innerHTML='SHIP <a id=\"marquee-link\" href=\"#demo\">details</a>';el.append(item);document.body.append(el);})()");
  await sleep(60);
  const defaults=await ev("(() => {const el=document.querySelector('#phase13-marquee'),copy=el.shadowRoot.querySelector('.copy[aria-hidden=true]');return el.duration===22&&el.paused===false&&copy.hasAttribute('inert')&&copy.textContent.includes('SHIP')&&!!copy.querySelector('a')&&!copy.querySelector('[id]')&&copy.querySelector('a').getAttribute('tabindex')==='-1'&&copy.querySelector('a').getAttribute('aria-hidden')==='true';})()");
  await ev("(() => {const el=document.querySelector('#phase13-marquee');el.duration=200;el.paused=true;el.label='News ticker';})()");
  const attributes=await ev("(() => {const el=document.querySelector('#phase13-marquee');return el.duration===120&&el.style.getPropertyValue('--duration')==='120s'&&el.paused&&el.shadowRoot.querySelector('.viewport').getAttribute('aria-label')==='News ticker';})()");
  await ev("(() => {const el=document.querySelector('#phase13-marquee'),extra=document.createElement('button');extra.textContent='Open';extra.id='extra-action';el.firstElementChild.append(extra);})()");
  await sleep(80);
  const dynamic=await ev("(() => {const el=document.querySelector('#phase13-marquee'),copy=el.shadowRoot.querySelector('.copy[aria-hidden=true]');return copy.textContent.includes('Open')&&copy.querySelector('button')?.getAttribute('tabindex')==='-1'&&!copy.querySelector('#extra-action');})()");
  await ev("(() => {const el=document.querySelector('#phase13-marquee');el.paused=false;el.querySelector('a').focus();})()");
  const focus=await ev("getComputedStyle(document.querySelector('#phase13-marquee').shadowRoot.querySelector('.track')).animationPlayState==='paused'");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const reduced=await ev("getComputedStyle(document.querySelector('#phase13-marquee').shadowRoot.querySelector('.track')).animationName==='none'");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await ev("(() => {const el=document.querySelector('#phase13-marquee');el.remove();document.body.append(el);})()");
  const reconnect=await ev("(() => {const el=document.querySelector('#phase13-marquee');return el.shadowRoot.querySelector('.copy[aria-hidden=true]').textContent.includes('Open');})()");
  check('phase 13: Marquee clamps live duration, pauses when focused, suppresses reduced motion, clones live slot content without duplicate IDs, and makes cloned controls inert',defaults&&attributes&&dynamic&&focus&&reduced&&reconnect,JSON.stringify({defaults,attributes,dynamic,focus,reduced,reconnect}));
  await ev("document.querySelector('#phase13-marquee').remove()");
}
{
  await ev("(() => {window.__phase13Observers=[];class FakeIntersectionObserver{constructor(callback,options){this.callback=callback;this.options=options;this.targets=new Set();this.disconnected=false;window.__phase13Observers.push(this);}observe(target){this.targets.add(target);}unobserve(target){this.targets.delete(target);}disconnect(){this.disconnected=true;this.targets.clear();}trigger(target,isIntersecting){this.callback([{target,isIntersecting}],this);}}window.__phase13FakeIO=FakeIntersectionObserver;window.IntersectionObserver=FakeIntersectionObserver;const el=document.createElement('vfx-scroll-reveal');el.id='phase13-reveal';el.threshold=.4;el.distance=32;el.duration=450;el.once=false;const a=document.createElement('article');a.textContent='First reveal';el.append(a);window.__phase13RevealEvents=[];['reveal','conceal'].forEach(type=>el.addEventListener(type,event=>window.__phase13RevealEvents.push({type,index:event.detail.index})));document.body.append(el);window.__phase13RevealFirst=a;})()");
  const defaults=await ev("(() => {const el=document.querySelector('#phase13-reveal'),io=window.__phase13Observers.at(-1);return el.threshold===.4&&el.distance===32&&el.duration===450&&!el.once&&io.options.threshold===.4&&io.targets.has(window.__phase13RevealFirst)&&!window.__phase13RevealFirst.classList.contains('revealed');})()");
  await ev("(() => {const el=document.querySelector('#phase13-reveal'),io=window.__phase13Observers.at(-1);io.trigger(window.__phase13RevealFirst,true);})()");
  const reveal=await ev("window.__phase13RevealFirst.classList.contains('revealed')&&window.__phase13RevealEvents.some(x=>x.type==='reveal'&&x.index===0)");
  await ev("window.__phase13Observers.at(-1).trigger(window.__phase13RevealFirst,false)");
  const conceal=await ev("!window.__phase13RevealFirst.classList.contains('revealed')&&window.__phase13RevealEvents.some(x=>x.type==='conceal')");
  await ev("(() => {const el=document.querySelector('#phase13-reveal'),extra=document.createElement('article');extra.textContent='Dynamic reveal';el.append(extra);window.__phase13RevealSecond=extra;})()");
  await sleep(40);
  const dynamic=await ev("window.__phase13Observers.at(-1).targets.has(window.__phase13RevealSecond)");
  await ev("document.querySelector('#phase13-reveal').disabled=true");
  const disabled=await ev("window.__phase13RevealFirst.classList.contains('revealed')&&window.__phase13RevealSecond.classList.contains('revealed')&&!window.__phase13Observers.at(-1).targets.size");
  await ev("(() => {const el=document.querySelector('#phase13-reveal');el.disabled=false;el.remove();window.__phase13Disconnected=window.__phase13Observers.at(-1).disconnected;document.body.append(el);})()");
  const reconnect=await ev("(() => {const el=document.querySelector('#phase13-reveal');return window.__phase13Disconnected&&window.__phase13Observers.at(-1).targets.has(window.__phase13RevealFirst)&&el.isConnected;})()");
  await ev("(() => {document.querySelector('#phase13-reveal').remove();window.IntersectionObserver=undefined;})()");
  check('phase 13: Scroll Reveal observes initial and dynamically assigned children, supports once=false reveal/conceal events, bounded options, disabled visibility and observer cleanup/reconnect',defaults&&reveal&&conceal&&dynamic&&disabled&&reconnect,JSON.stringify({defaults,reveal,conceal,dynamic,disabled,reconnect}));
}
{
  await ev("(() => {const el=document.createElement('vfx-animated-counter');el.id='phase13-counter';window.__phase13Counter=el;el.setAttribute('value','12.5');el.setAttribute('label','Active users');el.setAttribute('duration','90');el.setAttribute('decimals','1');el.setAttribute('locale','en-US');window.__phase13CounterEvents=[];el.addEventListener('complete',event=>window.__phase13CounterEvents.push(event.detail.value));document.body.append(el);})()");
  const initial=await ev("(() => {const el=document.querySelector('#phase13-counter');return el.value===12.5&&el.shadowRoot.querySelector('.value').textContent==='12.5'&&el.shadowRoot.querySelector('.label').textContent==='Active users'&&window.__phase13CounterEvents.length===0;})()");
  const immediate=await ev("(() => {const el=document.querySelector('#phase13-counter');return el.setValue(100,false)&&el.value===100&&el.shadowRoot.querySelector('.value').textContent==='100.0'&&window.__phase13CounterEvents.at(-1)===100;})()");
  const invalid=await ev("(() => {const el=document.querySelector('#phase13-counter');return el.setValue(Number.NaN)===false&&el.value===100;})()");
  await ev("(() => {const el=document.querySelector('#phase13-counter');el.setValue(200,true);})()");
  await sleep(25);
  await ev("window.__phase13Counter.remove()");
  const detach=await ev("(() => {const el=window.__phase13Counter;return !el.isConnected&&el._raf===null&&el._current===200&&el.shadowRoot.querySelector('.value').textContent==='200.0';})()");
  await ev("document.body.append(window.__phase13Counter)");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await ev("(() => {const el=document.querySelector('#phase13-counter');el.value=25;})()");
  const reduced=await ev("(() => {const el=document.querySelector('#phase13-counter');return el.value===25&&el._raf===null&&el.shadowRoot.querySelector('.value').textContent==='25.0';})()");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await ev("(() => {const el=document.querySelector('#phase13-counter');el.setAttribute('value','25');el.shadowRoot.querySelector('.value').textContent='stale';el.value=25;})()");
  const reset=await ev("document.querySelector('#phase13-counter').shadowRoot.querySelector('.value').textContent==='25.0'");
  await ev("(() => {const el=document.querySelector('#phase13-counter');el.locale='de-DE';el.decimals=2;el.setValue(1234.5,false);el.label='Revenue';el.duration=-500;})()");
  const format=await ev("(() => {const el=document.querySelector('#phase13-counter');return el.shadowRoot.querySelector('.value').textContent==='1.234,50'&&el.shadowRoot.querySelector('.label').textContent==='Revenue'&&el.duration===0;})()");
  check('phase 13: Animated Counter formats locales/decimals, rejects non-finite targets, emits completion once, finalizes cleanly on detach, restores same-valued properties and honors reduced motion',initial&&immediate&&invalid&&detach&&reduced&&reset&&format,JSON.stringify({initial,immediate,invalid,detach,reduced,reset,format,finalState:await ev("JSON.stringify((()=>{const el=document.querySelector('#phase13-counter');return {connected:el.isConnected,raf:el._raf,current:el._current,target:el._target,text:el.shadowRoot.querySelector('.value').textContent,media:el._media?.matches,query:matchMedia('(prefers-reduced-motion: reduce)').matches,events:window.__phase13CounterEvents};})())")}));
  await ev("document.querySelector('#phase13-counter').remove()");
}
{
  await ev("(() => {const el=document.createElement('vfx-confetti-button');el.id='phase13-confetti';el.label='<img src=x onerror=alert(1)> Celebrate';window.__phase13Celebrate=[];el.addEventListener('celebrate',event=>window.__phase13Celebrate.push(event.detail));document.body.append(el);})()");
  const safe=await ev("(() => {const el=document.querySelector('#phase13-confetti');return el.shadowRoot.querySelector('.btn').textContent===el.label&&!el.shadowRoot.querySelector('img')&&el.disabled===false;})()");
  await ev("document.querySelector('#phase13-confetti').shadowRoot.querySelector('.btn').click()");
  const event=await ev("window.__phase13Celebrate.length===1&&window.__phase13Celebrate[0].label.includes('<img')&&window.__phase13Celebrate[0].reducedMotion===false");
  await ev("(() => {const el=document.querySelector('#phase13-confetti');el.label='Updated celebration';el.disabled=true;window.__phase13Blocked=!el.celebrate()&&el.shadowRoot.querySelector('.btn').disabled;})()");
  const disabled=await ev("window.__phase13Blocked&&window.__phase13Celebrate.length===1&&document.querySelector('#phase13-confetti').shadowRoot.querySelector('.btn').textContent==='Updated celebration'");
  await ev("document.querySelector('#phase13-confetti').disabled=false");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await ev("document.querySelector('#phase13-confetti').shadowRoot.querySelector('.btn').click()");
  const reduced=await ev("window.__phase13Celebrate.length===2&&window.__phase13Celebrate.at(-1).reducedMotion===true");
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await ev("document.querySelector('#phase13-confetti').shadowRoot.querySelector('.btn').focus()");
  await key('Enter',13);
  const keyboard=await ev("(() => {const el=document.querySelector('#phase13-confetti'),button=el.shadowRoot.querySelector('.btn');window.__phase13ConfettiKeyboardDebug={focused:el.shadowRoot.activeElement===button,documentFocused:document.activeElement===el,events:window.__phase13Celebrate.length,disabled:button.disabled};return window.__phase13Celebrate.length===3;})()");
  await key(' ',32);
  const space=await ev("window.__phase13Celebrate.length===4");
  check('phase 13: Confetti Button safely renders dynamic labels as text, emits celebration events, blocks disabled triggers, suppresses effects for reduced motion, and supports keyboard activation',safe&&event&&disabled&&reduced&&keyboard&&space,JSON.stringify({safe,event,disabled,reduced,keyboard,space,keyboardDebug:await ev("JSON.stringify(window.__phase13ConfettiKeyboardDebug)")}));
  await ev("document.querySelector('#phase13-confetti').remove()");
}

{
 const idSafety=await ev(`(() => {
  const specs=[
   ['vfx-date-picker','.popup','.trigger','aria-controls'],
   ['vfx-command-palette','.list','input','aria-controls'],
   ['vfx-drawer','.title','dialog','aria-labelledby'],
   ['vfx-select','.list','.trigger','aria-controls'],
   ['vfx-search','.suggestions','input','aria-controls'],
   ['vfx-menu','.panel','.trigger','aria-controls'],
   ['vfx-dialog','.title','dialog','aria-labelledby']
  ];
  const results=[];
  for(const [tag,target,reference,attribute] of specs){
   const a=document.createElement(tag),b=document.createElement(tag);
   document.body.append(a,b);
   const inspect=el=>{const root=el.shadowRoot,id=root.querySelector(target)?.id,ref=root.querySelector(reference)?.getAttribute(attribute);return !!id&&id===ref?id:'';};
   const first=inspect(a),second=inspect(b);
   results.push(!!first&&!!second&&first!==second);
   a.remove();b.remove();
  }
  return results.every(Boolean);
 })()`);
 check('security: generated IDs are unique and each ARIA reference resolves within its component instance',idSafety,idSafety);
}
check('no horizontal scroll at 390', (await ev('document.documentElement.scrollWidth')) <= 390, await ev('document.documentElement.scrollWidth'));
if (logs.length) { console.log(logs.join('\n')); fails++; }
ws.close(); chrome.kill(); await sleep(300); try { rmSync(PROFILE, { recursive: true, force: true }); } catch {} process.exit(fails ? 1 : 0);
