<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>상품 등록</title>

  <!-- CSS (별도 관리) -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css"/>

  <!-- JS (디커플링) -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" defer></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" defer></script>
  <script>
    window.App = window.App || { ctx: function(){ return '${ctx}'; } };
  </script>
  <script src="${ctx}/javascript/addProduct.js" defer></script>
</head>
<body data-ctx="${ctx}">
<div class="container">
  <div class="page-title"><h2>상품 등록</h2></div>

  <!-- method/action 없음(요구사항) -->
  <form name="detailForm" enctype="multipart/form-data">
    <table class="form-table">
      <tr>
        <th>상품명</th>
        <td><input type="text" id="prodName" name="prodName" class="input-text w-200" maxlength="50" required></td>
      </tr>

      <tr>
        <th>상품상세정보</th>
        <td>
          <div id="editor"></div>
          <textarea id="prodDetail" name="prodDetail" hidden></textarea>
        </td>
      </tr>

      <tr>
        <th>제조일자</th>
        <td>
          <div class="nv-date-wrap">
            <input type="text" id="manuDate" name="manuDate" class="input-text w-200"
                   placeholder="YYYY-MM-DD" autocomplete="off" required>
            <button type="button" class="nv-cal-btn" aria-label="달력 열기">📅</button>
          </div>
          <input type="hidden" id="manuDateHidden" name="manuDateHidden">
        </td>
      </tr>

      <tr>
        <th>가격</th>
        <td>
          <div class="nv-price-wrap">
            <input type="text" id="price" name="price" class="input-text w-200" required>
            <span class="nv-unit">원</span>
          </div>
        </td>
      </tr>

      <tr>
        <th>재고 수량</th>
        <td><input type="number" id="stockQty" name="stockQty" min="1" value="1"/>
      </tr>

      <tr>
        <th>상품이미지</th>
        <td><input type="file" id="uploadFiles" name="uploadFiles" class="input-text" multiple accept="image/*"></td>
      </tr>
    </table>

    <div id="preview-container"></div>

    <div class="btn-area">
      <button type="button" class="btn-green" id="btnAdd">등록</button>
      <button type="button" class="btn-gray" id="btnCancel">취소</button>
    </div>
  </form>
</div>
</body>
</html>
