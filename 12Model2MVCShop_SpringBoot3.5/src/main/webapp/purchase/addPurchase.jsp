<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c"   uri="jakarta.tags.core" %>
<%@ taglib prefix="fmt" uri="jakarta.tags.fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!--
  addPurchase.jsp (fragment)
  - 레이아웃의 __layout.loadMain()이 data-page-css/js를 읽어 공통 뒤에 주입합니다.
  - head/body 없음. 오직 본문 조각만 반환.
-->
<div class="container purchase-wrap two-col"
     data-page="purchase-add"
     data-page-css="/css/addPurchase.css"
     data-page-js="/javascript/addPurchase.js">

  <!-- ========== 좌 : 상품 정보 + 이미지 ========== -->
  <section class="col-left panel">
    <div class="page-title"><h2>상품 정보</h2></div>
    <table class="form-table">
      <tr><th>상품번호</th><td>${product.prodNo}</td></tr>
      <tr><th>상품명</th><td>${product.prodName}</td></tr>
      <tr><th>가격</th><td><fmt:formatNumber value="${product.price}" type="number"/> 원</td></tr>
      <tr>
        <th>남은 재고</th>
        <td>
          <c:choose>
            <c:when test="${product.stockQty > 0}">${product.stockQty} 개</c:when>
            <c:otherwise><span style="color:#e03131;font-weight:700;">품절</span></c:otherwise>
          </c:choose>
        </td>
      </tr>
      <tr><th>상세설명</th><td style="line-height:1.6;">${product.prodDetail}</td></tr>
    </table>

    <!-- ▼ 상품 이미지 (상세설명 바로 아래) -->
    <div class="page-title" style="margin-top:14px;"><h2>상품 이미지</h2></div>
    <div class="img-grid" id="imgGrid">
      <c:choose>
        <c:when test="${not empty productImages}">
          <c:forEach var="img" items="${productImages}">
            <div class="img-box" role="button" tabindex="0" aria-label="${product.prodName}">
              <img src="${ctx}/images/uploadFiles/${img.fileName}" alt="${product.prodName}" class="img-existing"/>
            </div>
          </c:forEach>
        </c:when>
        <c:otherwise><p class="text-muted">등록된 이미지가 없습니다.</p></c:otherwise>
      </c:choose>
    </div>
    <div class="img-more-wrap">
      <button type="button" id="btnImgMore" class="btn-gray btn-pill" style="display:none;">이미지 더보기</button>
    </div>
  </section>

  <!-- ========== 우 : 구매 등록 폼 ========== -->
  <section class="col-center panel">
    <div class="page-title"><h2>구매 등록</h2></div>

    <form name="purchaseForm" data-unit-price="${product.price}">
      <input type="hidden" name="purchaseProd.prodNo" value="${product.prodNo}"/>
      <input type="hidden" name="buyerId" value="${sessionScope.user.userId}"/>

      <table class="form-table">
        <tr><th>구매자 ID</th><td>${sessionScope.user.userId}</td></tr>

        <tr>
          <th>결제수단</th>
          <td>
            <select name="paymentOption" class="input-text" required>
              <option value="">-- 선택 --</option>
              <option value="CAR">카드</option>
              <option value="CAS">현금</option>
              <option value="KAKAO">카카오페이</option>
            </select>
          </td>
        </tr>

        <tr>
          <th>구매 수량</th>
          <td>
            <input type="number" id="qty" name="qty" class="input-text"
                   min="1" max="${product.stockQty}" value="${qty}"
                   <c:if test="${product.stockQty <= 0}">disabled</c:if> />
          </td>
        </tr>

        <tr><th>총 결제금액</th><td><strong id="totalPrice">0 원</strong></td></tr>

        <tr><th>수령인</th><td class="vfield"><input type="text" name="receiverName" class="input-text" required/></td></tr>
        <tr><th>연락처</th><td class="vfield"><input type="tel" name="receiverPhone" placeholder="010-0000-0000" class="input-text" required/></td></tr>

        <tr>
          <th>배송주소</th>
          <td>
            <button type="button" id="btnSameInfo" class="btn-gray" style="margin-bottom:6px;">내 정보로 자동입력</button><br/>
            <input type="text" id="zipcode" name="zipcode" placeholder="우편번호" readonly class="input-text" style="width:140px;"/>
            <button type="button" id="btnAddr" class="btn-gray">주소검색</button><br/>
            <input type="text" id="divyAddr" name="divyAddr" placeholder="기본 주소" class="input-text" style="margin-top:6px;" required/><br/>
            <input type="text" id="addrDetail" name="addrDetail" placeholder="상세 주소" class="input-text" style="margin-top:6px;"/>
          </td>
        </tr>

        <tr><th>희망배송일</th><td class="vfield"><input type="date" name="divyDate" class="input-text" required/></td></tr>
        <tr><th>요청사항</th><td><textarea name="divyRequest" rows="4" class="input-text"></textarea></td></tr>
      </table>

      <div class="btn-area">
        <c:choose>
          <c:when test="${product.stockQty > 0}">
            <button type="button" class="btn-green" data-role="submit">주문등록</button>
            <button type="button" class="btn-yellow" id="btnKakaoPay">
              <img src="${ctx}/images/icon_kakao.png" alt="kakao" style="height:16px;vertical-align:middle;margin-right:4px;"/>
              카카오페이로 결제하기
            </button>
          </c:when>
          <c:otherwise><button type="button" class="btn-gray" disabled>품절상품</button></c:otherwise>
        </c:choose>
        <button type="button" class="btn-gray" data-role="cancel">취소</button>
      </div>
    </form>
  </section>

  <!-- 주문 확인 모달 -->
  <div id="confirmModal" class="dlg-mask" style="display:none;">
    <div class="dlg dlg-sm">
      <div class="dlg-hd">구매 확인</div>
      <div class="dlg-bd">입력하신 정보로 주문을 진행하시겠습니까?</div>
      <div class="dlg-ft">
        <button type="button" class="btn-green" data-role="confirm">확인</button>
        <button type="button" class="btn-gray"  data-role="close">취소</button>
      </div>
    </div>
  </div>
</div>
