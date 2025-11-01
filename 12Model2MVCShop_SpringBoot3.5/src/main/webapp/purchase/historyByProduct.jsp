<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>주문내역 - ${prodNo}</title>
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script>
  (function($, w, d){
    'use strict';

    // ---- 네이버 스타일 모달(confirm/alert 최소구현) ----
    function buildModal(opts){
      var o = $.extend({title:'확인', message:'', okText:'확인', cancelText:'취소'}, opts||{});
      var $mask = $('<div class="dlg-mask" style="display:flex;"></div>');
      var $dlg  = $('<div class="dlg dlg-sm">\
        <div class="dlg-hd">'+o.title+'</div>\
        <div class="dlg-bd">'+o.message+'</div>\
        <div class="dlg-ft"></div>\
      </div>');
      var $ok = $('<button type="button" class="btn-green">'+o.okText+'</button>');
      var $no = o.cancelText ? $('<button type="button" class="btn-gray">'+o.cancelText+'</button>') : null;
      $dlg.find('.dlg-ft').append($ok); if($no) $dlg.find('.dlg-ft').append($no);
      $mask.append($dlg);
      return {$mask:$mask,$ok:$ok,$no:$no};
    }
    function nvConfirm(msg, title, ok, cancel){
      return new Promise(function(resolve){
        var ui = buildModal({title:title||'확인', message:msg, okText:ok||'확인', cancelText:cancel||'취소'});
        $('body').append(ui.$mask.hide()); ui.$mask.fadeIn(120);
        function done(v){ ui.$mask.fadeOut(100,function(){ui.$mask.remove();}); resolve(v); }
        ui.$ok.on('click', function(){ done(true); });
        if(ui.$no) ui.$no.on('click', function(){ done(false); });
        ui.$mask.on('click', function(e){ if(e.target===ui.$mask[0]) done(false); });
        $(d).on('keydown.nvDlg', function(e){
          if(e.key==='Escape') { $(d).off('keydown.nvDlg'); done(false); }
          if(e.key==='Enter')  { $(d).off('keydown.nvDlg'); done(true);  }
        });
      });
    }

    // ---- 상태 변경 공통 AJAX ----
    function updateStatus(tranNo, nextCode){
      return $.post('${ctx}/purchase/'+encodeURIComponent(tranNo)+'/status', {tranCode: nextCode});
    }
    function notifyParent(){
      try { if (w.parent) w.parent.postMessage({type:'status-updated'}, '*'); } catch(e){}
    }

    // 배송 시작
    $(d).on('click', '.btn-ship-start', async function(){
      var no = $(this).data('tranno'); if(!no) return;
      var ok = await nvConfirm('이 주문의 배송을 시작할까요?', '배송 시작', '배송하기', '취소');
      if(!ok) return;
      updateStatus(no, '002').done(function(){ notifyParent(); location.reload(); })
        .fail(function(x){ alert('처리 실패 : '+x.status); });
    });

    // 배송 완료
    $(d).on('click', '.btn-ship-done', async function(){
      var no = $(this).data('tranno'); if(!no) return;
      var ok = await nvConfirm('이 주문을 배송완료로 처리할까요?', '배송 완료', '완료처리', '취소');
      if(!ok) return;
      updateStatus(no, '003').done(function(){ notifyParent(); location.reload(); })
        .fail(function(x){ alert('처리 실패 : '+x.status); });
    });

    // 취소확인(기존 confirm → 네이버 Confirm으로 교체)
    $(d).on('click', '.btn-ack', async function(){
      var no = $(this).data('tranno'); if(!no) return;
      var ok = await nvConfirm('해당 주문을 취소확인 처리하시겠습니까?', '취소 확인', '확인', '취소');
      if(!ok) return;
      updateStatus(no, '005').done(function(){ notifyParent(); location.reload(); })
        .fail(function(x){ alert('취소확인 처리 실패 : '+x.status); });
    });

  })(jQuery, window, document);
  </script>
</head>

<body>
<div class="container">
  <div class="page-title"><h2>상품번호 ${prodNo} - 주문내역</h2></div>

  <div class="table-wrap">
    <table class="list-table">
      <colgroup>
        <col /><col /><col /><col /><col /><col />
      </colgroup>
      <thead>
        <tr>
          <th>거래번호</th>
          <th>상태</th>
          <th>취소사유</th>
          <th>주문일자</th>
          <th>취소일자</th>
          <th>구매자ID</th>
        </tr>
      </thead>
      <tbody>
        <c:forEach var="p" items="${list}">
          <tr>
            <td>${p.tranNo}</td>
            <td>
			  <span class="status-cell">
			    <c:choose>
			      <c:when test="${p.tranCode == '001'}">
			        주문완료
			        <button type="button" class="btn-green btn-ship-start" data-tranno="${p.tranNo}">배송하기</button>
			      </c:when>
			      <c:when test="${p.tranCode == '002'}">
			        배송중
			        <button type="button" class="btn-gray btn-ship-done" data-tranno="${p.tranNo}">배송완료</button>
			      </c:when>
			      <c:when test="${p.tranCode == '003'}">배송완료</c:when>
			      <c:when test="${p.tranCode == '004'}">
			        <span class="text-red">취소요청</span>
			        <button type="button" class="btn-green btn-ack" data-tranno="${p.tranNo}">취소확인</button>
			      </c:when>
			      <c:when test="${p.tranCode == '005'}"><span class="text-red">취소확인</span></c:when>
			      <c:otherwise>-</c:otherwise>
			    </c:choose>
			  </span>
			</td>
            <td><c:out value="${empty p.cancelReason ? '-' : p.cancelReason}"/></td>
            <td><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></td>
            <td><fmt:formatDate value="${p.cancelDate}" pattern="yyyy-MM-dd"/></td>
            <td><c:out value="${empty p.buyer ? '-' : p.buyer.userId}"/></td>
          </tr>
        </c:forEach>
        <c:if test="${empty list}">
          <tr><td colspan="6">주문내역이 없습니다.</td></tr>
        </c:if>
      </tbody>
    </table>
  </div>
</div>
</body>
</html>
