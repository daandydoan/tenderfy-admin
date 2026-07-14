// Tenderfy Admin Portal — prototype interactions.
// Extracted from the subbie-portal prototype; shares styles.css with it.

// Placeholder-action toast: actions/buttons with no real destination show a
// toast instead of navigating. Trigger via data-toast="Description", or any a[href="#"].
let __toastTimer;
function showToast(msg){
  let t = document.getElementById('toast');
  if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  clearTimeout(__toastTimer);
  __toastTimer = setTimeout(()=>t.classList.remove('show'), 2600);
}
document.addEventListener('click', (e)=>{
  const el = e.target.closest && e.target.closest('[data-toast], a[href="#"]');
  if(!el) return;
  e.preventDefault();
  const desc = el.getAttribute('data-toast') || el.textContent.trim().replace(/\s+/g,' ');
  showToast('Placeholder Action: ' + desc);
});

// Scrollbars are hidden everywhere and stay hidden — they do NOT appear on hover
// or while scrolling. They show ONLY on explicit request: set this flag to true
// (or call toggleScrollbars() at runtime) to reveal them.
const SHOW_SCROLLBARS = false;
if(SHOW_SCROLLBARS) document.documentElement.classList.add('show-scrollbars');
window.toggleScrollbars = (on)=>document.documentElement.classList.toggle('show-scrollbars', on);
