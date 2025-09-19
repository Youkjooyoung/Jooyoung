<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 수정</title>
  <c:set var="ctx" value="${pageContext.request.contextPath}"/>
</head>
<body>
<header>
  <h1>구매 수정</h1>
  <nav>
    <a href="<c:url value='/purchase/listPurchase'/>">목록</a>
    <c:if test="${not empty requestScope.purchase and not empty requestScope.purchase.tranNo}">
      <a href="<c:url value='/purchase/getPurchase'><c:param name='tranNo' value='${requestScope.purchase.tranNo}'/></c:url>">상세</a>
    </c:if>
  </nav>
</header>

<main>
  <c:set var="t" value="${requestScope.purchase}"/>
  <c:choose>
    <c:when test="${empty t}">
      <p>수정할 주문 정보가 없습니다.</p>
    </c:when>
    <c:otherwise>
      <form action="<c:url value='/purchase/updatePurchase'/>" method="post">
        <input type="hidden" name="tranNo" value="${t.tranNo}"/>
        
        <fieldset>
          <legend>배송/상태</legend>
          <label>주문상태
            <select name="tranCode" disabled>
              <option value="001" ${t.tranCode == '001' ? 'selected' : ''}>배송전</option>
            </select>
          </label>

         	<label>지불방식
		  			<input type="text" name="paymentOption" value="${t.paymentOption}"  />
			</label>

          <label>배송희망일
            <input type="date" name="divyDate" value="${t.divyDate}"/>
          </label>
        </fieldset>

        <fieldset>
          <legend>수령인/연락처</legend>
          <label>수령인
            <input type="text" name="receiverName" value="${fn:escapeXml(t.receiverName)}" required />
          </label>
          <label>연락처
            <input type="tel" name="receiverPhone" value="${fn:escapeXml(t.receiverPhone)}" required />
          </label>
          <label>배송주소
            <input type="text" name="divyAddr" value="${fn:escapeXml(t.divyAddr)}" required />
          </label>
          <label>요청사항
            <textarea name="divyRequest" rows="4"><c:out value="${t.divyRequest}"/></textarea>
          </label>
        </fieldset>

        <div>
          <button type="submit">수정완료</button>
          <a href="<c:url value='/purchase/getPurchase'><c:param name='tranNo' value='${t.tranNo}'/></c:url>">취소</a>
        </div>
      </form>
    </c:otherwise>
  </c:choose>
</main>
</body>
</html>
