<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>회원정보 보완</title>
  <link rel="stylesheet" href="${ctx}/css/naver-common.css">
  <link rel="stylesheet" href="${ctx}/css/user-onboard.css">
  <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>
  <script src="${ctx}/javascript/user-onboard.js" defer></script>
</head>

<body data-ctx="${ctx}">
  <main class="onboard-container">
    <section class="onboard-panel">
      <header class="onboard-header">
        <h2>필수 정보 입력</h2>
      </header>

      <form id="onboardForm" class="onboard-form">
        <table class="form-table">
          <colgroup><col class="col-label"><col class="col-input"></colgroup>

          <tr>
            <th>이름</th>
            <td>
              <input type="text" id="userName" class="input-text"
                     value="${sessionScope.user.userName}" maxlength="50" autocomplete="off">
            </td>
          </tr>

          <tr>
            <th>이메일</th>
            <td>
              <div class="email-box">
                <input type="text" id="emailId" class="input-text"
                       value="${fn:substringBefore(sessionScope.user.email,'@')}" maxlength="50" autocomplete="off">
                <span>@</span>
                <select id="emailDomain" class="input-select">
                  <option value="직접입력">직접입력</option>
                  <option value="naver.com"
                    <c:if test="${fn:endsWith(sessionScope.user.email,'@naver.com')}">selected</c:if>>naver.com</option>
                  <option value="daum.net"
                    <c:if test="${fn:endsWith(sessionScope.user.email,'@daum.net')}">selected</c:if>>daum.net</option>
                  <option value="gmail.com"
                    <c:if test="${fn:endsWith(sessionScope.user.email,'@gmail.com')}">selected</c:if>>gmail.com</option>
                </select>
                <input type="text" id="emailCustom" class="input-text" placeholder="도메인 입력" style="display:none;">
                <input type="hidden" id="email" name="email" value="${sessionScope.user.email}">
              </div>
              <p class="help-text">주문/배송 안내를 받을 이메일입니다.</p>
            </td>
          </tr>

          <tr>
            <th>전화번호</th>
            <td>
              <input type="text" id="phone" class="input-text" maxlength="13" placeholder="010-1234-5678">
            </td>
          </tr>

          <tr>
            <th>주소</th>
            <td>
              <div class="addr-row">
                <input type="text" id="zipcode" class="input-text zipcode" placeholder="우편번호" readonly>
                <button type="button" id="btnAddr" class="btn-gray">주소검색</button>
              </div>
              <input type="text" id="addr" class="input-text" placeholder="기본 주소" readonly autocomplete="off">
              <input type="text" id="addrDetail" class="input-text" placeholder="상세 주소" autocomplete="off">
            </td>
          </tr>
        </table>

        <div class="btn-area">
          <button type="button" id="btnSave" class="nv-btn nv-btn-primary">저장</button>
          <button type="button" id="btnCancel" class="nv-btn nv-btn-default">취소</button>
        </div>
      </form>
    </section>
  </main>
</body>
</html>
