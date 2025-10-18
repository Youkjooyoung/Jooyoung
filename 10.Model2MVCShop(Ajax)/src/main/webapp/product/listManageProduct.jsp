<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>판매상품 관리</title>

  <!--  naver-common.css만 사용 -->
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/naver-common.css"/>

  <!-- ✅ jQuery + 페이지 전용 JS -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" defer></script>
  <script src="${ctx}/javascript/listManageProduct.js?v=<%=System.currentTimeMillis()%>" defer></script>
</head>

<body data-ctx="${ctx}" data-role="admin">
<div class="container">

  <div class="page-title"><h2>판매상품 관리</h2></div>
  
  <!-- ✅ 검색 영역 -->
  <div class="search-bar">
    <div class="search-controls">
      <select id="searchCondition" class="input-select">
        <option value="0"         <c:if test="${search.searchCondition == '0'}">selected</c:if>>전체</option>
        <option value="prodName"  <c:if test="${search.searchCondition == 'prodName'}">selected</c:if>>상품명</option>
        <option value="prodDetail"<c:if test="${search.searchCondition == 'prodDetail'}">selected</c:if>>상세내용</option>
      </select>
      <input type="text" id="searchKeyword" class="input-text search-keyword"
             placeholder="검색어 입력" autocomplete="off"
             value="${fn:escapeXml(search.searchKeyword)}"/>
      <button type="button" id="btnSearch" class="btn-green">검색</button>
    </div>
  </div>

  <!-- ✅ 상품 리스트 -->
  <table class="list-table">
    <thead>
      <tr>
        <th style="width:80px;">번호</th>
        <th style="width:200px;">상품명</th>
        <th style="width:140px;">가격
          <span class="sort-btn" data-sort="priceAsc">▲</span>
          <span class="sort-btn" data-sort="priceDesc">▼</span>
        </th>
        <th style="width:140px;">등록일자</th>
        <th style="width:220px;">상태</th>
        <th style="width:240px;">배송/내역</th>
      </tr>
    </thead>

    <tbody id="listBody">
      <c:forEach var="p" items="${list}">
        <c:set var="info" value="${latestInfo[p.prodNo]}"/>
        <tr data-prodno="${p.prodNo}">
          <td>${p.prodNo}</td>
          <td><span class="btn-detail" data-prodno="${p.prodNo}">${p.prodName}</span></td>
          <td><fmt:formatNumber value="${p.price}" pattern="#,###"/> 원</td>
          <td><fmt:formatDate value="${p.regDate}" pattern="yyyy-MM-dd"/></td>

          <!-- ✅ 상태 표시 -->
          	<td>
			  <c:choose>
			    <c:when test="${p.stockQty <= 0}">
			      <span class="text-red">품절</span>
			    </c:when>
			    <c:otherwise>
			      판매중
			    </c:otherwise>
			  </c:choose>
			</td>

          <!--  배송/내역 버튼 -->
          	<td>
			  <div class="order-btn-wrap">
			    <button class="btn-gray btn-order-history" data-prodno="${p.prodNo}">주문내역</button>
			    <c:if test="${p.cancelReqCnt != null && p.cancelReqCnt > 0}">
			      <span class="badge-alert" title="미처리 취소요청 있음">!</span>
			    </c:if>
			  </div>
			</td>
        </tr>
      </c:forEach>

      <c:if test="${empty list}">
        <tr><td colspan="6" class="text-center">등록된 상품이 없습니다.</td></tr>
      </c:if>
    </tbody>
  </table>

  <!-- ✅ 페이지 네비게이션 -->
  <div class="pagination">
    <jsp:include page="../common/pageNavigator.jsp"/>
  </div>
</div>

<!-- ✅ 주문내역 모달 -->
<div id="historyModal" class="dlg-mask hidden" role="dialog" aria-modal="true" aria-label="주문내역">
  <div class="dlg dlg-lg"> <!-- dlg-sm → dlg-lg 로 변경 -->
    <div class="dlg-hd">주문내역</div>
    <div class="dlg-bd" style="padding:0;">
      <iframe class="dlg-iframe" title="주문내역" 
              style="width:100%;height:600px;border:none;overflow:auto;"></iframe>
    </div>
    <div class="dlg-ft">
      <button type="button" class="btn-green dlg-close">닫기</button>
    </div>
  </div>
</div>

</body>
</html>
