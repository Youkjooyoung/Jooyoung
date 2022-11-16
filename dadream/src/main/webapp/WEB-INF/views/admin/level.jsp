<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"   isELIgnored="false"
 %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        document.addEventListener("DOMContentLoaded",()=>{

            <c:choose>
            <c:when test="${member.user_Id == null}">
            alert("로그인 후 작성 가능합니다.");
            location.href="/login.do";           
            </c:when>
            <c:when test="${member.user_Level != 100}">
            alert("관리자 권한이 아닙니다.")
            location.href="/";
            </c:when>
            </c:choose>
        })        

    </script>
</head>

<body>
    <div>
        <h1>${user_Id} 님</h1>
        <h3>매물등록 권한</h3>

        <form action="/admin/levelPost.do" method="POST">
            <select name="pending" id="pending">
                <option value="y">매물등록 제한</option>
                <option value="x">매물등록 허용</option>
            </select>
            <input id ="userId"type="hidden" name="user_Id" value="${user_Id}">
            <button id ="changeing"type="button">변경</button>
        </form>
    </div>
    <script>

        let pending =document.querySelector("#pending");
        document.querySelector("#changeing").addEventListener("click", async (e)=>{
            let userId= document.querySelector("#userId");
            let res = await fetch("/admin/levelPost.do", {
                method:"POST",
                headers:{"Content-type":"application/json"},
                body:JSON.stringify({
                    user_Id : userId.value,
                    pending : pending.value
                })
            }
            
            )
            if(res.status===200){
                let result = await res.json();
                if(result.res===1){
                    alert("변경되었습니다");
                    window.close();
                    opener.parent.location.reload(); // open 시켜주었던 부모의 창을 새로고침
                }else{
                    alert(`무슨오류일까요?`);
                }
            }else{
                alert("다시 시도하세요")
            }
        })
    </script>
</body>

</html>