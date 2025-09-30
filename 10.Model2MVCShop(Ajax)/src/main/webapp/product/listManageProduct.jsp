<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>판매상품 관리</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <!-- 캐시 버스트 -->
  <script src="${ctx}/javascript/app-core.js?v=20250930"></script>
  <script src="${ctx}/javascript/listManageProduct.js?v=20250930"></script>
</head>
<body data-ctx="${ctx}">
<div class="container">

  <!-- 제목 -->
  <div class="page-title">
    <h2>판매상품 관리</h2>
  </div>

  <!-- 리스트 -->
  <table class="list-table">
    <thead>
      <tr>
        <th>번호</th>
        <th>상품명</th>
        <th>가격</th>
        <th>등록일자</th>
        <th>구매자ID</th>
        <th>구매일자</th>
        <th>상태</th>
        <th>배송관리</th>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="row" items="${list}">
        <c:set var="info" value="${latestInfo[row.prodNo]}"/>
        <c:set var="code" value="${empty info ? '' : info.tranCode}"/>

        <tr data-prodno="${row.prodNo}">
          <td>${row.prodNo}</td>
          <td>
            <span class="prod-link"
                  data-prodno="${row.prodNo}"
                  data-filename="${row.fileName}">
              ${row.prodName}
            </span>
          </td>
          <td><fmt:formatNumber value="${row.price}" type="number"/> 원</td>
          <td>${row.manuDate}</td>

          <!-- 구매자ID -->
          <td>
            <c:choose>
              <c:when test="${code == '004' || code == '005'}">-</c:when>
              <c:otherwise>${empty row.buyerId ? '-' : row.buyerId}</c:otherwise>
            </c:choose>
          </td>

          <!-- 구매일자 -->
          <td>
            <c:choose>
              <c:when test="${code == '004' || code == '005'}">-</c:when>
              <c:otherwise>${empty row.buyDate ? '-' : row.buyDate}</c:otherwise>
            </c:choose>
          </td>

          <!-- 상태 -->
          <td>
            <c:choose>
              <c:when test="${code == '001' || code == '002'}">
                재고없음
                <button type="button" class="btn-gray btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
              </c:when>
              <c:when test="${code == '003'}">
                배송완료
                <button type="button" class="btn-gray btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
              </c:when>
              <c:when test="${code == '004'}">
                <span class="text-red">취소요청</span>
                <c:if test="${not empty info}">
                  <button type="button" class="btn-green btn-reason"
                          data-tranno="${info.tranNo}"
                          data-reason="${fn:escapeXml(info.cancelReason)}">사유보기</button>
                  <button type="button" class="btn-green btn-ack-cancel" data-prodno="${row.prodNo}">취소확인</button>
                  <button type="button" class="btn-gray btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
                </c:if>
              </c:when>
              <c:otherwise>
                판매중
                <button type="button" class="btn-gray btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
              </c:otherwise>
            </c:choose>
          </td>

          <!-- 배송 -->
          <td>
            <c:choose>
              <c:when test="${code == '001'}">
                <button type="button" class="btn-green btn-ship"
                        data-prodno="${row.prodNo}" data-trancode="002">배송하기</button>
              </c:when>
              <c:when test="${code == '002'}">배송중</c:when>
              <c:when test="${code == '003'}">배송완료</c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
        </tr>
      </c:forEach>
    </tbody>
  </table>

  <!-- 페이징 -->
  <div class="pagination">
    <input type="hidden" id="currentPage" value="${resultPage.currentPage}"/>
    <input type="hidden" id="menu" value="manage"/>
    <input type="hidden" id="sort" value="${sort}"/>
    <jsp:include page="../common/pageNavigator.jsp"/>
  </div>

  <!-- Hover 썸네일 -->
  <div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>

  <!-- 주문내역 모달 -->
  <div id="historyModal" class="dlg-mask" style="display:none;" role="dialog" aria-modal="true" aria-label="주문내역">
    <div class="dlg dlg-lg">
      <div class="dlg-hd">주문내역</div>
      <div class="dlg-bd">
        <iframe class="dlg-iframe" title="주문내역" style="width:100%;height:520px;border:0;"></iframe>
      </div>
      <div class="dlg-ft">
        <button type="button" class="ct_btn01 dlg-close">닫기</button>
      </div>
    </div>
  </div>

</div>
</body>
</html>
