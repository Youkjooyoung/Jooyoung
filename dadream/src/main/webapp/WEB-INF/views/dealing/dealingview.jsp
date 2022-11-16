<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"  %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"  %>
<%@taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>


<%
  request.setCharacterEncoding("UTF-8");
%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>부동산 매물보기</title>

    <!--JS-->
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script defer src="/js/dealingJS/dealingview.js"></script>
    <!-- <script defer src="/js/dealingJS/MapApi.js" ></script> -->
    <!--팝업창-->
    <!--부트스트랩-->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">
    <!--부트스트랩-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <!-- css -->
    <link rel="stylesheet" href="/css/dealingview.css">
    <script>
        function showPopup() {
            window.open("${contextPath}/call.do", "중개사번호", "width=400, height=500, top=200 left=600");
        }

        function showPopup2() {
            window.open("${contextPath}/rpPopUp.do?dl_Num=${DealingContents.dl_Num}", "신고하기",
                "width=500, height=600, top=200 left=600");
        }
    </script>
</head>
<body>
    <div class="first">
        <h1 class="title">매물정보</h1>
            <div class="middle">
            <!--이미지 div-->
            <div class="dlImg">
                <div class="dlMain">
                    <img src="/dealing/${DealingContents.user_Id}/${DealingContents.dl_Image}">
                </div>
            </div>

            <!---------------------------------상품 설명--------------------------------->

            <div class="dlComments">
                <div>
                <c:if test="${DealingContents.dl_Sold =='Y'}">
                 <p id="sold">안전거래 상품입니다.</p>
                </c:if>
                 </div>
                
                <!-------------------------------건물명,주소------------------------------->
                <div class="dlComments1">
                    <p>매물명</p>
                    <input class="dlName" type="text" value="${DealingContents.dl_Title}" name="dl_Title" disabled>
                    <p>상세 주소</p>
                    <input class="dlAddr" type="text" value="${DealingContents.dl_Address}" name="dl_Address" maxlength="50"disabled>
                </div>
                <br><br>
                <!-------------------------------방종류, 층수------------------------------->
                <div id="dlComments2">
                    <div class="">
                        <p>건물 유형</p>
                        <input class="dlCategory" type="text" value="${DealingContents.dl_Form}" name="dl_Form" size="10" disabled>
                    </div>
                    <div class="">
                        <p>거래 형태</p>
                        <input class="transaction_form" type="text" value="${DealingContents.dl_Form2}" name="dl_Form2" disabled></td>
                    </div>
                </div>

                <!-------------------------------가격,매물종류------------------------------->
                <div id="dlComments3">
                    <div>
                        <p>옵션</p>
                        <input class="Opt" type="text" value="${DealingContents.dl_Option}" name="dl_Form2" disabled>
                        <p>가격</p>
                            <input class="PriceNum" type="text" value="<fmt:formatNumber value='${DealingContents.dl_Price}'/>" name="dl_Price" currencySymbol="￦" disabled/>
                        <div class="JJIM_CALL">
                            <!-- 하트 찜  -->
                            <div class="heart"></div>
                            <button type="button" id="call" class="btn btn-secondary btn-lg"
                                onclick="showPopup();">전화하기</button>
                        </div>
                    </div>
                    <!-------------------------------판매자 전화번호------------------------------->

                </div>
            </div>
        </div>
        <div id="dlcontents">
            <textarea class="viewcontent" rows="20" cols="147" value="${DealingContents.dl_Content}" name="dl_Content"
                disabled>${DealingContents.dl_Content }</textarea>
        </div>
        <div id="reportbtn">
            <button type="button" class="btn btn-secondary btn-lg" onclick="showPopup2();">신고합니다</button>
        </div>
    </div>
    <c:if test="${member.user_Level == 3}">
        <c:if test="${DealingContents.dl_Sold =='X'}">
    <div id="level3">
        <button type="button" id="btnorder" class="btnorder">공실구매</button>
    </div>
    </c:if>
    </c:if>

    <!-- 찜하기 -->
    <script>
        //처음 들어갈때 찜 여부 체크
        var dl_Num = "${DealingContents.dl_Num}";
        var result2 = null;
        console.log("dl_Num" + dl_Num);
        $(document).ready(function () {
            $(".heart").css("backgroundImage", "url(../image/heart_default.png)");
            $(".heart").css("width", "24px");
            $(".heart").css("height", "24px");
            $(".heart").css("margin-top", "13%");
            $(".heart").css("margin-right", "50px");
            $.ajax({
                url: "jjimCheck.do",
                type: "post",
                data: {
                    dl_Num
                },
                success: function (result) {
                    console.log("result" + result);
                    result2 = result;
                    if (result == 0) {
                        $(".heart").css("backgroundImage", "url(../image/heart_default.png)");
                        $(".heart").css("width", "24px");
                        $(".heart").css("height", "24px");
                        $(".heart").css("margin-top", "13%");
                        $(".heart").css("margin-right", "50px");
                        return;
                    } else {
                        $(".heart").css("backgroundImage", "url(../image/heart_fill.png)");
                        $(".heart").css("width", "24px");
                        $(".heart").css("height", "24px");
                        $(".heart").css("margin-top", "13%");
                        $(".heart").css("margin-right", "50px");
                    }
                },
                error: function () {}
            });
        });

        //좋아요 찜 클릭
        var user_Id = "${user_Id}";
        console.log(user_Id);
        $(".heart").click(function () {
            console.log(result2);
            if (result2 == 0) {
                $.ajax({
                    url: "jjim.do",
                    type: "get",
                    data: {
                        dl_Num
                    },
                    success: function () {
                        alert("찜 하기를 등록하셨습니다.");
                        $(".heart").css("backgroundImage", "url(../image/heart_fill.png)");
                        $(".heart").css("width", "24px");
                        $(".heart").css("height", "24px");
                        $(".heart").css("margin-top", "13%");
                        $(".heart").css("margin-right", "50px");
                        result2 = 1;
                        return;
                    },
                    error: function () {
                        alert("찜 하기를 실패했습니다.");
                        return;
                    }
                });
            }
            if (result2 == 1) {
                $.ajax({
                    url: "jjimRemove.do",
                    type: "get",
                    data: {
                        dl_Num
                    },
                    success: function () {
                        alert("찜하기를 취소 했습니다.");
                        $(".heart").css("backgroundImage", "url(../image/heart_default.png)");
                        $(".heart").css("width", "24px");
                        $(".heart").css("height", "24px");
                        $(".heart").css("margin-top", "13%");
                        $(".heart").css("margin-right", "50px");
                        result2 = 0;
                        return;
                    },
                    error: function () {
                        alert("찜 취소 실패");
                        return;
                    }
                });
            }
        });
    </script>
        <script src="https://js.tosspayments.com/v1"></script>
        <script>
        var orderId = Math.floor(Math.random() * 1000000000) + 1;
        var clientKey = 'test_ck_jkYG57Eba3G7LGlBJkj3pWDOxmA1';
        var tossPayments = TossPayments(clientKey); // 클라이언트 키로 초기화하기
        let dl_Nums = "${DealingContents.dl_Num}"
        let dl_Title = "${DealingContents.dl_Title}"
        let user_Ids = "${member.user_Id}"
        var order_Nums = Math.floor(Math.random() * 1000000000) + 1;
        document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#btnorder").addEventListener("click", async e => {
        tossPayments.requestPayment('카드', { // 결제 수단 파라미터
        // 결제 정보 파라미터
        amount: 100000,
        orderId: orderId,
        orderName: dl_Title,
        customerName: '${member.user_Name}',
        successUrl: window.location.origin + "/dealing/gongsilCenter.do",
        failUrl: window.location.origin + "/fail.do",
        })
        let dl = await fetch('/dlorder.do', {
        method: "POST",
        headers: {
        'content-type': 'application/json'
        },
        body: JSON.stringify({
        dl_Num : dl_Nums,
        user_Id : user_Ids,
        order_Num : order_Nums,
        })
        });
        if (dl.status === 200) {
        let jsondata = await dl.json();
        if (jsondata.result === 1) {

        }

        } else {
        alert("예상치 못한 오류입니다.");
                    }
                });
            })
        </script>
</body>

</html>