<%@ page language="java" contentType="text/html; charset=UTF-8"
pageEncoding="UTF-8"
isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>

<head>
  <meta charset="UTF-8" />
  <title>Vanilla js slide with pagination</title>
  <!-- css -->
  <link rel="stylesheet" href="/css/product.css">
  <!--bxslider-->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/bxslider/4.2.12/jquery.bxslider.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/bxslider/4.2.12/jquery.bxslider.min.js"></script>
  <!-- js -->
  <script src="/js/product/imgside.js" defer></script>
  
  <!-- css -->
  <link rel="stylesheet" href="/css/product.css">


</head>

<body>

  <div class=" slider">
    <!-- 추후 아이디 삭제 -->
    <div class="slide_item" ><img class="bx_slide_image" id="slide_image" src="../image/slide_information.png"></div>
    <!-- <div class="slide_item"><img class="bx_slide_image" id="slide_image" src="../image/han.jpg"></div> -->
  </div>

</body>

</html>