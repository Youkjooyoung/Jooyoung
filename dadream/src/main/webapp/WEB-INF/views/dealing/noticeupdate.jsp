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
    <title>공지사항 수정 페이지</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet">
	<!--CSS-->
	<link rel="stylesheet" href="/css/addnotice.css">
	<!--JS-->
	<script src="/js/dealingJS/noticeupdate.js"></script>
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script>
        function readURL(input) {
	 	if (input.files && input.files[0]) {
	 	var reader = new FileReader();
	 	reader.onload = function (e) {
		 $('#preview').attr('src', e.target.result);	
		 }
		 reader.readAsDataURL(input.files[0]);
		 }
		} 
		function backToList(obj){
			obj.action="${contextPath}/noticelist.do";
			obj.submit();
		}
		var cnt = 1;
		function fn_addFile(){
			$("#d_file").append("<br>" + "<input type='file' name='file" + cnt +"' />");
			cnt++;
		}
		function _onSubmit(){
			if(!confirm("수정하시겠습니까?")){
				return false;
			}
		}
		function fn_modify_noticle(obj){
		obj.action="${contextPath}/notice/update_action";
		obj.submit();
		}
    </script>

	
</head>
<body>
    <form name="frmArticle" action="/notice/update_action" method="post" enctype="multipart/form-data" onsubmit="return _onSubmit();">
		<input type="hidden" id="notice_Num" name="notice_Num" value="${noticeContents.notice_Num}"/>
		
		<select name="notice_Category" id="notice_Category">
			<option value="부동산">부동산</option>
			<option value="가구">가구</option>
		</select>
		
		<table border="0" align="center" class="table-responsive">
			<tr>
				<td align="right"> 작성자: </td>
				<td class="form-inline" colspan="2" align="left">
					<input type="text" size="20" maxlength="100" name="user_Id" value="${noticeContents.user_Id}" readonly />
				</td>
			</tr>

			<tr>
				<td align="right">제목: </td>
				<td class="form-inline" colspan="2"><input type="text" size="67" maxlength="500" name="notice_Title" value="${noticeContents.notice_Title}"/></td>
			</tr>

			<tr>
				<td align="right" valign="top"><br>내용: </td>
				<td class="form-inline" colspan="2">
					<textarea rows="10" cols="65" maxlength="4000" name="notice_Text" value="${noticeContents.notice_Text}" style="resize: none;">${noticeContents.notice_Text}</textarea>
				</td>
			</tr>
        </table>
			<tr>
				<div id="update_btn">
				<button type="submit" class="btn btn-success" onClick="fn_modify_noticle(frmArticle)" >수정 완료</button>
				<button type="button"><a href="/notice/read?notice_Num=${noticeContents.notice_Num}" class="btn btn-danger" style="text-decoration: none;">취소</a></button>		
			</tr>
        </form>
</body>
</html>