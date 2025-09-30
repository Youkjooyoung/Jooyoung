<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 상세</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js" defer></script>
  <script src="${ctx}/javascript/app-core.js" defer></script>
  <script src="${ctx}/javascript/getProduct.js" defer></script>
</head>
<body data-ctx="${ctx}">
<div class="container">

  <!-- 제목 -->
  <div class="page-title">
    <h2>상품 상세</h2>
  </div>

  <!-- 상품 기본정보 -->
  <div class="detail-group">
    <div class="detail-row"><span class="detail-label">상품번호</span><span class="detail-value">${product.prodNo}</span></div>
    <div class="detail-row"><span class="detail-label">상품명</span><span class="detail-value">${product.prodName}</span></div>
    <div class="detail-row"><span class="detail-label">가격</span><span class="detail-value"><fmt:formatNumber value="${product.price}" type="number"/> 원</span></div>
    <div class="detail-row"><span class="detail-label">상세내용</span>
		  <div class="detail-value detail-html">
		    	<c:out value="${product.prodDetail}" escapeXml="false"/>
		  </div>
	</div>
    <div class="detail-row"><span class="detail-label">제조일자</span><span class="detail-value">${product.formattedManuDate}</span></div>
    <div class="detail-row"><span class="detail-label">등록일자</span><span class="detail-value">${product.regDate}</span></div>
    <div class="detail-row"><span class="detail-label">조회수</span><span class="detail-value">${product.viewCount}</span></div>

    <div class="detail-row">
      <span class="detail-label">상품 이미지</span>
      <span class="detail-value">
        <div class="product-img-container">
          <c:forEach var="img" items="${productImages}">
            <div class="product-img-box">
              <img src="${ctx}/upload/uploadFiles/${img.fileName}" 
                   alt="${product.prodName}" width="300" height="300"/>
            </div>
          </c:forEach>
        </div>
      </span>
    </div>
  </div>

  <!-- 상태 영역 -->
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
          <button type="button" class="btn-green btn-purchase" data-prodno="${product.prodNo}">구매하기</button>
        </c:if>
      </c:otherwise>
    </c:choose>
  </div>

  <!-- 관리자 전용 버튼 -->
  <c:if test="${sessionScope.user != null && sessionScope.user.role == 'admin'}">
    <div class="admin-area btn-area">
      <button type="button" class="btn-green btn-edit" data-prodno="${product.prodNo}">상품수정</button>
      <c:if test="${empty latestCode}">
        <button type="button" class="btn-gray btn-delete" data-prodno="${product.prodNo}">상품삭제</button>
      </c:if>
    </div>
  </c:if>

</div>
</body>
</html>
