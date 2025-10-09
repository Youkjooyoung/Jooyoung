/* /javascript/addPurchase.js */
(function ($, w, d) {
  'use strict';
  if (!$) return;

  // -------------------- 공통 유틸 --------------------
  function ensureMark($input) {
    if (!$input.siblings('.vmark').length) $('<span class="vmark" aria-hidden="true"/>').insertAfter($input);
  }
  function setMark($input, ok) {
    ensureMark($input);
    var $m = $input.siblings('.vmark');
    if (ok) $m.removeClass('err').addClass('ok').show();
    else $m.removeClass('ok').addClass('err').show();
  }
  function showErr($el, msg) {
    var $msg = $el.closest('td').find('.error-msg');
    if (!$msg.length) $msg = $('<span class="error-msg"/>').appendTo($el.closest('td'));
    $msg.text(msg).removeClass('hidden');
    $el.addClass('input-error');
  }
  function hideErr($el) {
    var $msg = $el.closest('td').find('.error-msg');
    $msg.addClass('hidden');
    $el.removeClass('input-error');
  }
  function isPhone(v) { return /^01[016789]-\d{3,4}-\d{4}$/.test(v); }
  function autoHyphenPhone(val) {
    val = val.replace(/[^0-9]/g, '');
    if (val.length < 4) return val;
    if (val.length < 8) return val.replace(/(\d{3})(\d+)/, '$1-$2');
    return val.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
  }

  $(function () {
    var ctx = $('body').data('ctx') || '';
    var $form = $('form[name=purchaseForm]');
    var $modal = $('#confirmModal');
    var isPostcodeLoaded = false;
	
	
	//총 가격 계산
	(function initTotalPrice() {
	  // ① 단가 읽기 (data-unit-price는 "232300" 또는 "232,300" 모두 허용)
	  var unit = Number(String($form.data('unit-price') || '0').replace(/[^\d]/g, '')) || 0;

	  // ② DOM 캐시
	  var $qty   = $('#qty');
	  var $total = $('#totalPrice');

	  // ③ 포맷 + 계산
	  function fmt(n){ return Number(n).toLocaleString('ko-KR'); }
	  function update() {
	    var q = parseInt($qty.val() || '1', 10);
	    if (isNaN(q) || q < 1) q = 1;
	    $total.text(fmt(unit * q) + ' 원');
	  }

	  // ④ 초기 1회 + 실시간 반영
	  update();
	  $qty.on('input change', update);
	})();

    // -------------------- 날짜 제한(오늘 이전 불가) --------------------
    var $date = $form.find('[name=divyDate]');
    if ($date.length) {
      var t = new Date(); t.setHours(0,0,0,0);
      var y=t.getFullYear(), m=('0'+(t.getMonth()+1)).slice(-2), dd=('0'+t.getDate()).slice(-2);
      $date.attr('min', y+'-'+m+'-'+dd);
    }

    // -------------------- 내정보 자동입력 --------------------
    $(d).on('click', '#btnSameInfo', function () {
      $.getJSON(ctx + '/user/json/me', function (res) {
        if (res && res.loggedIn) {
          $('[name=receiverName]').val(res.userName || '');
          $('[name=receiverPhone]').val(res.phone || '');
          $('#zipcode').val(res.zipcode || '');
          $('#divyAddr').val(res.addr || '');
          $('#addrDetail').val(res.addrDetail || '');
        } else {
          alert('로그인 정보가 없습니다.');
        }
      }).fail(function(){ alert('사용자 정보를 불러오지 못했습니다.'); });
    });

    // -------------------- 다음 주소검색 --------------------
    $(d).on('click', '#btnAddr', function () {
      function openPostcode() {
        try {
          new w.daum.Postcode({
            oncomplete: function (data) {
              $('#zipcode').val(data.zonecode);
              $('#divyAddr').val(data.roadAddress || data.jibunAddress);
              $('#addrDetail').val('').focus();
              validateAddr();
            }
          }).open();
        } catch(e) {
          w.open('https://postcode.map.daum.net/search', 'postcode', 'width=500,height=600,scrollbars=yes,resizable=yes');
        }
      }
      if (isPostcodeLoaded) return openPostcode();
      $.getScript('https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js')
        .done(function(){ isPostcodeLoaded = true; openPostcode(); })
        .fail(function(){ alert('우편번호 API 로드 실패: 도메인 등록 필요'); });
    });

    // -------------------- 폰 자동하이픈 + 검증 --------------------
    $(d).on('input', '[name=receiverPhone]', function () {
      this.value = autoHyphenPhone(this.value);
      validatePhone();
    });

    // -------------------- 필드별 검증 --------------------
    function validateName() {
      var $el = $('[name=receiverName]'); var v = ($el.val()||'').trim();
      var ok = v.length >= 2;
      if (!ok) showErr($el, '수령인을 입력하세요.');
      else hideErr($el);
      setMark($el, ok); return ok;
    }
    function validatePhone() {
      var $el = $('[name=receiverPhone]'); var v = ($el.val()||'').trim();
      var ok = isPhone(v);
      if (!ok) showErr($el, '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
      else hideErr($el);
      setMark($el, ok); return ok;
    }
    function validateAddr() {
      var $zip = $('#zipcode'), $addr = $('#divyAddr');
      var ok = !!$zip.val().trim() && !!$addr.val().trim();
      if (!ok) showErr($addr, '우편번호와 기본주소를 입력하세요.');
      else hideErr($addr);
      setMark($addr, ok); return ok;
    }
    function validateDate() {
      var $el = $('[name=divyDate]'); var ok = !!$el.val();
      if (!ok) showErr($el, '배송일자를 선택하세요.');
      else hideErr($el);
      setMark($el, ok); return ok;
    }
    function validateForm() {
      // bit 연산으로 모두 수행
      var ok = validateName() & validatePhone() & validateAddr() & validateDate();
      return !!ok;
    }
    $(d).on('blur input change', 'input, textarea, select', function () {
      var n = $(this).attr('name');
      switch(n){
        case 'receiverName': validateName(); break;
        case 'receiverPhone': validatePhone(); break;
        case 'zipcode': case 'divyAddr': case 'addrDetail': validateAddr(); break;
        case 'divyDate': validateDate(); break;
      }
    });

    // -------------------- 주문등록 → 확인 모달 --------------------
    $(d).on('click', '[data-role=submit]', function (e) {
      e.preventDefault();
      if (!validateForm()) { alert('입력값을 확인해주세요.'); return; }
      $modal.css('display','flex').hide().fadeIn(120);
    });
    $(d).on('click', '[data-role=close]', function(){ $modal.fadeOut(100); });
    $modal.on('click', function(e){ if (e.target === this) $modal.fadeOut(100); });

    // 확인 → 실제 제출 (컨트롤러 매핑: /purchase/add POST)
    $(d).on('click', '[data-role=confirm]', function (e) {
      e.preventDefault();
      $(this).prop('disabled', true);
      d.purchaseForm.action = ctx + '/purchase/add';
      d.purchaseForm.method = 'post';
      d.purchaseForm.submit();
    });

    // 취소 → 상품 목록
	$(document).on('click', '[data-role=cancel]', function (e) {
	  e.preventDefault();
	  var prodNo = $('[name="purchaseProd\\.prodNo"]').val();   // hidden 값 사용
	  window.location.href = (ctx || '') + '/product/getProduct?prodNo=' + encodeURIComponent(prodNo);
	});

    // -------------------- 이미지: 더보기/접기 + 라이트박스 --------------------
    (function initImages(){
      var $grid = $('#imgGrid');
      var $btnMore = $('#btnImgMore');
      var $items = $grid.find('.img-box img');
      if (!$items.length) return;

      function recheckMore(){
        // 그리드 실제 내용 높이가 표시 높이보다 크면 더보기 표시
        var needed = $grid[0].scrollHeight > $grid.outerHeight() + 4;
        $btnMore.toggle(needed);
      }
      recheckMore();
      $(w).on('resize', function(){ setTimeout(recheckMore, 50); });

      $btnMore.on('click', function(){
        var exp = $grid.toggleClass('is-expanded').hasClass('is-expanded');
        $(this).text(exp ? '접기' : '이미지 더보기');
      });

      // 라이트박스
      var $lb = $('#imgLightbox'), $lbImg = $('#lbImg'), cur = 0;
      function openLB(i){ cur=i; $lbImg.attr('src', $($items[cur]).attr('src')); $lb.css('display','flex').hide().fadeIn(120); }
      function closeLB(){ $lb.fadeOut(100); }
      function move(n){ if(!$items.length) return; cur=(cur+n+$items.length)%$items.length; $lbImg.attr('src', $($items[cur]).attr('src')); }

      $(d).on('click', '.img-box img', function(){ openLB($items.index(this)); });
      $(d).on('click', '[data-role=lb-close]', closeLB);
      $(d).on('click', '[data-role=lb-prev]', function(){ move(-1); });
      $(d).on('click', '[data-role=lb-next]', function(){ move(1); });
      $lb.on('click', function(e){ if (e.target === this) closeLB(); });
    })();
  });
})(jQuery, window, document);
