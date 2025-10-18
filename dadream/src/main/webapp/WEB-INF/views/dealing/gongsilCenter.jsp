<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<lang="ko">

    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>공실센터</title>
        <!-- 제이쿼리 -->
        <script src="http://code.jquery.com/jquery-latest.js"></script>
        <!-- 글꼴 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
        <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/css/gongsilCenter.css">
    </head>
    <body>
        <div id="gs_head">
        <h1>공실센터</h1>
        <form id="dlSearch2">
            <div id="gs_search" style="display: flex;">
                <div id="formChk">
                    <input type="checkbox" id="dl_Form" name="dl_Form" onclick="selectAll(this)">전체
                    <input type="checkbox" id="dl_Form" name="dl_Form" value="아파트">아파트
                    <input type="checkbox" id="dl_Form" name="dl_Form" value="원룸">원룸
                    <input type="checkbox" id="dl_Form" name="dl_Form" value="투룸">투룸+
                    <input type="checkbox" id="dl_Form" name="dl_Form" value="오피스텔">오피스텔
                    <input type="checkbox" id="dl_Form" name="dl_Form" value="주택">주택
                </div>
        </form>
        <form id="dlSearch3">
                <div id="locationChk">
                    <input type="text" id="dealingsearch" size="30px" name="dl_Address" placeholder="지역을 입력해주세요">
                    <button type="button" value="매물검색" onclick="dlBtn2()">매물검색</button>
                </div>
            </div>
        </form>
        </div>
        <div id="gs_main1">
                <h2>내 주변 추천 매물</h2>
            <div id="">
                <div id="mainList"></div>
            </div>
        </div>
        <div id="gs_main2">
            <h2>검색 매물</h2>
            <div>               
                <div id="resultList"></div>
            </div>
        </div>
        <script>
            /* 위치기반 매물목록 */
            $(document).ready(function () {
                /* 위치기반 api */
                // HTML5의 geolocation으로 사용할 수 있는지 확인합니다 
                if (navigator.geolocation) {
                    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
                    navigator.geolocation.getCurrentPosition(function (position) {

                        var lat = position.coords.latitude; // 위도
                        var lng = position.coords.longitude; // 경도

                        console.log(lat);
                        console.log(lng);

                        $.ajax({
                            url: "/hereMe.do",
                            type: "get",
                            cache: false,
                            data: {
                                lat,
                                lng
                            },
                            success: function (hereList) {

                                $("#mainList").empty();
                                var mainList = "";

                                $.each(hereList, function (index, item) {
                                    mainList +=
                                    '<a href="/dealingview.do?dl_Num='+item.dl_Num+'" style="color:black" target="_blank">'+
                                        '<div style="display: inline-block; border: 1px solid #ccc; margin-bottom: 20px; margin-left: 30px; width:350px; height:485px;">';
                                    mainList += '<div style="text-align:center;">' +
                                        '<img src="/dealing/' + item.user_Id + '/' +
                                        item.dl_Image +
                                        '" alt="매물사진" width="300px" height="250px" style="margin: 20px 0 20px 0;border:0.5px solid #ccc">' +
                                        '</div>';
                                    mainList += '<div style="margin-left:15px;">' +
                                        '<span style="font-size:20px;font-weight:bold;margin-left:10px; color:skyblue;">'+item.dl_Title+'</span>'+
                                        '<h1>'+ item.dl_Form + '<br>'+item.dl_Address+'<br>'+
                                        item.dl_Form2  +'<br>￦ '+ item.dl_Price + '<br>옵션 : '+item.dl_Option+'</h1></div>' + '</div></a>';
                                });

                                document.getElementById("mainList").innerHTML = mainList;
                            },
                            error: function () {
                                alert("오류발생");
                            }

                        });

                    });

                } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

                    // var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
                    //     message = 'geolocation을 사용할수 없어요..'
                    alert("현재위치를 불러올 수 없습니다.")
                }
            });

            /* 전체선택 */
            function selectAll(selectAll) {
                var checkboxes = document.getElementsByName('dl_Form');

                checkboxes.forEach(function (checkbox) {
                    checkbox.checked = selectAll.checked;
                });
            }

            /* 검색기능 */
            function dlBtn2() {
                var dl_Form = $('#dlSearch2').serialize();
                //var dlChk = $('#dealingsearch').val();
                var dl_Address = $('#dlSearch3').serialize();
                console.log(dl_Form);
                console.log(dl_Address);

                $.ajax({
                    url: "/gongsilSearch.do",
                    type: "get",
                    data: unescape((dl_Form+'&'+dl_Address).replace(/%/g, '%25')),
                    
                    success: function(gsResult) {
                        alert("성공");
                        console.log(gsResult);

                        var resultList = "";
                            $.each(gsResult, function (index, item) {
                                resultList +=
                                    '<a href="/dealingview.do?dl_Num='+item.dl_Num+'" style="color:black" target="_blank">'+
                                        '<div style="display: inline-block; border: 1px solid #ccc; margin-bottom: 20px; margin-left: 30px; width:350px; height:485px;">';
                                            resultList += '<div style="text-align:center;">' +
                                        '<img src="/dealing/' + item.user_Id + '/' +
                                        item.dl_Image +
                                        '" alt="매물사진" width="300px" height="250px" style="margin: 20px 0 20px 0;border:0.5px solid #ccc">' +
                                        '</div>';
                                        resultList += '<div style="margin-left:15px;">' +
                                        '<span style="font-size:20px;font-weight:bold;margin-left:10px;">'+item.dl_Title+'</span>'+
                                        '<h1>'+ item.dl_Form + '<br>'+item.dl_Address+'<br>'+
                                        item.dl_Form2  +'<br>￦ '+ item.dl_Price + '<br>옵션 : '+item.dl_Option+'</h1></div>' + '</div></a>';

                            })
                            //console.log(resultList);
                            document.getElementById("resultList").innerHTML = resultList;
                    },
                    error: function() {
                        alert("조건을 입력해주세요.");
                    }
                });
            }
            
        </script>
    </body>

    </html>