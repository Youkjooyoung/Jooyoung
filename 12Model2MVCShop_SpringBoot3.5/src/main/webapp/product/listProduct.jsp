<%-- 수정된 listProduct.jsp --%>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<section class="container" data-page="${param.menu eq 'manage' ? 'product-manage' : 'product-search'}" 
         data-ctx="${ctx}" data-role="${sessionScope.user.role}">
  
  <div class="page-title">
    <h2>${param.menu eq 'manage' ? '판매상품 관리' : '상품 검색'}</h2>
  </div>

  <c:choose>
    <c:when test="${param.menu eq 'manage'}">
      <!-- 판매상품 관리 화면 -->
      <jsp:include page="listManageProduct.jsp"/>
    </c:when>
    <c:otherwise>
      <!-- 상품 검색 화면 -->
      <jsp:include page="listProduct.fragment.jsp"/>
    </c:otherwise>
  </c:choose>

</section>
