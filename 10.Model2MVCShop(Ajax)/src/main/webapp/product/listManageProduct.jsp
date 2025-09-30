<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>판매상품 관리</title>
  <!-- 공통 CSS -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
  <!-- 페이지 전용 CSS -->
  <link rel="stylesheet" href="${ctx}/css/listManageProduct.css" type="text/css">

  <!-- jQuery + JS -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js" defer></script>
  <script src="${ctx}/javascript/app-core.js?v=20250930" defer></script>
  <script src="${ctx}/javascript/listManageProduct.js?v=20251001" defer></script>
</head>
<body data-ctx="${ctx}">
<div class="container">

  <div class="page-title">
    <h2>판매상품 관리</h2>
  </div>

  <!-- 검색 + 정렬 -->
  <div class="search-box">
    <div class="ac-wrap">
      <select id="searchCondition" class="input-select">
        <option value="0">전체</option>
        <option value="prodName">상품명</option>
        <option value="prodDetail">상세설명</option>
      </select>
      <input type="text" id="searchKeyword" class="input-text" placeholder="검색어 입력">
      <div class="ac-list" id="acList" role="listbox" aria-label="자동완성"></div>
    </div>

    <input type="hidden" id="sort" value="">
    <button type="button" id="btnSearch" class="btn-green">검색</button>
    <button type="button" id="btnAll" class="btn-gray">전체보기</button>
  </div>

  <!-- 리스트 -->
  <table class="list-table">
    <thead>
      <tr>
        <th style="width:80px;">번호</th>
        <th style="width:200px;">상품명</th>
        <th style="width:160px;">
          가격
          <span class="sort-btn" data-sort="priceAsc"  title="가격 오름차순">▲</span>
          <span class="sort-btn" data-sort="priceDesc" title="가격 내림차순">▼</span>
        </th>
        <th style="width:140px;">등록일자</th>
        <th style="width:140px;">구매자ID</th>
        <th style="width:140px;">구매일자</th>
        <th style="width:160px;">상태</th>
        <th style="width:160px;">배송관리</th>
      </tr>
    </thead>
    <tbody id="listBody">
      <!-- JS로 무한스크롤 append -->
    </tbody>
  </table>

  <!-- 로딩/마지막 표시 -->
  <div id="infiniteLoader">불러오는 중...</div>
  <div id="endOfList">마지막입니다.</div>

  <!-- Hover 썸네일 -->
  <div id="hoverThumb"></div>

  <!-- 주문내역 모달 -->
  <div id="historyModal" class="dlg-mask" role="dialog" aria-modal="true" aria-label="주문내역">
    <div class="dlg dlg-lg">
      <div class="dlg-hd">주문내역</div>
      <div class="dlg-bd">
        <iframe class="dlg-iframe" title="주문내역"></iframe>
      </div>
      <div class="dlg-ft">
        <button type="button" class="ct_btn01 dlg-close">닫기</button>
      </div>
    </div>
  </div>

  <!-- 취소사유 모달은 JS에서 동적 생성 -->

</div>
</body>
</html>
