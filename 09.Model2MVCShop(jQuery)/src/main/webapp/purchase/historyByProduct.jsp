<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>주문내역 - ${prodNo}</title>
  <link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
<script>
(function(w,$){
  'use strict';
  function getCookie(k){
    var m = document.cookie.match(new RegExp('(?:^|; )'+k.replace(/([.$?*|{}()[\\]\\/+^])/g,'\\$1')+'=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  $(function(){
    $('.cancel-reason').each(function(){
      var $el=$(this), no=$el.data('tranno');
      var r=''; try{ r=localStorage.getItem('cr:'+no)||''; }catch(_){}
      if(!r) r=getCookie('cr_'+no);
      $el.text(r && $.trim(r) ? r : '-');
    });
  });
  $(document).on('click','.btn-close',function(e){ e.preventDefault(); window.close(); });
})(window, window.jQuery);
</script>
</head>
<body style="padding:10px;" data-ctx="${ctx}">
  <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
      <td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
        <span class="ct_ttl01">상품번호 ${prodNo} - 주문내역</span>
      </td>
      <td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
    </tr>
  </table>

  <table width="100%" border="0" cellspacing="0" cellpadding="6" class="ct_box" style="margin-top:10px;">
    <thead>
      <tr>
        <td class="ct_list_b">거래번호</td>
        <td class="ct_list_b">상태</td>
        <td class="ct_list_b">취소사유</td>
        <td class="ct_list_b">주문일자</td>
        <td class="ct_list_b">취소일자</td>
        <td class="ct_list_b">구매자ID</td>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="p" items="${list}">
        <tr>
          <td class="ct_list_pop">${p.tranNo}</td>
          <td class="ct_list_pop">
            <c:choose>
              <c:when test="${p.tranCode == '001'}">주문완료</c:when>
              <c:when test="${p.tranCode == '002'}">배송중</c:when>
              <c:when test="${p.tranCode == '003'}">배송완료</c:when>
              <c:when test="${p.tranCode == '004'}"><span style="color:#c00;">취소요청</span></c:when>
              <c:when test="${p.tranCode == '005'}"><span style="color:#c00;">취소확인</span></c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
          	<td class="ct_list_pop">
			  	<c:out value="${empty p.cancelReason ? '-' : p.cancelReason}"/>
			</td>
          <td class="ct_list_pop">
            <c:choose>
              <c:when test="${p.orderDate != null}">
                <fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/>
              </c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
          <td class="ct_list_pop">
            <c:choose>
              <c:when test="${p.cancelDate != null}">
                <fmt:formatDate value="${p.cancelDate}" pattern="yyyy-MM-dd"/>
              </c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
			<td class="ct_list_pop"><span class="cancel-reason" data-tranno="${p.tranNo}">-</span></td>
        </tr>
      </c:forEach>
      <c:if test="${empty list}">
        <tr><td class="ct_list_pop" colspan="5">주문내역이 없습니다.</td></tr>
      </c:if>
    </tbody>
  </table>

  	<div style="text-align:right; margin-top:10px;">
  		<button type="button" class="ct_btn01 btn-close">닫기</button>
	</div>
</body>
</html>
