<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>상품 상세</title>
</head>

<body class="product-detail-page" data-ctx="${ctx}" data-prodno="${param.prodNo}">
  <div class="container product-detail-wrap" data-page="product-detail" data-prodno="${param.prodNo}">
    <div class="product-detail-card">

      <!-- 좌측: 이미지 -->
      <section>
        <c:set var="firstImage"
               value="${not empty productImages ? productImages[0].fileName : 'noimage.png'}"/>
        <img id="mainImg"
             class="image-main"
             src="${ctx}/images/uploadFiles/${firstImage}"
             alt="${product.prodName}"/>

        <c:if test="${not empty productImages}">
          <div class="thumbs" id="thumbList">
            <c:forEach var="img" items="${productImages}" varStatus="st">
              <img src="${ctx}/images/uploadFiles/${img.fileName}"
                   class="${st.first ? 'active' : ''}"
                   alt="${product.prodName} 썸네일 ${st.index + 1}"/>
            </c:forEach>
          </div>
        </c:if>
      </section>

      <!-- 우측: 정보 -->
      <section>
        <h2 class="prod-name">${product.prodName}</h2>
        <p class="prod-price"><fmt:formatNumber value="${product.price}" type="number"/>원</p>

        <div class="prod-status">
          <c:choose>
            <c:when test="${product.stockQty > 0}">
              <span class="badge badge-green">재고 ${product.stockQty}개</span>
            </c:when>
            <c:otherwise>
              <span class="badge badge-red">품절</span>
            </c:otherwise>
          </c:choose>
        </div>

        <div class="prod-desc">${product.prodDetail}</div>

        <ul class="prod-meta">
          <li><strong>상품번호</strong> ${product.prodNo}</li>
          <li><strong>제조일자</strong> ${product.manuDate}</li>
          <li><strong>등록일자</strong> <fmt:formatDate value="${product.regDate}" pattern="yyyy-MM-dd"/></li>
          <li><strong>조회수</strong> ${product.viewCount}</li>
        </ul>

        <div class="btn-area">
          <c:choose>
            <c:when test="${sessionScope.user != null && sessionScope.user.userId eq 'admin'}">
              <a class="btn btn-green" href="${ctx}/product/updateProduct?prodNo=${product.prodNo}">상품수정</a>
              <a class="btn btn-gray"  href="${ctx}/product/deleteProduct?prodNo=${product.prodNo}">상품삭제</a>
            </c:when>
            <c:otherwise>
              <a class="btn btn-green"
                 href="${ctx}/purchase/add?prodNo=${product.prodNo}"
                 <c:if test='${product.stockQty <= 0}'>aria-disabled="true" onclick="return false;" style="pointer-events:none;opacity:.6"</c:if>>
                구매하기
              </a>
              <a class="btn btn-gray"
                 href="${ctx}/cart/add?prodNo=${product.prodNo}"
                 <c:if test='${product.stockQty <= 0}'>aria-disabled="true" onclick="return false;" style="pointer-events:none;opacity:.6"</c:if>>
                장바구니 담기
              </a>
            </c:otherwise>
          </c:choose>
        </div>
      </section>
    </div>
  </div>

  <!-- 프래그먼트 로딩 시에도 동작하도록 본문 하단에 가벼운 스크립트 -->
  <script>
    (function(){
      var $ = window.jQuery;
      function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
      ready(function(){
        var main = document.getElementById('mainImg');
        var list = document.getElementById('thumbList');
        if(!main || !list) return;
        list.addEventListener('click', function(e){
          var t = e.target;
          if(t.tagName !== 'IMG') return;
          main.src = t.src;
          [].forEach.call(list.querySelectorAll('img'), function(img){ img.classList.remove('active'); });
          t.classList.add('active');
        });
      });
    })();
  </script>
</body>
</html>
