<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <!-- IFrame에 포함되어 열리더라도 링크는 항상 top으로 이동 -->
  <base target="_top" />
  <c:if test="${not empty _csrf}">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
  </c:if>
  <!-- Google OAuth client id (리디렉션 방식에서도 참조) -->
  <meta name="google-signin-client_id"
        content="<spring:eval expression='@commonProperties[\"google.clientId\"]'/>"/>
<link rel="stylesheet" href="${ctx}/css/naver-common.css" />
<link rel="stylesheet" href="${ctx}/css/login.css" />
</head>

<body class="auth-page"
      data-ctx="${ctx}"
      data-kakao-jskey="<spring:eval expression='@commonProperties[\"kakao.jsKey\"]'/>"
      data-kakao-client="<spring:eval expression='@commonProperties[\"kakao.clientId\"]'/>"
      data-google-client="<spring:eval expression='@commonProperties[\"google.clientId\"]'/>">

  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="${ctx}/images/uploadFiles/naver.png" alt="Logo" />
      </div>

      <form id="loginForm" class="auth-form">
        <div class="form-row">
          <label for="userId">ID</label>
          <input type="text" id="userId" name="userId" class="input-text w-100" maxlength="50" />
        </div>

        <div class="form-row">
          <label for="password">PASSWORD</label>
          <input type="password" id="password" name="password" class="input-text w-100" maxlength="50" />
        </div>

        <div class="auth-actions">
          <span id="btnLoginSubmit" class="btn-green btn-lg btn-pill">로그인</span>
          <span id="btnGoJoin" class="btn-gray btn-lg btn-pill">회원가입</span>
        </div>

        <div class="social-login-wrap">
		  <button type="button" id="btnKakaoLogin" class="kakao-btn">카카오로 로그인</button>
		  <button type="button" id="btnGoogleLogin" class="google-btn">
		    <span class="gicon" aria-hidden="true"></span>
		    <span>Google 계정으로 로그인</span>
		  </button>
		</div>
      </form>
    </div>
  </div>
<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="${ctx}/javascript/common-toast.js"></script>
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" crossorigin="anonymous"></script>
<script src="${ctx}/javascript/login.js" defer></script>
</body>
</html>
