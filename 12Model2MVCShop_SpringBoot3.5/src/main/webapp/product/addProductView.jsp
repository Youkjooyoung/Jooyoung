<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<section class="container" data-page="product-add" data-ctx="${ctx}">
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
            <input type="text" id="manuDate" name="manuDate" class="input-text w-200" placeholder="YYYY-MM-DD" autocomplete="off" required>
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
        <td><input type="number" id="stockQty" name="stockQty" min="1" value="1"/></td>
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
</section>
