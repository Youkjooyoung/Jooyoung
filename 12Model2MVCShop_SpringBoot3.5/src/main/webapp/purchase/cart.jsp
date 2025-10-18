<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>내 장바구니</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" />
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/cart.js"></script>
</head>

<body class="nv-container" data-ctx="${ctx}">
  <div class="container nv-cart" data-page="cart">
    <div class="page-title">
      <h2>🛒 장바구니</h2>
    </div>

    <div class="cart-wrapper">
      <c:choose>
        <c:when test="${empty cartList}">
          <div class="empty-box">장바구니에 담긴 상품이 없습니다.</div>
        </c:when>
        <c:otherwise>
          <form id="cartForm">
            <table class="list-table nv-cart-table">
              <thead>
                <tr>
                  <th>상품이미지</th>
                  <th>상품명</th>
                  <th>가격</th>
                  <th>수량</th>
                  <th>합계</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                <c:forEach var="c" items="${cartList}">
                 <tr class="row-item"	data-cartid="${c.cartId}"
															data-prodno="${c.product.prodNo}"
    														data-price="${c.product.price}">
    <td>${c.product.prodNo}</td>   <!-- ★ 여기에 일시적으로 추가 -->
    <td>${c.product.prodName}</td>
                    <td><img src="${ctx}/upload/${c.product.fileName}" alt="${c.product.prodName}" class="cart-thumb" /></td>
                    <td class="prod-name">${c.product.prodName}</td>
                    <td class="price">${c.product.price}원</td>
                    <td>
                      <select class="qty-select">
                        <c:forEach var="i" begin="1" end="10">
                          <option value="${i}" <c:if test="${i == c.qty}">selected</c:if>>${i}</option>
                        </c:forEach>
                      </select>
                    </td>
                    <td class="subtotal">${c.product.price * c.qty}원</td>
                    <td><button type="button" class="btn-nv-outline btn-del">삭제</button></td>
                  </tr>
                </c:forEach>
                <tr>
                  <td colspan="6" class="text-right total-line">
                    총 결제금액 : <span id="totalPrice" class="total-price">0원</span>
                  </td>
                </tr>
              </tbody>
            </table>

            <div class="btn-area text-right mt-20">
              <span id="btnOrder" class="btn-green btn-lg">상품 구매</span>
            </div>
          </form>
        </c:otherwise>
      </c:choose>
    </div>
  </div>

  <!-- ✅ 공통 모달 구조 -->
  <div id="dlgConfirm" class="dlg-mask hidden">
    <div class="dlg dlg-sm">
      <div class="dlg-hd">확인</div>
      <div class="dlg-bd">정말 이 상품을 장바구니에서 삭제하시겠습니까?</div>
      <div class="dlg-ft">
        <button id="btnConfirmYes" class="btn-green">확인</button>
        <button id="btnConfirmNo" class="btn-gray">취소</button>
      </div>
    </div>
  </div>
</body>
</html>
