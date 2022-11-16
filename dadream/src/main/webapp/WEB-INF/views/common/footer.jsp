<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"
 %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>

<head>
    <meta charset="UTF-8">
    <title>하단부분</title>
    <!-- reset css -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/reset-css@5.0.1/reset.min.css">
    <!-- css -->
    <link rel="stylesheet" href="/css/footer.css">
    <script src="//dapi.kakao.com/v2/maps/sdk.js?appkey=d1a9a1b185a416c4c43f9c88915f8650"></script>
</head>

<body>
    <footer>
        <div class="footer">
            <!-- <div class="footer_img">
                <img src="../image/메인로고.png" alt="다드림 메인이미지">
            </div> -->
            <div class="footer_content">
                <span>대표자 : 뜨거운 감자</span><br>
                <span>사업장 : 사랑시 고백구 행복동</span><br>
                <span>사업자 번호 : 02-222-2222</span><br>
                <span>Email : DaDream@test.com</span><br><br>
                <span><button type="button" onclick="javascript:openModal('modal1');"
                        class="button1 modal-open">회사위치보기</button></span>
                <div id="modal"></div>
                <div class="modal-con modal1">
                    <a href="javascript:;" class="close">X</a>
                    <p class="title">회사위치</p>
                        <div class="con" id="map2" style="width:700px;height:500px;"></div>
                </div>
            </div>
            <div class="footerinfo">
                <span>저희 다드림 은 집을 계약하고 가구 도 함께 구매할수있는 사이트 입니다 .</span> <br>
                <span>이용해주셔서 감사합니다.</span> <br> <br>
                <c:if test="${member.user_Level == 100}">
                    <a href="/admin/admin.do">관리자페이지</a>
                </c:if>
                <span>팀장 : 육주영</span><br>
                <span>팀원 : 안형수, 김병성, 이재욱</span>
            </div>
        </div>
    </footer>
    <script>
        function openModal(modalname) {
            document.get
            $("#modal").fadeIn(300);
            $("." + modalname).fadeIn(300);

            var mapContainer = document.getElementById('map2'), // 지도를 표시할 div 
                mapOption = {
                    center: new kakao.maps.LatLng(37.586582263676604, 126.97486505354091), // 지도의 중심좌표
                    level: 3, // 지도의 확대 레벨
                    mapTypeId: kakao.maps.MapTypeId.ROADMAP // 지도종류
                };

            // 지도를 생성한다 
            var map = new kakao.maps.Map(mapContainer, mapOption);

            // 지도에 마커를 생성하고 표시한다
            var marker = new kakao.maps.Marker({
                position: new kakao.maps.LatLng(37.586582263676604,
                126.97486505354091), // 마커의 좌표
                map: map // 마커를 표시할 지도 객체
            });

            // 마커 위에 표시할 인포윈도우를 생성한다
            var infowindow = new kakao.maps.InfoWindow({
                content: '<div style="padding:5px;">다드림(주)</div>' // 인포윈도우에 표시할 내용
            });

            // 인포윈도우를 지도에 표시한다
            infowindow.open(map, marker);
        }

        $("#modal, .close").on('click', function () {
            $("#modal").fadeOut(300);
            $(".modal-con").fadeOut(300);
        });
    </script>
</body>

</html>