// Host-page event wiring for the four additional Sakuga originals.
(() => {
 const get=id=>document.getElementById(id);
 const say=(id,text)=>{const n=get(id);if(n)n.textContent=text};
 get('sakuga-like')?.addEventListener('change',e=>say('sakuga-like-status',e.detail.pressed?'Liked!':'Like removed.'));
 get('sakuga-accordion')?.addEventListener('change',e=>say('sakuga-accordion-status',e.detail.open?'Details expanded.':'Details collapsed.'));
 get('sakuga-segmented')?.addEventListener('change',e=>say('sakuga-segmented-status','Selected '+e.detail.label+'.'));
 get('sakuga-notification')?.addEventListener('change',()=>say('sakuga-notification-status','All notifications cleared.'));
})();
