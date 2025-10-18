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
   
    <!-- js -->
    <script src="/js/product/productform.js" defer></script>
</head>

<body>

    <div class="first">
        <h1 class="firstH1" >상품등록</h1>
        <br><br><br><br>
        <form class="product_form" method="post" action="/productpost.do" enctype="multipart/form-data">
            <div class="middle">

                <!--이미지 div-->
                <div class="dlImg">
                    <div class="dlMain">
                        <input style="display: none;" type="file" id="product_Image" name="product_Image"
                            accept="image/*" multiple>
                        <img id="preview" class="xbox" src="" width=500 height=500 >
                        <label for="product_Image">
                            <p class="dlMainP">클릭 후 이미지 를 골라주세요</p>
                        </label>
                        <h1 class="imgh1"></h1>
                    </div>
                </div>

                  <!--상품 설명div-->
                <div class="productcg">
                    <div class="productcon">
                        <h3>상품제목</h3>
                        <input type="text" class="width:300" id="product_Name" name="product_Name" placeholder="ex)뜨거운침대"
                            size="70">
                        <br><br>

                    </div>
                    <div class="pfcontrol">
                        <div class="flexnum">
                            <div class="margin10">
                                <h3>상품가격</h3>
                                <input type="text" class="width145" id="product_Price" name="product_Price"
                                    placeholder="상품가격을 입력하세요." size="32">
                                <br><br>
                            </div>
                            <div class="margin10">
                                <h3>상품수량</h3>
                                <input type="text" class="width145" id="product_TotalCount" name="product_TotalCount"
                                    placeholder="상품수량을 입력해주세요." size="32">
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
            <h3>상품설명</h3>
            <textarea id="summernote" name="product_Content" cols="70" rows="15" placeholder="상품 상세 설명"></textarea>

            <br><br>

            <div class="bds02">
                <input type="submit" id="productsubmit" class="btn btn-secondary btn-lg"
                    value="등록하기">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input type="reset" class="btn btn-secondary btn-lg" value="다시입력">
            </div>
        </form>

    </div>
    </div>
   


</body>

</html>