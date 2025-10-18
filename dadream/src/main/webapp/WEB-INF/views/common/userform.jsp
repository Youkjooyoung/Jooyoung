<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"
    isELIgnored="false" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%
  request.setCharacterEncoding("UTF-8");
%>
<c:set var="contextPath" value="${pageContext.request.contextPath}" />
<c:set var="result" value="{param.result}" />
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="3600"><!-- 1시간뒤 페이지 초기화-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="http://dmaps.daum.net/map_js_init/postcode.v2.js"></script>
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js"></script>
   
    <script defer type="text/javascript" src="https://cdn.jsdelivr.net/jquery.validation/1.16.0/jquery.validate.min.js">
    </script>

    <title>회원가입창</title>
    <!-- css -->
    <link rel="stylesheet" href="/css/userform.css">
    <!-- JS -->
    <script defer src="/js/dealingJS/MapApi.js" ></script>
    <script defer src="/js/common/userform.js"></script>
</head>

<body>
    <form id="userform" action="${contextPath}/addMember.do" method="post" onsubmit="return check()">
        <fieldset>
            <h1 class="RegTitle">회원가입</h1>
            <br><br>
            <div class="form1">


                <h3>이름</h3>
                <div class="userformbtn">
                    <input type="text" id="user_Name" name="user_Name" size="40"  placeholder="ex)홍길동" /><br><br>
                </div>
                <h3>아이디</h3>
                <div class="userformbtn" >
                    <div class="id">
                        <div>
                            <input type="text" id="user_Id" name="user_Id" size="40" placeholder="ex)abc123" />
                        </div>
                        <button type="button" id="idcheck">중복확인</button>
                    </div>
                </div>
                <h3 class="idcheckresult"></h3>

                <label class="error"></label>
                <h3>비밀번호</h3>
                <div class="userformbtn">
                    <input type="password" id="user_Pwd" name="user_Pwd" size="40"placeholder="아래의 형식에 맞게 입력해주세요." /><span id="pwd"></span>
                    <span class="span">특수문자[ !@#$%^&* ]와 영대소문자를 혼합하여 8~16자리로 작성해주세요.</span>
                </div>
                <h3 class="pwdcheck">비밀번호 확인</h3>
                <div class="userformbtn">
                    <input type="password" id="user_Pwd2" name="user_Pwd2" size="40" /><span id="pwd2"></span><br><br>
                </div>
                <h3>주소</h3>
                <div class="userformbtn" style="display: flex;">
                    <input type="text" id="sample4_postcode" placeholder="우편번호" name="user_Address1" size="40" /> <input
                        type="button" onclick="sample4_execDaumPostcode()" value="우편번호 찾기"><br><br>
                </div>
                <h3>도로명주소</h3>
                <div class="userformbtn">
                    <input type="text" id="sample4_roadAddress" placeholder="도로명주소" name="user_Address2"
                        size="40" /><br><br>
                    <input type="hidden" id="sample4_jibunAddress" placeholder="지번주소" name="user_Address2" size="40" />
                    <input type="hidden" id="sample4_extraAddress">
                    <input type="hidden" id="sample4_engAddress">
                    <span id="guide" style="color:#999;display:none"></span>
                </div>
                <h3>상세주소</h3>
                <div class="userformbtn">
                    <input type="text" id="userAddress2" name="user_Address3" size="40" placeholder="ex)오라클빌딩 10층 1005호" /><br><br>
                </div>
                <h3>이메일</h3>
                <div class="userformbtn">
                    <input type="email" id="user_Email" name="user_Email" size="40"  placeholder="ex)abc@daream.com"/><br><br>
                </div>
                <h3>휴대폰 인증</h3>
                <div class="userformbtn">
                    <input type="text" id="user_Phone" name="user_Phone" size="40" placeholder="-없이 입력해주세요" /> <button type="button" id="phoneCheck1">인증번호 받기</button><br><br>
                </div>
                <h3>인증번호 입력</h3>
                <div class="userformbtn">
                    <input type="text" id="phoneCheck" name="휴대폰인증" size="40" /> <button type="button" id="tryCheck">인증번호 확인</button>
                </div>

                <!--판매자 ,중개사 전용 태그-->
                <c:choose>
                    <c:when test="${memberjoin == '1'}">
                        <input type="hidden" name="user_Level" value=1>
                    </c:when>
                    <c:when test="${memberjoin == '2'}">
                        <h3>사업자 번호</h3>
                        <div class="userformbtn">
                            <input type="text" id="businessNum" name="user_Business" size="40" />
                            <input type="hidden" name="user_Level" value=2>
                        </div>
                    </c:when>
                    <c:when test="${memberjoin == '3'}">
                        <h3>사업자 번호</h3>
                        <div class="userformbtn">
                            <input type="text" id="businessNum" name="user_Business" size="40" />
                            <input type="hidden" name="user_Level" value=3>
                        </div>
                    </c:when>
                </c:choose>
                <input id="userSubmit" type="submit" value="회원가입">

        </fieldset>
    </form>
  
    <script>
            let checkNum="";
            let success = 0;
            document.querySelector("#phoneCheck1").addEventListener("click", async (e) =>{
                let phoneNum =document.querySelector("#user_Phone");
                let phone = phoneNum.value
                
                if(phone === ""){
                    alert("전화번호를 입력해주세요")
                    return;
                }
                if(phone.length !== 11){
                    alert("전화번호를 확인해주십쇼")
                    return;
                }
                console.log(phoneNum.value);
                let phoneCheck = await fetch("/phoneCheck.do",{
                    method:"post",
                    headers:{"content-type":"application/json"},
                    body:JSON.stringify({phone:phone})
            })
            if(phoneCheck.status == 200){
                alert("인증번호가 전송 되었습니다.")
                let response= await phoneCheck.json();
                checkNum = response.res;
            }
        })
        // 인증번호 확인버튼
        document.querySelector("#tryCheck").addEventListener("click",()=>{
            let phoneCheck = document.querySelector("#phoneCheck")
            if(phoneCheck.value ===""){
                alert("인증번호를 입력해주세요");
                return;
            }
            if(phoneCheck.value !== checkNum){
                alert("인증번호를 다시한번 확인해주십쇼");
                return;
            }else{
                alert("확인되었습니다.")
                success = 1;
                return;
            }

        })
    </script>
</body>
</html>