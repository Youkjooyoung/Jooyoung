<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c"   uri="jakarta.tags.core"%>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt"%>
<%@ taglib prefix="fn"  uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<c:set var="manuDateIso" value="${empty product.manuDate ? '' : product.manuDate}"/>

<section class="container panel" data-page="product-update" data-ctx="${ctx}">
  <style>
    .form-table{width:100%;border-collapse:separate;border-spacing:0 8px}
    .form-table th{width:140px;padding:6px 8px;text-align:left;color:#555;white-space:nowrap}
    .form-table td{padding:6px 8px}
    .input-text{width:100%}
    .btn-area{margin-top:10px}
    .btn-green{background:#03c75a;color:#fff;border:0;border-radius:10px;padding:9px 14px;cursor:pointer}
    .btn-gray{background:#e9ecef;color:#111;border:0;border-radius:10px;padding:9px 14px;cursor:pointer}
    .img-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}
    .img-box{position:relative;border:1px solid #e5e8eb;border-radius:10px;background:#f8f9fa;overflow:hidden;aspect-ratio:4/3}
    .img-box img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .2s}
    .img-box:hover img{transform:scale(1.02)}
    .thumb-del{position:absolute;right:6px;top:6px;border:0;border-radius:999px;width:28px;height:28px;background:#0008;color:#fff;cursor:pointer}
    .img-box.removing::after{content:"삭제 예정";position:absolute;inset:0;background:rgba(0,0,0,.45);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:12px}
    .hint{color:#888;font-size:12px;margin-top:6px}
    .summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:6px 0 14px}
    .summary .cell{background:#f8f9fa;border:1px solid #eef0f2;border-radius:10px;padding:10px 12px}
    .summary .t{color:#667}
    .summary .v{font-weight:700}
  </style>

  <div class="page-title"><h2>상품 수정</h2></div>

  <!-- 상단 요약 -->
  <div class="summary">
    <div class="cell"><div class="t">상품번호</div><div class="v">${product.prodNo}</div></div>
    <div class="cell"><div class="t">상품명</div><div class="v"><c:out value="${product.prodName}"/></div></div>
    <div class="cell"><div class="t">가격</div><div class="v"><fmt:formatNumber value="${product.price}" type="number"/> 원</div></div>
    <div class="cell"><div class="t">재고</div><div class="v">${product.stockQty} 개</div></div>
  </div>

  <form id="updateProductForm" action="${ctx}/product/updateProduct" method="post" enctype="multipart/form-data">
    <input type="hidden" id="prodNo" name="prodNo" value="${product.prodNo}"/>
    <input type="hidden" id="deleteImageIds" name="deleteImageIds" value=""/>

    <table class="form-table">
      <tr>
        <th>상품명</th>
        <td><input type="text" id="prodName" name="prodName" class="input-text" value="<c:out value='${product.prodName}'/>" required></td>
      </tr>

      <tr>
        <th>상품상세정보</th>
        <td>
          <!-- ✅ 에디터가 읽을 원본(HTML) -->
          <textarea id="detailSource" style="display:none;"><c:out value="${product.prodDetail}"/></textarea>

          <!-- ✅ Toast UI Editor 컨테이너 -->
          <div id="editor"></div>

          <!-- 제출용(에디터 HTML 동기화) -->
          <textarea id="prodDetail" name="prodDetail" class="input-text" rows="8" style="display:none"></textarea>
          <div class="hint">* 에디터에서 작성한 내용이 저장 시 HTML로 전송됩니다.</div>
        </td>
      </tr>

      <tr>
        <th>제조일자</th>
        <td>
          <input type="text" id="manuDate" name="manuDate" class="input-text" value="${manuDateIso}" placeholder="YYYY-MM-DD" autocomplete="off">
        </td>
      </tr>

      <tr>
        <th>가격</th>
        <td>
          <fmt:formatNumber value="${product.price}" type="number" var="priceFmt"/>
          <input type="text" id="price" name="price" class="input-text" value="${priceFmt}" inputmode="numeric"> 원
        </td>
      </tr>

      <tr>
        <th>재고 수량</th>
        <td><input type="number" id="stockQty" name="stockQty" class="input-text" value="${product.stockQty}" min="0"></td>
      </tr>

      <tr>
        <th>기존 이미지</th>
        <td>
          <div class="img-grid" id="existGrid">
            <c:choose>
              <c:when test="${not empty productImages}">
                <c:forEach var="img" items="${productImages}">
                  <div class="img-box" data-imgid="${img.imgId}">
                    <img src="${ctx}/images/uploadFiles/${img.fileName}" alt="기존 이미지">
                    <button type="button" class="thumb-del" title="삭제">✖</button>
                  </div>
                </c:forEach>
              </c:when>
              <c:otherwise><span class="hint">등록된 이미지가 없습니다.</span></c:otherwise>
            </c:choose>
          </div>
          <div class="hint">* ✖ 버튼을 누르면 “삭제 예정”으로 표시되고 저장 시 삭제됩니다.</div>
        </td>
      </tr>

      <tr>
        <th>새 이미지</th>
        <td>
          <input type="file" id="uploadFiles" name="uploadFiles" accept="image/*" multiple>
          <div class="img-grid" id="previewGrid" style="margin-top:8px;"></div>
          <div class="hint">* 여러 장 선택 가능. 미리보기 썸네일에서 ✖ 버튼으로 제외할 수 있어요.</div>
        </td>
      </tr>
    </table>

    <div class="btn-area">
      <button type="button" id="btnSave"   class="btn-green">수정완료</button>
      <button type="button" id="btnCancel" class="btn-gray">취소</button>
      <button type="button" id="btnList"   class="btn-gray">목록</button>
    </div>
  </form>

  <link rel="stylesheet" href="https://uicdn.toast.com/editor/latest/toastui-editor.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/themes/material_green.css">
</section>
