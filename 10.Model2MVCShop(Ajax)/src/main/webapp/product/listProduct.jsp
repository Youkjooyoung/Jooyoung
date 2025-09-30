<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 검색</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="${ctx}/javascript/listProduct.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
</head>
<body data-ctx="${ctx}">

<div class="container">

  <!-- 제목 -->
  <div class="page-title">
    <h2>상품 검색</h2>
  </div>

  <!-- 검색 영역 -->
  <form id="searchForm" class="search-box">
    <select name="searchCondition" id="searchCondition" class="input-select">
      <option value="0" ${search.searchCondition == "0" ? "selected" : ""}>전체</option>
      <option value="prodName" ${search.searchCondition == "prodName" ? "selected" : ""}>상품명</option>
      <option value="prodDetail" ${search.searchCondition == "prodDetail" ? "selected" : ""}>상세설명</option>
    </select>

    <input type="text" name="searchKeyword" id="searchKeyword"
           value="${search.searchKeyword}" class="input-text" placeholder="검색어 입력"/>

    <select name="pageSize" id="pageSize" class="input-select">
      <option value="5"  ${search.pageSize == 5 ? "selected" : ""}>5개</option>
      <option value="10" ${search.pageSize == 10 ? "selected" : ""}>10개</option>
      <option value="20" ${search.pageSize == 20 ? "selected" : ""}>20개</option>
      <option value="50" ${search.pageSize == 50 ? "selected" : ""}>50개</option>
    </select>

    <input type="hidden" id="sort" value="${param.sort}"/>
    <button type="button" id="btnSearch" class="btn-green">검색</button>
    <button type="button" id="btnAll" class="btn-gray">전체보기</button>
  </form>

  <!-- 상품 목록 -->
  <table class="list-table">
    <thead>
      <tr>
        <th>번호</th>
        <th>상품명</th>
        <th>
          가격
          <span class="sort-btn" data-sort="priceAsc">▲</span>
          <span class="sort-btn" data-sort="priceDesc">▼</span>
        </th>
        <th>등록일자</th>
        <th>조회수</th>
        <th>상태</th>
        <th>관리</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="product" items="${list}">
        <c:set var="code" value="${latestCodeMap[product.prodNo]}"/>
        <tr>
          <td>${product.prodNo}</td>
          <td>
            <span class="prod-link"
                  data-prodno="${product.prodNo}"
                  data-filename="${product.fileName}">
              ${product.prodName}
            </span>
          </td>
          <td><fmt:formatNumber value="${product.price}" type="number" groupingUsed="true"/> 원</td>
          <td>${product.manuDate}</td>
          <td>${product.viewCount}</td>
          <td>
            <c:choose>
              <c:when test="${code == '001' || code == '002' || code == '003'}">재고없음</c:when>
              <c:when test="${code == '004'}">취소대기</c:when>
              <c:otherwise>판매중</c:otherwise>
            </c:choose>
          </td>
          <td>
            <c:choose>
              <c:when test="${sessionScope.user.role == 'admin'}">-</c:when>
              <c:otherwise>
                <c:choose>
                  <c:when test="${empty code || code == '005'}">
                    <button type="button" class="btn-green btn-buy" data-prodno="${product.prodNo}">구매하기</button>
                  </c:when>
                  <c:otherwise>-</c:otherwise>
                </c:choose>
              </c:otherwise>
            </c:choose>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>

  <!-- 페이징 -->
  <div class="pagination">
    <jsp:include page="../common/pageNavigator.jsp" />
  </div>
</div>

<!-- 전역 hover 썸네일 -->
<div id="hoverThumb" style="display:none; position:absolute; border:1px solid #ccc; background:#fff; padding:5px; z-index:999;"></div>
</body>
</html>
