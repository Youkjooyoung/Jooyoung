<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<section class="container" data-page="product-manage" data-ctx="${ctx}" data-role="admin">
  <div class="page-title"><h2>판매상품 관리</h2></div>

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
      <div id="acList" class="ac-list"></div>
      <button type="button" id="btnSearch" class="btn-green">검색</button>
    </div>
  </div>

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
        <tr data-prodno="${p.prodNo}">
          <td>${p.prodNo}</td>
          <td><span class="btn-detail" data-prodno="${p.prodNo}">${p.prodName}</span></td>
          <td><fmt:formatNumber value="${p.price}" pattern="#,###"/> 원</td>
          <td><fmt:formatDate value="${p.regDate}" pattern="yyyy-MM-dd"/></td>
          <td>
            <c:choose>
              <c:when test="${p.stockQty <= 0}"><span class="text-red">품절</span></c:when>
              <c:otherwise>판매중</c:otherwise>
            </c:choose>
          </td>
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

  <div class="pagination">
    <jsp:include page="../common/pageNavigator.jsp"/>
  </div>

  <!-- 주문내역 모달 -->
  <div id="historyModal" class="dlg-mask hidden" role="dialog" aria-modal="true" aria-label="주문내역">
    <div class="dlg dlg-lg">
      <div class="dlg-hd">주문내역</div>
      <div class="dlg-bd" style="padding:0;">
        <iframe class="dlg-iframe" title="주문내역" style="width:100%;height:600px;border:none;overflow:auto;"></iframe>
      </div>
      <div class="dlg-ft"><button type="button" class="btn-green dlg-close">닫기</button></div>
    </div>
  </div>
</section>
