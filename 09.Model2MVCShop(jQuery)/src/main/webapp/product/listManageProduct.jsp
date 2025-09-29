<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>판매상품 관리</title>
  <link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>

  <!-- 캐시 버스트는 꼭 업데이트 -->
  <script src="${ctx}/javascript/app-core.js?v=20250929f"></script>
  <script src="${ctx}/javascript/order-list.js?v=20250929f"></script>
  <script src="${ctx}/javascript/listManageProduct.js?v=20250929f"></script>
</head>
<body data-ctx="${ctx}">
<div style="width:98%; margin:10px auto;">

  <!-- 제목 -->
  <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"></td>
      <td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
        <span class="ct_ttl01">판매상품 관리</span>
      </td>
      <td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"></td>
    </tr>
  </table>

  <!-- 리스트 -->
  <table width="100%" border="0" cellspacing="0" cellpadding="6" class="ct_box">
    <thead>
      <tr>
        <td class="ct_list_b">번호</td>
        <td class="ct_list_b">상품명</td>
        <td class="ct_list_b">가격</td>
        <td class="ct_list_b">등록일자</td>
        <td class="ct_list_b">구매자ID</td>
        <td class="ct_list_b">구매일자</td>
        <td class="ct_list_b">상태</td>
        <td class="ct_list_b">배송관리</td>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="row" items="${list}">
        <c:set var="info" value="${latestInfo[row.prodNo]}"/>
        <c:set var="code" value="${empty info ? '' : info.tranCode}"/>

        <tr data-prodno="${row.prodNo}"
            data-tranno="${not empty info && not empty info.tranNo ? info.tranNo : ''}">
          <td class="ct_list_pop">${row.prodNo}</td>
          <td class="ct_list_pop">
            <span class="prod-link"
                  data-prodno="${row.prodNo}"
                  data-filename="${row.fileName}">
              ${row.prodName}
            </span>
          </td>

          <td class="ct_list_pop"><fmt:formatNumber value="${row.price}" type="number"/> 원</td>
          <td class="ct_list_pop">${row.manuDate}</td>

          <td class="ct_list_pop">
            <c:choose>
              <c:when test="${code == '004' || code == '005'}">-</c:when>
              <c:otherwise><c:out value="${empty row.buyerId ? '-' : row.buyerId}"/></c:otherwise>
            </c:choose>
          </td>
          <td class="ct_list_pop">
            <c:choose>
              <c:when test="${code == '004' || code == '005'}">-</c:when>
              <c:otherwise><c:out value="${empty row.buyDate ? '-' : row.buyDate}"/></c:otherwise>
            </c:choose>
          </td>

          <td class="ct_list_pop">
  <c:choose>
    <c:when test="${code == '001'}">
      재고없음
      <button type="button" class="ct_btn02 btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
    </c:when>
    <c:when test="${code == '002'}">
      재고없음
      <button type="button" class="ct_btn02 btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
    </c:when>
    <c:when test="${code == '003'}">
      배송완료
      <button type="button" class="ct_btn02 btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
    </c:when>
    <c:when test="${code == '004'}">
      <span style="color:#c00;">취소요청</span>
      <c:if test="${not empty info}">
        <button type="button" class="ct_btn01 btn-reason"
                data-tranno="${info.tranNo}"
                data-reason="${fn:escapeXml(info.cancelReason)}">사유보기</button>
        <button type="button" class="ct_btn01 btn-ack-cancel" data-prodno="${row.prodNo}">취소확인</button>
        <button type="button" class="ct_btn02 btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
      </c:if>
    </c:when>
    <c:when test="${code == '005'}">
      판매중
      <button type="button" class="ct_btn02 btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
    </c:when>
    <c:otherwise>
      판매중
      <button type="button" class="ct_btn02 btn-order-history" data-prodno="${row.prodNo}">주문내역</button>
    </c:otherwise>
  </c:choose>
</td>


          <!-- 배송 -->
          <td class="ct_list_pop">
            <c:choose>
              <c:when test="${code == '001'}">
                <button type="button" class="ct_btn01 btn-ship"
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
  <div class="pagination" style="margin-top:15px; text-align:center;">
    <input type="hidden" id="currentPage" value="${resultPage.currentPage}"/>
    <input type="hidden" id="menu" value="manage"/>
    <input type="hidden" id="sort" value="${sort}"/>
    <jsp:include page="../common/pageNavigator.jsp"/>
  </div>

  <!-- Hover 썸네일 컨테이너 -->
  <div id="hoverThumb" style="display:none;position:absolute;border:1px solid #ccc;background:#fff;padding:5px;z-index:999;"></div>
</div>
</body>
</html>
