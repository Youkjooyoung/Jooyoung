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
    <title>매물일반인</title>
    <!-- JS -->
    <script defer src="/js/common/headerp_m.js"></script>
    <!-- reset css -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">
    <!-- css -->
    <link rel="stylesheet" href="/css/headerp_m.css">
    <!-- 글꼴 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com">
    <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
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

    <c:choose>
        <c:when test="${member.user_Level == 3}">
            <header class="header">
                <div class="headerleft">
                    <a href="${contextPath}/dealingmain.do" style="width:200px;"><img class="Main_Logo" 
                            src="../image/메인로고.png" alt="다드림 메인로고"></a>
                </div>

                <div class="headerul">
                   
                    <ul>
                        <a href="${contextPath}/noticelist.do">
                            <li>공지사항</li>
                        </a>
                        <a href="${contextPath}/inteboardlist.do">
                            <li>인테리어</li>
                        </a>
                        <li>
                            <form method="post"  action="/dealing/gongsilCenter.do">
                                <p class="submit1">중개관리</p>
                            </form>
                        </li>
                        <!-- <li>
                            <form method="post"  action="">
                                <p class="submit2">매물관리</p>
                            </form>
                        </li>   -->
                        <li>
                            <a href="/mypage.do">
                                마이페이지
                            </a>
                        </li>
                               
                          <!-- select 를 이용해 action -->
                          <script>
                            document.querySelector(".headerul").addEventListener("click",(e)=>{
                                if(e.target.matches(".submit1")){
                                    document.querySelector(".submit1").parentElement.submit();
                                }else if(e.target.matches(".submit2")){
                                    document.querySelector(".submit2").parentElement.submit();
                                }
                                
                            })
                                
                            
                        </script>

                        
                        <c:choose>
                            <c:when test="${isLogOn == true  && member!= null}">
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
        </c:when>
       <c:when test ="${member.user_Level == 4}">
        <script>
            function dont(){
                <c:choose>
                    <c:when test="${member.user_Id == null}">
                        alert("로그인 후 작성 가능합니다.");
                        event.preventDefault();
                        location.href="/login.do";

                    </c:when>
                </c:choose>
            }
        </script>

            <!-- header -->
            <header class="header">
                <div class="headerleft" style="margin-right: 39.8%">
                    <a href="${contextPath}/dealingmain.do"><img class="Main_Logo" 
                            src="../image/메인로고.png" alt="다드림 메인로고"></a>
                </div>

                <div class="headerul">

                    <ul>
                        <a href="${contextPath}/noticelist.do">
                            <li>공지사항</li>
                        </a>
                        <a href="${contextPath}/inteboardlist.do">
                            <li>인테리어</li>
                        </a>
                        <a onclick="dont();" href="${contextPath}/dealingform.do">
                            <li>매물등록</li>
                        </a>

                        <c:choose>
                            <c:when test="${isLogOn == true  && member!= null}">
    
                                <li>
                                    <div class="pmcurosr">
                                    <h6>${member.user_Name} 님</h6>
                                    </div>
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
       </c:when>
        <c:otherwise>
        <script>
            function dont(){
                <c:choose>
                    <c:when test="${member.user_Id == null}">
                        alert("로그인 후 작성 가능합니다.");
                        event.preventDefault();
                        location.href="/login.do";

                    </c:when>
                </c:choose>
            }
        </script>

            <!-- header -->
            <header class="header">
                <div class="headerleft" style="margin-right: 39.8%">
                    <a href="${contextPath}/dealingmain.do"><img class="Main_Logo" 
                            src="../image/메인로고.png" alt="다드림 메인로고"></a>
                </div>

                <div class="headerul">

                    <ul>
                        <a href="${contextPath}/noticelist.do">
                            <li>공지사항</li>
                        </a>
                        <a href="${contextPath}/inteboardlist.do">
                            <li>인테리어</li>
                        </a>
                        <a onclick="dont();" href="${contextPath}/dealingform.do">
                            <li>매물등록</li>
                        </a>

                        <c:choose>
                            <c:when test="${isLogOn == true  && member!= null}">
                                <li>
                                    <form method="POST" action="/mypage.do">
                                        <input id="mypage" type="submit" value="마이페이지" style="background: white; color: black;border: none; font-size: 18px; width: 120px; font-weight: bold;cursor: pointer;font-size: 20px;">
                                    </form>
                                </li>
    
                                <li>
                                    <div class="pmcurosr">
                                    <h6>${member.user_Name} 님</h6>
                                    </div>
                                </li>
                                <!--댓글 수정,삭제시 아이디값을 가져와야 함-->
                                <li>
                                    <h6 id="user_id">${member.user_Id}</h6>
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
    <a class="top" href="#">TOP</a>
    <!-- 게시판 부분 -->
    <!-- <a class="pan" href="#">게시판</a> -->
    <!-- Channel Plugin Scripts -->

</body>

</html>