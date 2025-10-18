<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<div class="nv-header" data-ctx="${ctx}">
  <input type="hidden" id="userIdForTop" value="${sessionScope.user != null ? sessionScope.user.userId : ''}"/>
  <h1 id="btnHome" class="nv-brand" role="button" tabindex="0" aria-label="홈으로">
    <span class="brand-mark-bg" role="img" aria-label="Model2 MVC Shop"></span>
    <span class="brand-title">Model2 MVC Shop</span>
  </h1>
  <nav class="nv-auth"></nav>
</div>
