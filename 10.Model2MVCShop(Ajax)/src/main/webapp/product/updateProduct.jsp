<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="p" value="${requestScope.product}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>상품 수정</title>

  <!-- CSS -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <link rel="stylesheet" href="${ctx}/css/addPurchase.css"/>
  <link rel="stylesheet" href="${ctx}/css/updateProduct.css"/>
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css"/>

  <!-- JS -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js" defer></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js" defer></script>
  <script src="${ctx}/javascript/app-core.js" defer></script>
  <script src="${ctx}/javascript/updateProduct.js" defer></script>
</head>

<body data-ctx="${ctx}">
<div class="container">
  <div class="page-title"><h2>상품 수정</h2></div>

<form id="updateProductForm" enctype="multipart/form-data">
  <input type="hidden" name="prodNo" id="prodNo" value="${p.prodNo}"/>
  <input type="hidden" name="deleteImageIds" id="deleteImageIds"/>

    <table class="form-table">
      <tr>
        <th>상품명</th>
        <td><input type="text" id="prodName" name="prodName" value="${p.prodName}" class="input-text w-200" required></td>
      </tr>

      <tr>
        <th>상품상세정보</th>
        <td>
          <div id="editor" data-init-html="${p.prodDetail}"></div>
          <textarea id="prodDetail" name="prodDetail" hidden></textarea>
        </td>
      </tr>

      <tr>
        <th>제조일자</th>
        <td>
          <div class="nv-date-wrap">
            <input type="text" id="manuDate" name="manuDate" class="input-text w-200"
                   value="${p.manuDate}" placeholder="YYYY-MM-DD" autocomplete="off" required>
            <button type="button" class="nv-cal-btn" aria-label="달력 열기">📅</button>
          </div>
        </td>
      </tr>

      <tr>
        <th>가격</th>
        <td>
          <div class="nv-price-wrap">
            <input type="text" id="price" name="price" class="input-text w-200"
                   value="${p.price}" required>
            <span class="nv-unit">원</span>
          </div>
        </td>
      </tr>

      <tr>
        <th>재고 수량</th>
        <td><input type="number" id="stockQty" name="stockQty" value="${p.stockQty}" min="1" required></td>
      </tr>

     	 <tr>
      <th>기존 이미지</th>
      <td>
        <div class="img-grid" id="existGrid">
          <c:forEach var="img" items="${productImages}">
            <div class="img-box" data-imgid="${img.imgId}">
              <img src="${ctx}/images/uploadFiles/${img.fileName}" alt="${p.prodName}" />
              <button type="button" class="thumb-del" data-imgid="${img.imgId}" aria-label="삭제">✖</button>
            </div>
          </c:forEach>
          <c:if test="${empty productImages}">
            <p class="text-muted">등록된 이미지가 없습니다.</p>
          </c:if>
        </div>
      </td>
    </tr>

    <tr>
      <th>새 이미지</th>
      <td>
        <input type="file" id="uploadFiles" name="uploadFiles" multiple accept="image/*" class="input-text"/>
        <div class="img-grid" id="preview-container"></div>
      </td>
    </tr>
  </table>

  <div class="btn-area">
    <button type="button" class="btn-green" id="btnSave">수정완료</button>
    <button type="button" class="btn-gray" id="btnCancel">취소</button>
    <button type="button" class="btn-gray" id="btnList">목록</button>
  </div>
</form>
</div>
</body>
</html>
