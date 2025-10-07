<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 검색</title>
  <!-- 공통 CSS -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
<!-- jQuery는 반드시 가장 먼저 로드 -->
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<!-- 공통 유틸 -->
<script src="${ctx}/javascript/app-core.js"></script>
<!-- 통합 JS -->
<script src="${ctx}/javascript/listProduct.js"></script>
</head>
<body data-ctx="${ctx}" data-role="${sessionScope.user.role}">
<div class="container">
  <div class="page-title">
    <h2>상품 검색</h2>
  </div>

  <!-- 검색 영역 -->
  <div class="search-bar">
    <div class="search-controls">
      <input type="hidden" id="sort" value="">
      <select id="searchCondition" class="input-select">
        <option value="0">전체</option>
        <option value="prodName">상품명</option>
        <option value="prodDetail">상세설명</option>
      </select>

      <div class="ac-wrap">
        <input type="text" id="searchKeyword" class="input-text search-keyword" placeholder="검색어 입력">
        <div id="acList" class="ac-list"></div>
      </div>

      <span class="label-inline">가격 범위</span>
      <input type="number" id="minPrice" class="input-text price-input" placeholder="최소 가격">
      <span class="label-tilde">~</span>
      <input type="number" id="maxPrice" class="input-text price-input" placeholder="최대 가격">

      <button type="button" id="btnSearch" class="btn-green">검색</button>
      <button type="button" id="btnAll" class="btn-gray">전체보기</button>
    </div>

    <div class="view-switch">
      <button type="button" id="btnListView" class="btn-gray">리스트 보기</button>
      <button type="button" id="btnThumbView" class="btn-gray">썸네일 보기</button>
    </div>
  </div>

  <!-- 리스트 테이블 -->
  <div class="list-table-wrapper" id="listTableWrap">
    <table class="list-table">
      <thead>
        <tr>
          <th style="width:80px;">번호</th>
          <th style="width:200px;">상품명</th>
          <th style="width:160px;">가격
	          <span class="sort-btn" data-sort="priceAsc">▲</span>
	          <span class="sort-btn" data-sort="priceDesc">▼</span>
          </th>
          <th style="width:140px;">등록일자</th>
          <th style="width:120px;">조회수</th>
          <th style="width:120px;">상태</th>
          <th style="width:160px;">관리</th>
        </tr>
      </thead>
      <tbody id="listBody"><!-- JS로 <tr>이 append됨 --></tbody>
    </table>
  </div>

  <!-- 썸네일 그리드 -->
  <div id="gridBody" class="thumb-grid" style="display:none;"></div>

  <!-- 무한스크롤 로딩/마지막 -->
  <div id="infiniteLoader">불러오는 중...</div>
  <div id="endOfList" style="display:none;">마지막 상품입니다.</div>

  <!-- Hover 썸네일 -->
  <div id="hoverThumb"></div>
</div>

</body>
</html>
