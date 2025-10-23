<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<div
	class="nv-panel bg-white rounded-nv shadow-nv p-8 w-full max-w-xl mx-auto mt-10">
	<h2 class="text-xl font-bold text-naver-green mb-4">회원 상세정보</h2>
	<div class="space-y-2">
		<p>
			<b>ID :</b> ${user.userId}
		</p>
		<p>
			<b>이름 :</b> ${user.userName}
		</p>
		<p>
			<b>이메일 :</b> ${user.email}
		</p>
		<p>
			<b>주소 :</b> ${user.addr}
		</p>
		<p>
			<b>전화번호 :</b> ${user.phone}
		</p>
	</div>
	<div class="text-center mt-5">
		<button type="button" onclick="history.back()"
			class="border border-gray-300 px-5 h-10 rounded-nv">확인</button>
	</div>
</div>