<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<html>
<body>

<h3>default Exception page</h3>

<%
    Exception exception = (Exception) request.getAttribute("exception");
    String msg = (exception != null) ? exception.getMessage() : "No exception found (null)";
%>

<p>Java Code을 이용한 예외 Message 보기 :: <%= msg %></p>
<p>EL을 이용한 예외 Message 보기 :: ${message}</p>

<hr/>
<p>요청 URI: <%= request.getRequestURI() %></p>
<p>요청 URL: <%= request.getRequestURL() %></p>

</body>
</html>
