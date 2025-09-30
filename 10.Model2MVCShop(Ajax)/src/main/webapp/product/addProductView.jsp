<%@ page contentType="text/html; charset=UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>상품 등록</title>
  <!-- Toast UI Editor -->
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css" />
  <!-- 공통 CSS -->
  <link rel="stylesheet" href="${ctxPath}/css/naver-common.css" type="text/css">
  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <script src="${ctxPath}/javascript/addProduct.js"></script>
</head>
<body data-ctx="${ctxPath}">
<div class="container">
  <div class="page-title">
    <h2>상품 등록</h2>
  </div>

  <form name="detailForm">
    <div class="form-group">
      <label for="prodName">상품명</label>
      <input type="text" id="prodName" name="prodName" maxlength="20" class="hp_input" required>
    </div>

    <div class="form-group editor-group">
      <label for="editor">상품상세정보</label>
      <div id="editor"></div>
      <textarea id="prodDetail" name="prodDetail" style="display:none;"></textarea>
    </div>
	    <!-- 제조일자 -->
	<div class="form-group">
	  <label for="manuDate">제조일자</label>
		  <input type="date" id="manuDate" class="hp_input" required>
		  <input type="hidden" name="manuDate" id="manuDateHidden">
	</div>

    <div class="form-group">
      <label for="price">가격</label>
      <input type="text" id="price" name="price" class="hp_input" required> 원
    </div>

    <div class="form-group">
      <label for="uploadFiles">상품이미지</label>
      <input type="file" id="uploadFiles" name="uploadFiles" multiple class="hp_input">
    </div>

    <div class="btn-area">
      <button type="button" class="btn-green" id="btnAdd">등록</button>
      <button type="button" class="btn-gray" id="btnCancel">취소</button>
    </div>
  </form>
</div>
</body>
</html>
