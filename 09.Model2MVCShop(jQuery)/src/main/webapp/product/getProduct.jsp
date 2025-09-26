<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<html>
<head>
<title>상품 상세</title>
<link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
<link rel="stylesheet" href="${ctx}/css/ProductDetail.css" type="text/css">
<script src="${ctx}/javascript/productDetail.js"></script>
</head>
<body>
<div class="container">

	<!-- 제목 -->
	<div class="title-bar">
		<img src="${ctx}/images/ct_ttl_img01.gif" />
		<span class="title-text">상품 상세</span>
		<img src="${ctx}/images/ct_ttl_img03.gif" />
	</div>

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
					    <img src="${ctx}/upload/${img.fileName}" alt="${product.prodName}" width="300" height="300"/>
					  </div>
				</c:forEach>
	  </div>
    </td>
  </tr>
</table>

	<!-- 상태/구매 버튼 -->
	<div class="status-area">
		<c:choose>
			<c:when test="${not empty latestCode}">
				<p class="sold-out">해당상품은 품절된 상태입니다.</p>
			</c:when>
			<c:otherwise>
				<c:if test="${!(sessionScope.user != null && sessionScope.user.role == 'admin')}">
					<form action="${ctx}/purchase/add" method="get" class="inline-form">
						<input type="hidden" name="prodNo" value="${product.prodNo}" />
						<button type="submit" class="ct_btn01">구매하기</button>
					</form>
				</c:if>
			</c:otherwise>
		</c:choose>
	</div>

	<!-- 관리자 기능 -->
	<c:if test="${sessionScope.user != null && sessionScope.user.role == 'admin'}">
		<div class="admin-area">
			<form action="${ctx}/product/updateProduct" method="get" class="inline-form">
				<input type="hidden" name="prodNo" value="${product.prodNo}" />
				<button type="submit" class="ct_btn01">상품수정</button>
			</form>

			<c:if test="${empty latestCode}">
				<form action="${ctx}/product/deleteProduct" method="post" class="inline-form delete-form">
					<input type="hidden" name="prodNo" value="${product.prodNo}" />
					<button type="submit" class="ct_btn01 delete-btn">상품삭제</button>
				</form>
			</c:if>
		</div>
	</c:if>

</div>
</body>
</html>
