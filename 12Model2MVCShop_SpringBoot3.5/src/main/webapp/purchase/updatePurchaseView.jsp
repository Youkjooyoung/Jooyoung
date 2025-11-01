<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 수정</title>
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/updatePurchase.js"></script>
  <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container">
  <div class="page-title"><h2>구매 수정</h2></div>

  <div class="form-wrapper">
    <c:set var="t" value="${requestScope.purchase}"/>
    <c:choose>
      <c:when test="${empty t}">
        <p class="msg-error">수정할 주문 정보가 없습니다.</p>
      </c:when>
      <c:otherwise>
        <form name="purchaseForm">
          <input type="hidden" name="tranNo" value="${t.tranNo}"/>

          <table class="form-table">
            <tr><th>주문상태</th><td>${t.tranCode}</td></tr>
            <tr><th>지불방식</th><td><input type="text" name="paymentOption" value="${t.paymentOption}" class="input-text" readonly/></td></tr>
            <tr><th>배송희망일</th><td><input type="date" name="divyDate" value="${t.divyDate}" class="input-text"/></td></tr>
            <tr><th>수령인</th><td><input type="text" name="receiverName" value="${fn:escapeXml(t.receiverName)}" class="input-text" required/></td></tr>
            <tr><th>연락처</th><td><input type="tel" name="receiverPhone" value="${fn:escapeXml(t.receiverPhone)}" class="input-text" required/></td></tr>
            <tr>
              <th>배송주소</th>
              <td>
                <input type="text" id="zipcode" name="zipcode" value="${purchase.zipcode}" readonly class="input-text" style="width:120px;"/>
                <button type="button" id="btnAddr" class="btn-gray">주소검색</button><br/>
                <input type="text" id="divyAddr" name="divyAddr" value="${purchase.divyAddr}" readonly class="input-text" style="width:80%; margin-top:5px;" required/><br/>
                <input type="text" id="addrDetail" name="addrDetail" value="${purchase.addrDetail}" class="input-text" style="width:80%; margin-top:5px;" required/>
              </td>
            </tr>
            <tr><th>요청사항</th><td><textarea name="divyRequest" rows="5" class="input-text"><c:out value="${t.divyRequest}"/></textarea></td></tr>
          </table>

          <div class="btn-area">
            <button type="button" class="btn-green" id="btnUpdate">수정완료</button>
            <button type="button" class="btn-gray" id="btnCancel">취소</button>
          </div>
        </form>
      </c:otherwise>
    </c:choose>
  </div>
</div>
</body>
</html>
