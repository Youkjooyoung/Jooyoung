<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<c:set var="result" value="${param.result }" />
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">

    <head>
        <title>로그인 / 회원가입 폼 템플릿</title>
        <!-- css -->
        <link rel="stylesheet" href="/css/login.css">







        <c:choose>
            <c:when test="${result=='loginFailed' }">
                <script>
                    window.onload = function () {
                        alert("아이디나 비밀번호가 틀립니다. 다시 로그인 하세요😢");
                    }
                </script>
            </c:when>

        </c:choose>
    </head>

<body>
    <div class="wrap" name="frmLogin">
        <div class="form-wrap">
            <div class="button-wrap">
                <div id="btn"></div>
                <!-- <button type="button" class="togglebtn" onclick="login()">LOG IN</button> -->

            </div>
            <div class="social-icons">
                <!-- <img src="../image/face.png" alt="대체">
                <img src="../image/ins.png" alt="대체"> -->
            </div>
            <form id="login" method="post" action="${contextPath}/logincheck.do" class="input-group">
                <input type="text" class="input-field" name="user_Id" placeholder="ID" autofocus required>
                <input type="password" class="input-field" name="user_Pwd" placeholder="PASSWORD" required>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <div id="loginbtn">
                    <button class="submit">Login</button>
                    <a id="kakao-login-btn" href="javascript:loginWithKakao()">
                        <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="222"
                            alt="카카오 로그인 버튼" style="border-radius: 60px; margin-top: 5px;" />
                </div>
            </form>


            <script src="https://t1.kakaocdn.net/kakao_js_sdk/2.0.0/kakao.min.js"
                integrity="sha384-PFHeU/4gvSH8kpvhrigAPfZGBDPs372JceJq3jAXce11bVA6rMvGWzvP4fMQuBGL"
                crossorigin="anonymous"></script>
            <script>
                Kakao.init('24a6c15e2202626d02ee581aa3846810'); // 사용하려는 앱의 JavaScript 키 입력
                console.log(Kakao.isInitialized());
            </script>

            
            </a>
            <p id="token-result"></p>

            <script>
                function loginWithKakao() {
                    Kakao.Auth.authorize({
                        redirectUri: 'http://localhost:8080/kakaologin.do',
                        prompts: 'login',
                    });
                  

                   
                }

                // 아래는 데모를 위한 UI 코드입니다.
                displayToken()

                function displayToken() {
                    var token = getCookie('authorize-access-token');

                    if (token) {
                        Kakao.Auth.setAccessToken(token);
                        Kakao.Auth.getStatusInfo()
                            .then(function (res) {
                                if (res.status === 'connected') {
                                    document.getElementById('token-result').innerText = 'login success, token: ' +
                                        Kakao.Auth.getAccessToken();
                                }
                            })
                            .catch(function (err) {
                                Kakao.Auth.setAccessToken(null);
                            });
                    }
                }

                function getCookie(name) {
                    var parts = document.cookie.split(name + '=');
                    if (parts.length === 2) {
                        return parts[1].split(';')[0];
                    }
                }
            </script>






        </div>
    </div>







</body>

</html>