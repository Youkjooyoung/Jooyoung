<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>판매 내역</title>
<link rel="icon" href="${ctx}/images/favicon.ico"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>
tailwind.config={theme:{extend:{colors:{naver:'#03c75a','naver-dark':'#00a74a','naver-gray':'#f7f9fa'}}}}
</script>
<link rel="stylesheet" href="${ctx}/css/sale-list.css"/>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script defer src="${ctx}/javascript/listSale.js"></script>
</head>
<body data-ctx="${ctx}">
<main class="max-w-7xl mx-auto p-4" data-page="sale-list">
  <div class="flex items-center justify-between mb-4">
    <h1 class="text-2xl font-bold">판매 내역</h1>
    <div class="flex gap-2">
      <input type="text" id="kw" class="border rounded-xl px-3 py-2" placeholder="상품명/코드 검색"/>
      <button type="button" id="btnSearch" class="px-4 py-2 rounded-xl bg-gray-900 text-white">검색</button>
    </div>
  </div>

  <div class="overflow-x-auto bg-white border rounded-2xl shadow">
    <table class="min-w-full text-sm">
      <thead class="bg-naver-gray">
        <tr class="text-left">
          <th class="p-3">주문번호</th>
          <th class="p-3">상품</th>
          <th class="p-3">수량</th>
          <th class="p-3">금액</th>
          <th class="p-3">구매자</th>
          <th class="p-3">상태</th>
          <th class="p-3">작업</th>
        </tr>
      </thead>
      <tbody id="saleBody"></tbody>
    </table>
  </div>
</main>
</body>
</html>
