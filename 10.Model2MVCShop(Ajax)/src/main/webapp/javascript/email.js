(function(w, d, $){
  'use strict';
  if(!$) return;

  $(function(){
    var $id = $('#emailId'),
        $domain = $('#emailDomain'),
        $custom = $('#emailCustom'),
        $hidden = $('#email');

    function updateEmail(){
      var id = $id.val().trim();
      var dom = $domain.val();
      if(dom === '직접입력'){
        dom = $custom.val().trim();
      }
      if(id && dom){
        $hidden.val(id + '@' + dom);
      } else {
        $hidden.val('');
      }
    }

    $id.on('input', updateEmail);
    $domain.on('change', function(){
      if($(this).val() === '직접입력'){
        $custom.removeClass('hidden').focus();
      } else {
        $custom.addClass('hidden').val('');
      }
      updateEmail();
    });
    $custom.on('input', updateEmail);

    // 페이지 로드 시 초기화
    updateEmail();
  });
})(window, document, jQuery);
