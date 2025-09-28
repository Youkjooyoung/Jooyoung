<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<html>
<head>
<title>상품 상세</title>
<link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
<link rel="stylesheet" href="${ctx}/css/getProduct.css" type="text/css">

<script src="https://code.jquery.com/jquery-2.1.4.min.js" defer></script>
<script src="${ctx}/javascript/app-core.js" defer></script>
<script src="${ctx}/javascript/getProduct.js" defer></script>

</head>
<body data-ctx="${ctx}">
	<div class="container">
		<!-- 제목 -->
		<table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
		    <tr>
		      	<td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
				<td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
				  <span class="ct_ttl01">상품 상세</span>
				</td>
				<td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
		    </tr>
		  </table>
		<!-- 상품 기본정보 -->
		<table class="ct_box mt-10">
			<tr>
				<td class="ct_list_b" width="150">상품번호</td>
				<td class="ct_list_pop">${product.prodNo}</td>
			</tr>
			<tr>
				<td class="ct_list_b">상품명</td>
				<td class="ct_list_pop">${product.prodName}</td>
			</tr>
			<tr>
				<td class="ct_list_b">가격</td>
				<td class="ct_list_pop">${product.price}</td>
			</tr>
			<tr>
				<td class="ct_list_b">상세 설명</td>
				<td class="ct_list_pop">${product.prodDetail}</td>
			</tr>
			<tr>
				<td class="ct_list_b">제조일자</td>
				<td class="ct_list_pop">${product.formattedManuDate}</td>
			</tr>
			<tr>
				<td class="ct_list_b">등록일자</td>
				<td class="ct_list_pop">${product.regDate}</td>
			</tr>
			<tr>
				<td class="ct_list_b">조회수</td>
				<td class="ct_list_pop">${product.viewCount}</td>
			</tr>
			<tr class="product-detail-row">
				<td class="ct_list_b">상품 이미지</td>
				<td class="ct_list_pop">
					<div class="product-img-container">
						<c:forEach var="img" items="${productImages}">
							<div class="product-img-box">
								<img src="${ctx}/upload/uploadFiles/${img.fileName}"
									alt="${product.prodName}" width="300" height="300" />
							</div>
						</c:forEach>
					</div>
				</td>
			</tr>
		</table>

		<div class="status-area">
		  <c:choose>
		    <c:when test="${latestCode == '001' || latestCode == '002' || latestCode == '003'}">
		      <p class="sold-out">해당상품은 품절된 상태입니다.</p>
		    </c:when>
		    <c:when test="${latestCode == '004'}">
		      <p class="sold-out">해당상품은 취소 대기 상태입니다.</p>
		    </c:when>
		    <c:otherwise>
		      <c:if test="${!(sessionScope.user != null && sessionScope.user.role == 'admin')}">
		        <button type="button" class="ct_btn01 btn-purchase" data-prodno="${product.prodNo}">구매하기</button>
		      </c:if>
		    </c:otherwise>
		  </c:choose>
		</div>

		<c:if
			test="${sessionScope.user != null && sessionScope.user.role == 'admin'}">
			<div class="admin-area">
				<button type="button" class="ct_btn01 btn-edit"
					data-prodno="${product.prodNo}">상품수정</button>

				<c:if test="${empty latestCode}">
					<button type="button" class="ct_btn01 btn-delete"
						data-prodno="${product.prodNo}">상품삭제</button>
				</c:if>
			</div>
		</c:if>

	</div>
</body>
</html>
