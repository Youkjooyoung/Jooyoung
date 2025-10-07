<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>로그인</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" />
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
  <script src="${ctx}/javascript/login.js"></script>
</head>

<body class="auth-page"
      data-ctx="${ctx}"
      data-kakao-jskey="<spring:eval expression='@commonProperties["kakao.jsKey"]'/>"
      data-kakao-client="<spring:eval expression='@commonProperties["kakao.clientId"]'/>"
      data-google-client="<spring:eval expression='@commonProperties["google.clientId"]'/>">

  <div class="auth-wrap">
    <div class="auth-card">
      <div class="auth-logo">
        <img src="${ctx}/images/logo-spring.png" alt="Spring" />
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
          <span id="btnGoJoin"     class="btn-gray  btn-lg btn-pill">회원가입</span>
        </div>

        <img id="btnKakaoLogin" src="${ctx}/images/kakao_login.png" alt="카카오 아이디로 로그인" class="kakao-btn"/>
        <img id="btnGoogleLogin" src="${ctx}/images/google-login.png" alt="구글 아이디로 로그인" class="google-btn"/>
        
      </form>
    </div>
  </div>
</body>
</html>
