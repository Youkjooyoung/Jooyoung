(function($, w, d) {
  'use strict'; 
  if (!$) return;

  $(function() {
    var ctx = App.ctx();

    // 주문 버튼 클릭 → 모달 띄우기
    $('#btnSubmit').on('click', function(e) {
      e.preventDefault();
      $('#confirmModal').show();
    });

    // 모달 내 확인 버튼 → 주문 전송
    $('#btnConfirm').on('click', function(e) {
      e.preventDefault();
      var form = d.purchaseForm;
      form.action = ctx + '/purchase/add';
      form.method = 'post';
      form.submit();
    });

    // 모달 내 취소 버튼 → 닫기
    $('#btnClose').on('click', function(e) {
      e.preventDefault();
      $('#confirmModal').hide();
    });

    // 기존 취소 버튼 (상품목록으로 이동)
    $('#btnCancel').on('click', function(e) {
      e.preventDefault();
      App.go('/product/listProduct');
    });
  });
})(jQuery, window, document);
