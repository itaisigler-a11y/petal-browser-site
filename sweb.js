// Shared by the pack, move and helper pages. Set SWEB_API to the sync server (no trailing slash).
var SWEB_API = 'https://sweb-sync.sweb-app.workers.dev';
var APP_STORE = 'https://apps.apple.com/app/id6836605431';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function host(u){try{return new URL(u).hostname.replace(/^www\./,'');}catch(e){return u;}}
// Letter tiles, no icon requests: neither an icon service nor the pack's sites learn who is looking at a pack.
function tile(s){var h=host(s.url),t=s.title||h;return '<div class="tile"><span class="mark">'+esc(t.charAt(0).toUpperCase())+'</span>'+esc(t)+'</div>';}
function preview(snap){
  var by=Object.create(null),order=[''].concat(snap.folders||[]),out='';
  (snap.sites||[]).forEach(function(s){(by[s.folder||'']=by[s.folder||'']||[]).push(s);});
  order.forEach(function(f){var list=by[f];if(!list)return;out+=(f?'<div class="folder">'+esc(f)+'</div>':'')+'<div class="tiles">'+list.map(tile).join('')+'</div>';});
  return out;
}
function openApp(path){location.href='petal://'+path;}
function api(path){if(!SWEB_API)return Promise.reject(new Error('offline'));return fetch(SWEB_API+path).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();});}
