/* addProduct.js (교체본) */
(function (w, d, $) {
  'use strict';
  if (!$) return;

  var editor = null;

  // ============ 공통 유틸 ============
  function fmt2(n){ return (n<10?'0':'')+n; }
  function ymdStr(y,m,d){ return y+'-'+fmt2(m)+'-'+fmt2(d); }
  function parseInput(v){ // YYYY-MM-DD or YYYYMMDD -> Date|null
    var t=String(v||'').replace(/[^0-9]/g,'');
    if(t.length!==8) return null;
    var y=+t.substr(0,4), m=+t.substr(4,2)-1, d=+t.substr(6,2);
    var dt=new Date(y,m,d);
    return (dt.getFullYear()===y && dt.getMonth()===m && dt.getDate()===d) ? dt : null;
  }
  function setDateToFields($input, iso){
    $input.val(iso);
    $('#manuDateHidden').val(iso.replace(/-/g,''));
  }
  function closePicker(){
    $('.nv-datepicker').remove();
    $('.nv-dp-mask').remove();
    $(d).off('keydown.nvdp');
  }

  // ============ 커스텀 DatePicker ============
  function buildGrid(baseDate, selISO){
    var y=baseDate.getFullYear(), m=baseDate.getMonth();
    var first=new Date(y,m,1), start=new Date(y,m,1-(first.getDay())); // 일요일 시작
    var dn=['일','월','화','수','목','금','토'];
    var html='<div class="nv-dp-grid">';
    for(var i=0;i<7;i++) html+='<div class="nv-dp-cell is-dow">'+dn[i]+'</div>';
    var today=new Date(), tISO=ymdStr(today.getFullYear(), today.getMonth()+1, today.getDate());
    for(var r=0;r<6;r++){
      for(var c=0;c<7;c++){
        var cur=new Date(start.getFullYear(), start.getMonth(), start.getDate()+r*7+c);
        var iso=ymdStr(cur.getFullYear(), cur.getMonth()+1, cur.getDate());
        var cls='nv-dp-cell'
          +(cur.getMonth()!==m?' is-muted':'')
          +(iso===tISO?' is-today':'')
          +(iso===selISO?' is-sel':'');
        html+='<div class="'+cls+'" data-iso="'+iso+'" role="button" tabindex="0">'+cur.getDate()+'</div>';
      }
    }
    html+='</div>';
    return html;
  }

  function openPickerFor($input){
    if(!$input || !$input.length) return;
    closePicker();

    var selISO = $input.val();
    var base = parseInput(selISO) || new Date();

    var $mask = $('<div class="nv-dp-mask"></div>').appendTo('body');
    var $dp   = $('<div class="nv-datepicker" role="dialog" aria-label="날짜 선택"></div>').appendTo('body');

    var $hd   = $('<div class="nv-dp-hd"></div>');
    var $nav  = $('<div class="nv-dp-nav"></div>');
    var $ttl  = $('<div class="nv-dp-title"></div>');
    var $prev = $('<button type="button" class="nv-dp-btn" aria-label="이전 달">&lt;</button>');
    var $next = $('<button type="button" class="nv-dp-btn" aria-label="다음 달">&gt;</button>');
    var $today= $('<button type="button" class="nv-dp-btn" aria-label="오늘">오늘</button>');
    $nav.append($prev,$today,$next); $hd.append($nav,$ttl); $dp.append($hd);

    function render(){
      $ttl.text(base.getFullYear()+'년 '+(base.getMonth()+1)+'월');
      $dp.find('.nv-dp-grid').remove();
      $dp.append(buildGrid(base, selISO));
    }

    // 안전한 위치 계산 (offset() 미사용)
    var el = $input[0];
    var rect = el.getBoundingClientRect();
    var left = rect.left + (w.pageXOffset || d.documentElement.scrollLeft || 0);
    var top  = rect.bottom + (w.pageYOffset || d.documentElement.scrollTop || 0) + 6;
    $dp.css({ left:left, top:top });

    // 이벤트
    $prev.on('click', function(){ base=new Date(base.getFullYear(), base.getMonth()-1, 1); render(); });
    $next.on('click', function(){ base=new Date(base.getFullYear(), base.getMonth()+1, 1); render(); });
    $today.on('click',function(){ var t=new Date(); base=new Date(t.getFullYear(), t.getMonth(), 1); render(); });

    $dp.on('click', '.nv-dp-cell:not(.is-dow)', function(){
      selISO = $(this).data('iso');
      setDateToFields($input, selISO);
      closePicker();
    });

    $mask.on('click', closePicker);
    $(d).on('keydown.nvdp', function(e){ if(e.which===27) closePicker(); });

    render();
  }

  // 포커스/버튼 클릭 시 현재 인풋 기준으로 오픈
  $(d).on('focus', '#manuDate', function(){ openPickerFor($(this)); });
  $(d).on('click', '.nv-cal-btn', function(){
    // 버튼 → 같은 래퍼 안의 인풋을 찾음
    var $wrap = $(this).closest('.nv-date-wrap');
    openPickerFor($wrap.find('#manuDate'));
  });

  // 수동 입력 동기화
  $(d).on('change blur', '#manuDate', function(){
    var $inp=$(this);
    var dt=parseInput($inp.val());
    if(dt){
      var iso=ymdStr(dt.getFullYear(), dt.getMonth()+1, dt.getDate());
      setDateToFields($inp, iso);
    }
  });

  // ============ 가격 포맷 ============
  $(d).off('keyup.price').on('keyup.price', 'input[name="price"]', function () {
    var raw = this.value.replace(/,/g,'').replace(/[^\d]/g,'');
    this.value = raw ? Number(raw).toLocaleString('ko-KR') : '';
  });

  // ============ 에디터 초기화 & 제출 ============
  $(function(){
    // Toast UI Editor 안전 초기화
    if (w.toastui && $('#editor').length) {
      try {
        editor = new toastui.Editor({
          el: d.querySelector('#editor'),
          height: '300px',
          initialEditType: 'wysiwyg',
          previewStyle: 'vertical',
          placeholder: '상품 상세내용을 입력하세요.'
        });
      } catch(e) {
        console.error('Toast UI Editor init error:', e);
      }
    } else {
      console.error('Toast UI Editor not loaded or #editor missing');
    }

    var $f = $('form[name="detailForm"]');

    // 등록
    $(d).on('click', '#btnAdd', function(e){
      e.preventDefault();

      var $name  = $f.find('[name="prodName"]');
      var $price = $f.find('[name="price"]');
      var uiDate = $('#manuDate').val();
      var detailHtml = editor && editor.getHTML ? editor.getHTML() : '';

      // 검증
      if (!$.trim($name.val())) { alert('상품명을 입력하세요.'); $name.focus(); return; }
      if (!detailHtml || detailHtml.trim()==='') { alert('상품상세를 입력하세요.'); if(editor){ editor.focus(); } return; }
      if (!uiDate) { alert('제조일자를 선택하세요.'); $('#manuDate').focus(); return; }
      var rawPrice = $price.val().replace(/,/g,'');
      if (!rawPrice) { alert('가격을 입력하세요.'); $price.focus(); return; }
      if (parseInt(rawPrice,10) <= 0) { alert('가격은 0보다 커야 합니다.'); $price.focus(); return; }

      if (!confirm('상품을 등록하시겠습니까?')) return;

      // 값 세팅
      $('#prodDetail').val(detailHtml);
      $('#manuDateHidden').val(uiDate.replace(/-/g,''));

      // 제출 (form에 method/action 없음 규칙 준수 → 여기서만 설정)
      var action = (w.App && App.ctx) ? (App.ctx() + '/product/addProduct') : '/product/addProduct';
      $f.attr({ method:'post', enctype:'multipart/form-data', action: action });
      $f[0].submit();
    });

    // 취소
    $(d).on('click', '#btnCancel', function(e){ e.preventDefault(); history.back(); });
  });

})(window, document, window.jQuery);
