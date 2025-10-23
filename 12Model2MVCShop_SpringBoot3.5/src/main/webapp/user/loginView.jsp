<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>로그인</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<link rel="stylesheet" href="${ctx}/css/naver-common.css">
<script src="${ctx}/javascript/login.js" defer></script>
</head>
<body
	class="bg-naver-gray-50 flex justify-center items-center min-h-screen">
	<div class="bg-white rounded-nv shadow-nv p-8 w-full max-w-md">
		<div class="text-center mb-6">
			<img src="${ctx}/images/uploadFiles/naver.png" alt="Logo"
				class="w-14 mx-auto mb-3">
			<h2 class="text-2xl font-extrabold text-naver-green">로그인</h2>
		</div>
		<form id="loginForm" class="space-y-4">
			<div>
				<label class="block font-semibold">ID</label> <input type="text"
					name="userId" class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div>
				<label class="block font-semibold">PASSWORD</label> <input
					type="password" name="password"
					class="border rounded-nv px-3 h-10 w-full">
			</div>
			<div class="flex justify-between pt-4">
				<button type="button" id="btnLoginSubmit"
					class="bg-naver-green text-white px-5 h-10 rounded-nv">로그인</button>
				<button type="button" id="btnGoJoin"
					class="border border-gray-300 px-5 h-10 rounded-nv">회원가입</button>
			</div>
		</form>
	</div>
</body>
</html>