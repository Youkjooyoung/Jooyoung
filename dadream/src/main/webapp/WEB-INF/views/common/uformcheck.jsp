<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>


<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <style>
     
        .formcheck{
            display: flex;
            flex-direction: column;
            
            align-items: center;
            justify-content: center ;
            font-size: 50px;
            font-weight: bold;
            height: 600px;
        }
        .da{
            color:  rgb(146, 142, 142);
        }
        .dream{
            color: rgb(161, 117, 20);
        }
        .da,.dream{
            font-weight: bold;
            font-size:60px;
        }
    </style>
</head>
<body class="formcheckbody">
    <div class="formcheck">

        <h1 class="formcheckh1"><span class="da">Da</span>&nbsp;<span class="dream">Dream</span>&nbsp;회원가입을 축하드립니다.</h1>
        <h1 class="formcheckh2">" welcome to the new world "</h1>

    </div>
</body>
</html>