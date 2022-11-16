<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath"  value="${pageContext.request.contextPath}"  />
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>회원종류 선택창</title>
    <!-- css -->
    <link rel="stylesheet" href="/css/userjoin.css">
</head>

<body>
    <div class="userjoin">

        <h1 style="font:bold">회원가입 하기</h1>
        <br><br><br>
        <h3>가입하실 회원의 종류를 선택해주세요.</h3>
        <br><br><br><br><br><br><br><br>
        <div class="memberType">
            <form id="member1" method="get" action="${contextPath}/userform.do">
                <button type="submit">
                        <img src="../image/customer.png" />
                        <p>일반회원 가입</p>
                        <input type="hidden" name="memberjoin" value="1" />
                </button>
            </form>
            <form id="member2" method="" action="${contextPath}/userform.do">
                <button type="submit">
                        <img src="../image/seller.png" />
                        <p>판매자회원 가입</p>
                        <input type="hidden" name="memberjoin" value="2" />
                </button>
            </form>
            <form id="member3" method="" action="${contextPath}/userform.do">
                <button type="submit">
                        <img src="../image/broker.png" />
                        <p>중개사회원 가입</p>
                        <input type="hidden" name="memberjoin" value="3" />
                </button>
            </form>
        </div>
    </div>
</body>

</html>