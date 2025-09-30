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

  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <script src="${ctxPath}/javascript/preview.js"></script>
  <script src="${ctxPath}/javascript/addProduct.js"></script>
  <script src="${ctxPath}/javascript/app-core.js"></script>
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
		  <label for="prodDetail">상품상세정보</label>
		  <div id="prodDetail"></div>
	</div>

    <div class="form-group">
      <label for="manuDate">제조일자</label>
      <input type="date" id="manuDate" name="manuDate" class="hp_input" required>
      <button type="button" class="btn-calendar" id="calendarBtn" aria-label="달력 열기">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
             fill="currentColor" viewBox="0 0 16 16">
          <path d="M3.5 0a.5.5 0 0 1 .5.5V2h8V.5a.5.5 0 0 1 1 0V2h.5A1.5
                   1.5 0 0 1 15 3.5V4H1v-.5A1.5 1.5 0 0 1 2.5 2H3V.5a.5.5
                   0 0 1 .5-.5z"/>
          <path d="M1 14V5h14v9a2 2 0 0 1-2
                   2H3a2 2 0 0 1-2-2z"/>
        </svg>
      </button>
    </div>

    <div class="form-group">
      <label for="price">가격</label>
      <input type="text" id="price" name="price" class="hp_input" required> 원
    </div>

    <div class="form-group">
      <label for="uploadFiles">상품이미지</label>
      <input type="file" id="uploadFiles" name="uploadFiles" multiple class="hp_input">
      <div id="preview-container"></div>
    </div>

    <div class="btn-area">
      <button type="button" class="btn-green" id="btnAdd">등록</button>
      <button type="button" class="btn-gray" id="btnCancel">취소</button>
    </div>
  </form>
</div>
</body>
</html>
