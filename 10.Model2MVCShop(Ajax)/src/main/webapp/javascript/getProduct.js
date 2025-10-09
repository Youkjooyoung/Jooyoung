// /javascript/getProduct.js  ← 전체 교체
(function(w, d, $){
  'use strict'; if(!$) return;

  $(function(){
    var CTX  = $('body').data('ctx') || '';
    var $info = $('.product-info-area');
    var $wrap = $('#nvRotor');

    // ===== 경로 상수 (환경에 맞게 딱 한 번만 바꾸면 됨) =====
    var EDIT_VIEW_PATH   = '/product/updateProduct';                // 관리자 수정 화면(GET)
    var MANAGE_LIST_PATH = '/product/listProduct?menu=manage';// 관리자 목록(리다이렉트 목적지)

    // ===== 토스트 유틸 =====
    function toast(msg){
      var $t = $('<div/>', {
        text: msg,
        css:{
          position:'fixed', left:'50%', bottom:'24px', transform:'translateX(-50%)',
          background:'#333', color:'#fff', padding:'10px 14px', borderRadius:'8px',
          fontSize:'14px', zIndex:99999, boxShadow:'0 2px 8px rgba(0,0,0,.25)', opacity:0
        }
      }).appendTo('body').animate({opacity:1},120);
      setTimeout(function(){ $t.animate({opacity:0},180,function(){ $t.remove(); }); },1400);
    }

    // ===== 상품번호 =====
    var params = new URLSearchParams(w.location.search);
    var prodNo = params.get('prodNo');
    if(!prodNo){
      $info.html('<p class="text-red">상품번호가 누락되었습니다.</p>');
      return;
    }

    // ===== 상품정보 로드 =====
    $.ajax({
      url: CTX + '/api/products/' + prodNo,
      method: 'GET', dataType: 'json'
    }).done(function(p){
      if(!p || !p.prodNo){
        $info.html('<p class="text-red">상품 정보를 불러오지 못했습니다.</p>');
        return;
      }

      // 정보 바인딩
      $('.prod-name').text(p.prodName || '');
      $('.prod-price').text(Number(p.price||0).toLocaleString('ko-KR') + '원');
      $('.prod-desc').html(p.prodDetail || '');
      $('.prod-meta').html(
        '<li><strong>상품번호</strong> '+p.prodNo+'</li>'+
        '<li><strong>제조일자</strong> '+(p.manuDate||'')+'</li>'+
        '<li><strong>등록일자</strong> '+(p.regDate ? new Date(p.regDate).toLocaleDateString('ko-KR') : '')+'</li>'+
        '<li><strong>조회수</strong> '+(p.viewCount||0)+'</li>'
      );
      $('.prod-status').html(
        (Number(p.stockQty||0)===0)
          ? '<span class="badge badge-red">품절</span>'
          : '<span class="badge badge-green">재고 '+(p.stockQty||0)+'개</span>'
      );

      // 이미지 로드
      $.ajax({
        url: CTX + '/api/products/' + prodNo + '/images',
        method: 'GET', dataType: 'json'
      }).done(function(imgs){
        buildRotor(p, imgs || []);
      }).fail(function(){
        buildRotor(p, []);
      });
    }).fail(function(xhr){
      $info.html('<p class="text-red">데이터 요청 오류 ('+xhr.status+')</p>');
    });

    // ===== Rotor Slider (포지션+z-index 회전) =====
    function buildRotor(p, images){
      var list = images.slice(0, 5).map(function(it){ return it.fileName; });
      var need = 5 - list.length;
      while(need-- > 0){ list.push(list.length ? list[list.length-1] : 'noimage.png'); }

      var html = ''
        + '<div class="slider">'
        + '  <ul>'
        + '    <li class="item item1"><img class="thumb" alt=""/><p class="txt"></p></li>'
        + '    <li class="item item2"><img class="thumb" alt=""/><p class="txt"></p></li>'
        + '    <li class="item item3"><img class="thumb" alt=""/><p class="txt"></p></li>'
        + '    <li class="item item4"><img class="thumb" alt=""/><p class="txt"></p></li>'
        + '    <li class="item item5"><img class="thumb" alt=""/><p class="txt"></p></li>'
        + '  </ul>'
        + '</div>'
        + '<div class="nv-rotor-ctrl" role="group" aria-label="이미지 슬라이더 제어">'
        + '  <button type="button" class="btn-rotor p">이전</button>'
        + '  <button type="button" class="btn-rotor n">다음</button>'
        + '</div>';
      $wrap.html(html);

      $wrap.find('.item').each(function(i, el){
        var fileName = list[i] || 'noimage.png';
        var src = CTX + '/images/uploadFiles/' + encodeURIComponent(fileName);
        $(el).find('img.thumb').attr({ src: src, alt: (p.prodName||'')+' 이미지 '+(i+1) });
        $(el).find('.txt').text((p.prodName||'') + ' ('+(i+1)+')');
      });

      var pt = [], $item = $wrap.find('.item');
      var maxZindex = Math.max.apply(null, $item.map(function(){ return +($(this).css('z-index'))||0; }).get());

      function eachItem(fn){ $item.each(function(i,e){ fn(i,e); }); }
      function setZindex(e,fn){ if((+$(e).css('z-index')||0)===maxZindex){ fn(e); } }

      function snapshot(){
        pt = [];
        eachItem(function(i,e){
          var $e = $(e), o = {};
          o.top = $e.position().top;
          o.left = $e.position().left;
          o.height = $e.outerHeight();
          o['z-index'] = $e.css('z-index');
          pt[i] = o;
        });
      }
      function applyAll(){
        eachItem(function(i,e){
          $(e).css(pt[i]);
          setZindex(e, function(e2){ $(e2).find('.txt').css({display:'block', bottom:0}); });
        });
      }
      function animateAll(){
        eachItem(function(i,e){
          $(e).css('z-index', pt[i]['z-index'])
              .stop(true,true)
              .animate({ top:pt[i].top, left:pt[i].left, height:pt[i].height }, 200, function(){
                $(e).find('.txt').css({display:'none', bottom:-40});
                setZindex(e, function(e2){
                  $(e2).find('.txt').css('display','block').stop(true,true).animate({bottom:0},100);
                });
              });
        });
      }

      snapshot();
      pt.push(pt.shift()); pt.push(pt.shift());
      applyAll();

      $wrap.find('.p').on('click', function(){ pt.push(pt.shift());  animateAll(); });
      $wrap.find('.n').on('click', function(){ pt.unshift(pt.pop());  animateAll(); });
    }

    // ===== 버튼 동작 =====

    // [사용자] 구매하기: 뷰 컨트롤러로 이동 (/purchase/add?prodNo=...)
    $(d).on('click', '.btn-purchase', function(){
      var to = '/purchase/add';
      var q  = { prodNo: prodNo };
      if (w.App && typeof w.App.go === 'function') {
        w.App.go(to, q);
      } else {
        location.href = CTX + to + '?prodNo=' + encodeURIComponent(prodNo);
      }
    });

    // [사용자] 장바구니: 아직 미구현
    $(d).on('click', '.btn-addcart', function(){
      toast('장바구니 담기는 준비중입니다.');
    });

    // [관리자] 상품수정: 수정 화면으로 이동
    $(d).on('click', '.btn-edit', function(){
      var to = EDIT_VIEW_PATH;
      var q  = { prodNo: prodNo };
      if (w.App && typeof w.App.go === 'function') {
        w.App.go(to, q);
      } else {
        location.href = CTX + to + '?prodNo=' + encodeURIComponent(prodNo);
      }
    });

    // [관리자] 상품삭제: REST 삭제 후 목록으로 이동
    var deleteBusy = false;
    $(d).on('click', '.btn-delete', function(){
      if (deleteBusy) return;
      if (!w.confirm('정말로 이 상품을 삭제하시겠습니까? 삭제 후 복구할 수 없습니다.')) {
        return;
      }
      deleteBusy = true;

      $.ajax({
        url: CTX + '/api/products/' + encodeURIComponent(prodNo),
        method: 'DELETE',
        dataType: 'json'
      }).done(function(res){
        toast('상품이 삭제되었습니다.');
        setTimeout(function(){
          if (w.App && typeof w.App.go === 'function') {
            w.App.go(MANAGE_LIST_PATH);
          } else {
            location.href = CTX + MANAGE_LIST_PATH;
          }
        }, 450);
      }).fail(function(xhr){
        var msg = (xhr.responseJSON && xhr.responseJSON.message) ? xhr.responseJSON.message : ('삭제 실패: ' + xhr.status);
        toast(msg);
      }).always(function(){
        deleteBusy = false;
      });
    });

  });
})(window, document, window.jQuery);
