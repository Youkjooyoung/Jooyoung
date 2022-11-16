<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false"
%>

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	request.setCharacterEncoding("UTF-8");
%>

<c:set var="member" value="${member.user_Id}"/>
<c:set var="contextPath" value="${pageContext.request.contextPath }" />
<c:set var="article" value="${articleMap.article }" />
<c:set var="imageFileList" value="${articleMap.imageFileList }" />
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>상세보기 페이지</title>
<!-- 글꼴 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
<link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
<!-- css -->
<link rel="stylesheet" href="/css/boardview.css">
<!--JS-->
<script defer src="/js/dealingJS/reply.js"></script>
<script src="/js/dealingJS/boardview.js"></script>
<script  src="http://code.jquery.com/jquery-latest.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

</head>
<body>
	<section id="container">
	<form  id="readForm" method="post" action="${contextPath}/board/update" enctype="multipart/form-data">
		<input type="hidden" name="inte_Num" value="${boardContents.inte_Num }" />
			<div id="viewboardform">
			<div id="writerName">
				<td align="center" bgcolor="pink">작성자</td>
				<div id="Eachform">
				<td>
					<input type="text" value="${boardContents.user_Id }" name="user_Id" disabled />
					<input id="backList" type="button"  value="목록으로 이동" onClick="backToList(this.form)">
				</td>
				</div>
			</div>

			<div >
				<td align="right" bgcolor="pink">제목&nbsp;&nbsp; </td>
				<td colspan="2">
					<input type="text" size="63" maxlength="100" value="${boardContents.inte_Title }" name="inte_Title" disabled /></td>
			</div>

			<div >
					<div>
						<td align="rigth" valign="top">내용&nbsp;&nbsp; </td>
					<td><textarea rows="20" cols="65" value="${boardContents.inte_Text}" name="inte_Text" disabled style="resize: none;">${boardContents.inte_Text}</textarea>
					</td>
					</div>
			</div>
			
			<div>
				<!-- <td>조회수</td> -->
				<td>
					<input id="viewCount" type="hidden" value="${boardContents.viewCounts }" name="viewCounts" disabled />
				</td>
			</div>
			<div class="inteImg">
			<div class="inteMain">
                    <img src="/board/${boardContents.user_Id}/${boardContents.inte_Image}" width="250" height="250">
			</div>
		</div>
			<!---------------------------------------------------------------------------------------------------------------->
			
			<div id="regDate">
				<td width="150" align="center" bgcolor="pink">
					등록일자
				</td>
			</div>
				<td>
					<input type="text" value="<fmt:formatDate value='${boardContents.inte_Date}'/>" disabled />
				</td>

			<div id="readbtn">	
			<c:if test="${user_Id == boardContents.user_Id}">
				<input type="button" id="updatebtn" value="수정하기" onClick="fn_update_article('/board/update?inte_Num=${boardContents.inte_Num}','${boardContents.inte_Num}')">
				<input type="button" id="delete" value="삭제하기" onClick="fn_remove_article('${contextPath}/board/removeArticle.do','${boardContents.inte_Num}')">	
			</c:if>
				
			</div>
		
	</div>
	</form>
	<div id="write_form">
		<input type="hidden" name="user_Id" value="${user_Id}">
		<input type="hidden" name="reply_regDate" value="${reply_regDate}">
		<input type="hidden" name="reply_Num" value="${reply_Num}">

		<textarea rows="5" cols="50" id="reply_content"></textarea>
		<button type="button" id="btn_add">댓글쓰기</button>
	</div>
</section>
	<div id="chat">
		
		<ul id="replyUL">
			
		</ul>
		<button id="load">더보기</button>
		
		
	</div>

</body>
</html>