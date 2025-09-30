// /javascript/updatePurchase.js
(function (w, d, $) {
  'use strict'; if (!$) return;

  function val(id){ return $.trim($(id).val() || ''); }
  function focusErr($el, msg){
    alert(msg);
    $el.focus();
    return false;
  }
  function normalizePhone(s){
    var digits = (s || '').replace(/[^\d]/g, '');
    if (digits.length === 11)
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (digits.length === 10)
      return digits.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    return digits.replace(/(\d{3,4})(\d{4})/, '$1-$2');
  }
  function isFutureOrToday(yyyy_mm_dd){
    if (!yyyy_mm_dd) return true;
    var t = new Date(), today = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    var p = yyyy_mm_dd.split('-');
    if (p.length !== 3) return false;
    var dt = new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10));
    return !isNaN(dt.getTime()) && dt >= today;
  }

  // 입력 중 전화번호 정리
  $(d).on('input', '#receiverPhone', function(){
    var cur = $(this).val();
    var norm = normalizePhone(cur);
    if (cur !== norm) $(this).val(norm);
  });

  $(function () {
    var ctx = (w.App && typeof w.App.ctx === 'function') ? w.App.ctx() : ($('body').data('ctx') || '');

    // 저장
    $(d).on('click', '#btnUpdate', function (e) {
      e.preventDefault();

      var $form = $('form[name="purchaseForm"]');
      if (!$form.length) { alert('구매 폼이 없습니다.'); return; }

      // === 1) 값 수집 ===
      var $tranNo  = $('#tranNo');
      var $pay     = $('#paymentOption');
      var $divy    = $('#divyDate');
      var $name    = $('#receiverName');
      var $phone   = $('#receiverPhone');
      var $addr    = $('#divyAddr');
      var $req     = $('#divyRequest');

      var tranNo   = val('#tranNo');
      var pay      = val('#paymentOption');
      var divy     = val('#divyDate');
      var name     = val('#receiverName');
      var phone    = normalizePhone(val('#receiverPhone'));
      var addr     = val('#divyAddr');
      var req      = val('#divyRequest');

      // === 2) 검증 ===
      if (!tranNo) return focusErr($tranNo, '거래번호가 없습니다.');
      if (!name)   return focusErr($name, '수령인을 입력하세요.');
      if (!phone)  return focusErr($phone, '연락처를 입력하세요.');
      if (!/^\d{2,3}-?\d{3,4}-?\d{4}$/.test(phone)) return focusErr($phone, '연락처 형식이 올바르지 않습니다. 예) 010-1234-5678');
      if (!addr)   return focusErr($addr, '배송주소를 입력하세요.');
      if (req.length > 200) return focusErr($req, '요청사항은 200자 이내로 입력하세요.');
      if (!isFutureOrToday(divy)) return focusErr($divy, '배송희망일은 오늘 또는 이후 날짜여야 합니다.');

      $phone.val(phone);

      var form = $form[0];
      form.action = ctx + '/purchase/update';
      form.method = 'post';
      form.submit();
    });

    // 취소
    $(d).on('click', '#btnCancel', function (e) {
      e.preventDefault();
      var tranNo = val('#tranNo');
      if (tranNo) {
        if (w.App && typeof w.App.go === 'function') w.App.go('/purchase/' + encodeURIComponent(tranNo));
        else w.location.href = ctx + '/purchase/' + encodeURIComponent(tranNo);
      } else {
        history.back();
      }
    });
  });
})(window, document, window.jQuery);
