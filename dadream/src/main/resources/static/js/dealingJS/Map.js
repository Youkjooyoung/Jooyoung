	//------------------------지도  생성------------------------//

var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                    mapOption = {
                        center: new kakao.maps.LatLng(36.3492687452282, 127.3776153193601), // 지도의 중심좌표
                        level: 4, // 지도의 확대 레벨
                        mapTypeId: kakao.maps.MapTypeId.ROADMAP // 지도종류
                    };

                // 지도를 생성한다 
                var map = new kakao.maps.Map(mapContainer, mapOption);

                // 인포윈도우를 표시하는 클로저를 만드는 함수입니다 
                function makeOverListener(map, marker, infowindow) {
                    return function () {
                        infowindow.open(map, marker);
                    };
                }

                // 인포윈도우를 닫는 클로저를 만드는 함수입니다 
                function makeOutListener(infowindow) {
                    return function () {
                        infowindow.close();
                    };
                }

                var dl_Form = "${dl_Form}";
                var dl_Address = "${dl_Address}";
                console.log(dl_Form);
                console.log(dl_Address);

            $( document ).ready(function() {
                //map ajax
                $.ajax({
                    url: "/showMap.do",
                    type: "get",
                    async: false,
                    dataType: "json",
                    data: {
                        "dl_Lat": "36.3492687452282",
                        "dl_Lng": "127.3776153193601",
                        dl_Form,
                        dl_Address
                    },
                    success: function (dlMap) {
                        if (dlMap.length == 0) {
                            alert('검색한 매물이 없습니다.');
                            //window.location.replace();
                            window.history.back();
                        }

                        //console.log(dlMap[0].dl_Lat);
                        //console.log(dlMap[0].dl_Lng);
                        //반복문으로 마커 생성
                        markers = [];

                        var bounds = new kakao.maps.LatLngBounds()

                        for (var i = 0; i < dlMap.length; i++) {

                            //위도+경도
                            var latlng = new kakao.maps.LatLng(dlMap[i].dl_Lat, dlMap[i].dl_Lng);
                            // 마커를 생성합니다
                            var marker = new kakao.maps.Marker({
                                map: map, // 마커를 표시할 지도
                                position: latlng // 마커를 표시할 위치
                                //title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                            });

                            // 마커에 표시할 인포윈도우를 생성합니다 
                            var infowindow = new kakao.maps.InfoWindow({
                                content: dlMap[i].dl_Title // 인포윈도우에 표시할 내용
                            });

                            markers[i] = marker;

                            bounds.extend(latlng);

                            // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
                            // 이벤트 리스너로는 클로저를 만들어 등록합니다 
                            // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                            kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map,
                                marker, infowindow));
                            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(
                                infowindow));
                        }

                        map.setBounds(bounds);

                        dlMap2 = dlMap;

                        var resultList = "";
                        $.each(dlMap, function (index, item) {

                            resultList += '<form action="${contextPath}/dealingview.do" method="get">'
                                resultList += '<input type="hidden" name ="dl_Num" value="' + item.dl_Num + '">';
                                resultList += '<button style="cursor:pointer; border:none; background-color:white;" type="submit" >';
                                resultList += '<div style="width:400px; height:350px;border:0.1px solid #ccc;  "><img src="/dealing/'+item.user_Id+'/'+item.dl_Image+'" alt="매물사진" style="margin:5px 0; border:1px solid #ccc;" width="380px;"  height="190px">' ;
                                resultList += '<p style="font-size:18px; font-weight:bold; margin:10px 0 5px 0;">'+ item.dl_Title +'</p><p style="font-weight:bold;">'+item.dl_Address +'</p><span style="margin-right:5px; font-weight:bold;">'+item.dl_Form 
                                   +'</span>'+ item.dl_Form2 +'<p style="font-weight:bold;">옵션 : '+item.dl_Option+'</p><p style="font-weight:bold;">￦ '+
                                    item.dl_Price +'</p></div></button>'+'</form>';

                        })
                        //console.log(resultList);
                        document.getElementById("resultList").innerHTML = resultList;
                    },
                    error: function () {
                        alert("오류발생");
                    }


                });
            });

                //검색기능
                function dlBtn() {
                    var dlSearch = $('#dlReq2').serialize();
                    console.log(dl_Form);
                    console.log(dl_Address);
                    var dl_Form = null;
                    var dl_Address = null;
                    window.localStorage.clear();
                    window.localStorage.setItem("dlLocalStorage", dlSearch);
                    $.ajax({
                        url: "showMap2.do",
                        type: "get",
                        async: false,
                        data: dlSearch,
                        dataType: "json",
                        success: function (dlReq) {
                            if (dlReq.length == 0) {
                                alert("검색조건이 없습니다.");
                                // window.location.reload();
                                return;
                            }
                            console.log(dlReq);
                            console.log(dlMap2);

                            var bounds = new kakao.maps.LatLngBounds()

                            //반복문으로 마커 삭제
                            // FIXME: markers undefined 체크
                            if (markers) {
                                for (var i = 0; i < markers.length; i++) {
                                    markers[i].setMap(null);
                                }
                            }

                            //반복문으로 마커 생성
                            for (var i = 0; i < dlReq.length; i++) {

                                //위도+경도
                                var latlng = new kakao.maps.LatLng(dlReq[i].dl_Lat, dlReq[i].dl_Lng);
                                // 마커를 생성합니다
                                var marker = new kakao.maps.Marker({
                                    map: map, // 마커를 표시할 지도
                                    position: latlng // 마커를 표시할 위치
                                    //title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                                });

                                // 마커에 표시할 인포윈도우를 생성합니다 
                                var infowindow = new kakao.maps.InfoWindow({
                                    content: dlReq[i].dl_Title // 인포윈도우에 표시할 내용
                                });

                                markers[i] = marker;
                                bounds.extend(latlng);

                                // 마커에 mouseover 이벤트와 mouseout 이벤트를 등록합니다
                                // 이벤트 리스너로는 클로저를 만들어 등록합니다 
                                // for문에서 클로저를 만들어 주지 않으면 마지막 마커에만 이벤트가 등록됩니다
                                kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map,
                                    marker, infowindow));
                                kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(
                                    infowindow));
                            }

                            // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
                            map.setBounds(bounds);

                            //console.log(dlReq);

                            var resultList = "";
                            $.each(dlReq, function (index, item) {
                                resultList += '<form action="${contextPath}/dealingview.do" method="get">'
                                resultList += '<input type="hidden" value="${item.dl_Num}" >'
                                resultList += '<button type="submit" style="width:450px; height:300px; background-color:white; border:outset;">'
                                    
                                resultList += '<div style="display: flex; border-bottom: 1px solid #ccc; margin-bottom: 20px; margin-left: 30px;">';
                                resultList += '<div>' +
                                    '<img src="../image/sample01.jpg" alt="" width="200px" height="190px">' +
                                    '</div>';
                                resultList += '<div style="flex-grow:1; margin:auto; line-height:14px; font-weight:bold; color:darkorange">'+'매물번호'+'<br>'+ item.dl_Num +'<br><br>'+'매물이름'+'<br>' + item.dl_Title + '<br><br>' + item.dl_Form +
                                    '<br><br>'+'거래유형'+'<br>' + item.dl_Form2 + '<br><br>' +'가격'+'<br>'+
                                    item.dl_Price + '</div>' + '</div>'+'</button>'+'</form>';

                            })
                            //console.log(resultList);
                            document.getElementById("resultList").innerHTML = resultList;
                        },
                        error: function () {
                            alert("오류발생");
                        }
                    });
                    
                }
                
                
                
                //-----------------  검색창에 엔터 치면 검색  -----------------//
                document.querySelector(".dealingsearch").addEventListener("keydown",(e)=>{
                                console.log(e);
                                if(e.code ==="Enter"){
                                    
                                    document.querySelector("#dlReq2").submit();
                                }
                            })
                            
                            
                            
                            
                
