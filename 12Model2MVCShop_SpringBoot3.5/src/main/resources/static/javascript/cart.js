// =========================================================
// 🛒 장바구니(cart.js)
// ver.2025-10  |  Naver Style (네이버 공통 디자인 일관)
// =========================================================
$(function () {
  const ctx = $('body').data('ctx') || '';
  const $modal = $('#dlgConfirm');
  const $yes = $('#btnConfirmYes');
  const $no = $('#btnConfirmNo');
  let targetRow = null;

  // ===== 총 결제금액 갱신 =====
  function updateTotal() {
    let total = 0;
    $('.row-item').each(function () {
      const price = parseInt($(this).data('price'));
      const qty = parseInt($(this).find('.qty-select').val());
      total += price * qty;
    });
    $('#totalPrice').text(total.toLocaleString() + '원');
  }
  updateTotal();

  // ===== 수량 변경 시 실시간 갱신 =====
  $('.qty-select').on('change', function () {
    const $row = $(this).closest('.row-item');
    const price = parseInt($row.data('price'));
    const qty = parseInt($(this).val());
    $row.find('.subtotal').text((price * qty).toLocaleString() + '원');
    updateTotal();
  });

  // ===== 삭제 클릭 → Naver confirm 모달 오픈 =====
  $('.btn-del').on('click', function () {
    targetRow = $(this).closest('.row-item');
    $modal.removeClass('hidden');
  });

  // ===== 모달 취소 =====
  $no.on('click', function () {
    $modal.addClass('hidden');
    targetRow = null;
  });

  // ===== 모달 확인 =====
  $yes.on('click', function () {
    if (targetRow) {
      targetRow.remove();
      nvToast('선택한 상품이 장바구니에서 삭제되었습니다.', 'info');
      updateTotal();
    }
    $modal.addClass('hidden');
    targetRow = null;
  });

  // =========================================================
  // 🟢 상품 구매 버튼 클릭 → 구매등록 화면 이동
  // =========================================================
  $('#btnOrder').on('click', function () {
    const $rows = $('.row-item');
    if ($rows.length === 0) {
      nvToast('장바구니가 비어 있습니다.', 'warn');
      return;
    }

    // 첫 번째 상품 기준으로 단일 구매 이동 (확장 시 다중 가능)
    const $first = $rows.first();
	const prodNo = $first.data('prodno');
	const qty = parseInt($first.find('.qty-select option:selected').val(), 10);

    // 확인 모달 띄워 사용자 동의 후 이동
    nvConfirm(
      '선택하신 상품을 구매하시겠습니까?',
      () => {
        location.href = `${ctx}/purchase/add?prodNo=${prodNo}&qty=${qty}`;
      },
      () => {
        nvToast('구매가 취소되었습니다.', 'info');
      }
    );
  });

  // =========================================================
  // 🧩 Naver UI Helper (토스트 + 확인창)
  // =========================================================

  // 네이버스타일 토스트 (짧게 사라지는 알림)
  window.nvToast = function (msg, type) {
    const colors = { info: '#03c75a', warn: '#f18f01', error: '#d63031' };
    const $t = $('<div class="nv-toast"></div>')
      .text(msg)
      .css({
        position: 'fixed',
        bottom: '40px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: colors[type] || colors.info,
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,.2)',
        fontSize: '14px',
        zIndex: 9999,
        opacity: 0,
      })
      .appendTo('body')
      .animate({ opacity: 1, bottom: '60px' }, 200)
      .delay(1500)
      .animate({ opacity: 0, bottom: '80px' }, 300, function () {
        $(this).remove();
      });
  };

  // 네이버스타일 확인 모달
  window.nvConfirm = function (msg, onYes, onNo) {
    const $wrap = $(`
      <div class="nv-confirm-mask">
        <div class="nv-confirm-box">
          <div class="nv-confirm-msg">${msg}</div>
          <div class="nv-confirm-btns">
            <button class="btn-yes">확인</button>
            <button class="btn-no">취소</button>
          </div>
        </div>
      </div>
    `);

    $wrap.find('.btn-yes').on('click', function () {
      $wrap.remove();
      if (typeof onYes === 'function') onYes();
    });

    $wrap.find('.btn-no').on('click', function () {
      $wrap.remove();
      if (typeof onNo === 'function') onNo();
    });

    $wrap.css({
      position: 'fixed',
      top: 0, left: 0,
      width: '100%', height: '100%',
      background: 'rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9998
    });
    $wrap.find('.nv-confirm-box').css({
      background: '#fff',
      borderRadius: '12px',
      padding: '25px 30px',
      textAlign: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,.2)'
    });
    $wrap.find('.nv-confirm-msg').css({
      marginBottom: '15px',
      fontSize: '15px',
      fontWeight: '500',
      color: '#333'
    });
    $wrap.find('.nv-confirm-btns button').css({
      padding: '8px 18px',
      margin: '0 6px',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer'
    });
    $wrap.find('.btn-yes').css({ background: '#03c75a', color: '#fff' });
    $wrap.find('.btn-no').css({ background: '#e4e4e4', color: '#333' });

    $('body').append($wrap);
  };
});
