/*Dropzone.autoDiscover = false; // deprecated 된 옵션. false로 해놓는걸 공식문서에서 명시
             
                const dropzone = new Dropzone("div.dropzone.dz1", {
                    url: "https://httpbin.org/post",
                    dictDefaultMessage: "대표 이미지를 등록해주세요.",
                    autoProcessQueue: false, //자동으로 보내기
                    clickable: true, // 클릭 가능 여부
                    autoQueue: false, // 드래그 드랍 후 바로 서버로 전송
                    createImageThumbnails: true, //파일 업로드 썸네일 생성
                    thumbnailHeight: 150, // Upload icon size
                    thumbnailWidth: 150, // Upload icon size
                    maxFiles: 1, // 업로드 파일수
                    maxFilesize: 1000, // 최대업로드용량 : 1000MB
                    paramName: 'dl_Image', // 서버에서 사용할 formdata 이름 설정 (default는 file)
                    uploadMultiple: false, // 다중업로드 기능
                    timeout: 300000, //커넥션 타임아웃 설정 -> 데이터가 클 경우 꼭 넉넉히 설정해주자
                    addRemoveLinks: true, // 업로드 후 파일 삭제버튼 표시 여부
                    dictRemoveFile: '삭제', // 삭제버튼 표시 텍스트
                    acceptedFiles: '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF', // 이미지 파일 포맷만 허용
                });
                
                
                //-------------------------------------------------//
                
                Dropzone.autoDiscover = false; // deprecated 된 옵션. false로 해놓는걸 공식문서에서 명시
             
                const dropzone2 = new Dropzone("div.dropzone.dz2", {
                    url: "https://httpbin.org/post",
                    dictDefaultMessage: "추가 할 이미지를 등록해주세요.",
                    autoProcessQueue: false, //자동으로 보내기
                    clickable: true, // 클릭 가능 여부
                    autoQueue: false, // 드래그 드랍 후 바로 서버로 전송
                    // createImageThumbnails: true, //파일 업로드 썸네일 생성
                    // thumbnailHeight: 150, // Upload icon size
                    // thumbnailWidth: 150, // Upload icon size
                    maxFiles: 10, // 업로드 파일수
                    maxFilesize: 1000, // 최대업로드용량 : 1000MB
                    paramName: 'dl_Image', // 서버에서 사용할 formdata 이름 설정 (default는 file)
                    uploadMultiple: false, // 다중업로드 기능
                    timeout: 300000, //커넥션 타임아웃 설정 -> 데이터가 클 경우 꼭 넉넉히 설정해주자
                    addRemoveLinks: true, // 업로드 후 파일 삭제버튼 표시 여부
                    dictRemoveFile: '삭제', // 삭제버튼 표시 텍스트
                    acceptedFiles: '.jpeg,.jpg,.png,.gif,.JPEG,.JPG,.PNG,.GIF', // 이미지 파일 포맷만 허용
                });*/
                
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
                        
                        // 썸네일 코드 
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector('.note-editable').innerHTML="${modDealing.dl_Content}";
            document.querySelector("#dealing_Image").addEventListener("change", async e => {
                const preview = document.querySelector("#preview");
                document.querySelector(".imgh1").innerHTML = "감사합니다";
                let reader = new FileReader();
                reader.onloadend = finished => {
                    preview.setAttribute('src', finished.target.result);
                    console.log(finished.target.result);
                }
                reader.readAsDataURL(e.target.files.item(0));
            })
        });
        
        
         (function () {


            $("#summernote").summernote("code", {
                height: 300, // 에디터 높이
                minHeight: 300, // 최소 높이
                maxHeight: null, // 최대 높이(null 제한없음)
                focus: false, // 에디터 로딩후 포커스를 맞출지 여부
                lang: "ko-KR", // 한글 설정
                toolbar: [
                    ['fontname', ['fontname']], // 글꼴 설정
                    ['fontsize', ['fontsize']], // 글자 크기 설정
                    ['style', ['bold', 'italic', 'underline', 'strikethrough',
                        'clear'
                    ]], // 굵기, 기울임꼴, 밑줄,취소 선, 서식지우기
                    ['color', ['forecolor', 'color']], // 글자색
                    ['table', ['table']], // 표만들기
                    ['para', ['ul', 'ol', 'paragraph']], // 글머리 기호, 번호매기기, 문단정렬
                    ['height', ['height']], // 줄간격
                    ['insert', ['picture', 'link', 'video']], // 그림첨부, 링크만들기, 동영상첨부
                    ['view', ['fullscreen', 'codeview', 'help']] // 코드보기, 확대해서보기, 도움말
                ],
                // 추가한 글꼴
                fontNames: ['Arial', 'Arial Black', '맑은 고딕', '궁서',
                    '굴림체', '굴림', '돋음체', '바탕체'
                ],
                // 추가한 폰트사이즈
                fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24',
                    '28', '30',
                    '36', '50', '72'
                ]
            });


        })();
        
        
        
        
        document.querySelector("#submitbtn").addEventListener("click", () => {
            event.preventDefault();
            check();
            
        });
        let check = ()=>{

        
        let dealing_Image = document.querySelector("#dealing_Image").value.trim();
        let dl_Title = document.querySelector("#dl_Title").value.trim();
        let sample5_address = document.querySelector("#sample5_address").value.trim();
        let dl_Price = document.querySelector("#dl_Price").value.trim();
        let dl_Option = document.querySelector("#dl_Option").value.trim();
        let dl_Form = document.querySelector("#dl_Form").value.trim();
        let dl_Form2 = document.querySelector("#dl_Form2").value.trim();
        let dl_Room = document.querySelector("#dl_Room").value.trim();
        let dl_Size = document.querySelector("#dl_Size").value.trim();
        let summernote = document.querySelector("#summernote").value.trim();
        let FORMTAG =document.querySelector("#FORMTAG");
        
        if (dl_Title === '') {
            alert("매물명 을 입력해주세요");
            dl_Title.focus();
            return ;
        } else if (sample5_address === '') {
            alert("주소를 입력해주세요");
            sample5_address.focus();
            return ;
        } else if (dl_Price === '') {
            alert("가격을 입력해주세요");
            dl_Price.focus();
            return ;
        } else if (dl_Option === '') {
            alert("옵션을 입력해주세요");
            dl_Price.focus();
            return ;
        } else if (dl_Form === '') {
            alert("건물을 입력해주세요");
            dl_From.focus();
            return ;
        } else if (dl_Form2 === '') {
            alert("구매방식 입력해주세요");
            dl_From2.focus();
            return ;
        } else if (dl_Room === '') {
            alert("방 개수 를 입력해주세요");
            dl_Room.focus();
            return ;
        } else if (dl_Size === '') {
            alert("평수 를 입력해주세요");
            dl_Size.focus();
            return ;
        } 
        // else if (summernote === '') {
        //     alert("상세설명 을 입력해주세요");
        //     summernote.focus();
        //     return ;
        // }
        FORMTAG.submit();
            
    }
                