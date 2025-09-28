<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>최근 본 상품</title>
  <!-- 공통 CSS만 사용 -->
  <link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css"/>
  <!-- jQuery & 공용 JS -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/recentProduct.js"></script>
</head>

<body data-ctx="${ctx}">
  <h2 class="recent-title">최근 본 상품</h2>
  <c:if test="${empty sessionScope.recentList}">
    <p class="no-data">최근 본 상품이 없습니다.</p>
  </c:if>
  <c:if test="${not empty sessionScope.recentList}">
    <ul class="recent-list" aria-label="최근 본 상품 목록">
      <c:forEach var="prod" items="${sessionScope.recentList}">
        <li class="recent-list-item">
          <span class="recent-item"
                role="link"
                tabindex="0"
                data-prodno="${prod.prodNo}"
                data-filename="${prod.fileName}">
            ${prod.prodName}
          </span>
        </li>
      </c:forEach>
    </ul>
  </c:if>
  <!-- Hover 미리보기 오버레이 -->
  <div id="preview-box" aria-hidden="true">
    <img id="preview-img" src="" alt="상품 이미지 미리보기"/>
  </div>
</body>
</html>
