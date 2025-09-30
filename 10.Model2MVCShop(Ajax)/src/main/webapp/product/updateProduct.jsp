<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctxPath" value="${pageContext.request.contextPath}" />
<c:set var="p" value="${requestScope.product}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>상품 수정</title>

  <!-- CSS -->
  <link rel="stylesheet" href="${ctxPath}/css/naver-common.css" />
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css" />
<!-- JS -->
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <script>window.APP_CTX='${ctxPath}';</script>
  <script src="${ctxPath}/javascript/app-core.js"></script>
  <script src="${ctxPath}/javascript/updateProduct.js"></script>
</head>
<body data-ctx="${ctxPath}">
<div class="container">
  <div class="page-title"><h2>상품 수정</h2></div>

  <c:choose>
    <c:when test="${empty p}">
      <p class="msg-error">상품을 찾을 수 없습니다.</p>
    </c:when>
    <c:otherwise>
      <form id="updateProductForm">
        <input type="hidden" name="prodNo" id="prodNo" value="${p.prodNo}" />
        <input type="hidden" name="deleteImageIds" id="deleteImageIds" />

        <table class="form-table">
          <tr>
            <th>상품명</th>
            <td>
              <input type="text" name="prodName" id="prodName"
                     value="${p.prodName}" maxlength="20" class="input-text"/>
            </td>
          </tr>

          <tr>
            <th>상품상세정보</th>
            <td>
              <div id="editor"></div>
              <textarea id="prodDetail" name="prodDetail" style="display:none;"></textarea>
              <textarea id="detailInit" style="display:none;">${p.prodDetail}</textarea>
            </td>
          </tr>

          <tr>
            <th>제조일자</th>
            <td>
              <input type="text" id="manuDate" name="manuDate" value="${p.manuDate}"
                     readonly class="input-text"/>
            </td>
          </tr>

          <tr>
            <th>가격</th>
            <td>
              <input type="text" id="price" name="price" value="${p.price}" class="input-text"/> 원
            </td>
          </tr>

          <tr>
            <th>기존 이미지</th>
            <td>
              <div class="img-grid" id="existingImages">
                <c:forEach var="img" items="${productImages}">
                  <div class="img-box" data-imgid="${img.imgId}">
                    <img class="img-existing"
                         src="${ctxPath}/upload/${img.fileName}"
                         alt="${p.prodName}" />
                    <button type="button" class="btn-delete-existing"
                            title="이미지 삭제" data-imgid="${img.imgId}">✖</button>
                  </div>
                </c:forEach>
              </div>
            </td>
          </tr>

          <tr>
            <th>새 이미지</th>
            <td>
              <input type="file" id="uploadFiles" name="uploadFiles" multiple class="input-text"/>
              <div id="preview-container"></div>
            </td>
          </tr>
        </table>

        <div class="btn-area">
          <button type="button" class="btn-green" id="btnSave">수정완료</button>
          <button type="button" class="btn-gray" id="btnCancel" data-prodno="${p.prodNo}">수정취소</button>
        </div>
      </form>
    </c:otherwise>
  </c:choose>
</div>
</body>
</html>
