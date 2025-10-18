<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<!-- <c:set var="/images" value=" application.getRealPath()" /> -->
<%
request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>

<head>
  <meta charset="UTF-8" />
  <title>Vanilla js slide with pagination</title>
  <!-- css -->
  <link rel="stylesheet" href="/css/product.css">
  <link rel="stylesheet" href="/css/mainpro.css">
</head>
<style>
  .submit li{
    width: 70px;
  }
  .submits{
    /* width: 50%; */
    
            cursor: pointer;
            display: block;
            
            background: rgb(238, 232, 232);
            /*background: linear-gradient(to right, #ff105f, #ffad06);*/
            border: 0;
            outline: none;
            border-radius: 10px;
  }
  
</style>

<body>
  <div class="pro_category" style="width: 892px; margin-left: 253px;">
    <ul>
        <div class="pro_category_image">

            <form action="/product.do" class="submits">
                <li onclick="">
                    <button class="PRONAME" type="submit" name="product_Name" value="책상">
                        <!-- <img src="../메인 카테고리 사진/책상.png"> -->
                        책상
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="침대">
                        <!-- <img src="../메인 카테고리 사진/침대.png"> -->
                        침대
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="의자">
                        <!-- <img src="../메인 카테고리 사진/의자.png"> -->
                        의자
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="스탠드">
                        <!-- <img src="../메인 카테고리 사진/스텐드.png"> -->
                        스텐드
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="거울">
                        <!-- <img src="../메인 카테고리 사진/거울.png"> -->
                        거울
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="서랍장">
                        <!-- <img src="../메인 카테고리 사진/서랍장.png"> -->
                        서랍장
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="소파">
                        <!-- <img src="../메인 카테고리 사진/소파.png"> -->
                        소파
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME" type="submit" name="product_Name" value="식탁">
                        <!-- <img src="../메인 카테고리 사진/식탁.png"> -->
                        식탁
                    </button>
                </li>
            </form>
        </div>
    </ul>
    <ul>
        <div class="pro_category_image">
            <form action="/product.do" class="submits">
                <li>
                    <button class="PRONAME"  type="submit" name="product_Name" value="옷장">
                        <!-- <img src="../메인 카테고리 사진/옷장.png"> -->
                        옷장
                    </button>
                </li>
            </form>
        </div>
    </ul>
</div>
  <!-- 슬라이드 body  절대 절대 건드리지 마시오 이거 없으면 화면 뒤틀림 -->
  <div id="stupit" style="display:none; ">
    <div class="slide_item">1</div>
    <div class="slide_item">2</div>
    <div class="slide_item">3</div>
    <div class="slide_item">4</div>
    <div class="slide_item">5</div>
    <div class="slide_prev_button slide_button">◀</div>
    <div class="slide_next_button slide_button">▶</div>
    <ul class="slide_pagination"></ul>
  </div>
  <!-- 카테고리상품들 -->
  <!-- 함부로 inlinecss 건드리면 안돼요 깨져용 -->
  <div class=scroll >
    <c:forEach var="product" items="${productsList}">
      <div class="pro_category_padding" >
        <div class="pro_category_content">
          <div class="productimg">
            <a href="${contextPath}/productview.do?product_Num=${product.product_Num}">
              <img class="imgStyle" src="/product/${product.user_Id}/${product.product_Image}" alt="상품사진" width="200px" height="170px">
            </a>
          </div>
          <div class="productcontent" >
            <h1>상품명 : ${product.product_Name}</h1>
            <h3><span>가격 : </span>${product.product_Price}</h3>
            <p id="over">상품 설명 : ${product.product_Content}</p>
          </div>
        </div>
      </div>
    </c:forEach>
  </div>

</body>

</html>