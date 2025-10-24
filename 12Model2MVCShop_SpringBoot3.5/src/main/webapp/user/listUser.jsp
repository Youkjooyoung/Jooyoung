<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<title>회원 목록</title>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="${ctx}/javascript/listUser.js" defer></script>
</head>

<body data-ctx="${ctx}" class="bg-gray-50 min-h-screen">
	<div class="bg-white shadow-nv rounded-nv p-8 w-full max-w-5xl mx-auto mt-10">
		<div class="flex justify-between items-center mb-6">
			<h2 class="text-2xl font-extrabold text-naver">회원 목록</h2>
			<div class="flex gap-2">
				<select id="searchCondition"
					class="border border-gray-300 rounded-lg px-2 h-[42px] focus:border-naver focus:ring focus:ring-naver/20">
					<option value="0">회원ID</option>
					<option value="1">회원명</option>
				</select>
				<input type="text" id="searchKeyword"
					class="border border-gray-300 rounded-lg h-[42px] px-3 focus:border-naver focus:ring focus:ring-naver/20"
					placeholder="검색어 입력" />
				<button id="btnSearch"
					class="bg-naver hover:bg-naver-dark text-white font-bold px-5 h-[42px] rounded-lg transition">검색</button>
			</div>
		</div>

		<table
			class="w-full text-sm text-left border-t border-gray-200 rounded-nv overflow-hidden">
			<thead class="bg-gray-100">
				<tr>
					<th class="p-3 w-[60px]">No</th>
					<th class="p-3">ID</th>
					<th class="p-3">이름</th>
					<th class="p-3">이메일</th>
				</tr>
			</thead>
			<tbody id="userList" class="divide-y divide-gray-100"></tbody>
		</table>

		<div id="pagination" class="flex justify-center gap-2 mt-6"></div>
	</div>
</body>
</html>
