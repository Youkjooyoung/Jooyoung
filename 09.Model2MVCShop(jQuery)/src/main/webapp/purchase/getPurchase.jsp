<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 상세</title>
  <link rel="stylesheet" href="${ctx}/css/admin.css"/>
</head>
<body data-ctx="${ctx}">
<div style="width:98%; margin-left:10px;">

  <c:if test="${not empty msg}">
    <div class="alert-box">${msg}</div>
  </c:if>

  <!-- 제목 영역 -->
  <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
      <td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
        <span class="ct_ttl01">구매 상세</span>
      </td>
      <td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
    </tr>
  </table>

  <!-- 상세 정보 -->
  <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-top:10px;">
    <tr><td class="ct_list_b" width="150">주문번호</td><td class="ct_list_pop">${purchase.tranNo}</td></tr>
    <tr><td class="ct_list_b">상품번호</td><td class="ct_list_pop">${purchase.purchaseProd.prodNo}</td></tr>
    <tr><td class="ct_list_b">상품명</td><td class="ct_list_pop">${purchase.purchaseProd.prodName}</td></tr>
    <tr><td class="ct_list_b">가격</td><td class="ct_list_pop"><fmt:formatNumber value="${purchase.purchaseProd.price}" type="number"/> 원</td></tr>
    <tr><td class="ct_list_b">구매자</td><td class="ct_list_pop">${purchase.buyer.userId}</td></tr>
    <tr><td class="ct_list_b">결제수단</td><td class="ct_list_pop">${purchase.paymentOption}</td></tr>
    <tr>
      <td class="ct_list_b">주문상태</td>
      <td class="ct_list_pop">
        <c:choose>
          <c:when test="${purchase.tranCode == '001'}">주문완료</c:when>
          <c:when test="${purchase.tranCode == '002'}">배송중</c:when>
          <c:when test="${purchase.tranCode == '003'}">배송완료</c:when>
          <c:when test="${purchase.tranCode == '004'}"><span style="color:red;">취소됨</span></c:when>
        </c:choose>
      </td>
    </tr>
    <tr><td class="ct_list_b">주문일</td><td class="ct_list_pop"><fmt:formatDate value="${purchase.orderDate}" pattern="yyyy-MM-dd"/></td></tr>
    <tr><td class="ct_list_b">배송일</td><td class="ct_list_pop">${purchase.divyDate}</td></tr>
    <tr><td class="ct_list_b">수령인</td><td class="ct_list_pop">${purchase.receiverName}</td></tr>
    <tr><td class="ct_list_b">연락처</td><td class="ct_list_pop">${purchase.formattedReceiverPhone}</td></tr>
    <tr><td class="ct_list_b">배송주소</td><td class="ct_list_pop">${purchase.divyAddr}</td></tr>
    <tr><td class="ct_list_b">요청사항</td><td class="ct_list_pop"><c:out value="${purchase.divyRequest != null ? purchase.divyRequest : '요청사항이 없습니다.'}"/></td></tr>
  </table>

  <!-- 버튼 영역 -->
  <div style="margin-top:10px; text-align:right;">
    <c:if test="${purchase.tranCode == '001'}">
      <button type="button" class="ct_btn01" id="btnEdit" data-tranno="${purchase.tranNo}">수정</button>
      <button type="button" class="ct_btn01" id="btnCancel" data-tranno="${purchase.tranNo}">구매취소</button>
    </c:if>

    <c:if test="${purchase.tranCode == '002'}">
      <button type="button" class="ct_btn01" id="btnConfirm" 
              data-tranno="${purchase.tranNo}" data-prodno="${purchase.purchaseProd.prodNo}">
        물품수령
      </button>
    </c:if>

    <c:if test="${purchase.tranCode == '003'}"><span style="color:green;">구매가 완료되었습니다.</span></c:if>
    <c:if test="${purchase.tranCode == '004'}"><span style="color:red;">해당 주문은 취소되었습니다.</span></c:if>
  </div>

</div>

<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="${ctx}/javascript/getPurchase.js"></script>
<script src="${ctx}/javascript/app-core.js"></script>
</body>
</html>
