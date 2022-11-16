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
    <title>게시글 수정 페이지</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Jua&display=swap" rel="stylesheet">
	<!--CSS-->
	<link rel="stylesheet" href="/css/update.css">
	<!--JS-->
	<script src="/js/dealingJS/update.js"></script>
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
	 	 obj.action="${contextPath}/inteboardlist.do";
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
	function fn_modify_article(obj){
	obj.action="${contextPath}/board/update_action";
	obj.submit();
	}
	</script>

	
</head>
<body>
    <form name="frmArticle" action="/board/update_action" method="post" enctype="multipart/form-data" onsubmit="return _onSubmit();">
		<input type="hidden" id="inte_Num" name="inte_Num" value="${boardContents.inte_Num}"/>
		
		<input type="hidden" id="inte_Num" name="inte_Num" value="${boardContents.inte_Num}"/>
		
		<div id="updatecontent">
			<div id="writer1">
				<td align="right">작성자:&nbsp;&nbsp; </td>
					<input type="text" size="20" maxlength="100" name="user_Id" value="${boardContents.user_Id}" readonly />
			</div>

			<div id="update_title_form">
				<td align="right">제목:&nbsp;&nbsp; </td>
				<input type="text" size="63" maxlength="100" name="inte_Title" value="${boardContents.inte_Title}"/>
			</div>

			<div id="update_content">
				내용:&nbsp;&nbsp; 
					<textarea rows="10" cols="65" maxlength="5000" name="inte_Text" value="${boardContents.inte_Text}">${boardContents.inte_Text}
					</textarea>
			</div>
			
			
		</div>
       
			<div>
				<div id="update_btn">
				<button type="submit" id="submit_btn" class="btn btn-success" onClick="fn_modify_article(frmArticle)" >수정 완료</button>
				<button type="button" id="cancel_btn"><a href="/board/read?inte_Num=${boardContents.inte_Num}" class="btn btn-danger" style="text-decoration: none;">취소</a></button>		
				</div>
        </form>
</body>
</html>