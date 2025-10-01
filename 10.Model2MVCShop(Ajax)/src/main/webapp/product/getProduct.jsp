<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 상세</title>
  <!-- 공통 CSS -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <!-- 공통 JS -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js" defer></script>
  <script src="${ctx}/javascript/app-core.js" defer></script>
  <script src="${ctx}/javascript/getProduct.js" defer></script>
</head>
<body data-ctx="${ctx}" data-role="${sessionScope.user.role}">
<div class="container">

  <!-- 제목 -->
  <div class="page-title">
    <h2>상품 상세</h2>
  </div>

  <!-- 상세 정보 테이블 -->
  <table class="form-table">
    <tr>
      <th>상품번호</th>
      <td>${product.prodNo}</td>
    </tr>
    <tr>
      <th>상품명</th>
      <td>${product.prodName}</td>
    </tr>
    <tr>
      <th>가격</th>
      <td><fmt:formatNumber value="${product.price}" type="number"/> 원</td>
    </tr>
    <tr>
      <th>상세내용</th>
      <td><c:out value="${product.prodDetail}" escapeXml="false"/></td>
    </tr>
    <tr>
      <th>제조일자</th>
      <td>${product.formattedManuDate}</td>
    </tr>
    <tr>
      <th>등록일자</th>
      <td>${product.regDate}</td>
    </tr>
    <tr>
      <th>조회수</th>
      <td>${product.viewCount}</td>
    </tr>
    <tr>
      <th>상품 이미지</th>
      <td>
        <div class="img-grid">
          <c:forEach var="img" items="${productImages}">
            <div class="img-box">
              <img src="${ctx}/upload/${img.fileName}" alt="${product.prodName}" class="img-existing"/>
            </div>
          </c:forEach>
        </div>
      </td>
    </tr>
  </table>

  <!-- 상태/구매 버튼 -->
  <div class="status-area mt-16">
    <c:choose>
      <c:when test="${latestCode == '001' || latestCode == '002' || latestCode == '003'}">
        <p class="text-red">품절된 상품입니다.</p>
      </c:when>
      <c:when test="${latestCode == '004'}">
        <p class="text-red">취소 대기중인 상품입니다.</p>
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
    <div class="btn-area">
      <button type="button" class="btn-green btn-edit" data-prodno="${product.prodNo}">상품수정</button>
      <c:if test="${empty latestCode}">
        <button type="button" class="btn-gray btn-delete" data-prodno="${product.prodNo}">상품삭제</button>
      </c:if>
    </div>
  </c:if>

</div>
</body>
</html>
