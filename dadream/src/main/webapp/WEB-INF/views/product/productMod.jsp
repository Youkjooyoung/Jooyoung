<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html lang="ko">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>가구 상품등록</title>
    <script src="http://code.jquery.com/jquery-latest.min.js"></script>
    <!-- 섬머노트 -->
    <script src="/js/summernote/summernote-lite.js"></script>
    <script src="/js/summernote/lang/summernote-ko-KR.js"></script>
    <link rel="stylesheet" href="/css/summernote/summernote-lite.css">

    <!-- css -->
    <link rel="stylesheet" href="/css/productform.css">

</head>

<body>

    <div class="first">
        <h1 style="margin:20px 0 0 10px; font: bold; font-size: xx-large;">상품수정</h1>
        <br><br><br><br>
        <form class="product_form" method="post" action="/prdouctUpdate.do" enctype="multipart/form-data">
            <div class="middle">
                <input type="hidden" name ="product_Num" value="${pro.product_Num}">
                <input type="hidden" name ="originalFileName" value="${pro.product_Image}">
                
                <!--이미지 div-->
                <div class="dlImg">
                    <div class="dlMain">
                        <input style="display: none;" type="file" id="product_Image" name="product_Image"
                            accept="image/*" multiple>
                        <img id="preview" src="/product/${pro.user_Id}/${pro.product_Image}" width=500 height=500 />
                        <label for="product_Image">
                            <p class="ClickImg">
                                클릭 후 이미지 를 골라주세요</p>
                        </label>
                        <h1 class="imgh1" style="font-weight: bold;margin-top: 20px;"></h1>
                    </div>
                </div>

                <!-- 텍스트추가 -->

                <script type="text/javascript">
                    var cnt = 1;

                    function fn_addtext() {
                        $("#d_text").append("<br>" +
                            "<input type='text' id='product_Option1' name='product_Option1' size='32'  placeholder='상품 옵션을 입력하세요.' />"
                        );
                        cnt++;
                    }
                    var cnt = 1;

                    function fn_addtext2() {
                        $("#d_text2").append("<br>" +
                            "<input type='text' id='product_Option2' name='product_Option2' size='32'  placeholder='상품 추가 옵션을 입력하세요.' />"
                        );
                        cnt++;
                    }
                </script>
                <!--상품 설명div-->
                <div class="productcg">
                    <div class="productcon">
                        <h3>상품제목</h3>
                        <input type="text" class="width300" id="product_Name" name="product_Name"
                            value="${pro.product_Name}" size="70">
                        <br><br>

                    </div>
                    <div class="pfcontrol">
                        <div class="flexnum">
                            <div class="margin10">
                                <h3>상품가격</h3>
                                <input type="text" class="width145" id="product_Price" name="product_Price"
                                    value="${pro.product_Price}" size="32">
                                <br><br>
                            </div>
                            <div class="margin10">
                                <h3>상품수량</h3>
                                <input type="text" class="width145" id="product_TotalCount" name="product_TotalCount"
                                    value="${pro.product_TotalCount}" size="32">
                                <br><br>
                            </div>
                        </div>

                        <div class="option_all">
                            <div class="option">
                                <div class="flex_option">
                                    <h3>옵션 <input style="height: 30px;" type="button" value="추가" onclick="fn_addtext()"
                                            class="text_button" />
                                    </h3>

                                </div>
                                <div id="d_text"></div>
                                <br><br>
                            </div>
                            <div class="option1">
                                <div class="flex_option">
                                    <h3>추가옵션 <input style="height: 30px;" type="button" value="추가"
                                            onclick="fn_addtext2()" class="text_button2" /></h3>
                                </div>
                                <div id="d_text2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 썸머노트 -->
            <h3 style="font-weight: bolder; font-size: 22px;">상품설명</h3>
            <textarea id="summernote" name="product_Content" cols="70" rows="15"></textarea>

            <br><br>

            <div class="bds02">
                <input type="submit" id="productsubmit" class="btn btn-secondary btn-lg"
                    value="등록하기">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="reset" class="btn btn-secondary btn-lg" value="다시입력">
            </div>
        </form>

    </div>
    </div>
    <script>
        // 썸네일 코드 
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector(".note-editable").innerHTML = "${pro.product_Content}";

            //상품옵션1
            let Option1 = "${pro.product_Option1}";

            let op1Result = Option1.split(",");
            if (op1Result.length !== 0) {

                for (let i = 0; i < op1Result.length; i++) {
                    fn_addtext();
                    let optAll1 = document.querySelectorAll("#product_Option1");
                    optAll1[i].value = op1Result[i];
                }
            }
            // 상품옵션2
            let Option2 = "${pro.product_Option2}";

            let op2Result = Option2.split(",");
            if (op2Result.length !== 0) {
                console.log("0이 아님");   
                for (let i = 0; i < op2Result.length; i++) {
                    fn_addtext2();
                    let optAll2 = document.querySelectorAll("#product_Option2");
                    optAll2[i].value = op2Result[i];
                }
            }
           

            //

            document.querySelector("#product_Image").addEventListener("change", async e => {
                const preview = document.querySelector("#preview");
                document.querySelector(".imgh1").innerHTML = "사진이 등록 되었습니다.";
                let reader = new FileReader();
                reader.onloadend = finished => {
                    preview.setAttribute('src', finished.target.result);
                    console.log(finished.target.result);
                }
                reader.readAsDataURL(e.target.files.item(0));
            })

            // // 등록 버튼 누를시 
            document.querySelector("#productsubmit").addEventListener("click", async (e) => {
                if (!confirm("상품등록을 하시겠습니까?")) {
                    e.preventDefault();
                    return;
                }


            })
        });



        // 썸머노트
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
    </script>

</body>

</html>