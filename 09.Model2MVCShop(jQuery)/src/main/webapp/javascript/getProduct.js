(function (w, d) {
  'use strict';

  var $ = w.jQuery;
  if (!$) { console.error('[product.js] jQuery not loaded'); return; }

  w.AppNav = w.AppNav || (function () {
    var _ctx; // cache
    function ctx() {
      if (_ctx == null) { _ctx = $('body').data('ctx') || ''; }
      return _ctx;
    }
    function qs(p){ return $.param(p || {}); }
    function go(path, params){
      var url = ctx() + path + (params && Object.keys(params).length ? ('?' + qs(params)) : '');
      w.location.href = url;
    }
    function post(path, params){
      var $f = $('<form>', { method: 'post', action: ctx() + path }).css('display','none');
      $.each(params || {}, function(k, v){
        $('<input>', { type:'hidden', name:k, value:v }).appendTo($f);
      });
      $(d.body).append($f); $f.trigger('submit');
    }
    return { ctx: ctx, go: go, post: post };
  })();

  // ---- 유틸 ----
  function getProdNo(el){
    // dataset 우선, 폴백으로 jQuery .data
    return el.dataset ? el.dataset.prodno : $(el).data('prodno');
  }

  function withClickLock($btn, fn){
    if ($btn.prop('disabled')) return;
    $btn.prop('disabled', true);
    try { fn(); }
    finally { setTimeout(function(){ $btn.prop('disabled', false); }, 400); } // 짧은 락
  }

  // ---- 이벤트 바인딩 (위임) ----

  // 구매하기(일반 사용자)
  $(d).on('click', '.btn-purchase', function(){
    var prodNo = getProdNo(this);
    if (!prodNo) { console.warn('[product.js] prodNo missing on .btn-purchase'); return; }
    AppNav.go('/purchase/add', { prodNo: prodNo });
  });

  // 상품수정(관리자)
  $(d).on('click', '.btn-edit', function(){
    var prodNo = getProdNo(this);
    if (!prodNo) { console.warn('[product.js] prodNo missing on .btn-edit'); return; }
    AppNav.go('/product/updateProduct', { prodNo: prodNo });
  });

  // 상품삭제(관리자)
  $(d).on('click', '.btn-delete', function(){
    var $btn = $(this);
    var prodNo = getProdNo(this);
    if (!prodNo) { console.warn('[product.js] prodNo missing on .btn-delete'); return; }
    if (!w.confirm('정말 삭제하시겠습니까?')) return;

    withClickLock($btn, function(){
      AppNav.post('/product/deleteProduct', { prodNo: prodNo });
    });
  });

})(window, document);
