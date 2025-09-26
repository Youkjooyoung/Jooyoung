<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:choose>
  <c:when test="${resultPage.currentPage <= 1}">
    <span class="page-link disabled" title="이전">◀ 이전</span>
  </c:when>
  <c:otherwise>
    <!-- 규칙: '<' 는 1페이지 이동 -->
    <span class="page-link" data-page="${resultPage.currentPage-1}" title="이전">◀ 이전</span>
  </c:otherwise>
</c:choose>

<c:forEach var="i" begin="${resultPage.beginUnitPage}" end="${resultPage.endUnitPage}" step="1">
  <span class="page-link${i == resultPage.currentPage ? ' disabled' : ''}" data-page="${i}" title="${i}">
    ${i}
  </span>
</c:forEach>

<c:choose>
  <c:when test="${resultPage.endUnitPage >= resultPage.maxPage}">
    <span class="page-link disabled" title="이후">이후 ▶</span>
  </c:when>
  <c:otherwise>
    <!-- 규칙: '>' 는 블록 이동(pageUnit 단위) -->
    <span class="page-link" data-page="${resultPage.endUnitPage+1}" title="이후">이후 ▶</span>
  </c:otherwise>
</c:choose>