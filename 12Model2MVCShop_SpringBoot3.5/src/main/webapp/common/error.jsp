<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>오류</title>
</head>
<body data-ctx="${pageContext.request.contextPath}">
  <h3>default Exception page</h3>
  <p>예외 Message :: 
    <c:choose>
      <c:when test="${not empty requestScope.exception}">
        <c:out value="${requestScope.exception.message}"/>
      </c:when>
      <c:otherwise>No exception found (null)</c:otherwise>
    </c:choose>
  </p>
  <p>EL을 이용한 예외 Message 보기 :: <c:out value="${message}"/></p>
  <hr/>
  <p>요청 URI: <c:out value="${pageContext.request.requestURI}"/></p>
  <p>요청 URL: <c:out value="${pageContext.request.requestURL}"/></p>
</body>
</html>
