<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false"
%>

<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
	request.setCharacterEncoding("UTF-8");
%>
<!-- <c:set var="member" value="${member.user_Id}"/> -->
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
	<link rel="stylesheet" href="/css/noticeview.css">
	<!-- JS -->
	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	<script src="/js/dealingJS/noticeview.js"></script>

</head>
<body>
	<section id="container">
		<form id="readForm" method="get" action="${contextPath}/notice/update" enctype="multipart/form-data">
			<input type="hidden" name="notice_Num" value="${noticeContents.notice_Num }" />
			<div id="viewboardform">
				<div class="select_backBtn">
				<select name="notice_Category" id="notice_Category" disabled>
					<option value="부동산">부동산</option>
					<option value="가구">가구</option>
				</select>
				<input id="backList" type="button" value="목록으로 이동" onClick="backToList(this.form)">
				</div>
				<div id="writerName">
						<input type="hidden" value="${noticeContents.user_Id }" name="user_Id" disabled />
				</div>

				<div>
					<td align="right" bgcolor="pink">제목&nbsp;&nbsp; </td>
					<td colspan="2">
						<input type="text" size="63" maxlength="100" value="${noticeContents.notice_Title }"
							name="notice_Title" disabled /></td>
				</div>
				<div>
					<div class="contentForm">
						<td align="rigth" valign="top">내용&nbsp;&nbsp; </td>
						<td><textarea rows="20" cols="65" value="${noticeContents.notice_Text}" name="notice_Text"disabled  style="resize: none;">${noticeContents.notice_Text }</textarea>
						</td>
					</div>
				</div>

				<!-- <td>조회수</td> -->
				<td>
					<input id="viewCnt" type="hidden" value="${noticeContents.viewCnt }" name="viewCnt" disabled />
				</td>
			</div>
	
			<div id="regDate">
				<td width="150" align="center" bgcolor="pink">
					등록일자
				</td>
			</div>
			<td>
				<input type="text" value="<fmt:formatDate value='${noticeContents.notice_Date}'/>" disabled />
			</td>
			</section>
		</div>
	</form>
<script>
		function backToList(obj) {
		obj.action="${contextPath}/noticelist.do";
		obj.submit();
		}
		function readURL(input) {
			if(input.files && input.files[0]) {
			var reader = new FileReader();
			reader.onload = function (e) {
				$('#preview').attr('src', e.target.result);
			}
			reader.readAsDataURL(input.files[0]);
		}
		}
	
</script>
</body>

</html>