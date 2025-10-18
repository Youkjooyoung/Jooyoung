<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 상세</title>

  <!-- 공통 + 구매등록과 동일한 CSS 구조 -->
  <link rel="stylesheet" href="${ctx}/css/naver-common.css"/>
  <link rel="stylesheet" href="${ctx}/css/addPurchase.css"/>

  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>

  <!-- 간단 POST 유틸 -->
  <script>
    window.App = window.App || {
      ctx: () => '${ctx}',
      post(path, body){
        const f = document.createElement('form');
        f.method='post'; f.action=this.ctx()+path;
        if(body){
          Object.keys(body).forEach(k=>{
            const i=document.createElement('input');
            i.type='hidden'; i.name=k; i.value=body[k];
            f.appendChild(i);
          });
        }
        document.body.appendChild(f); f.submit();
      }
    };
  </script>

  <script src="${ctx}/javascript/getPurchase.js" defer></script>
</head>

<body data-ctx="${ctx}">
<div class="container two-col">

  <!-- ============= 좌측 : 상품 정보/이미지 (구매등록과 동일) ============= -->
  <section class="col-left">
    <div class="page-title"><h2>상품 정보</h2></div>
    <table class="form-table">
      <tr><th>상품번호</th><td>${purchase.purchaseProd.prodNo}</td></tr>
      <tr><th>상품명</th><td>${purchase.purchaseProd.prodName}</td></tr>
      <tr><th>가격</th><td><fmt:formatNumber value="${purchase.purchaseProd.price}" type="number"/> 원</td></tr>
      <tr><th>상세설명</th><td style="line-height:1.6;">${purchase.purchaseProd.prodDetail}</td></tr>
    </table>

    <div class="page-title"><h2>상품 이미지</h2></div>

    <!-- 균일 썸네일 그리드 (처음 6장만 노출) -->
    <div class="img-grid" id="imgGrid" data-collapsed="true">
      <c:choose>
        <c:when test="${not empty productImages}">
          <c:forEach var="img" items="${productImages}" varStatus="st">
            <div class="img-box <c:if test='${st.index >= 6}'>is-hidden</c:if>" role="button" tabindex="0"
                 aria-label="${purchase.purchaseProd.prodName}">
              <img src="${ctx}/images/uploadFiles/${img.fileName}"
                   alt="${purchase.purchaseProd.prodName}" class="img-existing"/>
            </div>
          </c:forEach>
        </c:when>
        <c:otherwise><p class="text-muted">등록된 이미지가 없습니다.</p></c:otherwise>
      </c:choose>
    </div>

    <c:if test="${not empty productImages && productImages.size() > 6}">
      <div class="img-more-wrap">
        <button type="button" id="btnImgMore" class="btn-gray btn-pill"
                data-more-text="이미지 더보기" data-less-text="이미지 접기">이미지 더보기</button>
      </div>
    </c:if>

    <!-- 이미지 라이트박스 (구매등록과 동일 컴포넌트) -->
    <div id="imgLightbox" class="dlg-mask" style="display:none;">
      <div class="dlg dlg-lg">
        <div class="dlg-hd">이미지 미리보기</div>
        <div class="dlg-bd">
          <img id="lbImg" alt="preview"
               style="max-width:100%;max-height:70vh;border-radius:10px;display:block;margin:0 auto;"/>
        </div>
        <div class="dlg-ft">
          <button type="button" class="btn-gray" data-role="lb-prev">이전</button>
          <button type="button" class="btn-gray" data-role="lb-next">다음</button>
          <button type="button" class="btn-green" data-role="lb-close">닫기</button>
        </div>
      </div>
    </div>
  </section>

  <!-- ============= 우측 : 구매 상세 (테이블/버튼) ============= -->
  <section class="col-right">
    <div class="page-title"><h2>구매 상세</h2></div>

    <table class="form-table">
      <tr><th>주문번호</th><td>${purchase.tranNo}</td></tr>
      <tr><th>구매자</th><td>${purchase.buyer.userId}</td></tr>
      <tr><th>구매수량</th><td><fmt:formatNumber value="${purchase.qty}" type="number"/> 개</td></tr>
      <tr><th>단가</th><td><fmt:formatNumber value="${purchase.purchaseProd.price}" type="number"/> 원</td></tr>
      <tr><th>총 금액</th>
          <td><fmt:formatNumber value="${purchase.purchaseProd.price * purchase.qty}" type="number"/> 원</td></tr>
      <tr><th>결제수단</th><td>${purchase.paymentOption}</td></tr>
      <tr>
        <th>주문상태</th>
        <td>
          <c:choose>
            <c:when test="${purchase.tranCode == '001'}"><span class="badge badge-green">주문완료</span></c:when>
            <c:when test="${purchase.tranCode == '002'}"><span class="badge badge-green">배송중</span></c:when>
            <c:when test="${purchase.tranCode == '003'}"><span class="badge badge-green">배송완료</span></c:when>
            <c:when test="${purchase.tranCode == '004'}"><span class="badge badge-red">취소됨</span></c:when>
          </c:choose>
        </td>
      </tr>
      <tr><th>주문일</th><td><fmt:formatDate value="${purchase.orderDate}" pattern="yyyy-MM-dd"/></td></tr>
      <tr><th>희망배송일</th><td>${purchase.divyDate}</td></tr>
      <tr><th>수령인</th><td>${purchase.receiverName}</td></tr>
      <tr><th>연락처</th><td>${purchase.formattedReceiverPhone}</td></tr>
      <tr>
        <th>배송주소</th>
        <td>${purchase.zipcode} ${purchase.divyAddr}<br/><c:out value="${purchase.addrDetail}"/></td>
      </tr>
      <tr><th>요청사항</th><td><c:out value="${empty purchase.divyRequest ? '요청사항이 없습니다.' : purchase.divyRequest}"/></td></tr>
    </table>

    <div class="btn-area">
      <c:if test="${purchase.tranCode == '001'}">
        <button type="button" class="btn-green" id="btnEdit"
                data-tranno="${purchase.tranNo}">주문정보 수정</button>
        <button type="button" class="btn-gray"  id="btnCancel"
                data-tranno="${purchase.tranNo}">구매취소</button>
      </c:if>

      <c:if test="${purchase.tranCode == '002'}">
        <button type="button" class="btn-green" id="btnConfirm"
                data-tranno="${purchase.tranNo}" data-prodno="${purchase.purchaseProd.prodNo}">
          물품 수령확인
        </button>
      </c:if>

      <c:if test="${purchase.tranCode == '003'}"><span class="text-green">구매가 완료되었습니다.</span></c:if>
      <c:if test="${purchase.tranCode == '004'}"><span class="text-red">해당 주문은 취소되었습니다.</span></c:if>
    </div>
  </section>
</div>

<!-- 취소/수령 모달 (등록화면 모달 스타일과 동일) -->
<div id="dlg-cancel" class="dlg-mask" style="display:none;">
  <div class="dlg dlg-sm">
    <div class="dlg-hd">구매 취소</div>
    <div class="dlg-bd">해당 주문을 취소하시겠습니까?</div>
    <div class="dlg-ft">
      <button type="button" class="btn-green" data-role="ok-cancel">확인</button>
      <button type="button" class="btn-gray"  data-role="close-cancel">닫기</button>
    </div>
  </div>
</div>

<div id="dlg-confirm" class="dlg-mask" style="display:none;">
  <div class="dlg dlg-sm">
    <div class="dlg-hd">수령 확인</div>
    <div class="dlg-bd">물품을 정상적으로 수령하셨습니까?</div>
    <div class="dlg-ft">
      <button type="button" class="btn-green" data-role="ok-confirm">확인</button>
      <button type="button" class="btn-gray"  data-role="close-confirm">닫기</button>
    </div>
  </div>
</div>
</body>
</html>
