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
                                '<a href="/dealingview.do?dl_Num='+item.dl_Num+'" id="ListNum">'+
                                    '<div id="Listeachform">';

                                mainList += '<div style="text-align:center;">' 
                                    +'<img src="/dealing/' + item.user_Id + '/' +item.dl_Image +
                                    '" alt="매물사진"  id="dealingListImg">' +
                                    '</div>';

                                mainList += '<div>' +
                                    '<span id="ListName">'+item.dl_Title+'</span>'+
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