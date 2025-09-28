<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"  uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 수정화면</title>
  <link rel="stylesheet" href="${ctx}/css/admin.css"/>
</head>
<body data-ctx="${ctx}">
<div style="width:98%; margin-left:10px;">

  <!-- 제목 -->
  <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
      <td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
        <span class="ct_ttl01">구매 수정</span>
      </td>
      <td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
    </tr>
  </table>

  <c:set var="t" value="${requestScope.purchase}"/>
  <c:choose>
    <c:when test="${empty t}">
      <p>수정할 주문 정보가 없습니다.</p>
    </c:when>
    <c:otherwise>
      <fmt:formatDate value="${t.divyDate}" pattern="yyyy-MM-dd" var="divyYmd"/>
      <form name="purchaseForm">
        <input type="hidden" name="tranNo" value="${t.tranNo}"/>

        <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-top:10px;">
          <tr><td class="ct_list_b" width="150">주문상태</td><td class="ct_list_pop">${t.tranCode}</td></tr>
          <tr><td class="ct_list_b">지불방식</td><td class="ct_list_pop"><input type="text"  name="paymentOption"  value="${t.paymentOption}" class="ct_input_g"/></td></tr>
          <tr><td class="ct_list_b">배송희망일</td><td class="ct_list_pop"><input type="date" name="divyDate"       value="${divyYmd}"        class="ct_input_g"/></td></tr>
          <tr><td class="ct_list_b">수령인</td><td class="ct_list_pop"><input type="text"  name="receiverName"   value="${fn:escapeXml(t.receiverName)}"  required class="ct_input_g"/></td></tr>
          <tr><td class="ct_list_b">연락처</td><td class="ct_list_pop"><input type="tel"   name="receiverPhone"  value="${fn:escapeXml(t.receiverPhone)}" required class="ct_input_g"/></td></tr>
          <tr><td class="ct_list_b">배송주소</td><td class="ct_list_pop"><input type="text" name="divyAddr"       value="${fn:escapeXml(t.divyAddr)}"      required class="ct_input_g"/></td></tr>
          <tr><td class="ct_list_b">요청사항</td><td class="ct_list_pop"><textarea name="divyRequest" rows="4" class="ct_input_g"><c:out value="${t.divyRequest}"/></textarea></td></tr>
        </table>

        <div style="margin-top:12px; text-align:right;">
          <button type="button" class="ct_btn01" id="btnUpdate" data-tranno="${t.tranNo}">수정완료</button>
          <button type="button" class="ct_btn01" id="btnCancel" data-tranno="${t.tranNo}">취소</button>
        </div>
      </form>
    </c:otherwise>
  </c:choose>
</div>

<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="${ctx}/javascript/app-core.js"></script>
<script src="${ctx}/javascript/updatePurchase.js"></script>
</body>
</html>
