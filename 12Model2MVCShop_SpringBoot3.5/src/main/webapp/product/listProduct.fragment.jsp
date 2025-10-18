<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<section class="container" data-page="product-search" data-ctx="${ctx}" data-role="${sessionScope.user.role}">
  <div class="page-title"><h2>상품 검색</h2></div>

  <!-- 검색 바 (네이버 톤 + 가격 슬라이더) -->
  <div class="search-bar nv-searchbar">
    <div class="search-controls">
      <input type="hidden" id="sort" value="">

      <select id="searchCondition" class="input-select" aria-label="검색 조건">
        <option value="0">전체</option>
        <option value="prodName">상품명</option>
        <option value="prodDetail">상세설명</option>
      </select>

      <div class="ac-wrap nv-input">
        <input type="text" id="searchKeyword" class="input-text search-keyword" placeholder="검색어 입력" aria-label="검색어">
        <div id="acList" class="ac-list"></div>
      </div>

      <!-- 가격 범위 : 슬라이더 + 현재값 표시 (hidden은 기존 JS와 호환용) -->
      <div class="nv-price">
        <span class="nv-price-label">가격 범위</span>

        <input type="hidden" id="minPrice" value="">
        <input type="hidden" id="maxPrice" value="">

        <div class="nv-pr">
          <div class="nv-pr-track"></div>
          <div class="nv-pr-fill"></div>
          <input type="range" id="rMin" class="nv-pr-range"
       min="0" max="2000000" step="5000" value="0" aria-label="최소 가격">
          <input type="range" id="rMax" class="nv-pr-range" min="200000" max="2000000" step="5000" value="2000000" aria-label="최대 가격">
        </div>

        <div class="nv-pr-values">
          <span id="priceMinView">0</span>
          <span class="tilde">~</span>
          <span id="priceMaxView">2,000,000</span>
          <span class="unit">원</span>
        </div>
      </div>

      <span class="btn-group" role="group" aria-label="검색 실행">
        <button type="button" id="btnSearch" class="btn-green">검색</button>
        <button type="button" id="btnAll" class="btn-gray">전체보기</button>
      </span>
    </div>

    <!-- 오른쪽 끝 토글 -->
    <div class="seg" role="group" aria-label="보기 전환">
      <button type="button" id="btnListView"  class="seg-btn is-active" aria-pressed="true">리스트 보기</button>
      <button type="button" id="btnThumbView" class="seg-btn" aria-pressed="false">썸네일 보기</button>
    </div>
  </div>

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
      <tbody id="listBody"></tbody>
    </table>
  </div>

  <div id="gridBody" class="thumb-grid" style="display:none;"></div>

  <div id="infiniteLoader" style="display:none;">불러오는 중...</div>
  <div id="endOfList" style="display:none;">마지막 상품입니다.</div>
</section>
