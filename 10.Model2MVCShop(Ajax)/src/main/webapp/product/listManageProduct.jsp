<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>판매상품 관리</title>

  <!-- 공통/페이지 CSS -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
  <link rel="stylesheet" href="${ctx}/css/listManageProduct.css" type="text/css">

  <!-- jQuery + 페이지 JS (캐시버스터) -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js" defer></script>
  <script src="${ctx}/javascript/listManageProduct.js?v=<%=System.currentTimeMillis()%>" defer></script>
</head>
<body data-ctx="${ctx}" data-role="admin">
<div class="container">

  <div class="page-title"><h2>판매상품 관리</h2></div>

  <!-- 검색영역 -->
  <div class="search-box">
    <div class="ac-wrap">
      <select id="searchCondition" class="input-select">
        <option value="0"         <c:if test="${search.searchCondition == '0'}">selected</c:if>>전체</option>
        <option value="prodName"  <c:if test="${search.searchCondition == 'prodName'}">selected</c:if>>상품명</option>
        <option value="prodDetail"<c:if test="${search.searchCondition == 'prodDetail'}">selected</c:if>>상세내용</option>
      </select>
      <input type="text"
             id="searchKeyword"
             class="input-text"
             placeholder="검색어 입력"
             autocomplete="off"
             value="${fn:escapeXml(search.searchKeyword)}">
      <div class="ac-list" id="acList" role="listbox" aria-label="자동완성"></div>
    </div>
    <button type="button" id="btnSearch" class="btn-green">검색</button>
  </div>

  <!-- 리스트 -->
  <table class="list-table">
    <thead>
      <tr>
        <th style="width:80px;">번호</th>
        <th style="width:200px;">상품명</th>
        <th style="width:160px;">가격
          <span class="sort-btn" data-sort="priceAsc">▲</span>
          <span class="sort-btn" data-sort="priceDesc">▼</span>
        </th>
        <th style="width:140px;">등록일자</th>
        <th style="width:220px;">상태</th>
        <th style="width:220px;">배송/내역</th>
      </tr>
    </thead>

    <tbody id="listBody">
      <c:forEach var="p" items="${list}">
        <c:set var="info" value="${latestInfo[p.prodNo]}"/>
        <tr data-prodno="${p.prodNo}">
          <td>${p.prodNo}</td>
         	<td>
			  <span class="btn-detail" data-prodno="${p.prodNo}">
			    ${p.prodName}
			  </span>
			</td>

          <td><fmt:formatNumber value="${p.price}" pattern="#,###"/> 원</td>
          <td><fmt:formatDate value="${p.regDate}" pattern="yyyy-MM-dd"/></td>

         			<td>
						  <c:choose>
						    <c:when test="${empty info}">판매중</c:when>
						    <c:when test="${info.tranCode == '001'}">주문완료</c:when>
						    <c:when test="${info.tranCode == '002'}">배송중</c:when>
						    <c:when test="${info.tranCode == '003'}">배송완료</c:when>
						    <c:when test="${info.tranCode == '004'}">
						      <span class="text-red">취소요청</span>
						      <button type="button"
						              class="btn-gray btn-cancel-reason"
						              data-reason="${fn:escapeXml(info.cancelReason)}">
						        취소사유
						      </button>
						      <button type="button"
						              class="btn-green btn-ack-cancel"
						              data-prodno="${p.prodNo}">
						        취소확인
						      </button>
						    </c:when>
						    <c:when test="${info.tranCode == '005'}">판매중</c:when>
						    <c:otherwise>-</c:otherwise>
						  </c:choose>
					</td>

          <td>
            <c:if test="${info.tranCode == '001'}">
              <button class="btn-green btn-ship" data-prodno="${p.prodNo}" data-trancode="002">배송하기</button>
            </c:if>
            <c:if test="${info.tranCode == '002'}">
              <button class="btn-gray btn-ship" data-prodno="${p.prodNo}" data-trancode="003">배송완료</button>
            </c:if>
            <button class="btn-gray btn-order-history" data-prodno="${p.prodNo}">주문내역</button>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>

  <!-- 페이지네이션 -->
  <div class="pagination">
    <jsp:include page="../common/pageNavigator.jsp"/>
  </div>
</div>

<!-- 주문내역 모달 -->
<div id="historyModal" class="dlg-mask" role="dialog" aria-modal="true" aria-label="주문내역" style="display:none;">
  <div class="dlg dlg-lg">
    <div class="dlg-hd">주문내역</div>
    <div class="dlg-bd">
      <iframe class="dlg-iframe" title="주문내역"></iframe>
    </div>
    <div class="dlg-ft">
      <button type="button" class="ct_btn01 dlg-close">닫기</button>
    </div>
  </div>
</div>

<!-- 취소사유 알림용 (간단히 alert로 표시하되 필요 시 모달로 변경 가능) -->

</body>
</html>
