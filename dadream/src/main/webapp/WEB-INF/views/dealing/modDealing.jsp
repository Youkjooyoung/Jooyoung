<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>부동산 매물수정</title>

    <script src="http://code.jquery.com/jquery-latest.js"></script>

    <!-- 부트스트랩 -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css">

    <!-- 파일업로드 드래그앤드롭 -->
    <script src="https://unpkg.com/dropzone@5/dist/min/dropzone.min.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/dropzone@5/dist/min/dropzone.min.css" type="text/css" />

    <!-- css -->
    <link rel="stylesheet" href="/css/dealingform.css">
    <!-- JS -->
    <script src="/js/dealingJS/dealingform.js"></script>
    <script src="/js/dealingJS/dealingmod.js"></script>
    <!-- 섬머노트 -->
    <script src="/js/summernote/summernote-lite.js"></script>
    <script src="/js/summernote/lang/summernote-ko-KR.js"></script>
    <link rel="stylesheet" href="/css/summernote/summernote-lite.css">
    <!--구글 폰트-->
    <!-- 글꼴 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" 교차 출처>
    <link href="https: //fonts.googleapis.com/css2? family= Merriweather+Sans:wght@500 & display=swap" rel="stylesheet">
   

</head>

<body>
    <!--부트스트랩-->
    <!-- <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
    <div class="first">
        <h1>매물등록</h1>

        <form id="FORMTAG" method="post" action="${contextPath}/dealing/modDealing2.do" enctype="multipart/form-data">
            <div class="middle">

                <!------------------------------------------이미지 div--------------------------------------->
                <div class="dlImg">
                    <div class="dlMain">
                        <label for="dealing_Image" class="mod_Img" style="margin-bottom: 5px;">
                            <p>대표이미지를 선택해주세요.</p>
                        </label><br>
                        <img id="preview" src="/dealing/${modDealing.user_Id}/${modDealing.dl_Image}" width=500 height=500 />
                        <input type="file" id="dealing_Image" name="dl_Image"  accept="image/*" multiple>
                        <h1 class="imgh1"></h1>
                    </div>
                </div>
                <input type="hidden" name="originalFileName" value="${modDealing.dl_Image}">
                <input type="hidden" name="dl_Num" value="${modDealing.dl_Num}">
                <!--------------------------------------상품 설명div----------------------------------------->
                <div class="dealingcon">
                    <h3>매물이름</h3>
                    <input type="text" id="dl_Title" name="dl_Title" placeholder="건물명을 입력해주세요." size="50" value="${modDealing.dl_Title}">
                    <br><br>
                    <h3>도시명</h3>
                    <input type="text" id="dl_City" name="dl_City" placeholder="ex) 서울, 부산, 대전" size="50" value="${modDealing.dl_City}">
                    <br><br>
                    <h3>주소입력</h3>
                    <input type="text" id="sample5_address" name="dl_Address" value="${modDealing.dl_Address}" placeholder="주소" size="38" readonly>
                    <input type="button" onclick="sample5_execDaumPostcode()" value="주소 검색" class="Address_search_btn"><br><br>
                    <div id="map"></div><br>
                    <!----------------------------------------- 우편api ------------------------------------->
                    <script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
                    <!--------------------------------------- 지도api -------------------------------------->
                    <script
                        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=d1a9a1b185a416c4c43f9c88915f8650&libraries=services">
                    </script>
                    <!-- ----------------------------------지도생성 --------------------------------------->
                    <script>
                        var mapContainer = document.getElementById('map'), // 지도를 표시할 div
                            mapOption = {
                                center: new daum.maps.LatLng(37.537187, 127.005476), // 지도의 중심좌표
                                level: 5 // 지도의 확대 레벨
                            };

                        //지도를 미리 생성
                        var map = new daum.maps.Map(mapContainer, mapOption);
                        //주소-좌표 변환 객체를 생성
                        var geocoder = new daum.maps.services.Geocoder();
                        // //마커를 미리 생성
                        // var marker = new daum.maps.Marker({
                        //     position: new daum.maps.LatLng(37.537187, 127.005476),
                        //     map: map
                        // });
                        // 지도를 클릭한 위치에 표출할 마커입니다
                        var marker = new kakao.maps.Marker({
                            // 지도 중심좌표에 마커를 생성합니다 
                            position: map.getCenter()
                        });
                        // 지도에 마커를 표시합니다
                        marker.setMap(map);
                        // 지도에 클릭 이벤트를 등록합니다
                        // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
                        //(function(){
                        kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
                            document.querySelector("#sample5_address").value = "";
                            searchDetailAddrFromCoords(mouseEvent.latLng, function (result, status) {
                                if (status === kakao.maps.services.Status.OK) {
                                    // 클릭한 위도, 경도 정보를 가져옵니다 
                                    var latlng = mouseEvent.latLng;

                                    // 마커 위치를 클릭한 위치로 옮깁니다
                                    marker.setPosition(latlng);

                                    var dl_Lat = latlng.getLat();
                                    var dl_Lng = latlng.getLng();
                                    //console.log(dl_Lat);
                                    //console.log(dl_Lng);

                                    console.log(result[0]);
                                    /* if문 안먹음 */
                                    if (!result[0].road_address) {
                                        alert("정확한 위치를 찍어주세요 ");
                                        return;
                                    }

                                    

                                    var jibun_address = result[0].address.address_name; // 지번 주소
                                    var road_address = result[0].road_address.address_name; //도로명 주소

                                    //마커찍으면 주소 변환
                                    document.querySelector("#sample5_address").value = road_address;
                                    

                                    console.log(road_address);
                                    console.log(jibun_address);
                                    // var message = '클릭한 위치의 위도는 ' + latlng.getLat() + ' 이고, ';
                                    // message += '경도는 ' + latlng.getLng() + ' 입니다';

                                    // var resultDiv = document.getElementById('clickLatlng');
                                    // resultDiv.innerHTML = message;

                                    //인풋에 value 값 넣기
                                    document.querySelector("#dl_Lat").setAttribute('value', dl_Lat);
                                    document.querySelector("#dl_Lng").setAttribute('value', dl_Lng);
                                }
                            });
                        });
                        //})();
                        function searchDetailAddrFromCoords(coords, callback) {
                            // 좌표로 법정동 상세 주소 정보를 요청합니다
                            geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
                        }


                        function sample5_execDaumPostcode() {
                            new daum.Postcode({
                                oncomplete: function (data) {
                                    var addr = data.address; // 최종 주소 변수

                                    // 주소 정보를 해당 필드에 넣는다.
                                    document.getElementById("sample5_address").value = addr;
                                    // 주소로 상세 정보를 검색
                                    geocoder.addressSearch(data.address, function (results, status) {
                                        // 정상적으로 검색이 완료됐으면
                                        if (status === daum.maps.services.Status.OK) {

                                            var result = results[0]; //첫번째 결과의 값을 활용

                                            // 해당 주소에 대한 좌표를 받아서
                                            var coords = new daum.maps.LatLng(result.y, result.x);
                                            // 지도를 보여준다.
                                            mapContainer.style.display = "block";
                                            map.relayout();
                                            // 지도 중심을 변경한다.
                                            map.setCenter(coords);
                                            // 마커를 결과값으로 받은 위치로 옮긴다.
                                            marker.setPosition(coords)
                                        }
                                    });
                                }
                            }).open();
                        }
                    </script>
                    <input type="hidden" name="dl_Lat" id="dl_Lat" value="${modDealing.dl_Lat}"/>
                    <input type="hidden" name="dl_Lng" id="dl_Lng" value="${modDealing.dl_Lng}"/>
                    <h3>가격</h3>
                    <input type="text" name="dl_Price" id="dl_Price" placeholder="희망하시는 가격을 입력해주세요." size="50" value="${modDealing.dl_Price}">
                    <br><br>
                    <h3>옵션정보</h3>
                    <input type="text" name="dl_Option" id="dl_Option" placeholder="매물의 추가정보를 입력해주세요." size="50" value="${modDealing.dl_Option}">

                    <!-------------------------------------카테고리----------------------------------------->
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
                        <input type="text" name="dl_Size" id="dl_Size" placeholder="평수를 입력해주세요." value="${modDealing.dl_Size}">
                        <br><br>
                    </div>
                </div>
            </div>
            
            <div class="dealingformcontent">
                <h3>상세설명</h3>

                <textarea id="summernote" name="dl_Content" >${modDealing.dl_Content}</textarea>

                <div class="bds02">
                    <input type="submit" id="submitbtn" class="btn btn-secondary btn-lg" value="수정하기">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <input type="reset" class="btn btn-secondary btn-lg" value="다시입력">
                </div>
            </div>
        </form>
    </div>

</body>

</html>