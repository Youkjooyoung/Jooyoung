<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<%
  request.setCharacterEncoding("UTF-8");
%>
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Insert title here</title>
<link rel="stylesheet" href="/css/refundform.css">
</head>
<body>
<div class="wrap">
 <div class="displayflex">
     <div id="df_1">
         <div class="reviewTitle">
             <h4>환불제목</h4>
             <input type="text" name="refund_Name" id="title">
         </div>
         <div class="review_contents">
             <div class="warning_msg"></div>
             <h4>환불 사유</h4>
             <textarea rows="10" id="text" name="refund_Content" class="review_textarea"></textarea>
         </div>
     </div>
 </div>
 <button type="button" id="save">환불요청</button>
</div>

<script>
debugger;
    document.querySelector("#save").addEventListener("click", async e => {
        debugger;
        if(!confirm("환불요청을 하시겠습니까?") ){
            e.preventDefault();
            return;
        }
        let data = {
      		refund_Name: document.querySelector('#title').value.trim(),
      		refund_Content: document.querySelector('#text').value.trim()
        }
        let Go = await fetch("/payrefunds.do?order_Num=${order_Num}", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let success = await Go.json();
        if (success.result === 1) {
            alert('요청되었습니다.');
            window.close();
            location.reload();
            return ;
        }else{
            alert('다시 작성해주세요.');
            return false;
        }
    });

</script>
</body>
</html>