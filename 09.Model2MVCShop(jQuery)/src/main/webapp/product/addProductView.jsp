<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 등록</title>
  <link rel="stylesheet" href="${ctxPath}/css/admin.css" type="text/css">
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="${ctxPath}/javascript/calendar.js"></script>
  <script src="${ctxPath}/javascript/preview.js"></script>
  <script src="${ctxPath}/javascript/addProduct.js"></script>
</head>
<body data-ctx="${ctxPath}">
<div class="container">
  <form name="detailForm">
    <!-- 제목 -->
    <table width="100%" height="37" border="0" cellpadding="0" cellspacing="0">
      <tr>
        <td width="15"><img src="${ctxPath}/images/ct_ttl_img01.gif" width="15" height="37"/></td>
        <td background="${ctxPath}/images/ct_ttl_img02.gif" style="padding-left:10px;">
          <span class="ct_ttl01">상품 등록</span>
        </td>
        <td width="12"><img src="${ctxPath}/images/ct_ttl_img03.gif" width="12" height="37"/></td>
      </tr>
    </table>
    <!-- 입력 폼 -->
    <table class="ct_box">
      <tr>
        <td class="ct_write">상품명</td>
        <td class="ct_write01">
          <input type="text" name="prodName" maxlength="20" class="hp_input">
        </td>
      </tr>
      <tr>
        <td class="ct_write">상품상세정보</td>
        <td class="ct_write01">
          <input type="text" name="prodDetail" maxlength="100" class="hp_input">
        </td>
      </tr>
      <tr>
        <td class="ct_write">제조일자</td>
        <td class="ct_write01">
          <input type="text" id="manuDate" name="manuDate" readonly placeholder="YYYYMMDD" class="hp_input">
          <img src="${ctxPath}/images/ct_icon_date.gif" class="icon-btn" alt="달력 열기"/>
        </td>
      </tr>
      <tr>
        <td class="ct_write">가격</td>
        <td class="ct_write01">
          <input type="text" id="price" name="price" class="hp_input"> 원
        </td>
      </tr>
      <tr>
        <td class="ct_write">상품이미지</td>
        <td class="ct_write01">
          <input type="file" id="uploadFiles" name="uploadFiles" multiple class="hp_input">
          <div id="preview-container"></div>
        </td>
      </tr>
    </table>
    <!-- 버튼 -->
    <div class="btn-area">
      <span class="ct_btn01" id="btnAdd">등록</span>
      <span class="ct_btn01" id="btnCancel">취소</span>
    </div>
  </form>

</div>
</body>
</html>
