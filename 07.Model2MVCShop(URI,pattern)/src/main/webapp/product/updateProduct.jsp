<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />
<c:set var="p" value="${requestScope.product}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>상품 수정</title>
<link rel="stylesheet" href="<c:url value='/css/getProduct.css'/>">
</head>
<body>
	<h1>상품 수정</h1>

	<c:choose>
		<c:when test="${empty p}">
            상품을 찾을 수 없습니다.
        </c:when>
		<c:otherwise>
			<form method="post" action="${ctx}/product/updateProduct"
				enctype="multipart/form-data">
				<input type="hidden" name="prodNo" value="${p.prodNo}">
				<table border="1" cellspacing="0" cellpadding="8" width="100%">
					<tr>
						<td class="kv">상품명</td>
						<td><input type="text" name="prodName" value="${p.prodName}"
							required></td>
					</tr>
					<tr>
						<td class="kv">상세정보</td>
						<td><input type="text" name="prodDetail"
							value="${p.prodDetail}"></td>
					</tr>
					<tr>
						<td class="kv">제조일자</td>
						<td><input type="text" name="manuDate" value="${p.manuDate}"
							placeholder="YYYYMMDD 또는 YYYY-MM-DD" readonly="readonly"></td>
					</tr>
					<tr>
						<td class="kv">가격</td>
						<td><input type="number" name="price" value="${p.price}"
							required></td>
					</tr>
					<tr>
						<td class="kv">기존 이미지</td>
						<td>
							<div id="existing-images"
								style="display: flex; flex-wrap: wrap; gap: 10px;">
								<c:forEach var="img" items="${productImages}">
									<div class="image-wrapper"
										style="position: relative; display: inline-block;">
										<img src="${ctx}/images/uploadFiles/${img.fileName}"
											alt="${p.prodName}"
											style="width: 100px; height: auto; border: 1px solid #ccc; border-radius: 4px;" />
										<!-- X 버튼 -->
										<span class="delete-existing" data-imgid="${img.imgId}"
											style="position: absolute; top: 2px; right: 2px; background: rgba(0, 0, 0, 0.6); color: #fff; font-size: 12px; width: 20px; height: 20px; text-align: center; line-height: 20px; border-radius: 50%; cursor: pointer;">✖</span>
									</div>
								</c:forEach>
							</div>
						</td>
					</tr>

					<tr>
						<td class="kv">새 이미지 업로드</td>
						<td><input type="file" id="uploadFiles" name="uploadFiles"
							multiple="multiple" />
							<div id="preview-container"
								style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;"></div>
							<p style="font-size: 12px; color: gray;">
								※ 새로 선택한 이미지는 기존 이미지에 <b>추가</b> 등록됩니다.<br> ※ 썸네일의 <b>✖
									버튼</b>을 누르면 삭제 처리됩니다.
							</p></td>
					</tr>
				</table>
				<div style="margin-top: 12px; text-align: right;">
					<button type="submit" class="btn">저장</button>
					<a class="btn"
						href="<c:url value='/product/getProduct'><c:param name='prodNo' value='${p.prodNo}'/></c:url>">취소</a>
				</div>
			</form>
		</c:otherwise>
	</c:choose>

	<!-- 외부 JS 연결 -->
	<script src="<c:url value='/javascript/updateProduct.js'/>"></script>
</body>
</html>
