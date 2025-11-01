<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<section class="max-w-[1100px] mx-auto px-4 py-8" data-page="product-list" data-ctx="${ctx}">
  <section class="bg-white shadow-[0_4px_14px_rgba(0,0,0,.06)] rounded-[12px] p-5">
    <div class="sticky top-[68px] z-10 -mx-5 -mt-5 px-5 pt-5 pb-3 bg-white/95 backdrop-blur border-b">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <select id="searchCondition" class="h-[42px] px-3 rounded-[10px] border border-gray-300">
            <option value="0">전체</option>
            <option value="prodName">상품명</option>
            <option value="prodDetail">상세설명</option>
          </select>
          <div class="relative w-64">
            <input id="searchKeyword" type="text" placeholder="검색어 입력" class="h-[42px] w-full px-3 pr-10 rounded-[10px] border border-gray-300" />
            <div id="acList" class="hidden absolute left-0 right-0 mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-[10px] shadow-[0_16px_40px_rgba(0,0,0,.12)] text-sm"></div>
          </div>
          <select id="sortSelect" class="h-[42px] px-3 rounded-[10px] border border-gray-300">
            <option value="">정렬 없음</option>
            <option value="priceAsc">가격↑</option>
            <option value="priceDesc">가격↓</option>
            <option value="dateDesc">최신순</option>
            <option value="viewDesc">조회순</option>
          </select>
          <button id="btnSearch" class="h-[42px] px-5 rounded-[10px] font-semibold text-white bg-[#03c75a]">검색</button>
          <button id="btnAll" class="h-[42px] px-5 rounded-[10px] font-semibold border border-gray-300">전체보기</button>
        </div>
        <div class="flex items-center gap-2">
          <button id="btnListView" class="seg-btn h-[36px] px-4 rounded-full bg-[#03c75a] text-white font-bold">리스트 보기</button>
          <button id="btnThumbView" class="seg-btn h-[36px] px-4 rounded-full bg-gray-200 text-gray-700 font-bold">썸네일 보기</button>
        </div>
      </div>

      <div class="mt-3">
        <div class="h-2 bg-gray-200 rounded-full relative">
          <div id="priceBar" class="absolute h-2 bg-[#03c75a] rounded-full" style="left:0;width:100%"></div>
        </div>
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span id="priceMinView">0</span>
          <span id="priceMaxView">2,000,000</span>
        </div>
        <div class="relative">
          <input id="rMin" type="range" min="0" max="2000000" step="5000" value="0" class="absolute top-[-6px] w-full appearance-none bg-transparent cursor-pointer" />
          <input id="rMax" type="range" min="0" max="2000000" step="5000" value="2000000" class="absolute top-[-6px] w-full appearance-none bg-transparent cursor-pointer" />
        </div>
      </div>
    </div>

    <div id="listTableWrap" class="mt-5">
      <table class="w-full text-sm border-t border-gray-200">
        <thead class="bg-[#f0f2f4] text-gray-700 font-semibold">
          <tr>
            <th class="p-3 w-[60px]">번호</th>
            <th class="p-3 w-[240px]">상품명</th>
            <th class="p-3 w-[140px]">가격</th>
            <th class="p-3 w-[140px]">등록일자</th>
            <th class="p-3 w-[120px]">조회수</th>
            <th class="p-3 w-[100px]">상태</th>
            <th class="p-3 w-[160px]">관리</th>
          </tr>
        </thead>
        <tbody id="listBody" class="divide-y divide-gray-100"></tbody>
      </table>
    </div>

    <div id="gridBody" class="hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"></div>
    <div id="infiniteLoader" class="hidden text-center text-gray-400 text-sm mt-6">불러오는 중...</div>
    <div id="endOfList" class="hidden text-center text-gray-400 text-sm mt-6">마지막 상품입니다.</div>
    <div id="ioSentinel" class="h-8"></div>
  </section>
</section>

  <button id="btnTop" type="button" class="hidden fixed right-6 bottom-6 w-11 h-11 rounded-full shadow-[0_6px_16px_rgba(0,0,0,.2)] bg-[#03c75a] text-white text-lg">↑</button>
