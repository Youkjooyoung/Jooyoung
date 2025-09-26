<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="p" value="${requestScope.product}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>상품 수정</title>
<link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
</head>
<body>
	<table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
		<tr>
			<td width="15"><img src="${ctx}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
			<td background="${ctx}/images/ct_ttl_img02.gif" style="padding-left:10px;">
				<span class="ct_ttl01">상품 수정</span>
			</td>
			<td width="12"><img src="${ctx}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
		</tr>
	</table>
<c:choose>
	<c:when test="${empty p}">
		<p style="color:red;">상품을 찾을 수 없습니다.</p>
	</c:when>
	<c:otherwise>
		<form method="post" action="${ctx}/product/updateProduct" enctype="multipart/form-data">
			<input type="hidden" name="prodNo" value="${p.prodNo}"/>

			<table width="100%" border="0" cellspacing="0" cellpadding="6" style="margin-top:10px;">
				<tr>
					<td class="ct_list_b">상품명</td>
					<td class="ct_list_pop">
						<input type="text" name="prodName" value="${p.prodName}" required/>
					</td>
				</tr>
				<tr>
					<td class="ct_list_b">상세정보</td>
					<td class="ct_list_pop">
						<input type="text" name="prodDetail" value="${p.prodDetail}"/>
					</td>
				</tr>
				<tr>
					<td class="ct_list_b">제조일자</td>
					<td class="ct_list_pop">
						<input type="text" name="manuDate" value="${p.manuDate}" readonly="readonly"/>
					</td>
				</tr>
				<tr>
					<td class="ct_list_b">가격</td>
					<td class="ct_list_pop">
						<input type="text" id="price" name="price" value="${p.price}" required/> 원
					</td>
				</tr>
				<tr>
					<td class="ct_list_b">기존 이미지</td>
					<td class="ct_list_pop">
						<div style="display:flex; flex-wrap:wrap; gap:10px;">
							<c:forEach var="img" items="${productImages}">
								<div style="position:relative; display:inline-block;">
									<img src="${ctx}/images/uploadFiles/${img.fileName}" 
									     alt="${p.prodName}" style="width:100px; border:1px solid #ccc; border-radius:4px;"/>
									<span class="delete-existing" data-imgid="${img.imgId}"
									      style="position:absolute; top:2px; right:2px; background:rgba(0,0,0,0.6); color:#fff;
									             font-size:12px; width:20px; height:20px; text-align:center; line-height:20px;
									             border-radius:50%; cursor:pointer;">✖</span>
								</div>
							</c:forEach>
						</div>
					</td>
				</tr>
				<tr>
					<td class="ct_list_b">새 이미지 업로드</td>
					<td class="ct_list_pop">
						<input type="file" id="uploadFiles" name="uploadFiles" multiple="multiple"/>
						<div id="preview-container" style="margin-top:10px; display:flex; gap:10px; flex-wrap:wrap;"></div>
					</td>
				</tr>
			</table>

			<div style="margin-top:12px; text-align:right;">
				<button type="submit" class="ct_btn01">저장</button>
				<a class="ct_btn01" href="${ctx}/product/getProduct?prodNo=${p.prodNo}">취소</a>
			</div>
		</form>
	</c:otherwise>
</c:choose>

<script src="${ctx}/javascript/preview.js"></script>
</body>
</html>
