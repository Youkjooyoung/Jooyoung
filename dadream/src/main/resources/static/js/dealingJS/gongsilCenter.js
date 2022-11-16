 /* ---------------------------------전체선택 --------------------------------*/
function selectAll(selectAll) {
                var checkboxes = document.getElementsByName('dl_Form');

                checkboxes.forEach(function (checkbox) {
                    checkbox.checked = selectAll.checked;
                });
            }
            
            
/*---------------------------------- 검색기능 -------------------------------*/
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
                                        '<a href="/dealingview.do?dl_Num=' + item.dl_Num + '" id="Arr1">' +
                                        '<div id="Arr2">';
                                            resultList += '<div style="text-align:center;">' + '<img src="/dealing/' + item.user_Id + '/' + item.dl_Image +
                                        '" alt="매물사진" id="Arr3">' +
                                        '</div>';
                                        resultList += '<div id="Arr4">' + '<span id="Arr5">' + item.dl_Title + '</span>' +
                                        '<h4>' + item.dl_Form + '<br>' + item
                                        .dl_Address + '<br>' +
                                        item.dl_Form2 + '<br>￦ ' + item.dl_Price +
                                        '<br>옵션 : ' + item.dl_Option +
                                        '</h4></div>' + '</div></a>';

                            })
                            //console.log(resultList);
                            document.getElementById("resultList").innerHTML = resultList;
                    },
                    error: function() {
                        alert("조건을 입력해주세요.");
                    }
                });
            }