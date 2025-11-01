<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<div data-page="home" class="space-y-10">
  <section class="bg-white border border-naver-gray-100 rounded-nv shadow-nv">
    <div class="card-hd px-5 py-4 text-lg font-extrabold">Bestsellers</div>
    <div class="p-5">
      <div class="product-slider"></div>
    </div>
  </section>

  <section class="space-y-4">
    <div class="text-lg font-extrabold">추천 카테고리</div>
    <div class="flex flex-wrap gap-2">
      <button class="px-4 h-9 rounded-full border border-naver-gray-200 bg-white hover:bg-naver-gray-50">전체</button>
      <button class="px-4 h-9 rounded-full border border-naver-gray-200 bg-white hover:bg-naver-gray-50">디지털</button>
      <button class="px-4 h-9 rounded-full border border-naver-gray-200 bg-white hover:bg-naver-gray-50">패션</button>
      <button class="px-4 h-9 rounded-full border border-naver-gray-200 bg-white hover:bg-naver-gray-50">생활</button>
      <button class="px-4 h-9 rounded-full border border-naver-gray-200 bg-white hover:bg-naver-gray-50">취미</button>
    </div>
  </section>

  <section class="space-y-4">
    <div class="text-lg font-extrabold">신규 상품</div>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div class="bg-white border border-naver-gray-100 rounded-nv p-4 shadow-nv">
        <div class="aspect-[4/3] bg-naver-gray-50 rounded-lg"></div>
        <div class="mt-3 font-semibold truncate">New Item A</div>
        <div class="text-sm text-gray-600">12,000원</div>
      </div>
      <div class="bg-white border border-naver-gray-100 rounded-nv p-4 shadow-nv">
        <div class="aspect-[4/3] bg-naver-gray-50 rounded-lg"></div>
        <div class="mt-3 font-semibold truncate">New Item B</div>
        <div class="text-sm text-gray-600">25,000원</div>
      </div>
      <div class="bg-white border border-naver-gray-100 rounded-nv p-4 shadow-nv">
        <div class="aspect-[4/3] bg-naver-gray-50 rounded-lg"></div>
        <div class="mt-3 font-semibold truncate">New Item C</div>
        <div class="text-sm text-gray-600">59,000원</div>
      </div>
      <div class="bg-white border border-naver-gray-100 rounded-nv p-4 shadow-nv">
        <div class="aspect-[4/3] bg-naver-gray-50 rounded-lg"></div>
        <div class="mt-3 font-semibold truncate">New Item D</div>
        <div class="text-sm text-gray-600">99,000원</div>
      </div>
    </div>
  </section>

  <section class="space-y-4">
    <div class="text-lg font-extrabold">리뷰 하이라이트</div>
    <div class="grid md:grid-cols-3 gap-4">
      <div class="bg-white border border-naver-gray-100 rounded-nv p-5 shadow-nv">
        <div class="font-semibold">★★★★★</div>
        <div class="mt-2 text-sm text-gray-700 line-clamp-2">배송도 빠르고 상품이 아주 만족스러웠습니다.</div>
      </div>
      <div class="bg-white border border-naver-gray-100 rounded-nv p-5 shadow-nv">
        <div class="font-semibold">★★★★☆</div>
        <div class="mt-2 text-sm text-gray-700 line-clamp-2">가성비가 좋아 추천합니다.</div>
      </div>
      <div class="bg-white border border-naver-gray-100 rounded-nv p-5 shadow-nv">
        <div class="font-semibold">★★★★★</div>
        <div class="mt-2 text-sm text-gray-700 line-clamp-2">디자인이 예쁘고 품질도 좋습니다.</div>
      </div>
    </div>
  </section>
</div>
