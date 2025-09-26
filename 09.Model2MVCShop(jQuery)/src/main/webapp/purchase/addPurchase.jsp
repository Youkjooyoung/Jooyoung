<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 등록</title>
  <link rel="stylesheet" href="${ctx}/css/admin.css"/>
</head>
<body>

<div style="width:98%; margin-left:10px;">
  <h2 class="ct_ttl01">구매 등록</h2>

  <!-- ✅ form에는 name만 -->
  <form name="purchaseForm">
    <input type="hidden" name="purchaseProd.prodNo" value="${empty p ? param.prodNo : p.prodNo}" />

    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-top:10px;">
      <tr><td class="ct_list_b" width="150">상품번호</td><td class="ct_list_pop">${empty p ? param.prodNo : p.prodNo}</td></tr>
      <tr><td class="ct_list_b">상품명</td><td class="ct_list_pop"><c:out value="${empty p ? param.prodName : p.prodName}"/></td></tr>
      <tr><td class="ct_list_b">상세내용</td><td class="ct_list_pop"><c:out value="${empty p ? param.prodDetail : p.prodDetail}"/></td></tr>
      <tr><td class="ct_list_b">등록일자</td><td class="ct_list_pop"><c:out value="${empty p ? param.regDate : p.regDate}"/></td></tr>
      <tr><td class="ct_list_b">가격</td><td class="ct_list_pop"><fmt:formatNumber value="${p.price}" type="number"/> 원</td></tr>
      <tr><td class="ct_list_b">제조일자</td><td class="ct_list_pop"><c:out value="${empty p ? param.manuDate : p.manuDate}"/></td></tr>
    </table>

    <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-top:10px;">
      <tr><td class="ct_list_b" width="150">구매자 ID</td><td class="ct_list_pop">${sessionScope.user.userId}</td></tr>
      <tr>
        <td class="ct_list_b">결제수단</td>
        <td class="ct_list_pop">
          <select name="paymentOption" class="ct_input_g" required>
            <option value="">-- 선택 --</option>
            <option value="CAR">카드</option>
            <option value="CAS">현금</option>
          </select>
        </td>
      </tr>
      <tr><td class="ct_list_b">수령인</td><td class="ct_list_pop"><input type="text" name="receiverName" required/></td></tr>
      <tr><td class="ct_list_b">연락처</td><td class="ct_list_pop"><input type="tel" name="receiverPhone" placeholder="01012345678" required/></td></tr>
      <tr><td class="ct_list_b">배송주소</td><td class="ct_list_pop"><input type="text" name="divyAddr"/></td></tr>
      <tr><td class="ct_list_b">희망배송일</td><td class="ct_list_pop"><input type="date" name="divyDate" required/></td></tr>
      <tr><td class="ct_list_b">요청사항</td><td class="ct_list_pop"><textarea name="divyRequest" rows="4"></textarea></td></tr>
    </table>

    <div style="margin-top:12px; text-align:right;">
      <input type="button" value="주문 등록" class="ct_btn01" id="btnSubmit"/>
      <input type="button" value="취소" class="ct_btn01" id="btnCancel"/>
    </div>
  </form>
</div>

<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="${ctx}/javascript/addPurchase.js"></script>
</body>
</html>
