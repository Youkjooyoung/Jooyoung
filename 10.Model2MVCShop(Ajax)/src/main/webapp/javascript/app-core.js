/* /javascript/app-core.js */
(function(w, d, $){
  'use strict'; if(!$) return;

  function ctx(){ return $('body').data('ctx') || $('base').attr('href') || ''; }
  function qs(p){ return $.param(p||{}); }
  function go(path, p){ w.location.href = ctx()+path + (p && Object.keys(p).length? ('?'+qs(p)) : ''); }
  function post(path, p){
    var $f=$('<form>').css('display','none');
    $f.attr({action:ctx()+path, method:'post'});
    $.each(p||{}, function(k,v){ $('<input type="hidden">').attr({name:k, value:v}).appendTo($f); });
    $(d.body).append($f); $f.trigger('submit');
  }
  function ajaxPost(url, data){ return $.ajax({url:ctx()+url, type:'POST', data:data||{}}); }
  function popup(url, name, feat){
    var u = /^https?:\/\//i.test(url)? url : (ctx()+url);
    var wn; try{ wn=w.open(u, name||'_blank', feat||'width=900,height=650,scrollbars=yes,resizable=yes'); }catch(e){}
    if(!wn || wn.closed || typeof wn.closed==='undefined'){ w.location.assign(u); } else { try{ wn.focus(); }catch(_){ } }
    return wn;
  }
  function digits(s){ return (s||'').replace(/\D/g,''); }
  function lock($btn, fn){ if($btn.prop('disabled')) return; $btn.prop('disabled',true); try{ fn&&fn(); }finally{ setTimeout(function(){ $btn.prop('disabled',false); },300); } }
  function esc(s){ return (s==null?'':String(s)).replace(/[&<>"']/g,function(m){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m];}); }
  function fmtPrice(n){ var x=(typeof n==='number')?n:parseInt(n,10); if(isNaN(x)) return '0'; return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,','); }
  function fmtDate(s){ if(!s) return ''; var m=String(s).match(/^(\d{4})[-/]?(\d{2})[-/]?(\d{2})/); if(m) return m[1]+'-'+m[2]+'-'+m[3]; try{ var d2=new Date(s); if(!isNaN(d2.getTime())){ var y=d2.getFullYear(), mo=('0'+(d2.getMonth()+1)).slice(-2), da=('0'+d2.getDate()).slice(-2); return y+'-'+mo+'-'+da; } }catch(_){ } return s; }
  function noimg(e){
    if(!e||!e.target) return; var img=e.target; img.onerror=null;
    var fallback=ctx()+'/images/noimg.png';
    var svg='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360"><rect width="100%" height="100%" fill="#f8f9fa"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="16" fill="#adb5bd">no image</text></svg>');
    img.src=fallback; setTimeout(function(){ if(!img.complete || !img.naturalWidth) img.src=svg; },0);
  }
  function debounce(fn, wait){ var t; return function(){ var c=this, a=arguments; clearTimeout(t); t=setTimeout(function(){ fn.apply(c,a); }, wait||250); }; }

  w.App={ ctx:ctx, qs:qs, go:go, post:post, ajaxPost:ajaxPost, popup:popup, digits:digits, lock:lock, esc:esc, fmtPrice:fmtPrice, fmtDate:fmtDate, noimg:noimg, debounce:debounce };
})(window, document, window.jQuery);
