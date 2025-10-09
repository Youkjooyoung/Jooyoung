<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>상품 상세</title>

  <!-- 공통 -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>

  <!-- 페이지 전용(로터 슬라이더) -->
  <link rel="stylesheet" href="${ctx}/css/getProduct.css"/>

  <!-- jQuery 3.6.1 -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" defer></script>

  <!-- 네비 유틸(폼 제출 X, method/action 미사용) -->
  <script>
    window.App = window.App || {
      ctx: function(){ return '${ctx}'; },
      go: function(path, q){
        var url = '${ctx}'+path;
        if(q){
          var sp = new URLSearchParams(q);
          url += (url.indexOf('?')>-1 ? '&' : '?') + sp.toString();
        }
        location.href = url;
      }
    };
  </script>

  <!-- 페이지 전용 JS -->
  <script src="${ctx}/javascript/getProduct.js" defer></script>
</head>

<body class="product-detail-page" data-ctx="${ctx}" data-prodno="${param.prodNo}">
  <div class="container product-detail-wrap">
    <div class="product-detail-card">
      <!-- 좌측: 로터 슬라이더 컨테이너 -->
      <section class="product-image-area">
        <div id="nvRotor" class="nv-rotor-slider"><!-- JS가 채움 --></div>
      </section>

      <!-- 우측: 상품 정보 -->
      <section class="product-info-area">
        <h2 class="prod-name"></h2>
        <p class="prod-price"></p>
        <div class="prod-status"></div>
        <div class="prod-desc mt-10"></div>
        <ul class="prod-meta mt-12"></ul>

        <div class="btn-area mt-20">
			  <c:choose>
			    <c:when test="${sessionScope.user != null && sessionScope.user.userId eq 'admin'}">
			      <button type="button" class="btn-green btn-edit">상품수정</button>
			      <button type="button" class="btn-gray  btn-delete">상품삭제</button>
			    </c:when>
			    <c:otherwise>
			      <button type="button" class="btn-green btn-purchase">구매하기</button>
			      <button type="button" class="btn-gray  btn-addcart">장바구니 담기</button>
			    </c:otherwise>
			  </c:choose>
		</div>
      </section>
    </div>
  </div>
</body>
</html>
