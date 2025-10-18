<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
  <script src="https://js.tosspayments.com/v1"></script>
</head>
<body>
<div style="height:660px"></div>
<input type="hidden" value="${member.user_Name}" id="user_Name">
<c:forEach var="ord" items="${info}">
<c:forEach var="order" items="${ord.order}">
<input type="hidden" value="${order.order_Num}" id="ordernum">
<input type="hidden" value="${order.product_Name}" id="productname">
<input type="hidden" value="${order.product_TotalPrice}" id="producttotaleprice">
</c:forEach>
</c:forEach>

<script>
	var order_Num =  document.querySelectorAll("#ordernum");
	var product_Name =  document.querySelectorAll("#productname");
	var aa = "";
	var user_Name =  document.querySelector("#user_Name").value;
	var product_TotalPrice =  document.querySelectorAll("#producttotaleprice");
	var bb = 0;
	for(let i=0; i<order_Num.length; i++){
		aa += (product_Name[i].value + ",");
		bb += parseInt(product_TotalPrice[i].value);
	}
	console.log(aa);
	console.log(bb);
    var clientKey = 'test_ck_jkYG57Eba3G7LGlBJkj3pWDOxmA1';
	var tossPayments = TossPayments(clientKey); // 클라이언트 키로 초기화하기
	var orderId = new Date().getTime(); 
    
  tossPayments.requestPayment('카드', { // 결제 수단 파라미터
  // 결제 정보 파라미터
  amount: bb,
  orderId: orderId,
  orderName: aa,
  customerName: user_Name,
  successUrl: window.location.origin + "/oft.do",
  failUrl: window.location.origin + "/fail.do",
})
</script>
</body>
</html>