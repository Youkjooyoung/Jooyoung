<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<c:set var="t" value="${requestScope.purchase}"/>
<c:if test="${not empty t}">
  <fmt:formatDate value="${t.divyDate}" pattern="yyyy-MM-dd" var="divyYmd"/>
</c:if>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <title>구매 수정</title>

  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { naver:'#03c75a','naver-dark':'#00a74a','naver-gray':'#f7f9fa' },
          boxShadow:{ nv:'0 2px 4px rgba(0,0,0,.08)', card:'0 6px 18px rgba(0,0,0,.12)'}
        }
      }
    }
  </script>

  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/app-core.js"></script>
  <script src="${ctx}/javascript/updatePurchase.js" defer></script>
  <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
</head>
<body data-ctx="${ctx}" class="bg-naver-gray min-h-screen">
<div class="max-w-3xl mx-auto p-6">
  <div class="mb-6">
    <h2 class="text-2xl font-bold">구매 수정</h2>
  </div>

  <div class="bg-white border rounded-2xl shadow-card p-6">
    <c:choose>
      <c:when test="${empty t}">
        <p class="text-red-600">수정할 주문 정보가 없습니다.</p>
      </c:when>
      <c:otherwise>
        <form name="purchaseForm" class="space-y-6">
          <input type="hidden" name="tranNo" value="${t.tranNo}"/>

          <div class="grid grid-cols-1 gap-5">
            <div class="grid grid-cols-4 items-center gap-3">
              <div class="text-gray-600">주문상태</div>
              <div class="col-span-3">
                <input type="text" value="${t.tranCode}" class="w-full border rounded-xl px-3 py-2 bg-gray-50" readonly/>
              </div>
            </div>

            <div class="grid grid-cols-4 items-center gap-3">
              <div class="text-gray-600">지불방식</div>
              <div class="col-span-3">
                <input type="text" name="paymentOption" value="${t.paymentOption}" class="w-full border rounded-xl px-3 py-2 bg-gray-50" readonly/>
              </div>
            </div>

            <div class="grid grid-cols-4 items-center gap-3">
              <div class="text-gray-600">배송희망일</div>
              <div class="col-span-3">
                <input type="date" name="divyDate" value="${not empty divyYmd ? divyYmd : ''}" class="w-full border rounded-xl px-3 py-2"/>
              </div>
            </div>

            <div class="grid grid-cols-4 items-center gap-3">
              <div class="text-gray-600">수령인</div>
              <div class="col-span-3">
                <input type="text" name="receiverName" value="${fn:escapeXml(t.receiverName)}" class="w-full border rounded-xl px-3 py-2" required/>
                <span class="error-msg text-sm text-red-600 hidden"></span>
              </div>
            </div>

            <div class="grid grid-cols-4 items-center gap-3">
              <div class="text-gray-600">연락처</div>
              <div class="col-span-3">
                <input type="tel" name="receiverPhone" value="${fn:escapeXml(t.receiverPhone)}" class="w-full border rounded-xl px-3 py-2" required/>
                <span class="error-msg text-sm text-red-600 hidden"></span>
              </div>
            </div>

            <div class="grid grid-cols-4 items-start gap-3">
              <div class="text-gray-600">배송주소</div>
              <div class="col-span-3 space-y-2">
                <div class="flex items-center gap-2">
                  <input type="text" id="zipcode" name="zipcode" value="${t.zipcode}" readonly class="border rounded-xl px-3 py-2 w-32 bg-gray-50"/>
                  <button type="button" id="btnAddr" class="px-4 py-2 rounded-xl bg-gray-200">주소검색</button>
                </div>
                <input type="text" id="divyAddr" name="divyAddr" value="${t.divyAddr}" readonly class="w-4/5 border rounded-xl px-3 py-2 bg-gray-50" required/>
                <input type="text" id="addrDetail" name="addrDetail" value="${t.addrDetail}" class="w-4/5 border rounded-xl px-3 py-2" required/>
                <div class="space-y-1">
                  <span class="error-msg text-sm text-red-600 hidden"></span>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-4 items-start gap-3">
              <div class="text-gray-600">요청사항</div>
              <div class="col-span-3">
                <textarea name="divyRequest" rows="5" class="w-full border rounded-xl px-3 py-2"><c:out value="${t.divyRequest}"/></textarea>
                <span class="error-msg text-sm text-red-600 hidden"></span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button type="button" class="px-5 py-3 rounded-2xl bg-naver text-white" id="btnUpdate">수정완료</button>
            <button type="button" class="px-5 py-3 rounded-2xl bg-gray-200" id="btnCancel">취소</button>
          </div>
        </form>
      </c:otherwise>
    </c:choose>
  </div>
</div>
</body>
</html>
