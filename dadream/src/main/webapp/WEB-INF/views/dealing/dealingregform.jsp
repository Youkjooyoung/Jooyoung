<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>부동산 매물등록</title>
<!----------------------------------------- 주소검색 API f----------------------------------------->

<script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
<!----------------------------------------- 지도api ----------------------------------------->
<script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=d1a9a1b185a416c4c43f9c88915f8650&libraries=services">
</script>
    <script src="http://code.jquery.com/jquery-latest.js"></script>

    <!-- 부트스트랩 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">

    <!-- 파일업로드 드래그앤드롭 -->
    <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />

     <!-- css -->
     <link rel="stylesheet" href="/css/dealingform.css">
     <!-- JS -->
     <script defer src="/js/dealingJS/dealingform.js" ></script>
     <script defer src="/js/dealingJS/MapApi.js" ></script>

     <!-- 섬머노트 -->
     <script src="/js/summernote/summernote-lite.js"></script>
     <script src="/js/summernote/lang/summernote-ko-KR.js"></script>
     <link rel="stylesheet" href="/css/summernote/summernote-lite.css">
     <!-- 글꼴 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
    <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
</head>
<body>
    <!--부트스트랩-->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <div class="first">
        <h1>매물등록</h1>

        <form id="FORMTAG" method="post" action="${contextPath}/addNewdealing.do" enctype="multipart/form-data">
            <div class="middle">

                <!--이미지 div-->
                <div class="dlImg">
                    <div class="dlMain">
                        <label for="dealing_Image" style="margin-bottom: 5px;">
                            <p style="font-weight: bold;">대표이미지를 선택해주세요.</p>
                        </label><br>
                        <img id="preview" src="" width=500 height=500 />
                        <input type="file" id="dealing_Image" name="dl_Image" accept="image/*" multiple>
                        <h1 class="imgh1"></h1>
                    </div>
                </div>

                <!--상품 설명div-->
                <div class="dealingcon">
                    <h3>매물이름</h3>
                    <input type="text" id="dl_Title" name="dl_Title" placeholder="건물명을 입력해주세요." size="50">
                    <br><br>
                    <h3>도시명</h3>
                    <input type="text" id="dl_City" name="dl_City" placeholder="ex) 서울, 부산, 대전" size="50">
                    <br><br>
                    <h3>주소입력</h3>
                    <input type="text" id="sample5_address" name="dl_Address" value="" placeholder="주소" size="38" readonly >
                    <input type="button" onclick="sample5_execDaumPostcode()" value="주소 검색" class="Ad_Search_btn"><br><br>
                    <div id="map"></div><br>
                    <!--------------------------------------- 우편api ------------------------------------------->
                    
                    <input type="hidden" name="dl_Lat" id="dl_Lat" />
                    <input type="hidden" name="dl_Lng" id="dl_Lng" />
                    <h3>가격</h3>
                    <input type="text" name="dl_Price" id="dl_Price" placeholder="희망하시는 가격을 입력해주세요."size="50">
                    <!-- <script>
                        function addCommas(x){
                            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }
                        $("#dl_Price").on("keyup", function() {
                        $(this).val(addCommas($(this).val().replace(/[^0-9]/g,"")));
                    });
                    </script> -->
                    <br><br>
                    <h3>옵션정보</h3>
                    <input type="text" name="dl_Option" id="dl_Option" placeholder="ex)신축,애완동물,엘레베이터,주차가능..." size="50">
                    <!--카테고리-->
                    <div class="cg">
                        <h3>카테고리 선택</h3>
                        <br><br>
                        <h5>건물형태</h5>
                        <select name="dl_Form" id="dl_Form">
                            <option value="아파트">아파트</option>
                            <option value="투룸+">투룸+</option>
                            <option value="원룸">원룸</option>
                            <option value="오피스텔">오피스텔</option>
                            <option value="주택">주택</option>
                        </select>
                        <br><br>
                        <h5>거래유형</h5>
                        <select name="dl_Form2" id="dl_Form2">
                            <option value="매매">매매</option>
                            <option value="월세">월세</option>
                            <option value="전세">전세</option>
                        </select>
                    
                        <br><br>
                        <h5>방개수</h5>
                        <select name="dl_Room" id="dl_Room">
                            <option value="1">1개</option>
                            <option value="2">2개</option>
                            <option value="3">3개</option>
                            <option value="4">4개</option>
                            <option value="5">5개</option>
                        </select>
                        <br><br>
                        <h5>평수</h5>
                        <input type="text" name="dl_Size" id="dl_Size" placeholder="평수를 입력해주세요.">
                        <br><br>                       
                    </div>
                </div>
            </div>
            <div class="dealingformcontent">
                <h3>상세설명</h3>

                <textarea id="summernote" name="dl_Content"></textarea>

                <div class="bds02">
                    <input type="submit" id="submitbtn" class="btn btn-secondary btn-lg" value="등록하기">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="reset" class="btn btn-secondary btn-lg" value="다시입력">
                </div>
            </div>
        </form>
    </div>         
</body>

</html>