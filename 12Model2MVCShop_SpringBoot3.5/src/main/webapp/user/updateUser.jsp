<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="p1"
	value="${empty user.phone ? '' : fn:split(user.phone,'-')[0]}" />
<c:set var="p2"
	value="${empty user.phone ? '' : fn:split(user.phone,'-')[1]}" />
<c:set var="p3"
	value="${empty user.phone ? '' : fn:split(user.phone,'-')[2]}" />
<body data-ctx="${ctx}">
	<div class="nv-panel nv-user-edit" data-page="user-update"
		data-user-id="${user.userId}">
		<form id="userEditForm" autocomplete="off">
			<input type="hidden" name="userId" value="${user.userId}"> <input
				type="hidden" name="userName" value="${user.userName}">
			<div class="card bg-white shadow-nv rounded-nv p-6">
				<div class="text-xl font-bold text-naver-green mb-4">회원정보수정</div>
				<div class="space-y-4">
					<div>
						<label class="font-semibold block">아이디</label>
						<div>${user.userId}</div>
					</div>
					<div>
						<label class="font-semibold block">이름</label>
						<div>${user.userName}</div>
					</div>
					<div>
						<label class="font-semibold block">주소</label>
						<div class="flex gap-2">
							<input type="text" name="addr" value="${user.addr}"
								class="border rounded-nv px-3 h-10 flex-1">
							<button type="button"
								class="border border-naver-green text-naver-green px-3 h-10 rounded-nv"
								data-role="addr-search">주소검색</button>
						</div>
					</div>
					<div>
						<label class="font-semibold block">휴대전화번호</label>
						<div class="flex gap-2">
							<select name="phone1" class="border rounded-nv px-2 h-10 w-24">
								<option value="010" ${p1 eq '010' ? 'selected':''}>010</option>
								<option value="011" ${p1 eq '011' ? 'selected':''}>011</option>
								<option value="016" ${p1 eq '016' ? 'selected':''}>016</option>
								<option value="018" ${p1 eq '018' ? 'selected':''}>018</option>
								<option value="019" ${p1 eq '019' ? 'selected':''}>019</option>
							</select> <input type="text" name="phone2" value="${p2}" maxlength="4"
								class="border rounded-nv px-2 h-10 w-20"> <input
								type="text" name="phone3" value="${p3}" maxlength="4"
								class="border rounded-nv px-2 h-10 w-20">
						</div>
					</div>
					<div>
						<label class="font-semibold block">이메일</label> <input type="text"
							name="email" value="${user.email}"
							class="border rounded-nv px-3 h-10 w-full">
					</div>
				</div>
				<div class="flex justify-end gap-3 pt-6">
					<button type="button"
						class="bg-naver-green text-white px-5 h-10 rounded-nv"
						data-role="save">수정</button>
					<button type="button"
						class="border border-gray-300 px-5 h-10 rounded-nv"
						data-role="cancel">취소</button>
				</div>
			</div>
		</form>
	</div>
</body>