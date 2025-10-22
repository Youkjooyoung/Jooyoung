<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>

<div class="profile-wrap" data-page="user-detail"
	data-user-id="${user.userId}">
	<section class="profile-card">
		<div class="profile-hero">
			<div class="avatar">
				<c:choose>
					<c:when test="${not empty user.profileImg}">
						<img src="${user.profileImg}" alt="프로필" />
					</c:when>
					<c:otherwise>
						<span class="avatar-initial"> <c:out
								value="${empty user.userName ? 'U' : fn:substring(user.userName,0,1)}" />
						</span>
					</c:otherwise>
				</c:choose>
			</div>
			<div class="hero-meta">
				<h1 class="profile-name">
					<c:out value="${empty user.userName ? '사용자' : user.userName}" />
				</h1>
				<div class="chip-row">
					<span class="chip role"><c:out
							value="${empty user.role ? 'user' : user.role}" /></span> <span
						class="chip join">가입일자&nbsp;<c:out value="${user.regDate}" /></span>
				</div>
			</div>
		</div>

		<div class="profile-body">
			<div class="kv">
				<div class="kv-item">
					<div class="kv-label">아이디</div>
					<div class="kv-value">
						<c:out
							value="${empty user.email ? (empty user.userName ? user.kakaoId : user.userName) : user.email}" />
					</div>
				</div>
				<div class="kv-item">
					<div class="kv-label">이름</div>
					<div class="kv-value">
						<c:out value="${user.userName}" />
					</div>
				</div>
				<div class="kv-item kv-span">
					<div class="kv-label">주소</div>
					<div class="kv-value">
						<c:out value="${user.addr}" />
					</div>
				</div>
				<div class="kv-item">
					<div class="kv-label">휴대전화번호</div>
					<div class="kv-value copyable" data-copy="${user.phone}">
						<c:out value="${empty user.phone ? '' : user.phone}" />
					</div>
				</div>
				<div class="kv-item">
					<div class="kv-label">이메일</div>
					<div class="kv-value copyable" data-copy="${user.email}">
						<c:out value="${user.email}" />
					</div>
				</div>
			</div>
		</div>

		<div class="profile-actions">
			<button type="button" class="nv-btn nv-btn-primary" data-role="edit">수정</button>
			<button type="button" class="nv-btn nv-btn-ghost" data-role="back">확인</button>
		</div>
	</section>
</div>
