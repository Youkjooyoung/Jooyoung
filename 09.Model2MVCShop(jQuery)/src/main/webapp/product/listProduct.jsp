<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<html>
<head>
<title>상품 검색</title>
<link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
<script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
<script src="${ctx}/javascript/listProduct.js"></script>
</head>
<body>

<div style="width:98%; margin-left:10px;">
	<!-- 제목 -->
	<table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
			<td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
				<span class="ct_ttl01">상품 검색</span>
			</td>
			<td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
		</tr>
	</table>

	<!-- 검색 영역 -->
	<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:10px;">
	<tr>
		<td align="right">
			<form id="searchForm" style="display:inline;">
				<select name="searchCondition" id="searchCondition" class="ct_input_g">
					<option value="0" ${search.searchCondition == "0" ? "selected" : ""}>전체</option>
					<option value="prodName" ${search.searchCondition == "prodName" ? "selected" : ""}>상품명</option>
					<option value="prodDetail" ${search.searchCondition == "prodDetail" ? "selected" : ""}>상세설명</option>
				</select>
				<input type="text" name="searchKeyword" id="searchKeyword" value="${search.searchKeyword}" class="ct_input_g" style="width:200px;"/>
				페이지크기:
				<select name="pageSize" id="pageSize" class="ct_input_g">
				    <option value="5"  ${search.pageSize == 5 ? "selected" : ""}>5개</option>
				    <option value="10" ${search.pageSize == 10 ? "selected" : ""}>10개</option>
				    <option value="20" ${search.pageSize == 20 ? "selected" : ""}>20개</option>
				    <option value="50" ${search.pageSize == 50 ? "selected" : ""}>50개</option>
				</select>
				<input type="hidden" id="sort" value="${param.sort}"/>
				<input type="button" id="btnSearch" value="검색" class="ct_btn01"/>
				<input type="button" id="btnAll" value="전체보기" class="ct_btn01"/>
			</form>
		</td>
	</tr>
	</table>

	<!-- 상품 목록 -->
	<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:10px;">
		<tr>
			<td class="ct_list_b" width="100">번호</td>
			<td class="ct_line02"></td>
			<td class="ct_list_b" width="200">상품명</td>
			<td class="ct_line02"></td>
			<td class="ct_list_b" width="150">
				가격
				<span class="sort-btn" data-sort="priceAsc">▲</span>
				<span class="sort-btn" data-sort="priceDesc">▼</span>
			</td>
			<td class="ct_line02"></td>
			<td class="ct_list_b" width="150">등록일자</td>
			<td class="ct_line02"></td>
			<td class="ct_list_b" width="150">조회수</td>
			<td class="ct_line02"></td>
			<td class="ct_list_b" width="100">상태</td>
			<td class="ct_line02"></td>
			<td class="ct_list_b" width="150">관리</td>
		</tr>

		<c:forEach var="product" items="${list}">
		  <tr class="ct_list_pop">
		    <td align="center">${product.prodNo}</td>
		    <td></td>
		    <td align="left">
			  <div class="prod-link" 
			       data-prodno="${product.prodNo}" 
			       data-filename="${product.fileName}">
			    ${product.prodName}
			  </div>
			</td>
		    <td></td>
		    <td align="center">
		      <fmt:formatNumber value="${product.price}" type="number" groupingUsed="true"/> 원
		    </td>
		    <td></td>
		    <td align="center">${product.manuDate}</td>
		    <td></td>
		    <td align="center">${product.viewCount}</td>
		    <td></td>
		    <td align="center">
		      <c:choose>
		        <c:when test="${not empty latestCodeMap[product.prodNo]}">재고없음</c:when>
		        <c:otherwise>판매중</c:otherwise>
		      </c:choose>
		    </td>
		    <td></td>
		    <td align="center">
		      <c:choose>
		        <c:when test="${sessionScope.user.role == 'admin'}">
		          -
		        </c:when>
		        <c:otherwise>
		          <c:choose>
		            <c:when test="${empty latestCodeMap[product.prodNo]}">
		              <button type="button" class="ct_btn01 btn-buy" data-prodno="${product.prodNo}">구매하기</button>
		            </c:when>
		            <c:otherwise>-</c:otherwise>
		          </c:choose>
		        </c:otherwise>
		      </c:choose>
		    </td>
		  </tr>
		  <tr><td colspan="13" bgcolor="D6D7D6" height="1"></td></tr>
		</c:forEach>
	</table>

	<!-- 페이징 -->
	<div class="pagination" style="margin-top:10px; text-align:center;">
	    <jsp:include page="../common/pageNavigator.jsp" />
	</div>
</div>

<!-- 전역 hover 썸네일 -->
<div id="hoverThumb" style="display:none; position:absolute; border:1px solid #ccc; background:#fff; padding:5px; z-index:999;"></div>

<!-- 전역 변수 -->
<script>
  const ctx = "${ctx}";
</script>

</body>
</html>
