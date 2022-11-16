<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
	isELIgnored="false"%>

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath }" />
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>공지사항 글쓰기</title>

	<!--CSS-->
	<link rel="stylesheet" href="/css/addnotice.css">
	
	<script src="/js/dealingJS/addnotice.js"></script>
	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script>	
        (function () {
            <c:choose>
                <c:when test="${member.user_Id == null}">
                    alert("로그인 후 작성 가능합니다.");
                    location.href="/login.do";           
                </c:when>
                <c:when test="${member.user_Level != 100}">
                    alert("관리자 권한이 아닙니다.")
                    location.href="/";
                </c:when>
            </c:choose>
        })();
		
		function backToList(obj){
	 	 obj.action="${contextPath}/noticelist.do";
		 obj.submit();
	 }
	</script>
</head>
<body>
    <form action="${contextPath}/addnotice.do" method="post" enctype="multipart/form-data">
		<div id="notice_add_form">
			<select name="notice_Category" id="notice_Category">
				<option value="부동산">부동산</option>
				<option value="가구">가구</option>
			</select>
			<div id="writer_Title">
				<td align="right"> 작성자: </td>
				<td  colspan="2" align="left"><input type="text" id="Writer_Form" size="15" maxlength="100" value="${member.user_Name}" name="user_Id" readonly disabled/></td>
			
			<td align="right"> 제목: </td>
			<td colspan="2"><input type="text" size="30" maxlength="50" name="notice_Title" id="TitleForm" /></td>
			</div>
			<div id="notice_Context">
				<td align="right" valign="top">공지내용: </td>
				<td colspan="2"><textarea rows="10" cols="65" maxlength="4000" name="notice_Text"></textarea>
				</td>
			</div>
			<tr>
                	<tr>
                   
                    	<td colspan="2">
                        <input type="submit" value="등록하기" id="addnotice_btn" />
						<input type="button" value="목록보기" onClick="backToList(this.form)" id="backlist_btn" />
                        </td>
                    </tr>
                </tr>
            </div>
        </form>
</body>
</html>