<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>상품일반인</title>
    <!-- reset css -->
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">
    <!-- css -->
    <link rel="stylesheet" href="/css/headerpp.css">
</head>

<body>
    <!-- maintab -->
    <ul class="maintab">
        <a href="${contextPath}/dealingmain.do">
            <li class="a ">부동산</li>
        </a>
        <a href="${contextPath}/productmain.do">
            <li class="b">가구</li>
        </a>
    </ul>


    <c:choose>
        <c:when test="${member.user_Level == 2}">
            <!-- header -->
            <header class="header">
                <div class="headerleft">
                    <a href="${contextPath}/productmain.do" ><img class="Main_Logo"
                            src="../image/메인로고.png" alt="다드림 메인로고"></a>
                </div>
                <div class="search" >
                    <form action="/product.do" method="get">
                        <input type="search" name="product_Name" placeholder="검색어 입력" style="appearance:auto ;">
                        <button type="submit" class="pr_search">검색</button>
                    </form>
                </div>
                <div class="headerul">
                    <ul>
                        <li>
                            <a href="${contextPath}/noticelist.do">
                                공지사항
                            </a>
                        </li>
                        <li>
                            <a href="/inteboardlist.do">
                                인테리어
                            </a>
                        </li>
                        <li>
                            <form method="POST" id="result">
                                <select name="path" id="path" onchange="search()">
                                    <option style="text-align: center;" value="">메뉴</option>
                                    <option value="${contextPath}/productform.do">상품등록</option>
                                    <option value="${contextPath}/productmanager.do">상품관리</option>
                                    <option value="${contextPath}/mypaylist.do">판매내역</option>
                                    <option value="${contextPath}/mypage.do">마이페이지</option>
                                    <option value="${contextPath}/cartweb.do">장바구니</option>
                                </select>
                            </form>
                        </li>
                        <!-- select 를 이용해 action -->
                        <script>
                            function search() {

                                let path = document.querySelector("#path");
                                let pathresult = path.options[path.selectedIndex].value;
                                // console.log(pathresult);
                                const result = document.querySelector("#result");
                                result.setAttribute('action', pathresult);
                                result.submit();

                            };
                        </script>

                        <c:choose>
                            <c:when test="${isLogOn == true  && member!= null}">
                                <li>
                                    <h6>${member.user_Name}님</h6>
                                </li>
                                <a href="${contextPath}/logout.do">
                                    <li >로그아웃</li>
                                </a>
                            </c:when>
                            <c:otherwise>
                                <a href="/inteboardlist.do">
                                    <li>인테리어</li>
                                </a>
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
        </c:when>
        <c:when test="${member.user_Level ==4}">
            <!-- header -->
            <header class="header">
                <div class="headerleft">
                    <a href="${contextPath}/productmain.do" ><img class="Main_Logo"
                            src="../image/메인로고.png" alt="다드림 메인로고"></a>
                </div>
                <div class="search" >
                    <form action="/product.do" method="get">
                        <input type="search" name="product_Name" placeholder="검색어 입력" style="appearance:auto ;">
                        <button type="submit" class="pr_search" >검색</button>
                    </form>
                </div>
                <div class="headerul">
                    <ul>
                        <a href="${contextPath}/noticelist.do">
                            <li>공지사항</li>
                        </a>
                        <li>
                            <a href="/inteboardlist.do">
                                인테리어
                            </a>
                        </li>
                        <c:choose>
                            <c:when test="${isLogOn == true  && member!= null}">
                                <div class="ppcursor">
                                    <li>
                                        <a href="/cartweb.do" >
                                            장바구니
                                        </a>
                                    </li>
                                    <li class="headerppli">
                                        <h6>${member.user_Name}님</h6>
                                
                                    </li>
                                    
                                </div>
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
                <script>
                    let headerppli2 = document.querySelector(".headerppli");
                    let hiderpp2 = document.querySelector(".headerpp");
                    headerppli2.addEventListener("click", function () {
                        hiderpp2.classList.toggle("hidee");
                    })
                </script>
            </header>
        </c:when>
        <c:otherwise>
            <!-- header -->
            <header class="header">
                <div class="headerleft">
                    <a href="${contextPath}/productmain.do" ><img class="Main_Logo"
                            src="../image/메인로고.png" alt="다드림 메인로고"></a>
                </div>
                <div class="search" >
                    <form action="/product.do" method="get">
                        <input type="search" name="product_Name" placeholder="검색어 입력" style="appearance:auto ;">
                        <button type="submit" class="pr_search" >검색</button>
                    </form>
                </div>
                <div class="headerul">
                    <ul >
                        <a href="${contextPath}/noticelist.do">
                            <li>공지사항</li>
                        </a>
                        <li>
                            <a href="/inteboardlist.do">
                                인테리어
                            </a>
                        </li>
                        <c:choose>
                            <c:when test="${isLogOn == true  && member!= null}">
                            	<li>
                            	<a href="/orderlist.do">주문목록</a>
                            	</li>
                            
                                <li>
                                    <a href="/mypage.do">
                                        마이페이지
                                    </a>
                                </li>
                               
                                <li>
                                    <a href="/cartweb.do" >
                                        장바구니
                                    </a>
                                </li>
                                <div class="ppcursor">
                                    <li class="headerppli">
                                        <h6>${member.user_Name}님</h6>
                                    </li>
                                </div>
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
                <script>
                    // window.onload = function(){
                    let headerppli = document.querySelector(".headerppli");
                    let hiderpp = document.querySelector(".headerpp");
                    headerppli.addEventListener("click", function () {
                        hiderpp.classList.toggle("hidee");
                    })
                    // }
                </script>
            </header>
        </c:otherwise>
    </c:choose>

    <!-- 내용물 -->
    <div class="detaling">
        <!-- 부동산 페이지 -->
    </div>
    <div class="pro hide">
        <!-- 가구 페이지 -->
    </div>


    <!-- TOP 부분 -->
    <!-- <a class="top" href=".headerleft">TOP</a> -->
    <!-- 게시판 부분 -->
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