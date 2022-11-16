<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가구 물건수정</title>
    
    <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
    <!-- css -->
    <link rel="stylesheet" href="/css/productview.css">
 
</head>

<body>
    <!--부트스트랩-->
    <!-- <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>

    <div class="first">
        <h1 style="margin:20px 0 0 10px;font-size: 35px; font: bold;"></h1>
        <br><br><br><br>
        <div class="middle">

            <!--이미지 div-->
<div style="width:450px; height:525px;">
<img class="image" src="/product/${result.user_Id}/${result.product_Image}" style="width:450px; height:525px;">
</div>
            <!--상품 설명-->
            <div class="dlComments">
                <div class="dlComments1">
                    <div>
                        <!-- <h5 style="text-align: left;">상품평</h5> -->
                        <h1>${result.product_Name}</h1>
                    </div>
                    <!-- <div>
                        <h3 style="text-align: left;">상품설명</h3>
                        <p>${result.product_Content}</p>
                    </div> -->
                </div>
                <div id="dlComments2">
                    <div style="display: flex;">
                        <p class="resultPrice" style="color:  rgb(161, 117, 20);">${result.product_Price}</p><p>원</p>
                        <!-- <input class="resultPrice" type="text"value="<fmt:formatNumber value='${result.product_Price}'/>" name="product_Price" currencySymbol="￦"disabled/> -->
                    </div>
                </div>
                <div id="dlComments3">
                        <h3>옵션선택</h3>
                        <div class="selectoption">
                        <select name="ot_1" class="select" id="ot_1" onchange="select1()">
                            <option>옵션을 선택해 주세요</option>
                        </select>
                        <select name="ot_2" class="select" id="ot_2" onchange="select2()">
                            <option>추가옵션</option>
                        </select>
                        </div>
                </div>
                <div class="background">
                <span>${result.product_Name}</span>
                <div class="totaloption">
                <p>옵션: </p><span id="so1"></span>
                <p>추가옵션:</p><span id="so2"></span>
                </div>
                <div class="totalprice">
                    <td>수량선택</td>
		                <select class="num" id="product_Count" onchange="count()">
		                <option value="1">1</option>
		                <option value="2">2</option>
		                <option value="3">3</option>
		                <option value="4">4</option>
		                <option value="5">5</option>
		                <option value="6">6</option>
		                <option value="7">7</option>
		                <option value="8">8</option>
		                <option value="9">9</option>
		                <option value="10">10</option>
		                </select>
                    <p class="sump">결제 금액 : <span class="sum"></span></p>
                </div>
                </div>
                
                    <script>
                    function select1(){
                    	var x = document.getElementById("ot_1").value;
                    	document.getElementById("so1").innerHTML = x;
                    }
                    function select2(){
                    	var x = document.getElementById("ot_2").value;
                    	document.getElementById("so2").innerHTML = x;
                    }
                    </script>
                
                <script>
                    (function () {
                        let option1 = "${result.product_Option1}";
                        let ot_1 =document.querySelector("#ot_1");
                        option1 = option1.split(",");
                        for(let i = 0; i < option1.length ; i++){
                            let op1 = document.createElement("option");
                            op1.setAttribute("value",option1[i]);
                            op1.innerHTML=option1[i];
                            ot_1.appendChild(op1);
                        }

                        let option2 = "${result.product_Option2}";
                        let ot_2 =document.querySelector("#ot_2");
                        option2 = option2.split(",");
                        for(let i = 0; i < option2.length ; i++){
                            let op2 = document.createElement("option");
                            op2.setAttribute("value",option2[i]);
                            op2.innerHTML=option2[i];
                            ot_2.appendChild(op2);
                        }
                    	
                        
                        let num = document.querySelector(".num");
                        let resultPrice = +document.querySelector(".resultPrice").textContent;
                        let sum = document.querySelector(".sum");

                        sum.textContent = (resultPrice * num.value);
                        document.querySelector(".num").addEventListener("change", (e) => {
                            sum.textContent = (resultPrice * num.value);
                        })
                    })();
                </script>
                <div id="dlComments4">
                    <div class="bot">
                        <!-- <form action="/cart.do?product_Num=${product_Num}" method="post"> -->
                        <button type="button" id="cart" class="btn btn-secondary btn-lg"><img src="image/orderf.png" class="cartimg"></button>
                        <!-- </form> -->
                        <input type="button" id="order" class="btn btn-secondary btn-lg"
                         onClick="fn_remove_order('${contextPath}/order.do?product_Num=${result.product_Num}', '${result.product_Num}')" value="구매하기">
                         <!-- <input type="button" id="order" value="구매하기"> -->
                    </div>
                </div>

            </div>
        </div>
        <div class="stickydiv">
            <ul class="sticky">
                <li class="tabli"><a href="#content">상세설명</a></li>
                <li class="tabli"><a href="#review">리뷰</a></li>
                <li class="tabli"><a href="#change">교환/환불</a></li>
            </ul>
        </div>
        <!-- <div class="contents">
        </div> -->
        <div id="contents">
        <p>${result.product_Content}</p>
        </div>

        <div id="review">
            <ul>
                <c:forEach var="i" items="${review}" varStatus="j">
                    <li class="reviewinfo">
                        
                        <div id="reviewInfo">
                            <p class="reviewTitle">제목 : ${i.review_Title}</p>
                            
                            <p class="reviewText">내용 : ${i.review_Text}</p>
                            <div>
                                <p class="rvWriter">작성자 : ${i.user_Id}</p>
                            </div>
                            <p>작성일 : ${i.review_Date}</p>
                            <form action="/reviewReply.do" method="post">
                                <div id="replyList">
                                    <div class="divtag">
                                        <textarea name="reply_Text" id="" cols="80" rows="3"></textarea>
                                        <input type="submit" id="sub" value="등록">
                                    </div>
                                    <input id="proNum" type="hidden" name="product_Num" value="${i.product_Num}">
                                    <input id="revNum" type="hidden" name="review_Num" value="${i.review_Num}">
                                </div>
                            </form>

                            <button id="eye">댓글보기</button>
                            <div id="replycopy"></div>

                            <div id="toggle" class="replying">
                                <c:forEach var="reply" items="${reply}">
                                    <c:if test="${i.review_Num == reply.review_Num}">
                                        <div id="border">
                                            <p style="color:green; margin-left: 40px;">${reply.user_Id} : ${reply.reply_Text}</p>
                                            <p style="color:green; margin-left: 40px;">${reply.reply_Date}</p>
                                            <p id="plus" style=" margin-left: 80px;">댓글달기</p>
                                            <div id="hide" class="divtag replying">
                                                <form action="/daedatgle.do" method="post">
                                                    <div class="divtag">
                                                        <textarea name="reply_Text" id="" cols="80" rows="3"></textarea>
                                                        <input type="submit" id="sub" value="등록">
                                                    </div>
                                                    <input type="hidden" name="product_Num" value="${i.product_Num}">
                                                    <input type="hidden" name="parent_No" value="${reply.reply_Count}">
                                                    <input type="hidden" name="review_Num" value="${i.review_Num}">
                                                </form>
                                            </div>
                                            <c:forEach var="total" items="${totalReply}">
                                                <c:if test="${reply.reply_Count == total.parent_No}">
                                                    <p style="color:red; margin-left: 120px;">${total.user_Id} :
                                                        ${total.reply_Text}</p>
                                                    <p style="color:red; margin-left: 120px;">${total.reply_Date}</p>
                                                    <p id="plus" style=" margin-left: 120px;">댓글달기</p>
                                                    <div id="hide" class="divtag replying">
                                                        <form action="/daedatgle.do" method="post">
                                                            <div class="divtag">
                                                                <textarea name="reply_Text" id="" cols="80"
                                                                    rows="3"></textarea>
                                                                <input type="submit" id="sub" value="등록">
                                                            </div>
                                                            <input type="hidden" name="product_Num"
                                                                value="${i.product_Num}">
                                                            <input type="hidden" name="parent_No"
                                                                value="${total.reply_Count}">
                                                            <input type="hidden" name="review_Num"
                                                                value="${i.review_Num}">
                                                        </form>
                                                    </div>
                                                    <c:forEach var="totaltwo" items="${totalReply}">
                                                        <c:if test="${total.reply_Count == totaltwo.parent_No}">
                                                            <p style="color:orange;margin-left: 160px;">${totaltwo.user_Id} :
                                                                ${totaltwo.reply_Text}</p>
                                                            <p style="color:orange;margin-left: 160px;">${totaltwo.reply_Date}</p>
                                                            <p id="plus" style=" margin-left: 160px;">댓글달기</p>
                                                            <div style="padding-left: 80px;" id="hide"
                                                                class="divtag replying">
                                                                <form action="/daedatgle.do" method="post">
                                                                    <div class="divtag">
                                                                        <textarea name="reply_Text" id="" cols="80"
                                                                            rows="3"></textarea>
                                                                        <input type="submit" id="sub" value="등록">
                                                                    </div>
                                                                    <input type="hidden" name="product_Num"
                                                                        value="${i.product_Num}">
                                                                    <input type="hidden" name="parent_No"
                                                                        value="${totaltwo.reply_Count}">
                                                                    <input type="hidden" name="review_Num"
                                                                        value="${i.review_Num}">
                                                                </form>
                                                            </div>
                                                            <c:forEach var="totalthree" items="${totalReply}">
                                                                <c:if
                                                                    test="${totaltwo.reply_Count == totalthree.parent_No}">
                                                                    <p style="color:blue;margin-left: 200px;">
                                                                        ${totalthree.user_Id} : ${totalthree.reply_Text}
                                                                    </p>
                                                                    <p style="color:blue;margin-left: 200px;">
                                                                        ${totalthree.reply_Date}</p>
                                                                    <p id="plus" style="margin-left: 200px;">댓글달기</p>
                                                                    <div style="padding-left: 120px;" id="hide"
                                                                        class="divtag replying">
                                                                        <form action="/daedatgle.do" method="post">
                                                                            <div class="divtag">
                                                                                <textarea name="reply_Text" id=""
                                                                                    cols="80" rows="3"></textarea>
                                                                                <input type="submit" id="sub"
                                                                                    value="등록">
                                                                            </div>
                                                                            <input type="hidden" name="product_Num"
                                                                                value="${i.product_Num}">
                                                                            <input type="hidden" name="parent_No"
                                                                                value="${totalthree.reply_Count}">
                                                                            <input type="hidden" name="review_Num"
                                                                                value="${i.review_Num}">
                                                                        </form>
                                                                    </div>
                                                                </c:if>
                                                            </c:forEach>
                                                        </c:if>
                                                    </c:forEach>
                                                </c:if>
                                            </c:forEach>
                                        </div>
                                    </c:if>

                                </c:forEach>
                            </div>
                        </div>
                    </li>
                </c:forEach>

            </ul>
        </div>
        <!-- 상품리뷰 -->
        <script>
            $(function () {
                $('.sticky a').click(function () {
                    $('.sticky a').removeClass('active');
                    $(this).addClass('active');
                }).filter(':eq(0)').click();
            });
        </script>
       
               <script>
function option1(){
	var product_Option1 = document.getElementById('ot_1').value;
	console.log(product_Option1)
}
function option2(){
	var product_Option2 = document.getElementById('ot_2').value;
	console.log(product_Option2)
}
</script>
<script>
function count(){
	var product_CountOrder2 = document.getElementById('product_Count').value;
	/* document.getElementById("product_Count").innerHTML = product_CountOrder2; */
	console.log(product_CountOrder2)
}
</script>
<script>
let product_NumOrder ="${result.product_Num}"
let product_NameOrder = "${result.product_Name}"
let product_PriceOrder = "${result.product_Price}"
let product_ImageOrder = "${result.product_Image}"
var order_NumOrder = Math.floor(Math.random() * 1000000000) + 1;
document.addEventListener("DOMContentLoaded", () => {
document.querySelector("#order").addEventListener("click", async e => {
let product_Option1Order = document.getElementById("ot_1").value;
let product_Option2Order = document.getElementById("ot_2").value;
let product_CountOrder = document.getElementById("product_Count").value;
let product_TotalPriceOrder = "${result.product_Price}" * product_CountOrder;
if(!e.target.matches){
return;
}
let order = await fetch('/ordereach.do', {
method: "POST",
headers: {
'content-type': 'application/json'
},
body: JSON.stringify({
	order_Num : order_NumOrder, 
	product_Num : product_NumOrder,
	product_Name : product_NameOrder,
	product_Price : product_PriceOrder,
	product_Count : product_CountOrder,
	product_TotalPrice : product_TotalPriceOrder,
	product_Image : product_ImageOrder,
	product_Option1 : product_Option1Order,
	product_Option2 : product_Option2Order,
})
});
if(order.status===200){
	let jsondata1 = await order.json();
if(jsondata1.result === 1){
	alert("구매페이지");
}

}else{
	alert("실패");
			}
		});
	})
</script>
<script>
let product_Nums = "${result.product_Num}"
let product_Names = "${result.product_Name}"
let product_Prices = "${result.product_Price}"
let product_Images = "${result.product_Image}"
var order_Nums = Math.floor(Math.random() * 1000000000) + 1;
document.addEventListener("DOMContentLoaded", () => {
document.querySelector("#cart").addEventListener("click", async e => {
let product_Option1s = document.getElementById("ot_1").value;
let product_Option2s = document.getElementById("ot_2").value;
let product_Counts = document.getElementById("product_Count").value;
let cart = await fetch('/cart.do', {
method: "POST",
headers: {
'content-type': 'application/json'
},
body: JSON.stringify({
product_Num: product_Nums,
product_Name : product_Names,
product_Option1 : product_Option1s,
product_Option2 : product_Option2s,
product_Image : product_Images,
product_Price : product_Prices,
cart_BuytCount : product_Counts,
order_Num : order_Nums,
})
});
if (cart.status === 200) {
let jsondata = await cart.json();
if (jsondata.result === 1) {
alert("장바구니에 성공적으로 담겼습니다");
}

} else {
alert("예상치 못한 오류입니다.");
			}
		});
	})
</script>
<script>
var selectBoxChange = function(value){
	console.log("변경테스트" + value);
}
</script>
<script>
// 댓글 달기

let reviewli = document.querySelectorAll(".reviewinfo");
console.log(reviewli);
let sub = [...document.querySelectorAll("#sub")];
console.log("sub" + sub.length);
for (let i = 0; i < reviewli.length; i++) {
reviewli[i].addEventListener("click", (e) => {
if (!e.target.matches("#sub")) {
return;
}
if ("${member.user_Id}" === '') {
alert("로그인 후 작성 가능합니다");
if (!confirm("로그인 하시겠습니까?")) {
e.preventDefault();
} else {
location.href = "/login.do";
e.preventDefault();
}
} else {
if (!confirm("댓글을 다시겠습니까?")) {
e.preventDefault();
return;
}
alert("댓글이 달렸습니다.");
}
})
}

// 댓글보이게
let eye = document.querySelectorAll("#eye");
let toggle = document.querySelectorAll("#toggle");
// console.log(document.querySelectorAll("#toggle"));
// console.log(eye);
// console.log(eye.length);
for (let i = 0; i < eye.length; i++) {

eye[i].addEventListener("click", (e) => {
document.querySelectorAll("#toggle")[i].classList.toggle("replying");
})
}
//대 대댓글 작성
let plus = document.querySelectorAll("#plus");
console.log(plus);
for (let i = 0; i < plus.length; i++) {
plus[i].addEventListener("click", () => {
document.querySelectorAll("#hide")[i].classList.toggle("replying");
})
}
</script>
<script src="http://code.jquery.com/jquery-latest.min.js"></script> 
<script type="text/javascript" >
function fn_remove_order(url,product_Num){
var form = document.createElement("form");
form.setAttribute("method", "post");
form.setAttribute("action", url);
var product_NumInput = document.createElement("input");
product_NumInput.setAttribute("type","hidden");
product_NumInput.setAttribute("name","product_Num");
product_NumInput.setAttribute("value", product_Num);
form.appendChild(product_NumInput);
document.body.appendChild(form);
form.submit();
}
</script>
        </script>
</body>


</html>