/* /javascript/updatePurchase.js */
(function (w, d, $) {
  'use strict'; if (!$) return;

  function val(sel){ return $.trim($(sel).val()||''); }
  function showErr($i,msg){ var $e=$i.siblings('.error-msg'); if(!$e.length){ $e=$('<span class="error-msg"></span>').insertAfter($i); } $e.text(msg).show(); $i.addClass('is-invalid').removeClass('is-valid'); }
  function clearErr($i){ $i.siblings('.error-msg').hide(); $i.removeClass('is-invalid').addClass('is-valid'); }
  function normPhone(s){ var d=(s||'').replace(/[^\d]/g,''); if(d.length===11) return d.replace(/(\d{3})(\d{4})(\d{4})/,'$1-$2-$3'); if(d.length===10) return d.replace(/(\d{2,3})(\d{3,4})(\d{4})/,'$1-$2-$3'); return d; }
  function futureOrToday(ymd){ if(!ymd) return true; var t=new Date(); t.setHours(0,0,0,0); var p=ymd.split('-'); if(p.length!==3) return false; var dt=new Date(+p[0],+p[1]-1,+p[2]); return !isNaN(dt.getTime()) && dt>=t; }

  function validate(){
    var ok=true;
    var $name=$('[name=receiverName]'), $phone=$('[name=receiverPhone]'), $zip=$('[name=zipcode]'), $addr=$('[name=divyAddr]'), $detail=$('[name=addrDetail]'), $divy=$('[name=divyDate]'), $req=$('[name=divyRequest]');
    var name=val('[name=receiverName]'), phone=normPhone(val('[name=receiverPhone]')), zip=val('[name=zipcode]'), addr=val('[name=divyAddr]'), detail=val('[name=addrDetail]'), divy=val('[name=divyDate]'), req=val('[name=divyRequest]');

    if(!name){ showErr($name,'수령인을 입력하세요.'); ok=false; } else clearErr($name);
    if(!phone){ showErr($phone,'연락처를 입력하세요.'); ok=false; }
    else if(!/^\d{2,3}-\d{3,4}-\d{4}$/.test(phone)){ showErr($phone,'예) 010-1234-5678'); ok=false; }
    else { clearErr($phone); $phone.val(phone); }

    if(!zip){ showErr($zip,'우편번호를 선택하세요.'); ok=false; } else clearErr($zip);
    if(!addr){ showErr($addr,'기본 주소를 선택하세요.'); ok=false; } else clearErr($addr);
    if(!detail){ showErr($detail,'상세주소를 입력하세요.'); ok=false; } else clearErr($detail);
    if(req.length>200){ showErr($req,'요청사항은 200자 이내'); ok=false; } else clearErr($req);
    if(!futureOrToday(divy)){ showErr($divy,'배송희망일은 오늘 이후'); ok=false; } else clearErr($divy);

    return ok;
  }

  $(function(){
    var ctx = (w.App && App.ctx)? App.ctx() : ($('body').data('ctx')||'');

    $(d).on('blur input change','input, textarea',function(){ validate(); });

    // 수정완료
    $(d).on('click','#btnUpdate',function(e){
      e.preventDefault();
      if(!validate()) return;
      var $p=$('[name=receiverPhone]'); $p.val($p.val().replace(/-/g,''));
      var f=$('form[name=purchaseForm]')[0];
      f.action=ctx + '/purchase/update';
      f.method='post';
      f.submit();
    });

    // 취소
    $(d).on('click','#btnCancel',function(e){
      e.preventDefault();
      var no = val('[name=tranNo]');
      if(no) App.go('/purchase/'+encodeURIComponent(no));
      else history.back();
    });

    // 실시간 전화번호 포맷팅
    $(d).on('input','[name=receiverPhone]',function(){ $(this).val(normPhone($(this).val())); });

    // 주소검색
    $(d).on('click','#btnAddr',function(){
      $.getScript("https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js", function () {
        new w.daum.Postcode({
          oncomplete: function (data) {
            var addr = (data.userSelectedType==='R')? data.roadAddress : data.jibunAddress;
            var extra='';
            if(data.bname && /[동|로|가]$/g.test(data.bname)) extra+=data.bname;
            if(data.buildingName && data.apartment==='Y') extra+=(extra? ', '+data.buildingName : data.buildingName);
            if(extra) addr+=' ('+extra+')';
            $('#zipcode').val(data.zonecode);
            $('#divyAddr').val(addr);
            $('#addrDetail').val('').focus();
            validate();
          }
        }).open();
      });
    });
  });
})(window, document, window.jQuery);
