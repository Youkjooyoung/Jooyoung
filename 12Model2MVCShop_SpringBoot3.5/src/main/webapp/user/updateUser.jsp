<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<c:set var="p1"
	value="${empty user.phone ? '' : fn:split(user.phone,'-')[0]}" />
<c:set var="p2"
	value="${empty user.phone ? '' : fn:split(user.phone,'-')[1]}" />
<c:set var="p3"
	value="${empty user.phone ? '' : fn:split(user.phone,'-')[2]}" />

<div class="nv-panel nv-user-edit" data-page="user-update"
	data-user-id="${user.userId}">
	<form id="userEditForm" autocomplete="off">
		<input type="hidden" name="userId" value="${user.userId}" /> <input
			type="hidden" name="userName" value="${user.userName}" />

		<div class="card">
			<div class="card-hd">회원정보수정</div>
			<div class="card-bd">
				<div class="form-row">
					<label class="form-l">아이디</label>
					<div class="form-v">${user.userId}</div>
				</div>

				<div class="form-row">
					<label class="form-l">이름</label>
					<div class="form-v">
						<span class="readonly-text">${user.userName}</span>
					</div>
				</div>

				<div class="form-row">
					<label class="form-l">주소</label>
					<div class="form-v form-v-flex">
						<input type="text" name="addr" value="${user.addr}"
							class="nv-input" />
						<button type="button" class="nv-btn nv-btn-ghost"
							data-role="addr-search">주소검색</button>
					</div>
					<div class="form-v sub">
						<input type="text" name="addrDetail" placeholder="상세주소"
							class="nv-input" /> <input type="text" name="zipcode"
							placeholder="우편번호" class="nv-input zip" readonly />
					</div>
				</div>

				<div class="form-row">
					<label class="form-l">휴대전화번호</label>
					<div class="form-v phone">
						<select name="phone1" class="nv-input sel">
							<option value="010" ${p1 eq '010' ? 'selected' : ''}>010</option>
							<option value="011" ${p1 eq '011' ? 'selected' : ''}>011</option>
							<option value="016" ${p1 eq '016' ? 'selected' : ''}>016</option>
							<option value="018" ${p1 eq '018' ? 'selected' : ''}>018</option>
							<option value="019" ${p1 eq '019' ? 'selected' : ''}>019</option>
						</select> <span class="dash">-</span> <input type="text" name="phone2"
							value="${p2}" maxlength="4" class="nv-input seg" /> <span
							class="dash">-</span> <input type="text" name="phone3"
							value="${p3}" maxlength="4" class="nv-input seg" />
					</div>
				</div>

				<div class="form-row">
					<label class="form-l">이메일</label>
					<div class="form-v">
						<input type="text" name="email" value="${user.email}"
							class="nv-input" />
					</div>
				</div>
			</div>

			<div class="card-ft">
				<div class="nv-actions">
					<button type="button" class="nv-btn nv-btn-primary"
						data-role="save">수정</button>
					<button type="button" class="nv-btn nv-btn-ghost"
						data-role="cancel">취소</button>
				</div>
			</div>
		</div>
	</form>
</div>
