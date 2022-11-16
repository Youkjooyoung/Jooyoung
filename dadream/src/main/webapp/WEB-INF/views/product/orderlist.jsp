<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/css/orderlist.css">
<!-- 글꼴 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
<link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
</head>
<body>
<div id="flexs">
<h2>구매목록</h2>
<div id="order">
	<c:forEach var="myofv" items="${myofv}">
	<c:forEach var="pro" items="${myofv.product}">
	<div class="buyList">
	<div class="buyImg">
		<img src="/product/${pro.user_Id}/${pro.product_Image}" alt="상품사진" style="width:200px; height: 200px;">
	</div>
	<div id="myod">
		<p>${myofv.order_State}</p><br>
		<p>상품이름 : ${myofv.product_Name}</p>
		<p>받는이 : ${myofv.order_GetName}</p>
		<p>배송지 : ${myofv.order_Address2} ${myofv.order_Address3}</p>
		<p>핸드폰번호 : ${myofv.order_Phone}</p>
		<p>수량 : ${myofv.product_Count}</p>
		<p>가격 : ${myofv.product_TotalPrice}</p>
		<p>요청사항 : ${myofv.order_Rqd}</p>
		<button type="button" id="review" onclick="showPopup('${pro.product_Num}');">리뷰쓰기</button>
		<button type="button" id="refind" onclick="showPopup2('${myofv.order_Num}');">환불요청</button>
	</div>
	</div>
	<script>
		function showPopup(proNum) {
		    window.open("${contextPath}/reviewform.do?product_Num="+proNum, "리뷰", "width=460, height=560, top=200 left=600");
		}
		function showPopup2(orNum) {
    		window.open("${contextPath}/refundform.do?order_Num="+orNum, "환불이유", "width=460, height=560, top=200 left=600");
			}
</script>
</c:forEach>
</c:forEach>
</div>
<h2>환불목록</h2>
<div id="refund">
	<c:forEach var="refund" items="${refund}">
	<c:forEach var="pro" items="${refund.product}">
	<div class="refundList">
	<div class="refundImg">
		<img src="/product/${pro.user_Id}/${pro.product_Image}" alt="상품사진" style="width:200px; height: 200px;">
	</div>
	<div id="myod">
		<p>${refund.order_State}</p><br>
		<p>상품이름 : ${refund.product_Name}</p>
		<p>받는이 : ${refund.order_GetName}</p>
		<p>배송지 : ${refund.order_Address2} ${refund.order_Address3}</p>
		<p>핸드폰번호 : ${refund.order_Phone}</p>
		<p>수량 : ${refund.product_Count}</p>
		<p>가격 : ${refund.product_TotalPrice}</p>
		<p>요청사항 : ${refund.order_Rqd}</p>
	</div>
	</div>
</c:forEach>
</c:forEach>
</div>
</div>
</body>

</html>