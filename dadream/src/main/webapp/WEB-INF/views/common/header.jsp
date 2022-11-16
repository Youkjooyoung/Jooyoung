<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<c:set var="result" value="${param.result }" />

<%
  request.setCharacterEncoding("UTF-8");
%>

<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <title>매물일반인</title>
    <!-- reset css -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">
    <!-- css -->
    <link rel="stylesheet" href="/css/header.css">
</head>

<body>

    <!-- maintab -->
    <ul class="maintab">
        <a href="${contextPath}/dealingmain.do">
            <li class="a">부동산</li>
        </a>
        <a href="${contextPath}/productmain.do">
            <li class="b">가구</li>
        </a>
    </ul>


    <!-- header -->
    <header class="header">
        <div class="headerleft">
            <a href="${contextPath}/dealingmain.do" style="width:200px;"><img class="Main_Logo" src="../image/메인로고.png"
                    alt="다드림 메인로고"></a>
        </div>

        <div class="headerul">
            <ul>
                <a href="${contextPath}/noticelist.do">
                    <li>공지사항</li>
                </a>
                <a href="${contextPath}/inteboardlist.do">
                    <li>인테리어</li>
                </a>
                <c:choose>
                    <c:when test="${isLogOn == true  && member!= null}">
                        <li>
                            <form method="POST" action="/mypage.do">
                                <button style="background-color: white; cursor:pointer;border: none; font-weight: bold;font-size: 18px;padding: 0;">
                                    마이페이지
                                </button>
                            </form>
                        </li>
                        <li>
                            <h6>${member.user_Name}님</h6>
                        </li>
                        <a href="${contextPath}/logout.do">
                            <li>로그아웃</li>
                        </a>
                    </c:when>
                    <c:otherwise>
                        <a href="${contextPath}/login.do">
                            <li>로그인</li>
                        </a>
                        <a href="${contextPath}/userjoin.do">
                            <li>회원가입</li>
                        </a>
                    </c:otherwise>
                </c:choose>
            </ul>
        </div>
    </header>


    <!-- 내용물 -->
    <div class="detaling">
        <!-- 부동산 페이지 -->
    </div>
    <div class="pro hide">
        <!-- 가구 페이지 -->
    </div>


    <!-- TOP 부분 -->
    <!-- <a class="top" href=".headerleft">TOP</a> -->
    <a class="top" href="#">TOP</a>
    <!-- Channel Plugin Scripts -->
    <script>
        (function () {
            var w = window;
            if (w.ChannelIO) {
                return (window.console.error || window.console.log || function () {})(
                    'ChannelIO script included twice.');
            }
            var ch = function () {
                ch.c(arguments);
            };
            ch.q = [];
            ch.c = function (args) {
                ch.q.push(args);
            };
            w.ChannelIO = ch;

            function l() {
                if (w.ChannelIOInitialized) {
                    return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                s.charset = 'UTF-8';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
            if (document.readyState === 'complete') {
                l();
            } else if (window.attachEvent) {
                window.attachEvent('onload', l);
            } else {
                window.addEventListener('DOMContentLoaded', l, false);
                window.addEventListener('load', l, false);
            }
        })();
        ChannelIO('boot', {
            "pluginKey": "df04e6aa-33a1-40b0-b598-de67826a821e"
        });

        //  End Channel Plugin 

        // main tab
        let a = document.querySelector(".a");
        let b = document.querySelector(".b");

        let c = document.querySelector(".detaling");
        let d = document.querySelector(".pro");

        //  부동산을 클릭하였을때
        a.addEventListener('click', function () {
            b.classList.remove("blue");
            a.classList.add("red");
            d.classList.add("hide");
            c.classList.remove("hide");
        })

        // 가구를 클릭하였을때
        b.addEventListener('click', function () {
            a.classList.remove("red");
            b.classList.add("blue");

            c.classList.add("hide");
            d.classList.remove("hide");

        })
    </script>

</body>

</html>