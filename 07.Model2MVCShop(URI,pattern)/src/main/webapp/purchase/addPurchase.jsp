<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
  <c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>구매 등록</title>
  <link rel="stylesheet" href="${ctx}/css/purchase-common.css"/>

</head>
<body>
<header>
  <h1>구매 등록</h1>
  <nav>
    <a href="<c:url value='/listPurchase'/>">구매목록</a>
  </nav>
</header>

<main>
  <!-- Controller에서 product(선택상품) 또는 prodNo를 전달한다고 가정 -->
  <form action="<c:url value='/purchase/addPurchase'/>" method="post">
  <input type="hidden" name="purchaseProd.prodNo" value="${empty p ? param.prodNo : p.prodNo}" />
    <fieldset>
      <legend>주문 상품</legend>
      <label>상품번호
        <input type="text" name="prodNo" value="${empty p ? param.prodNo : p.prodNo}" required readonly="readonly"  />
      </label>
      <div>
        <strong>상품명 :</strong>
        <c:out value="${empty p ? param.prodName : p.prodName}"/>
      </div>  
      <div>
        <strong>상품상세내용 :</strong>
        <c:out value="${empty p ? param.prodDetail : p.prodDetail}"/>
      </div>
      <div>
      
         <div>
        <strong>등록일자 :</strong>
        <c:out value="${empty p ? param.regDate : p.regDate}"/>
      </div>
      
      
        <strong>가격 :</strong>
        <c:choose>
          <c:when test="${not empty p.price}"><fmt:formatNumber value="${p.price}" type="number" groupingUsed="true"/></c:when>
          <c:otherwise>-</c:otherwise>
        </c:choose> 원
      </div>
      
         <div>
        <strong>제조일자 :</strong>
        <c:out value="${empty p ? param.manuDate : p.manuDate}"/>
      </div>
      
    </fieldset>

    <fieldset>
      <legend>구매자 정보</legend>
      <label>구매자 ID
        <input type="text" name="buyer.userId" value="${sessionScope.user.userId}" readonly="readonly"/>
      </label>
      <label>결제수단
        <select name="paymentOption" required>
          <option value="">-- 선택 --</option>
	          <option value="CAR" ${param.paymentOption=='CAR' ? 'selected' : ''}>카드</option>
			  <option value="CAS" ${param.paymentOption=='CAS' ? 'selected' : ''}>현금</option>
        </select>
      </label>
    </fieldset>

    <fieldset>
      <legend>수령인/배송</legend>
      <label>수령인
        <input type="text" name="receiverName" value="${param.receiverName}" required />
      </label>
      <label>연락처
        <input type="tel" name="receiverPhone" value="${param.receiverPhone}" placeholder="01012345678" required />
      </label>
      <label>배송 주소
        <input type="text" name="divyAddr" class="input" />
      </label>
      <label>희망 배송일
	  <input type="date" name="divyDate" value="${param.divyDate}" required />
	</label>
      <label>요청사항
       <textarea name="divyRequest" rows="4">${fn:escapeXml(param.divyRequest)}</textarea>
      </label>
    </fieldset>

    <div>
      <button type="submit">주문 등록</button>
      <a href="<c:url value='/product/listProduct'/>">취소</a>
    </div>
  </form>
</main>
</body>
</html>
