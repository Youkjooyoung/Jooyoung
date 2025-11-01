<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>구매 내역</title>
<link rel="icon" href="${ctx}/images/favicon.ico"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config={theme:{extend:{colors:{naver:'#03c75a','naver-dark':'#00a74a','naver-gray':'#f7f9fa'}}}}
</script>
<link rel="stylesheet" href="${ctx}/css/purchase-list.css"/>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script defer src="${ctx}/javascript/listPurchase.js"></script>
</head>
<body data-ctx="${ctx}">
<main class="max-w-6xl mx-auto p-4" data-page="purchase-list">
  <h1 class="text-2xl font-bold mb-4">구매 내역</h1>

  <div class="overflow-x-auto bg-white border rounded-2xl shadow">
    <table class="min-w-full text-sm">
      <thead class="bg-naver-gray">
        <tr class="text-left">
          <th class="p-3">주문번호</th>
          <th class="p-3">상품명</th>
          <th class="p-3">수량</th>
          <th class="p-3">총 금액</th>
          <th class="p-3">주문일자</th>
          <th class="p-3">상태</th>
          <th class="p-3">작업</th>
        </tr>
      </thead>
      <tbody id="purchBody">
        <c:forEach var="p" items="${list}">
          <tr class="border-t" data-tranno="${p.tranNo}" data-prodno="${p.purchaseProd.prodNo}">
            <td class="p-3">${p.tranNo}</td>
            <td class="p-3"><span class="purchase-link">${p.purchaseProd.prodName}</span></td>
            <td class="p-3"><fmt:formatNumber value="${p.qty}" type="number"/> 개</td>
            <td class="p-3">
              <c:choose>
                <c:when test="${p.paymentAmount ne 0}">
                  <fmt:formatNumber value="${p.paymentAmount}" type="number"/> 원
                </c:when>
                <c:otherwise>
                  <fmt:formatNumber value="${p.purchaseProd.price * (p.qty == 0 ? 1 : p.qty)}" type="number"/> 원
                </c:otherwise>
              </c:choose>
            </td>
            <td class="p-3"><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></td>
            <td class="p-3">
              <c:choose>
                <c:when test="${p.tranCode == '001'}">주문완료</c:when>
                <c:when test="${p.tranCode == '002'}">물품수령대기</c:when>
                <c:when test="${p.tranCode == '003'}">배송완료</c:when>
                <c:when test="${p.tranCode == '004'}">취소요청</c:when>
                <c:when test="${p.tranCode == '005'}">취소완료</c:when>
                <c:otherwise>-</c:otherwise>
              </c:choose>
            </td>
            <td class="p-3 space-x-2">
              <button type="button" class="px-4 py-2 rounded-xl bg-gray-900 text-white btn-detail">상세</button>
              <c:if test="${p.tranCode == '002'}">
                <button type="button" class="px-4 py-2 rounded-xl bg-naver text-white btn-confirm">수령확인</button>
              </c:if>
              <c:if test="${p.tranCode == '001'}">
                <button type="button" class="px-4 py-2 rounded-xl bg-gray-200 btn-cancel">취소</button>
              </c:if>
            </td>
          </tr>
        </c:forEach>
        <c:if test="${empty list}">
          <tr><td class="p-6 text-center text-gray-500" colspan="7">구매 내역이 없습니다.</td></tr>
        </c:if>
      </tbody>
    </table>
  </div>
</main>
</body>
</html>
