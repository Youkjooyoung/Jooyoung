<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<section class="max-w-7xl mx-auto bg-white shadow-nv rounded-nv p-8 mt-6"
	data-page="product-search" data-ctx="${ctx}"
	data-role="${sessionScope.user.role}">

	<!-- 제목 및 검색 바 -->
	<div class="flex items-center justify-between mb-6 border-b pb-3">
		<h2 class="text-2xl font-extrabold text-naver">상품 검색</h2>
		<div class="flex flex-wrap gap-2 items-center">
			<select id="searchCondition"
				class="border border-gray-300 rounded-lg px-3 h-[44px] text-gray-700 focus:border-naver focus:ring focus:ring-naver/20">
				<option value="0">전체</option>
				<option value="prodName">상품명</option>
				<option value="prodDetail">상세설명</option>
			</select>

			<div class="relative w-64">
				<input type="text" id="searchKeyword" placeholder="검색어 입력"
					class="w-full border border-gray-300 rounded-lg h-[44px] pl-3 pr-10 text-sm focus:border-naver focus:ring focus:ring-naver/20" />
				<div id="acList"
					class="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 w-full hidden max-h-60 overflow-auto text-sm"></div>
			</div>

			<button id="btnSearch"
				class="bg-naver hover:bg-naver-dark text-white font-semibold px-6 h-[44px] rounded-lg transition">검색</button>
			<button id="btnAll"
				class="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-6 h-[44px] rounded-lg transition">전체보기</button>
		</div>
	</div>

	<!-- 가격 슬라이더 -->
	<div class="flex items-center gap-4 mb-6">
		<div class="flex-1">
			<div class="h-2 bg-gray-200 rounded-full relative">
				<div class="absolute bg-naver h-2 rounded-full" id="priceBar"></div>
			</div>
			<div class="flex justify-between text-xs text-gray-500 mt-1">
				<span id="priceMinView">0</span> <span id="priceMaxView">2,000,000</span>
			</div>
			<div class="relative">
				<input id="rMin" type="range" min="0" max="2000000" step="5000" value="0"
					class="absolute top-[-6px] w-full appearance-none bg-transparent cursor-pointer" />
				<input id="rMax" type="range" min="0" max="2000000" step="5000"
					value="2000000"
					class="absolute top-[-6px] w-full appearance-none bg-transparent cursor-pointer" />
			</div>
		</div>
	</div>

	<!-- 보기 전환 버튼 -->
	<div class="flex justify-end gap-2 mb-6">
		<button id="btnListView"
			class="seg-btn bg-naver text-white font-bold px-4 py-2 rounded-full transition is-active">리스트
			보기</button>
		<button id="btnThumbView"
			class="seg-btn bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-full transition">썸네일
			보기</button>
	</div>

	<!-- 리스트 보기 -->
	<div id="listTableWrap">
		<table class="w-full text-sm border-t border-gray-200">
			<thead class="bg-naver-gray text-gray-700 font-semibold">
				<tr>
					<th class="p-3 w-[60px]">번호</th>
					<th class="p-3 w-[200px]">상품명</th>
					<th class="p-3 w-[160px]">가격 <span
						class="sort-btn text-gray-400 cursor-pointer ml-1"
						data-sort="priceAsc">▲</span> <span
						class="sort-btn text-gray-400 cursor-pointer ml-1"
						data-sort="priceDesc">▼</span>
					</th>
					<th class="p-3 w-[140px]">등록일자</th>
					<th class="p-3 w-[120px]">조회수</th>
					<th class="p-3 w-[100px]">상태</th>
					<th class="p-3 w-[160px]">관리</th>
				</tr>
			</thead>
			<tbody id="listBody" class="divide-y divide-gray-100"></tbody>
		</table>
	</div>

	<!-- 썸네일 보기 -->
	<div id="gridBody"
		class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 hidden mt-6"></div>

	<div id="infiniteLoader"
		class="text-center text-gray-400 text-sm mt-4 hidden">불러오는 중...</div>
	<div id="endOfList"
		class="text-center text-gray-400 text-sm mt-4 hidden">마지막 상품입니다.</div>
</section>

<script src="${ctx}/javascript/listProduct.js"></script>
