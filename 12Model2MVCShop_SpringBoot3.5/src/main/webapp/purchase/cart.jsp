<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>장바구니</title>
<link rel="icon" href="${ctx}/images/favicon.ico"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config = {
  theme: { extend: { colors: { naver:'#03c75a','naver-dark':'#00a74a','naver-gray':'#f7f9fa' } } }
}
</script>
<link rel="stylesheet" href="${ctx}/css/cart.css"/>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script defer src="${ctx}/javascript/cart.js"></script>
</head>
<body data-ctx="${ctx}">
<main class="max-w-5xl mx-auto p-4" data-page="cart">
  <h1 class="text-2xl font-bold mb-4">장바구니</h1>

  <div class="overflow-x-auto bg-white border rounded-2xl shadow">
    <table class="min-w-full text-sm">
      <thead class="bg-naver-gray">
        <tr class="text-left">
          <th class="p-3">상품</th>
          <th class="p-3">단가</th>
          <th class="p-3">수량</th>
          <th class="p-3">금액</th>
          <th class="p-3">작업</th>
        </tr>
      </thead>
      <tbody id="cartBody">
        <c:forEach var="c" items="${cartList}">
          <tr class="border-t" data-cartid="${c.cartId}" data-prodno="${c.prodNo}" data-unitprice="${c.product != null ? c.product.price : 0}">
            <td class="p-3">
              <div class="font-medium">
                <c:choose>
                  <c:when test="${c.product != null}">${c.product.prodName}</c:when>
                  <c:otherwise>상품번호 ${c.prodNo}</c:otherwise>
                </c:choose>
              </div>
            </td>
            <td class="p-3"><fmt:formatNumber value="${c.product != null ? c.product.price : 0}" type="number"/> 원</td>
            <td class="p-3">
              <div class="inline-flex items-center border rounded-xl overflow-hidden">
                <button type="button" class="px-3 py-1 btn-dec">-</button>
                <input type="number" class="w-16 text-center qty" min="1" value="${c.qty}"/>
                <button type="button" class="px-3 py-1 btn-inc">+</button>
              </div>
            </td>
            <td class="p-3 amount"></td>
            <td class="p-3 space-x-2">
              <button type="button" class="px-4 py-2 rounded-xl bg-naver text-white btn-buy">구매하기</button>
              <button type="button" class="px-4 py-2 rounded-xl bg-gray-200 btn-del">삭제</button>
            </td>
          </tr>
        </c:forEach>
        <c:if test="${empty cartList}">
          <tr><td class="p-6 text-center text-gray-500" colspan="5">장바구니가 비었습니다.</td></tr>
        </c:if>
      </tbody>
      <tfoot class="bg-naver-gray">
        <tr>
          <td class="p-3 font-semibold" colspan="3">합계</td>
          <td class="p-3 font-bold text-lg" id="sumCell">0 원</td>
          <td class="p-3">
            <button type="button" class="px-5 py-3 rounded-2xl bg-gray-900 text-white" id="btnRefresh">새로고침</button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</main>
</body>
</html>
