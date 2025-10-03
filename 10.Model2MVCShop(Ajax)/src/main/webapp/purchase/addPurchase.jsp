<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 등록</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/addPurchase.js"></script>
</head>
<body data-ctx="${ctx}">
<div class="container two-col">

  <!-- 왼쪽: 구매 등록 -->
  <div class="col-left">
    <div class="page-title"><h2>구매 등록</h2></div>

    <form name="purchaseForm">
     <input type="hidden" name="purchaseProd.prodNo"/>
      <input type="hidden" name="buyerId" value="${sessionScope.user.userId}"/>

      <!-- 상품 정보 -->
      <table class="form-table" id="productInfo">
        <!-- JS에서 Ajax로 채움 -->
      </table>

      <!-- 주문 정보 -->
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
        <tr><th>수령인</th><td><input type="text" name="receiverName" class="input-text" required/></td></tr>
        <tr><th>연락처</th><td><input type="tel" name="receiverPhone" placeholder="01012345678" class="input-text" required/></td></tr>
        <tr>
          <th>배송주소</th>
          <td>
          <button type="button" id="btnSameInfo" class="btn-gray" style="margin-bottom:5px;">
		      기존 정보와 동일
		    </button><br/>
            <input type="text" id="zipcode" name="zipcode" placeholder="우편번호" readonly class="input-text"style="width:120px;"/>
            <button type="button" id="btnAddr" data-role="addr-search" class="btn-gray">주소검색</button><br/>
            <input type="text" id="divyAddr" name="divyAddr" placeholder="기본 주소" readonly class="input-text" style="width:80%; margin-top:5px;" required/><br/>
            <input type="text" id="addrDetail" name="addrDetail" placeholder="상세 주소" class="input-text" style="width:80%; margin-top:5px;" required/>
          </td>
        </tr>
        <tr><th>희망배송일</th><td><input type="date" name="divyDate" class="input-text" required/></td></tr>
        <tr><th>요청사항</th><td><textarea name="divyRequest" rows="5" cols="50" class="input-text"></textarea></td></tr>
      </table>

      <div class="btn-area">
        <button type="button" class="btn-green" data-role="submit">주문 등록</button>
        <button type="button" class="btn-gray" data-role="cancel">취소</button>
      </div>
    </form>
  </div>

  <!-- 오른쪽: 상품 이미지 -->
  <div class="col-right">
    <div class="page-title"><h2>상품 이미지</h2></div>
    <div class="img-grid" id="productImages"></div>
  </div>
</div>

<!-- 구매 확인 모달 -->
<div id="confirmModal" class="dlg-mask" data-role="modal">
  <div class="dlg dlg-sm">
    <div class="dlg-hd">구매 확인</div>
    <div class="dlg-bd">입력하신 구매정보로 주문을 진행하시겠습니까?</div>
    <div class="dlg-ft">
      <button type="button" class="btn-green" data-role="confirm">확인</button>
      <button type="button" class="btn-gray" data-role="close">취소</button>
    </div>
  </div>
</div>

</body>
</html>
