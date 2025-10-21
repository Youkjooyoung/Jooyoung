<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>장바구니</title>
<link rel="stylesheet" href="${ctx}/css/naver-common.css" />
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="${ctx}/javascript/cart.js"></script>
</head>

<body class="nv-container" data-ctx="${ctx}">
	<div class="nv-panel" data-page="cart">
		<div class="panel-hd">
			<h2>장바구니</h2>
		</div>

		<c:choose>
			<c:when test="${empty cartList}">
				<div class="empty-box">장바구니에 담긴 상품이 없습니다.</div>
			</c:when>
			<c:otherwise>
				<form id="cartForm">
					<table class="list-table nv-table nv-cart-table">
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
								<tr class="row-item" data-cartid="${c.cartId}"
									data-prodno="${c.product.prodNo}"
									data-price="${c.product.price}">
									<td><img src="${ctx}/upload/${c.product.fileName}"
										alt="${c.product.prodName}" class="cart-thumb" /></td>
									<td class="prod-name">${c.product.prodName}</td>
									<td class="price">${c.product.price}원</td>
									<td><select class="qty-select">
											<c:forEach var="i" begin="1" end="10">
												<option value="${i}"
													<c:if test="${i == c.qty}">selected</c:if>>${i}</option>
											</c:forEach>
									</select></td>
									<td class="subtotal">${c.product.price * c.qty}원</td>
									<td><button type="button" class="btn-nv-outline btn-del"
											aria-label="삭제">삭제</button></td>
								</tr>
							</c:forEach>
						</tbody>
						<tfoot>
							<tr>
								<td colspan="4" class="text-right">총 결제금액</td>
								<td id="totalPrice" class="total-price">0원</td>
								<td></td>
							</tr>
						</tfoot>
					</table>
				</form>

				<div class="btn-area text-right mt-20">
					<button id="btnOrder" type="button" class="btn-green btn-lg">상품
						구매</button>
				</div>
			</c:otherwise>
		</c:choose>
	</div>

	<div id="dlgConfirm" class="dlg-mask hidden">
		<div class="dlg dlg-sm">
			<div class="dlg-hd">확인</div>
			<div class="dlg-bd">선택한 상품을 삭제하시겠습니까?</div>
			<div class="dlg-ft">
				<button id="btnConfirmYes" class="btn-green">확인</button>
				<button id="btnConfirmNo" class="btn-gray">취소</button>
			</div>
		</div>
	</div>
</body>
</html>
