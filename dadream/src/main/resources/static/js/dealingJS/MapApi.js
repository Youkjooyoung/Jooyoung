/*---------------------------------------매물등록---------------------------------------- */ 
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
                        
                        
                        
                        
/*---------------------------------------회원가입---------------------------------------- */                        
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
                    guideTextBox.style.display = 'none';

                } else if (data.autoJibunAddress) {
                    var expJibunAddr = data.autoJibunAddress;
                    guideTextBox.innerHTML = '(예상 지번 주소 : ' + expJibunAddr + ')';
                    guideTextBox.style.display = 'none';
                } else {
                    guideTextBox.innerHTML = '';
                    guideTextBox.style.display = 'none';
                }
            }
        }).open();
    }
