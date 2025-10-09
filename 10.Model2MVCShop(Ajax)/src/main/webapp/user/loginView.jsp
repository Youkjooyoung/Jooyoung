<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>

  <%-- Spring Security CSRF (있으면 메타에 주입) --%>
  <c:if test="${not empty _csrf}">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
  </c:if>

  <%-- GIS가 내부적으로 참조하는 스타일/프레임/스크립트 허용 --%>
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self' data: blob:;
  script-src  'self' 'unsafe-inline' 'unsafe-eval'
              https://accounts.google.com https://apis.google.com
              https://ssl.gstatic.com https://*.gstatic.com
              https://code.jquery.com https://t1.kakaocdn.net;
  style-src   'self' 'unsafe-inline'
              https://accounts.google.com https://ssl.gstatic.com https://*.gstatic.com;
  img-src     'self' data:
              https://ssl.gstatic.com https://*.googleusercontent.com https://*.gstatic.com https://*.ggpht.com;
  frame-src   'self'
              https://accounts.google.com https://kauth.kakao.com
              https://ssl.gstatic.com https://*.gstatic.com;
  connect-src 'self'
              https://accounts.google.com https://apis.google.com https://www.googleapis.com
              https://kauth.kakao.com https://*.googleusercontent.com https://ssl.gstatic.com https://*.gstatic.com;
  font-src    'self' https://fonts.gstatic.com https://ssl.gstatic.com;
">


  <%-- Google 클라이언트 ID (GIS/버튼에서 둘 다 사용) --%>
  <meta name="google-signin-client_id"
        content="<spring:eval expression='@commonProperties[\"google.clientId\"]'/>"/>

<!-- ... head 안 -->
<link rel="stylesheet" href="${ctx}/css/naver-common.css"/>

<script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
<script src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js" crossorigin="anonymous"></script>

<!-- 먼저: 우리 스크립트(전역 onGoogleCredential 선언 포함) -->
<script src="${ctx}/javascript/login.js"></script>

<!-- 나중에: GSI -->
<script src="https://accounts.google.com/gsi/client" 	aync defer></script>
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
          <button type="button" id="btnKakaoLogin" class="kakao-btn" aria-label="카카오로 로그인"></button>

          <div id="g_id_onload"
               data-client_id="<spring:eval expression='@commonProperties[\"google.clientId\"]'/>"
               data-callback="onGoogleCredential"
               data-auto_prompt="false">
          </div>
          <div class="g_id_signin"
               data-type="standard" data-size="large"
               data-theme="outline" data-text="signin_with"
               data-shape="rect" data-logo_alignment="left">
          </div>
        </div>
      </form>
    </div>
  </div>
</body>
</html>
