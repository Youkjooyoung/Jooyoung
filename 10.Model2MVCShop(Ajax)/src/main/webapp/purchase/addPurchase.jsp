<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 등록</title>

  <!-- 공통 + 페이지전용 CSS (너가 적용한 파일) -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <link rel="stylesheet" href="${ctx}/css/addPurchase.css"/>

  <!-- jQuery -->
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>

  <!-- 공용 유틸 JS(있으면 로드 / 없어도 무관) -->
  <script src="${ctx}/javascript/app-core.js"></script>
</head>

<body data-ctx="${ctx}">
<div class="container two-col">

  <!-- ================= 좌측: 상품 요약 + 이미지 ================= -->
  <section class="col-left">
    <div class="page-title"><h2>상품 정보</h2></div>
    <table class="form-table">
      <tr><th>상품번호</th><td>${product.prodNo}</td></tr>
      <tr><th>상품명</th><td>${product.prodName}</td></tr>
      <tr><th>가격</th><td><fmt:formatNumber value="${product.price}" type="number"/> 원</td></tr>
      <tr>
        <th>남은 재고</th>
        <td>
          <c:choose>
            <c:when test="${product.stockQty > 0}">
              ${product.stockQty} 개
            </c:when>
            <c:otherwise>
              <span style="color:#e03131;font-weight:700;">품절</span>
            </c:otherwise>
          </c:choose>
        </td>
      </tr>
      <tr>
        <th>상세설명</th>
        <td style="line-height:1.6;">${product.prodDetail}</td>
      </tr>
    </table>

    <div class="page-title"><h2>상품 이미지</h2></div>

    <!-- 균일 썸네일 그리드 -->
    <div class="img-grid" id="imgGrid">
      <c:choose>
        <c:when test="${not empty productImages}">
          <c:forEach var="img" items="${productImages}">
            <div class="img-box" role="button" tabindex="0" aria-label="${product.prodName}">
              <img src="${ctx}/images/uploadFiles/${img.fileName}" alt="${product.prodName}" class="img-existing"/>
            </div>
          </c:forEach>
        </c:when>
        <c:otherwise>
          <p class="text-muted">등록된 이미지가 없습니다.</p>
        </c:otherwise>
      </c:choose>
    </div>

    <!-- 이미지 더보기 / 접기 -->
    <div class="img-more-wrap">
      <button type="button" id="btnImgMore" class="btn-gray btn-pill" style="display:none;">이미지 더보기</button>
    </div>

    <!-- 이미지 라이트박스 -->
    <div id="imgLightbox" class="dlg-mask" style="display:none;">
      <div class="dlg dlg-lg">
        <div class="dlg-hd">이미지 미리보기</div>
        <div class="dlg-bd">
          <img id="lbImg" alt="preview" style="max-width:100%;max-height:70vh;border-radius:10px;display:block;margin:0 auto;"/>
        </div>
        <div class="dlg-ft">
          <button type="button" class="btn-gray" data-role="lb-prev">이전</button>
          <button type="button" class="btn-gray" data-role="lb-next">다음</button>
          <button type="button" class="btn-green" data-role="lb-close">닫기</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= 우측: 구매 입력 폼 ================= -->
		<section class="col-right">
		  <div class="page-title"><h2>구매 등록</h2></div>
		
		  <!-- 단가를 data-unit-price로 전달 -->
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
		          </select>
		        </td>
		      </tr>
		
		      <tr>
		        <th>구매 수량</th>
		        <td>
		          <input type="number" id="qty" name="qty"
		                 class="input-text"
		                 min="1"
		                 max="${product.stockQty}"
		                 value="1"
		                 <c:if test="${product.stockQty <= 0}">disabled</c:if> />
		        </td>
		      </tr>
		
		      <tr>
		        <th>총 결제금액</th>
		        <td><strong id="totalPrice">0 원</strong></td>
		      </tr>
	
	      <tr>
	        <th>수령인</th>
	        <td class="vfield">
	          <input type="text" name="receiverName" class="input-text" required/>
	        </td>
	      </tr>

        <tr>
          <th>연락처</th>
          <td class="vfield">
            <input type="tel" name="receiverPhone" placeholder="010-0000-0000" class="input-text" required/>
          </td>
        </tr>

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

        <tr>
          <th>희망배송일</th>
          <td class="vfield"><input type="date" name="divyDate" class="input-text" required/></td>
        </tr>

        <tr>
          <th>요청사항</th>
          <td><textarea name="divyRequest" rows="4" class="input-text"></textarea></td>
        </tr>
      </table>

      <div class="btn-area">
        <c:choose>
          <c:when test="${product.stockQty > 0}">
            <button type="button" class="btn-green" data-role="submit">주문등록</button>
          </c:when>
          <c:otherwise>
            <button type="button" class="btn-gray" disabled>품절상품</button>
          </c:otherwise>
        </c:choose>
        <button type="button" class="btn-gray" data-role="cancel">취소</button>
      </div>
    </form>
  </section>
</div>

<!-- 주문 확인 모달 -->
<div id="confirmModal" class="dlg-mask" style="display:none;">
  <div class="dlg dlg-sm">
    <div class="dlg-hd">구매 확인</div>
    <div class="dlg-bd">입력하신 정보로 주문을 진행하시겠습니까?</div>
    <div class="dlg-ft">
      <button type="button" class="btn-green" data-role="confirm">확인</button>
      <button type="button" class="btn-gray" data-role="close">취소</button>
    </div>
  </div>
</div>
 <!-- 페이지 전용 JS -->
  <script src="${ctx}/javascript/addPurchase.js" ></script>
</body>
</html>
