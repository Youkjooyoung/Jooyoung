(function(w,$){
  'use strict'; if (!$) return;

  $(function(){
    $('.cancel-reason').each(function(){
      var $el = $(this), no = $el.data('tranno');
      var r = localStorage.getItem('cancelReason:'+no);
      $el.text(r && $.trim(r) ? r : '-');
    });
  });

  $(document).on('click','.btn-close',function(e){ e.preventDefault(); window.close(); });
})(window, window.jQuery);
