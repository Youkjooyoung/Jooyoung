<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div
	class="nv-panel bg-white shadow-nv rounded-nv p-6 max-w-5xl mx-auto mt-8">
	<div class="flex justify-between items-center mb-4">
		<h2 class="text-xl font-bold text-naver-green">회원 목록</h2>
		<div class="flex gap-2">
			<select name="searchCondition" class="border rounded-nv px-2 h-9">
				<option value="0" ${search.searchCondition==0?'selected':''}>회원ID</option>
				<option value="1" ${search.searchCondition==1?'selected':''}>회원명</option>
			</select> <input type="text" name="searchKeyword"
				value="${search.searchKeyword}" class="border rounded-nv h-9 px-2">
			<button class="bg-naver-green text-white px-4 h-9 rounded-nv">검색</button>
		</div>
	</div>
	<table class="w-full text-sm text-left border-t border-gray-200">
		<thead class="bg-naver-gray-50">
			<tr>
				<th class="p-2">No</th>
				<th>ID</th>
				<th>이름</th>
				<th>이메일</th>
			</tr>
		</thead>
		<tbody>
			<c:forEach var="user" items="${list}" varStatus="i">
				<tr class="border-b hover:bg-naver-gray-50">
					<td class="p-2">${i.index+1}</td>
					<td class="p-2 text-naver-green font-bold cursor-pointer">${user.userId}</td>
					<td class="p-2">${user.userName}</td>
					<td class="p-2">${user.email}</td>
				</tr>
			</c:forEach>
		</tbody>
	</table>
</div>