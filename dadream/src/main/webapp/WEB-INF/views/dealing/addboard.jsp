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
    <title>게시판 글쓰기</title>
	<!--CSS-->
	<link rel="stylesheet" href="/css/addboard.css">
	<!--JS-->
	<script src="/js/dealingJS/addboard.js"></script>
	<script src="http://code.jquery.com/jquery-latest.js"></script>
	<!--구글폰트-->
	<!-- 글꼴 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
    <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
    <!-- 부트스트랩 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
</head>
<body>
    <form action="${contextPath}/addinteboard.do" method="post" enctype="multipart/form-data"  onsubmit="return _onSubmit();">
		<div id="addboardform">
			<div id="writer">
				<td align="right">작성자:&nbsp;&nbsp; </td>
				<input type="text" size="20" maxlength="100" value="${member.user_Id }" name="user_Id" readonly disabled />
			</div>
			<div id="board_Title">
				<td align="right">제목:&nbsp;&nbsp; </td>
				<td colspan="2"><input type="text" size="63" maxlength="100" name="inte_Title" id="inte_Title" /></td>		
			</div>
			<div id="board_Context">
				<td align="right" valign="top">내용:&nbsp;&nbsp; </td>
				<textarea rows="10" cols="65" maxlength="5000"name="inte_Text" id="inte_Text"></textarea>
			</div>		
			<div id="board_img">
				<td>
					<div class="inteImg">
						<div class="inteMain">
							<label for="inteboard_Image">
								<p>업로드 하실 사진을 선택해주세요.</p></label><br>
							<img id="preview" src="/image/choice.png"  onerror="no_image()"/>
							<input type="file" id="inteboard_Image" name="inte_Image" accept="image/*" multiple>
							<h1 class="imgh2"></h1>
						</div>
					</div>
				</td>
                    	<div class="btnform">
							<input type="submit" value="등록하기" id="sub" />
							<input type="button" value="목록보기" id="List" onClick="backToList(this.form)"/>
						</div>
                        
                	</div>	
				</div>	
        </form>
		<script>
			function backToList(obj){
	 	 obj.action="${contextPath}/inteboardlist.do";
		 obj.submit();
	 }
		</script>
		
</body>
</html>