 <%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<c:set var = "user_Address1" value="${member.user_Address1}" />
<c:set var = "user_Address2" value="${member.user_Address2}" />
<c:set var = "user_Address3" value="${member.user_Address3}" />
<c:set var = "user_Name" value="${member.user_Name}" />
<c:set var = "user_Email" value="${member.user_Email}" />
<c:set var = "user_Phone" value="${member.user_Phone}" />
<c:set var = "user_Id" value="${member.user_Id}" />
<c:set var = "contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>결제창</title>
    	<script src="https://js.tosspayments.com/v1"></script>
    <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
    <!-- reset css -->
    <!-- <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css"> -->
    <!-- css -->
    <link rel="stylesheet" href="/css/cartorder.css">

</head>

<body>
  <script src="https://code.jquery.com/jquery-3.4.1.js"></script>
    <script>
       /* 주소입력란 버튼 동작(숨김, 등장) */
function showAdress(className){
    /* 컨텐츠 동작 */
    /* 모두 숨기기 */
    $(".addressInfo_input_div").css('display', 'none');
    /* 컨텐츠 보이기 */
    $(".addressInfo_input_div_" + className).css('display', 'block');

/* 버튼 색상 변경 */
    /* 모든 색상 동일 */
        $(".address_btn").css('backgroundColor', '#555');
    /* 지정 색상 변경 */
        $(".address_btn_"+className).css('backgroundColor', '#3c3838');	


$(".addressInfo_input_div").each(function(i, obj){
$(obj).find("selectAddress").val("F");
});
/* 선택한 selectAdress T만들기 */
$(".addressInfo_input_div_" + className).find("selectAddress").val("T");
}
    </script>
<script>
    //본 예제에서는 도로명 주소 표기 방식에 대한 법령에 따라, 내려오는 데이터를 조합하여 올바른 주소를 구성하는 방법을 설명합니다.
    function sample4_execDaumPostcode() {
        new daum.Postcode({
            oncomplete: function (data) {
                // 팝업에서 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.

                // 도로명 주소의 노출 규칙에 따라 주소를 표시한다.
                // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
                var roadAddr = data.roadAddress; // 도로명 주소 변수
                var extraRoadAddr = ''; // 참고 항목 변수

                // 법정동명이 있을 경우 추가한다. (법정리는 제외)
                // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
                if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
                    extraRoadAddr += data.bname;
                }
                // 건물명이 있고, 공동주택일 경우 추가한다.
                if (data.buildingName !== '' && data.apartment === 'Y') {
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data
                        .buildingName);
                }
                // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
                if (extraRoadAddr !== '') {
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                // 우편번호와 주소 정보를 해당 필드에 넣는다.
                document.getElementById('sample4_postcode').value = data.zonecode;
                document.getElementById("sample4_roadAddress").value = roadAddr;
                document.getElementById("sample4_jibunAddress").value = data.jibunAddress;

                document.getElementById("sample4_engAddress").value = data.addressEnglish;

                // 참고항목 문자열이 있을 경우 해당 필드에 넣는다.
                if (roadAddr !== '') {
                    document.getElementById("sample4_extraAddress").value = extraRoadAddr;
                } else {
                    document.getElementById("sample4_extraAddress").value = '';
                }

                var guideTextBox = document.getElementById("guide");
                // 사용자가 '선택 안함'을 클릭한 경우, 예상 주소라는 표시를 해준다.
                if (data.autoRoadAddress) {
                    var expRoadAddr = data.autoRoadAddress + extraRoadAddr;
                    guideTextBox.innerHTML = '(예상 도로명 주소 : ' + expRoadAddr + ')';
                    guideTextBox.style.display = 'block';

                } else if (data.autoJibunAddress) {
                    var expJibunAddr = data.autoJibunAddress;
                    guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                    guideTextBox.style.display = 'block';
                } else {
                    guideTextBox.innerHTML = '';
                    guideTextBox.style.display = 'none';
                }
            }
        }).open();
    }
</script>

	<script>
	$(document).ready(function(){
		var sum2 = 0;
		var con = 0;
		var test = document.querySelectorAll("#sum");
		var test2 = document.querySelectorAll("#productcount");
		for(i=0; i<test.length; i++){
			con += parseInt(test2[i].innerText);
			sum2 += parseInt(test[i].innerText);
		}
		console.log(con);
		console.log(sum2);
		document.querySelector("#resultPrice").innerHTML = sum2;
		document.querySelector("#productnum").innerHTML = con;
	});

	</script>
<form name="colist" class="colist" action="${contextPath}/carteach.do" method="post">
      	<!-- 구매자 -->
        <h3>주문결제</h3>
        <input type="hidden" name="order_Num" value="308">
        <div class="ordercontent">
        <div class="addInfo">
        <div class="content_main">
            <table class="memberInfo_table">
            <tbody>
            <tr>
                <th><h6>구매자 정보</h6></th>
                <td>이름&nbsp;:&nbsp;${user_Name}</td>
                <td>이메일&nbsp;:&nbsp;${user_Email}</td>
                <td>핸드폰&nbsp;:&nbsp;${user_Phone}&nbsp;<button>수정</button></td>
            </tr>
            </tbody>
            </table>
         </div>
            <!-- 받는사람 -->
            <div class="addressInfo_div">
	        <div class="addInfo_button_div">
	        	<button type="button" class="address_btn address_btn_1" onclick="showAdress('1')" style="background-color: #c3838;">사용자 정보 주소록</button>
	        	<button type="button" class="address_btn address_btn_2" onclick="showAdress('2')"  style="background-color: #c3838;">직접 입력</button>
	        </div>
	        <div class="addressInfo_input_div_wrap">
            <div class="addressInfo_input_div addressInfo_input_div_1">
	            <table>
	            <tbody>
	            <tr>
	                <th><h6>기본배송지</h6></th>
	                <!-- 배송정보등 값들이 변경되도록 설정 -->
	                <td>
		                <input class="selectAddress" value="T" type="hidden">
		            <div class="display_div">
	                <div>
	                <p>이름</p><p>우편번호</p><p>도로명주소</p><p>상세주소</p><p>연락처</p><p>배송시 요청사항</p>
	                </div>
	                <div class="display_div2">
	                <input type="text" class="order_GetName" value="${user_Name}" readonly>
	                <input type="text" class="order_Address1" value="${user_Address1}" readonly>
	                <input type="text" class="order_Address2" value="${user_Address2}" readonly>
	                <input type="text" class="order_Address3" value="${user_Address3}" readonly>
	                <input type="text" class="order_Phone" value="${user_Phone}" readonly>
	                <input type="text" id="order_Rqds" class="order_Rqd">
	                </div>
	                </div>
		          	</td>
	             </tr>
	            </tbody>
	            </table>
            </div>
            
			<div class="addressInfo_input_div addressInfo_input_div_2">
	            <table>
				<tbody>
				<tr>
					<th><h6>배송지 변경</h6></th>
					<td class="product_order_table">
	            		<input class="selectAddress" value="F" type="hidden" readonly="readonly">
	                <div class="display_div">
	                <div class="margin_div">
	                <p>이름</p><p>우편번호</p><p>도로명주소</p><p>상세주소</p><p>연락처</p><p>배송시 요청사항</p>
	                </div>
	                <div class="display_div2">
	                <input name="order_GetName" readonly="readonly">
	                <input id="sample4_postcode" placeholder="우편번호" placeholder="우편번호" name="order_Address1" readonly="readonly">
	                <input id="sample4_roadAddress" placeholder="도로명주소" name="order_Address2" readonly="readonly">
	                <input type="hidden" id="sample4_jibunAddress" placeholder="지번주소" name="user_Address2" size="40" />
	            	<input type="hidden" id="sample4_engAddress" />
	            	<input type="hidden" id="sample4_extraAddress" />
                    <span id="guide" style="color:#999;display:none"></span>
	            	<input name="order_Address3" readonly="readonly">
	            	<input name="order_Phone" readonly="readonly">
	            	<input name="order_Rqd" readonly="readonly">
	                </div>
	                </div>
	            	</td>
	            	<td><input type="button" onclick="sample4_execDaumPostcode()" class="address_search_btn" value="우편번호 찾기"></td>					
				</tr>
				</tbody>           
	            </table>
            </div>
            </div>
            </div>
        </div>
            
            <div>
            </div>

            <!-- 결제 정보 -->
            <div class="orderpay">
            <div>
                <h6 class="h6">결제 정보</h6>
                
				<div class="productcss">
				
                <table class="productlists">
                <thead class="prostyle">
                    <td>상품 이미지</td>
                    <td colspan="2">상품명(옵션)(추가옵션)</td>
                    <td>수량</td>
                    <td>상품가격</td>
                    <td>총 가격</td>
                </thead>
                <div class="productcss">
                <c:forEach var="order" items="${info}" varStatus="i">
                <c:forEach var="pro" items="${order.product}">
                <tr>
				    <td><img src="/product/${pro.user_Id}/${pro.product_Image}"  width="200px" height="70px"></td>
			        <td colspan="2" style="text-align: center; vertical-align: middle;"><span>${pro.product_Name}(${order.product_Option1})(${order.product_Option2})</span></td>
			       	<td  style="text-align: center;vertical-align: middle;"><span id="productcount">${order.product_Count}</span></td>
			        <td id="productprice" style="text-align: center;vertical-align: middle;"><span class="resultPrice">${order.product_Price}</span></td>
			        <td style="text-align: center; vertical-align: middle;"><span class="sum" id="sum">${order.product_Count * order.product_Price}</span></td>
                </tr>
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_GetName" id="order_GetName" value="${user_Name}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].user_Id" id="user_Id" value="${user_Id}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_Num" id="order_Num" value="${order.order_Num}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_Num" id="product_Num" value="${order.product_Num}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_Address1" id="order_Address1" value="${user_Address1}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_Address2" id="order_Address2" value="${user_Address2}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_Address3" id="order_Address3" value="${user_Address3}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_Phone" id="order_Phone" value="${user_Phone}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].order_Rqd" id="order_Rqd" value="dsdsd">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_Name" id="product_Name" value="${pro.product_Name}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_Option1" id="product_Option1" value="${order.product_Option1}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_Option2" id="product_Option2" value="${order.product_Option2}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_Count" id="product_Count" value="${order.product_Count}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_Price" id="product_Price" value="${order.product_Price}">
			    <input type="hidden" name="cartorderlistVO[${i.index}].product_TotalPrice" id="product_TotalPrice" value="${order.product_Count * order.product_Price}">
              </c:forEach>
              </c:forEach>
              </div>
            	</table>
            	
              </div>
            </div>
            <div id="just">
            <div id="flexs">
            <span id="productnum"></span>개 상품 : <span id="totalprice"></span>원 + 배송비 : 2.500원 총 금액 :<span id="resultPrice"></span>
            </div>
			<input type="submit" class="btnorder" id="order" onclick="Rqd()" value="구매하기">
			</div>
			</div>
        </div>
        </form>
        <script>
        function Rqd(){
        	
         var test = document.querySelector("#order_Rqds").value;
      var test2 = document.querySelectorAll("#order_Rqd")
      for(let zz = 0; zz<test2.length; zz++){
    	  test2[zz].value=test;
      }
        }
        </script>
</body>
</html>