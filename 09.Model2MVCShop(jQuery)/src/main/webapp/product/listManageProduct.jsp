<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>판매상품 관리</title>
    <link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
    <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
    <script src="${ctx}/javascript/listManageProduct.js"></script>
</head>
<body data-ctx="${ctx}">

<div style="width:98%; margin:10px auto;">

    <!-- 타이틀 -->
    <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"></td>
            <td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
                <span class="ct_ttl01">판매상품 관리</span>
            </td>
            <td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"></td>
        </tr>
    </table>

    <!-- 상품 리스트 -->
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
        <c:forEach var="product" items="${list}">
            <tr>
            <!-- 상품번호 -->
                <td class="ct_list_pop">${product.prodNo}</td>
                <!-- 상품명 -->
                <td class="ct_list_pop">
				  <span class="prod-link"
				        data-prodno="${product.prodNo}"
				        data-filename="${product.fileName}">
				    		${product.prodName}
				  </span>
				</td>
                <td class="ct_list_pop">
                    <fmt:formatNumber value="${product.price}" type="number" groupingUsed="true"/> 원
                </td>
                <td class="ct_list_pop">${product.manuDate}</td>

                <!-- 구매자ID -->
					<td class="ct_list_pop">
					    <c:out value="${empty product.buyerId ? '-' : product.buyerId}"/>
					</td>
					
					<!-- 구매일자 -->
					<td class="ct_list_pop">
					    <c:out value="${empty product.buyDate ? '-' : product.buyDate}"/>
					</td>

                <!-- 상태 -->
					<td class="ct_list_pop">
					  <c:set var="code" value="${latestCodeMap[product.prodNo]}"/>
					  <c:choose>
					    <c:when test="${not empty code and (fn:trim(code) eq '001' or fn:trim(code) eq '002')}">
					      재고없음
					    </c:when>
					    <c:otherwise>
					      판매중
					    </c:otherwise>
					  </c:choose>
					</td>

                <!-- 배송 관리 -->
                <c:set var="code" value="${latestCodeMap[product.prodNo]}"/>

				<td class="ct_list_pop">
				  <c:choose>
				    <c:when test="${code eq '001'}">
				      <button type="button" class="ct_btn01 btn-ship"
							            data-prodno="${product.prodNo}" data-trancode="002">
							        배송하기
				      </button>
				    </c:when>
					    <c:when test="${code eq '002'}">배송중</c:when>
					    <c:when test="${code eq '003'}">배송완료</c:when>
					    <c:when test="${code eq '004'}"><span style="color:red;">취소됨</span></c:when>
				    <c:otherwise>-</c:otherwise>
				  </c:choose>
				</td>
            </tr>
        </c:forEach>
    </tbody>
</table>

    <!-- 페이징 -->
    <div class="pagination" style="margin-top:15px; text-align:center;">
        <input type="hidden" id="currentPage" value="${resultPage.currentPage}" />
        <input type="hidden" id="menu" value="manage" />
        <input type="hidden" id="sort" value="${sort}" />

        <jsp:include page="../common/pageNavigator.jsp" />
    </div>
</div>
<!-- hover 썸네일 컨테이너 -->
<div id="hoverThumb" style="display:none; position:absolute; border:1px solid #ccc; background:#fff; padding:5px; z-index:999;"></div>

</body>
</html>
