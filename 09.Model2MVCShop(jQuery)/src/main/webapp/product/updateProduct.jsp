<%@ page contentType="text/html; charset=UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<c:set var="p" value="${requestScope.product}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 수정</title>
  <!-- 공통 CSS -->
  <link rel="stylesheet" href="${ctxPath}/css/admin.css" type="text/css">
  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <!-- 공통(미리보기) / 수정전용 -->
  <script src="${ctxPath}/javascript/preview.js"></script>
  <script src="${ctxPath}/javascript/updateProduct.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
</head>
<body data-ctx="${ctxPath}">
<div class="container">

  <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
    <tr>
      <td width="15"><img src="${ctxPath}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
      <td background="${ctxPath}/images/ct_ttl_img02.gif" style="padding-left:10px;">
        <span class="ct_ttl01">상품 수정</span>
      </td>
      <td width="12"><img src="${ctxPath}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
    </tr>
  </table>

  <c:choose>
    <c:when test="${empty p}">
      <p class="msg-error">상품을 찾을 수 없습니다.</p>
    </c:when>
    <c:otherwise>
      <form id="updateProductForm">
        <input type="hidden" name="prodNo" id="prodNo" value="${p.prodNo}"/>

        <table class="ct_box">
          <tr>
            <td class="ct_write">상품명</td>
            <td class="ct_write01">
              <input type="text" name="prodName" id="prodName" value="${p.prodName}" maxlength="20" class="hp_input">
            </td>
          </tr>
          <tr>
            <td class="ct_write">상품상세정보</td>
            <td class="ct_write01">
              <input type="text" name="prodDetail" id="prodDetail" value="${p.prodDetail}" maxlength="100" class="hp_input">
            </td>
          </tr>
          <tr>
            <td class="ct_write">제조일자</td>
            <td class="ct_write01">
              <input type="text" id="manuDate" name="manuDate" value="${p.manuDate}" readonly class="hp_input_bg">
            </td>
          </tr>
          <tr>
            <td class="ct_write">가격</td>
            <td class="ct_write01">
              <input type="text" id="price" name="price" value="${p.price}" class="hp_input"> 원
            </td>
          </tr>

          <!-- 기존 이미지 (삭제 가능) -->
          <tr>
            <td class="ct_write">기존 이미지</td>
            <td class="ct_write01">
              <div class="img-grid" id="existingImages">
                <c:forEach var="img" items="${productImages}">
                  <div class="img-box" data-imgid="${img.imgId}">
                    <img class="img-existing"
                         src="${ctxPath}/upload/uploadFiles/${img.fileName}"
                         data-filename="${img.fileName}"
                         alt="${p.prodName}">
                    <button type="button" class="btn-delete-existing" title="이미지 삭제" data-imgid="${img.imgId}">✖</button>
                  </div>
                </c:forEach>
              </div>
            </td>
          </tr>

          <!-- 새 이미지 (미리보기) -->
          <tr>
            <td class="ct_write">새 이미지</td>
            <td class="ct_write01">
              <input type="file" id="uploadFiles" name="uploadFiles" multiple class="hp_input">
              <div id="preview-container"></div>
            </td>
          </tr>
        </table>
        
        <div class="btn-area">
          <span class="ct_btn01" id="btnSave">수정완료</span>
          <span class="ct_btn01" id="btnCancel" data-prodno="${p.prodNo}">수정취소</span>
        </div>
      </form>

    </c:otherwise>
  </c:choose>
</div>
</body>
</html>
