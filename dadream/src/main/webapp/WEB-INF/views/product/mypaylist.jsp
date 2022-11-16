<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />

<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath"  value="${pageContext.request.contextPath}"  />
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
  <link rel="stylesheet" href="/css/mypaylist.css">

  <script>
	function state(){
		var order_State = document.getElementById('order_State').value;
		console.log(order_State);
	}
	</script>
<script>
function con(){
if(!confirm("배송수정을 하시겠습니까?")){
	 alert("취소");
	 return false;
	}else{
		alert("배송 수정 완료");
		document.getElementById("update").submit();
	}
}
</script>
<script>
function del(){
if(!confirm("상품을 환불 하시겠습니까?")){
	 alert("취소");
	 return false;
	}else{
		alert("환불 완료");
		document.getElementById("delete").submit();
	}
}
</script>
</head>
<body>
<div id="paydeletes">
<c:forEach var="pro" items="${pro}">
<c:forEach var="ord" items="${pro.order}">
	<form action="/state/update.do" method="post" id="update">
	<div id="flexdiv" style="width:280px;">
		<p id="psize">주문번호${ord.order_Num}</p>
<select id="order_State" name="order_State" onchange="state()">
<option>${ord.order_State}</option>
<option>배송준비</option>
<option>회수중</option>
<option>회수완료</option>
<option>배송중</option>
<option>배송완료</option>
</select>
</div>
<div id="flexdiv">
<div>
<p>이름</p>
<p>총 개수</p>
<p>구매자</p>
<p>구매개수</p>
</div>
<div style="margin-left:30px;">
<p class="proName">${pro.product_Name}</p>
<p>${pro.product_TotalCount}</p>
<p>${ord.order_GetName}</p>
<p>${ord.product_Count}</p>
</div>
</div>
<div id="flexdiv2">
<input type="hidden" name="order_Num" value="${ord.order_Num}">
<button type="button" id="updatebtn" value="${ord.order_Num}" onclick="con()">배송수정</button>
</form>
<form action="/state/delete.do" method="post" id="delete">
<input type="hidden" name="order_Num" value="${ord.order_Num}">
<button type="button" id="orderdelete" value="${ord.order_Num}" onclick="del()">환불하기</button>
</form>
</div>
</c:forEach>
</c:forEach>
</div>

</body>
</html>