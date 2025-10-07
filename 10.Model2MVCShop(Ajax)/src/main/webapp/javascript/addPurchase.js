(function ($, w, d) {
  'use strict';
  if (!$) return;

  $(function () {
    var ctx = $('body').data('ctx') || '';

    var $form = $('form[name=purchaseForm]');
    var $modal = $('#confirmModal');
    var $btnSubmit = $('[data-role=submit]');
    var $btnConfirm = $('[data-role=confirm]');
    var $btnClose = $('[data-role=close]');
    var $btnCancel = $('[data-role=cancel]');
    var $btnAddr = $('[data-role=addr-search]');

    // 오늘 이전 날짜 선택 불가
    var $date = $form.find('[name=divyDate]');
    if ($date.length) {
      var today = new Date(); today.setHours(0, 0, 0, 0);
      var yyyy = today.getFullYear();
      var mm = ('0' + (today.getMonth() + 1)).slice(-2);
      var dd = ('0' + today.getDate()).slice(-2);
      $date.attr('min', yyyy + '-' + mm + '-' + dd);
    }

    // 상품 정보 Ajax 로딩
    var prodNo = new URLSearchParams(location.search).get('prodNo');
    if (prodNo) {
      $.getJSON(ctx + '/api/products/' + prodNo, function (data) {
        $('#productInfo').html(
          '<tr><th>상품번호</th><td>' + (data.prodNo || '') + '</td></tr>' +
          '<tr><th>상품명</th><td>' + (data.prodName || '') + '</td></tr>' +
          '<tr><th>상세내용</th><td>' + (data.prodDetail || '') + '</td></tr>' +
          '<tr><th>등록일자</th><td>' + (data.regDate || '') + '</td></tr>' +
          '<tr><th>가격</th><td>' + (data.price ? data.price + '원' : '') + '</td></tr>' +
          '<tr><th>제조일자</th><td>' + (data.manuDate || '') + '</td></tr>'
        );

        if (data.images && data.images.length) {
          $('#productImages').html(data.images.map(function (img) {
            return '<div class="img-box"><img class="img-existing" src="' + ctx + '/upload/' + img.fileName + '" alt="' + (data.prodName || '') + '"/></div>';
          }).join(''));
        } else {
          $('#productImages').html('<p class="text-muted">등록된 이미지가 없습니다.</p>');
        }

        $form.find('[name="purchaseProd.prodNo"]').val(data.prodNo);
      });
    }

    // 주문 등록 버튼 → 모달 열기
    $btnSubmit.on('click', function () {
      $modal.fadeIn(120);
    });

    // 모달 닫기
    $btnClose.on('click', function () { $modal.fadeOut(120); });
    $modal.on('click', function (e) { if (e.target === this) $modal.fadeOut(120); });

    // 모달 확인 → submit
    $btnConfirm.on('click', function () {
      d.purchaseForm.action = ctx + '/purchase/add';
      d.purchaseForm.method = 'post';
      d.purchaseForm.submit();
    });

    // 취소 → 상품 목록
    $btnCancel.on('click', function () {
      w.location.href = ctx + '/product/listProduct';
    });

    // 주소검색
    $btnAddr.on('click', function () {
      $.getScript("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", function () {
        new w.daum.Postcode({
          oncomplete: function (data) {
            var addr = data.roadAddress || data.jibunAddress;
            if (data.bname && /[동|로|가]$/g.test(data.bname)) addr += ' ' + data.bname;
            if (data.buildingName && data.apartment === 'Y') addr += ' ' + data.buildingName;

            $('#zipcode').val(data.zonecode);
            $('#divyAddr').val(addr);
            $('#addrDetail').val('').focus();
          }
        }).open();
      });
    });
	
	// 기존 정보 자동 채우기
	$('#btnSameInfo').on('click', function () {
	  $.ajax({
	    url: ctx + '/user/json/me',
	    method: 'GET',
	    dataType: 'json',
	    success: function (user) {
	      if (user && user.loggedIn) {
	        $('[name=receiverName]').val(user.userName || '');
	        $('[name=receiverPhone]').val(user.cellPhone || '');
	        $('#zipcode').val(user.zipcode || '');
	        $('#divyAddr').val(user.addr || '');
	        $('#addrDetail').val(user.addrDetail || '');
	      } else {
	        alert('로그인 정보가 없습니다.');
	      }
	    }
	  });
	});
  });
})(jQuery, window, document);
