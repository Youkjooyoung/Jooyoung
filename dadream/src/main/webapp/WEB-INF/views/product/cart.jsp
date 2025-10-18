<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"
isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%
request.setCharacterEncoding("UTF-8");
%>
<c:set var="cart_Num" value="${CartVO.cart_Num}" />
<c:set var="product_Option1" value="${CartVO.product_Option1}" />
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>장바구니</title>
    <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
    <!-- reset css -->
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"> -->
    <!-- css -->
    <link rel="stylesheet" href="/css/cart.css">
</head>

<body>
    <form name="orderList" class="cartform" action="${contextPath}/addCartOrder.do" method="post">
        <div class="cart">

            <h3>장바구니</h3>
            <table id=carttable>
                <thead>
                    <tr align="center" style="font-weight: bold;">
                        <td>이미지</td>
                        <td colspan="2">상품명(옵션)(추가옵션)</td>
                        <td>수량</td>
                        <td>상품가격</td>
                        <td>총 가격</td>
                        <td>삭제</td>
                    </tr>
                </thead>

                <tbody class="cartOrder">
                    <c:forEach var="cart" items="${info}" varStatus="i">
                        <c:forEach var="pro" items="${cart.product}">
                            <tr align="center">
                                <td><img id="imga" src="/product/${pro.user_Id}/${pro.product_Image}">
                                </td>
                                <td colspan="2">
                                    <span>${pro.product_Name}(${cart.product_Option1})(${cart.product_Option2})</span>
                                </td>
                                <td>
                                    <select class="nums" id="product_Count" onchange="totalNum(event) , vile()"
                                        class="product_Count" name="cartListVO[${i.index}].product_Count">
                                        <option value="${cart.cart_BuytCount}">${cart.cart_BuytCount}</option>
                                        <!-- <option value="1">1</option> -->
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
                                </td>
                                <td id="productprice"><span class="resultPrice">${pro.product_Price}</span></td>
                                <td><span class="sum" id="sum"></span></td>
                                <td>
                                    <button type="button" class="cartdelete" id="num"
                                        value="${cart.cart_Num}">삭제</button></td>
                            </tr>
                            <input type="hidden" name="cartListVO[${i.index}].product_Image" class="product_Image"
                                value="${cart.product_Image}" />
                            <input type="hidden" name="cartListVO[${i.index}].product_Name" id="product_Name"
                                value="${pro.product_Name}" />
                            <input type="hidden" name="cartListVO[${i.index}].cart_Num" id="cart_Num"
                                value="${cart.cart_Num}" />
                            <input type="hidden" name="cartListVO[${i.index}].product_Num" id="product_Num"
                                value="${cart.product_Num}" />
                            <input type="hidden" name="cartListVO[${i.index}].user_Id" id="user_Id"
                                value="${member.user_Id}" />
                            <input type="hidden" name="cartListVO[${i.index}].product_Price" id="product_Price"
                                value="${pro.product_Price}" />
                            <input type="hidden" name="cartListVO[${i.index}].order_Num" id="order_Num"
                                value="${cart.order_Num}" />
                            <input type="hidden" name="cartListVO[${i.index}].product_Option1" id="product_Option1"
                                value="${cart.product_Option1}" />
                            <input type="hidden" name="cartListVO[${i.index}].product_Option2" id="product_Option2"
                                value="${cart.product_Option2}" />
                        </c:forEach>
                    </c:forEach>
                </tbody>
                <script>
                    let totalNum = (e) => {
                        let toCount = e.target.value;
                        let toPrice = e.target.parentElement.nextElementSibling.firstElementChild.innerText;
                        let toNum = e.target.parentElement.nextElementSibling.nextElementSibling.firstElementChild
                            .innerHTML = toCount * toPrice;
                        console.log(toNum);
                    }

                    document.addEventListener("DOMContentLoaded", () => {
                        // 삭제 버튼 
                        document.querySelector("#carttable").addEventListener("click", async e => {
                            if (e.target.tagName.toLowerCase() !== "button") {
                                // e.target instanceof HTMLButtonElement
                                return;
                            }
                            if (!confirm("정말로 삭제하시겠습니까?")) {
                                return;
                            }
                            let num = e.target.value;
                            // console.log(num);
                            console.log(e.target);
                            let cartdelete = await fetch("/cartdelete.do", {
                                method: "POST",
                                headers: {
                                    "content-type": "application/json"
                                },
                                body: JSON.stringify(num)
                            })
                            if (cartdelete.status = 200) {
                                let data = await cartdelete.json();
                                console.log(data);
                                if (data.result === 0) {
                                    alert("다시 시도해주세요");
                                    location.reload();
                                    return;
                                } else {
                                    alert("삭제가 완료되었습니다");
                                    location.reload();
                                    return;
                                }

                            } else {
                                alert("서버 문제");
                            }
                        })
                    })
                </script>
            </table>
            <div class="cartfoot">
                <h5>
                    <span id="productnum"></span>개 상품 : <span id="totalprice"></span>원 + 배송비 : 2.500원 총 금액 :<span
                        id="resultPrice"></span>
                </h5>
            </div>
            <div class="cartbuy">
                <input type="submit" class="btncart" id="cart" value="구매하기">
            </div>

        </div>
        <script>
            //밑에 총계산
            
                const vile = () => {

                    let tr = [...document.querySelectorAll("tbody > tr")];
                    console.log(tr);
                    let finish = tr.reduce((acc, count) => {
                        acc.totalCount += +count.querySelector("#product_Count").value;
                        acc.totalPrice += +count.querySelector("#sum").innerText;
                        return acc;
                    }, {
                        totalCount: 0,
                        totalPrice: 0
                    })
                    console.log("totalPrice"+finish.totalPrice);
                    document.querySelector("#productnum").innerHTML= finish.totalCount;
                    document.querySelector("#totalprice").innerHTML= finish.totalPrice;
                    document.querySelector("#resultPrice").innerHTML=finish.totalPrice +2500;
                }
                
            





            $(document).ready(function () {
                let num = new Array();
                num = document.querySelectorAll("#product_Count option:checked");
                let resultPrice = document.querySelectorAll(".resultPrice");
                var sumTest = [];
                var sum2 = null;
                var num2 = 0;
                for (i = 0; i < num.length; i++) {
                    sumTest.push(num[i].value * resultPrice[i].innerText);
                    let sum = sumTest[i];
                    document.querySelectorAll("#sum")[i].innerHTML = sum;
                    sum2 += sumTest[i];
                    num2 += parseInt(num[i].value);
                }
                document.querySelector("#resultPrice").innerHTML = sum2;
                document.querySelector("#productnum").innerHTML = num2;
            });
        </script>

    </form>
</body>

</html>