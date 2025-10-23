<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>회원가입</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<link rel="stylesheet" href="${ctx}/css/naver-common.css" />
<script src="${ctx}/javascript/addUser.js" defer></script>
</head>
<body
	class="bg-naver-gray-50 flex justify-center items-center min-h-screen">
	<div class="bg-white shadow-nv rounded-nv w-full max-w-lg p-8">
		<h2 class="text-2xl font-extrabold text-naver-green text-center mb-6">회원가입</h2>
		<form id="addUserForm" autocomplete="off" class="space-y-4">
			<div>
				<label class="block font-semibold">아이디</label>
				<div class="flex gap-2">
					<input type="text" name="userId" id="userId" readonly
						placeholder="중복확인 후 입력" class="border rounded-nv px-3 h-10 flex-1">
					<button type="button" id="btnCheckDup"
						class="nv-btn nv-btn-ghost border border-naver-green text-naver-green">중복확인</button>
				</div>
			</div>
			<div>
				<label class="block font-semibold">비밀번호</label> <input
					type="password" name="password"
					class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div>
				<label class="block font-semibold">비밀번호 확인</label> <input
					type="password" name="password2"
					class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div>
				<label class="block font-semibold">이름</label> <input type="text"
					name="userName" class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div>
				<label class="block font-semibold">주소</label> <input type="text"
					name="addr" class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div>
				<label class="block font-semibold">휴대전화번호</label>
				<div class="flex gap-2">
					<select name="phone1" class="border rounded-nv px-2 h-10">
						<option>010</option>
						<option>011</option>
						<option>016</option>
						<option>018</option>
						<option>019</option>
					</select> <input type="text" name="phone2" maxlength="4"
						class="border rounded-nv px-2 h-10 w-20"> <input
						type="text" name="phone3" maxlength="4"
						class="border rounded-nv px-2 h-10 w-20">
				</div>
			</div>
			<div>
				<label class="block font-semibold">이메일</label> <input type="text"
					name="email" class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div class="flex justify-center gap-3 pt-4">
				<button type="button" id="btnAddUser"
					class="bg-naver-green text-white px-6 h-10 rounded-nv">가입</button>
				<button type="reset"
					class="border border-gray-300 px-6 h-10 rounded-nv">취소</button>
			</div>
		</form>
	</div>
</body>
</html>