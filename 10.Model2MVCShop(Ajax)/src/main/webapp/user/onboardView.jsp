<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>회원정보 보완</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css" type="text/css">
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/user-onboard.js"></script>
  <script src="${ctx}/javascript/email.js"></script>
  <script src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"></script>
</head>

<body data-ctx="${ctx}">
  <div class="container form-wrapper">
    <div class="page-title"><h2>필수 정보 입력</h2></div>

    <form id="onboardForm">
      <table class="form-table w-100">
        <colgroup>
          <col style="width:140px;">
          <col>
        </colgroup>

        <tr>
          <th>이름</th>
          <td>
            <input type="text" id="userName" class="input-text w-100"
                   value="${sessionScope.user.userName}" maxlength="50" autocomplete="off">
          </td>
        </tr>

        <tr>
          <th>이메일</th>
          <td>
            <div class="email-input">
              <input type="text" id="emailId" class="input-text"
                     value="${fn:substringBefore(sessionScope.user.email,'@')}"
                     maxlength="50" autocomplete="off" >
              @
              <select id="emailDomain" class="input-select" >
                <option value="직접입력">직접입력</option>
                <option value="naver.com"
                  <c:if test="${fn:endsWith(sessionScope.user.email,'@naver.com')}">selected</c:if>>naver.com</option>
                <option value="daum.net"
                  <c:if test="${fn:endsWith(sessionScope.user.email,'@daum.net')}">selected</c:if>>daum.net</option>
                <option value="gmail.com"
                  <c:if test="${fn:endsWith(sessionScope.user.email,'@gmail.com')}">selected</c:if>>gmail.com</option>
                <option value="직접입력">직접입력</option>
              </select>

             <input type="text" id="emailCustom" class="input-text" placeholder="도메인 입력" style=margin-top:5px;"/>

              <input type="hidden" id="email" name="email"
                     value="${sessionScope.user.email}">
              <div class="help-text">주문/배송 안내를 받을 이메일입니다.</div>
            </div>
          </td>
        </tr>

        <tr>
          <th>전화번호</th>
          <td><input type="text" id="phone" class="input-text w-100"
                     value="${sessionScope.user.phone}" maxlength="20"
                     placeholder="010-1234-5678" autocomplete="off"></td>
        </tr>

        <tr>
          <th>주소</th>
          <td>
            <input type="text" id="zipcode" placeholder="우편번호" readonly class="input-text" style="width:120px;"/>
            <button type="button" id="btnAddr" class="btn-gray">주소검색</button><br/>
            <input type="text" id="addr" class="input-text w-100" value="${sessionScope.user.addr}" maxlength="200" placeholder="기본 주소" readonly autocomplete="off" style="margin-top:5px;width: 400px;"/><br/>
            <input type="text" id="addrDetail" class="input-text w-100" maxlength="200" placeholder="상세 주소" autocomplete="off" style="margin-top:5px;"/>
          </td>
        </tr>
      </table>

      <div class="btn-area mt-16" style="text-align:center;">
        <span id="btnSave" class="btn-green btn-lg btn-pill">저장</span>
        <span style="display:inline-block;width:10px;"></span>
        <span id="btnCancel" class="btn-gray btn-lg btn-pill">취소</span>
      </div>
    </form>
  </div>
</body>
</html>
