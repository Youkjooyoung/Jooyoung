(function(w, d, $){
  'use strict'; if(!$) return;

  function isEmail(s){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
  function isPhone(s){ return /^\d{2,3}-\d{3,4}-\d{4}$/.test(s); }

  function autoHyphenPhone(val){
    val = val.replace(/[^0-9]/g, '');
    if(val.length < 4) return val;
    if(val.length < 7) return val.replace(/(\d{3})(\d+)/, '$1-$2');
    if(val.length < 11) return val.replace(/(\d{3})(\d{3,4})(\d+)/, '$1-$2-$3');
    return val.replace(/(\d{3})(\d{4})(\d{4}).*/, '$1-$2-$3');
  }

  $(function(){
    var CTX = $('body').data('ctx') || '';

    // 전화번호 자동 하이픈
    $('#phone').on('input', function(){
      this.value = autoHyphenPhone(this.value);
    });

    // 주소검색 버튼
    $('#btnAddr').on('click', function(){
      new daum.Postcode({
        oncomplete: function(data) {
          var addr = '';
          if (data.roadAddress) {
            addr = data.roadAddress;
          } else if (data.jibunAddress) {
            addr = data.jibunAddress;
          }

          var extra = '';
          if (data.bname && /[동|로|가]$/g.test(data.bname)) {
            extra += data.bname;
          }
          if (data.buildingName && data.apartment === 'Y') {
            extra += (extra ? ', ' + data.buildingName : data.buildingName);
          }
          if (extra) {
            addr += ' ('+extra+')';
          }

          $('#zipcode').val(data.zonecode);
          $('#addr').val(addr);
          $('#addrDetail').val('').focus();
        }
      }).open();
    });

    // 저장 버튼
    $('#btnSave').on('click', function(){
		var data = {
		  userName   : $('#userName').val().trim(),
		  email      : $('#email').val().trim(),
		  phone      : $('#phone').val().trim(),
		  zipcode    : $('#zipcode').val().trim(),
		  addr       : $('#addr').val().trim(),
		  addrDetail : $('#addrDetail').val().trim()
		};

      if(!data.userName){ alert('이름을 입력하세요.'); return; }
      if(!data.email || !isEmail(data.email)){ alert('이메일을 올바르게 입력하세요.'); return; }
      if(!data.phone || !isPhone(data.phone)){ alert('전화번호를 올바르게 입력하세요.'); return; }
      if(!$('#addr').val() || !$('#addrDetail').val()){ alert('주소를 입력하세요.'); return; }

      $('#btnSave').prop('disabled', true);

      $.ajax({
        url: CTX + '/user/json/completeProfile',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data)
      }).done(function(res){
        if(res && res.success){
          alert('저장되었습니다.');
          window.top.location.href = CTX + '/index.jsp';
        } else {
          alert(res && res.message ? res.message : '저장에 실패했습니다.');
        }
      }).fail(function(xhr){
        if(xhr.status === 401){
          alert('세션이 만료되었습니다. 다시 로그인하세요.');
          location.href = CTX + '/user/loginView.jsp';
          return;
        }
        alert('통신 오류가 발생했습니다. (' + xhr.status + ')');
      }).always(function(){
        $('#btnSave').prop('disabled', false);
      });
    });

    $('#btnCancel').on('click', function(){ history.back(); });
  });

})(window, document, window.jQuery);
