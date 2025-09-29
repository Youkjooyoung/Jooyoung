(function (w, d, $) {
  'use strict'; if (!$) return;

  var box, img, hideT=null, ok={}, bad={}, load={};
  var BASES = ['/upload/uploadFiles/', '/upload/'];
  var NOIMG  = '/images/noimage.gif';

  function C(){ return (w.App && App.ctx ? App.ctx() : $('body').data('ctx') || ''); }
  function norm(v){ return $.trim((v||'').replace(/^['"]|['"]$/g,'')); }
  function urls(n){
    if (/^https?:\/\//.test(n)) return [n];
    n = encodeURIComponent(n); var c = C();
    return BASES.map(function(b){ return c + b + n; });
  }
  function ensure(){
    box = box && box.length ? box : $('#preview-box');
    img = img && img.length ? img : $('#preview-img');
    if (!box.length) return false;
    if (!img.length) img = $('<img id="preview-img" alt="상품 이미지 미리보기">').appendTo(box);
    if (!box.parent().is('body')) $('body').append(box);
    box.css({position:'fixed',display:'none',zIndex:99999,pointerEvents:'none',
             background:'#fff',border:'1px solid #ccc',padding:'4px',boxShadow:'0 2px 6px rgba(0,0,0,.2)'});
    img.css({maxWidth:'220px',maxHeight:'220px',display:'block'});
    return true;
  }
  function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
  function place(e){ if(!ensure()) return;
    var x = clamp(e.clientX+15,0,w.innerWidth-(box.outerWidth()||240));
    var y = clamp(e.clientY+15,0,w.innerHeight-(box.outerHeight()||240));
    box.css({left:x,top:y});
  }
  function showByFile(name,e){
    if(!ensure()||!name) return box.hide();
    name = norm(name);
    if (bad[name]) return box.hide();
    if (ok[name]) { img.attr('src', ok[name]); place(e); return box.show(); }
    var a = urls(name), i=0;
    img.off('load error').attr('src','');
    img.one('load', function(){ ok[name]=a[i]; box.show(); place(e); })
       .one('error', function(){
         if (++i < a.length) img.attr('src', a[i]);
         else if (NOIMG){ ok[name]=C()+NOIMG; img.attr('src', ok[name]); box.show(); place(e); }
         else { bad[name]=1; box.hide(); }
       });
    img.attr('src', a[0]);
  }

  $(function(){
    ensure();

    $(d).on('mouseenter','.recent-item',function(e){
      if (hideT) { clearTimeout(hideT); hideT=null; }
      ensure(); box.show(); place(e);

      var $el=$(this), fn=$el.data('filename'), no=$el.data('prodno');
      if (fn) return showByFile(fn, e);
      if (!no || load[no]) return;

      load[no]=1;
      $.getJSON(C()+'/api/products/'+encodeURIComponent(no)+'/images')
        .done(function(arr){
          var x=arr&&arr[0];
          var name = x && (x.fileName||x.imageFile||x.storedName||x.saveName||x.filename);
          if (name){ $el.data('filename', name); showByFile(name, e); } else { box.hide(); }
        })
        .always(function(){ load[no]=0; });
    })
    .on('mousemove','.recent-item', function(e){ if (hideT){ clearTimeout(hideT); hideT=null; } place(e); })
    .on('mouseleave','.recent-item', function(){ hideT=setTimeout(function(){ ensure()&&box.hide(); },150); })
    .on('click','.recent-item', function(){
      var n=$(this).data('prodno'); if (!n) return;
      if (w.App && App.go) App.go('/product/getProduct',{prodNo:n});
      else w.location.href = C()+'/product/getProduct?' + $.param({prodNo:n});
    })
    .on('keydown','.recent-item', function(e){ if (e.key==='Enter'||e.keyCode===13) $(this).click(); });
  });
})(window, document, jQuery);
