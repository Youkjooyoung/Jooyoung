<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<section class="max-w-[1100px] mx-auto px-4 py-8" data-page="product-detail" data-ctx="${ctx}" data-stock="${product.stockQty}">
  <input type="hidden" id="prodNo" value="${product.prodNo}" />
  <div class="bg-white rounded-[14px] shadow-[0_8px_24px_rgba(0,0,0,.06)] p-6">
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12 lg:col-span-7">
        <div class="grid grid-cols-3 gap-3">
          <c:forEach var="img" items="${productImages}">
            <img src="${ctx}/images/uploadFiles/${img.fileName}" alt="${product.prodName}" class="w-full h-40 object-cover rounded-lg border" />
          </c:forEach>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-5">
        <div class="text-2xl font-bold text-gray-900">${product.prodName}</div>
        <div class="mt-2 text-[#03c75a] text-xl font-semibold"><fmt:formatNumber value="${product.price}" pattern="#,###"/> 원</div>
        <div class="mt-1 text-sm text-gray-500">재고: ${product.stockQty}</div>

        <div class="mt-4 flex items-center gap-2">
          <button id="btnQtyDec" type="button" class="w-9 h-9 rounded bg-gray-100">-</button>
          <input id="qty" type="number" class="w-16 h-9 text-center border rounded" value="1" min="1" />
          <button id="btnQtyInc" type="button" class="w-9 h-9 rounded bg-gray-100">+</button>
        </div>

        <div class="mt-5 flex items-center gap-3">
          <button id="btnAddCart" type="button" class="px-4 h-10 rounded-[10px] bg-[#03c75a] text-white font-semibold">장바구니 담기</button>
          <button id="btnBuyNow" type="button" class="px-4 h-10 rounded-[10px] bg-gray-800 text-white">구매하기</button>
          <button id="btnGoCart" type="button" class="px-4 h-10 rounded-[10px] border">장바구니로 이동</button>
        </div>

        <div class="mt-6 text-gray-700 whitespace-pre-line">${product.prodDetail}</div>
      </div>
    </div>
  </div>
</section>
</body>
</html>
