(function(w, d, $){
  'use strict';
  if(!$) return;

  $(function(){
    var $id = $('#emailId'),
        $domain = $('#emailDomain'),
        $custom = $('#emailCustom'),
        $hidden = $('#email');

    // ===== 이메일 업데이트 =====
    function updateEmail(){
      var id = $id.val().trim();
      var dom = $domain.val();
      if(dom === '직접입력' || dom === ''){
        dom = $custom.val().trim();
      }
      var email = (id && dom) ? (id + '@' + dom) : '';
      $hidden.val(email);
    }

    // ===== 도메인 변경 시 동작 =====
    $domain.on('change', function(){
      if($(this).val() === '직접입력'){
        $custom.addClass('show').val('').focus();
      } else {
        $custom.removeClass('show').val('');
      }
      updateEmail();
    });

    // ===== 입력 이벤트 =====
    $id.on('input', updateEmail);
    $custom.on('input', updateEmail);

    // ===== 페이지 로드 시 기존 이메일 복원 =====
    var initEmail = $hidden.val();
    if(initEmail && initEmail.indexOf('@') > -1){
      var parts = initEmail.split('@');
      $id.val(parts[0]);
      var domain = parts[1];
      var found = false;
      $domain.find('option').each(function(){
        if($(this).val() === domain){
          $domain.val(domain);
          found = true;
        }
      });
      if(!found){
        $domain.val('직접입력');
        $custom.addClass('show').val(domain);
      }
    }

	if($domain.val() === '직접입력'){
	      $custom.addClass('show').focus();
	    }
		
    updateEmail();
  });
})(window, document, jQuery);
