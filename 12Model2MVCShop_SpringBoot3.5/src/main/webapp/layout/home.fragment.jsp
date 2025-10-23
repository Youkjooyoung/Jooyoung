<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<section class="right-stage p-6 bg-white rounded-nv shadow-nv"
	data-page="home" data-view="home" data-ctx="${ctx}">
	<div class="container home-main">
		<div class="page-title mb-4">
			<h2 class="text-2xl font-extrabold text-naver-green">추천 상품</h2>
		</div>
		<div
			class="product-slider grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
			<!-- Ajax로 상품 카드가 동적 로드됩니다 -->
		</div>
	</div>
</section>