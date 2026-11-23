// Shared by the pack, move and helper pages. Set SWEB_API to the sync server (no trailing slash).
var SWEB_API = '';
var APP_STORE = 'https://apps.apple.com/app/id6836605431';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function host(u){try{return new URL(u).hostname.replace(/^www\./,'');}catch(e){return u;}}
// Favicons come from each site itself, so no third-party icon service learns what packs people look at.
function tile(s){var h=host(s.url);return '<div class="tile"><img loading="lazy" alt="" src="https://'+esc(h)+'/favicon.ico" onerror="this.style.visibility=\'hidden\'">'+esc(s.title||h)+'</div>';}
function preview(snap){
  var by={},order=[''].concat(snap.folders||[]),out='';
  (snap.sites||[]).forEach(function(s){(by[s.folder||'']=by[s.folder||'']||[]).push(s);});
  order.forEach(function(f){var list=by[f];if(!list)return;out+=(f?'<div class="folder">'+esc(f)+'</div>':'')+'<div class="tiles">'+list.map(tile).join('')+'</div>';});
  return out;
}
function openApp(path){location.href='petal://'+path;}
function api(path){if(!SWEB_API)return Promise.reject(new Error('offline'));return fetch(SWEB_API+path).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();});}
