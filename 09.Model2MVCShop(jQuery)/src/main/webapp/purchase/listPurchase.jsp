<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 내역</title>
  <link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css"/>
  <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
  <!-- App 유틸 먼저 -->
  <script src="${ctx}/javascript/app-core.js"></script>
  <!-- 페이지 스크립트 다음 -->
  <script src="${ctx}/javascript/listPurchase.js"></script>
</head>
<body data-ctx="${ctx}">
<div style="width:98%; margin-left:10px;">

  <!-- 제목 -->
  <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
      <td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
        <span class="ct_ttl01">구매 내역</span>
      </td>
      <td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
    </tr>
  </table>

  <!-- 구매 내역 -->
  <table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-top:10px; table-layout:fixed;">
    <thead>
      <tr>
        <td class="ct_list_b" width="10%"  style="text-align:center;">No</td>
        <td class="ct_list_b" width="30%"  style="text-align:center;">상품명</td>
        <td class="ct_list_b" width="15%"  style="text-align:center;">가격</td>
        <td class="ct_list_b" width="20%"  style="text-align:center;">주문일자</td>
        <td class="ct_list_b" width="15%"  style="text-align:center;">상태</td>
      </tr>
    </thead>
    <tbody>
      <c:forEach var="p" items="${list}" varStatus="st">
        <tr class="ct_list_pop">
          <td align="center">${st.index + 1}</td>
          <td align="center">
            <span class="purchase-link" data-tranno="${p.tranNo}">
              ${p.purchaseProd.prodName}
            </span>
          </td>
          <td align="center"><fmt:formatNumber value="${p.purchaseProd.price}" type="number"/> 원</td>
          <td align="center"><fmt:formatDate value="${p.orderDate}" pattern="yyyy-MM-dd"/></td>
          <td align="center">
            <c:choose>
              <c:when test="${p.tranCode == '001'}">주문완료</c:when>
              <c:when test="${p.tranCode == '002'}">
                물품수령대기
                <button type="button" class="ct_btn01 btn-confirm"
                        data-tranno="${p.tranNo}"
                        data-prodno="${p.purchaseProd.prodNo}">
                  수령확인
                </button>
              </c:when>
              <c:when test="${p.tranCode == '003'}">배송완료</c:when>
              <c:when test="${p.tranCode == '004'}"><span style="color:red;">취소됨</span></c:when>
              <c:otherwise>-</c:otherwise>
            </c:choose>
          </td>
        </tr>
        <tr><td colspan="5" bgcolor="D6D7D6" height="1"></td></tr>
      </c:forEach>
    </tbody>
  </table>
</div>
</body>
</html>
