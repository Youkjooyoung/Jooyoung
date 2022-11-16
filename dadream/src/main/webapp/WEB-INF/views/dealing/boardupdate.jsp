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
	<!-- 글꼴 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
    <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
	<!--CSS-->
	<link rel="stylesheet" href="/css/boardupdate.css">
	<!--JS-->
	<script src="/js/dealingJS/boardupdate.js"></script>
	<script  src="http://code.jquery.com/jquery-latest.min.js"></script>
</head>
<body>
    <form id="FORMTAG2" name="frmArticle" action="${contextPath}/board/update_action" method="post" enctype="multipart/form-data" onsubmit="return _onSubmit();">
		<input type="hidden" id="inte_Num" name="inte_Num" value="${boardContents.inte_Num}"/>
		
		<div id="updatecontent">
			<div id="writer1">
				<td align="right">작성자:&nbsp;&nbsp; </td>
					<input type="text" size="20" maxlength="100" name="user_Id" value="${boardContents.user_Id}" readonly />
			</div>

			<div id="update_title_form">
				<td align="right">제목:&nbsp;&nbsp; </td>
				<input type="text" size="63" maxlength="100" name="inte_Title" id="inte_Title" value="${boardContents.inte_Title}"/>
			</div>

			<div id="update_content">
				내용:&nbsp;&nbsp; 
					<textarea rows="10" cols="65" maxlength="5000" name="inte_Text" id="inte_Text" value="${boardContents.inte_Text}">${boardContents.inte_Text}</textarea>
			</div>
			
			<div id="board_img">
					<div class="inteImg">
						<div class="inteMain">
							<label for="inteboard_Image">
								<p>수정 할 사진을 선택해주세요.</p></label><br>
							<img id="preview" src="/board/${boardContents.user_Id}/${boardContents.inte_Image}"  onerror="no_image()"/>
							<input type="file" id="inteboard_Image" name="inte_Image" accept="image/*" multiple>
							<h1 class="imgh2"></h1>
						</div>
					</div>
			</div>
			<input type="hidden" name="originalFileName" value="${boardContents.inte_Image}">
            <input type="hidden" name="inte_Num" value="${boardContents.inte_Num}">
		</div>
       
			<div>
				<div id="update_btn">
				<button type="submit" id="submit_btn" class="btn btn-success">수정 완료</button>
				<button type="button" id="cancel_btn" onclick="location.href='/board/read?inte_Num=${boardContents.inte_Num}'">돌아가기</button>	
				</div>
        </form>
		
</body>
</html>