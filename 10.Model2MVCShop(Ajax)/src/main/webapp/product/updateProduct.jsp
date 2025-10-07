<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="p" value="${requestScope.product}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>상품 수정</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css"/>
  <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
  <script src="https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/updateProduct.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container">

  <div class="page-title"><h2>상품 수정</h2></div>

  <c:choose>
    <c:when test="${empty p}">
      <p class="msg-error">상품을 찾을 수 없습니다.</p>
    </c:when>
    <c:otherwise>
      <form id="updateProductForm" enctype="multipart/form-data">
        <input type="hidden" name="prodNo" id="prodNo" value="${p.prodNo}"/>
        <input type="hidden" name="deleteImageIds" id="deleteImageIds"/>

        <div class="two-col">
          <!-- 왼쪽: 상품 기본정보 -->
          <div class="col-left">
            <table class="form-table">
              <tr>
                <th>상품명</th>
                <td><input type="text" name="prodName" value="${p.prodName}" class="input-text w-200"/></td>
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
                  <input type="text" name="manuDate" id="manuDate" value="${p.manuDate}" readonly class="input-text w-200"/>
                </td>
              </tr>
              <tr>
                <th>가격</th>
                <td>
                  <div class="nv-price-wrap">
                    <input type="text" name="price" id="price" value="${p.price}" class="input-text w-200"/> 
                    <span class="nv-unit">원</span>
                  </div>
                </td>
              </tr>
            </table>
          </div>

          <!-- 오른쪽: 이미지 영역 -->
          <div class="col-right">
            <div class="page-subtitle"><h3>기존 이미지</h3></div>
            <div class="img-grid">
              <c:forEach var="img" items="${productImages}">
                <div class="img-box" data-imgid="${img.imgId}">
                  <img src="${ctx}/upload/${img.fileName}" alt="${p.prodName}" class="img-existing"/>
                  <button type="button" class="btn-delete-existing" data-imgid="${img.imgId}">✖</button>
                </div>
              </c:forEach>
            </div>

            <div class="page-subtitle mt-16"><h3>새 이미지</h3></div>
            <input type="file" id="uploadFiles" name="uploadFiles" multiple accept="image/*" class="input-text"/>
            <div id="preview-container"></div>
          </div>
        </div>

        <div class="btn-area mt-16">
          <button type="button" class="btn-green" id="btnSave">수정완료</button>
          <button type="button" class="btn-gray" id="btnCancel">취소</button>
          <button type="button" class="btn-gray" id="btnList">목록</button>
        </div>
      </form>
    </c:otherwise>
  </c:choose>
</div>
</body>
</html>
