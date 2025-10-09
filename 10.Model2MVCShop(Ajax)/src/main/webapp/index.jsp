<%@ page contentType="text/html; charset=UTF-8"%>
<%@ page pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Model2 MVC Shop</title>
</head>

<frameset rows="80,*" cols="*" frameborder="0" border="0"
	framespacing="0">
	<frame src="/layout/top.jsp" name="topFrame" scrolling="NO" noresize
		frameborder="0">
	<frameset rows="*" cols="160,*" frameborder="0" border="0"
		framespacing="0">
		<frame src="/layout/left.jsp" name="leftFrame" scrolling="NO" noresize
			frameborder="0">
		<!-- ✅ 초기 진입 시 main.jsp를 우측에 띄우도록 수정 -->
		<frame src="/layout/main.jsp" name="rightFrame" scrolling="auto" frameborder="0">
	</frameset>
</frameset>

<noframes>
	<body>
	</body>
</noframes>

</html>
