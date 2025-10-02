<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>

<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>로그인 화면</title>

  <link rel="stylesheet" href="${ctx}/css/admin.css" type="text/css">
  
  <!-- jQuery -->
  <script src="http://code.jquery.com/jquery-2.1.4.min.js"></script>
  <!-- 카카오 SDK -->
  <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>

  <script type="text/javascript">
    $(function() {
      $("#userId").focus();

      // ===== 일반 로그인 =====
      $("img[src='${ctx}/images/btn_login.gif']").on("click", function() {
        var id = $("input:text").val();
        var pw = $("input:password").val();

        if (!id) {
          alert('ID를 입력하지 않으셨습니다.');
          $("input:text").focus();
          return;
        }
        if (!pw) {
          alert('패스워드를 입력하지 않으셨습니다.');
          $("input:password").focus();
          return;
        }

        $.ajax({
          url: "${ctx}/user/json/login",
          method: "POST",
          dataType: "json",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          data: JSON.stringify({
            userId: id,
            password: pw
          }),
          success: function(JSONData, status) {
            if (JSONData != null) {
              $(window.parent.frames["topFrame"].document.location).attr("href","${ctx}/layout/top.jsp");
              $(window.parent.frames["leftFrame"].document.location).attr("href","${ctx}/layout/left.jsp");
              $(window.parent.frames["rightFrame"].document.location).attr("href","${ctx}/user/getUser?userId="+JSONData.userId);
            } else {
              alert("아이디, 패스워드를 확인하시고 다시 로그인해주세요.");
            }
          }
        });
      });

      // ===== 회원가입 이동 =====
      $("img[src='${ctx}/images/btn_add.gif']").on("click", function() {
        self.location = "${ctx}/user/addUser";
      });
    });

    // ===== 카카오 로그인 =====
    Kakao.init("88b5793d1d2d5c146444412cbdf5c112"); // 반드시 JavaScript Key

    function kakaoLogin() {
      // 최상위 창에서 카카오 인증 요청
      window.top.location.href =
        "https://kauth.kakao.com/oauth/authorize" +
        "?client_id=c800109ff8046d4900c86659d4e9f89d" +
        "&redirect_uri=http://192.168.0.166:8080${ctx}/user/kakao/callback" +
        "&response_type=code";
    }
  </script>
</head>

<body bgcolor="#ffffff" text="#000000">

<form>
<div align="center">
<TABLE width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">
<TR><TD align="center" valign="middle">

  <table width="650" height="390" border="5" cellpadding="0" cellspacing="0" bordercolor="#D6CDB7">
    <tr>
      <td width="305">
        <img src="${ctx}/images/logo-spring.png" width="305" height="390"/>
      </td>
      <td width="345" align="left" valign="top" background="${ctx}/images/login02.gif">
        <table width="100%" height="220" border="0" cellpadding="0" cellspacing="0">
          <tr><td colspan="4" height="100">&nbsp;</td></tr>
          <tr>
            <td width="30"></td>
            <td width="100"><img src="${ctx}/images/text_login.gif" width="91" height="32"/></td>
            <td></td>
            <td width="20"></td>
          </tr>
          <tr><td colspan="4" height="50"></td></tr>
          <tr>
            <td width="30"></td>
            <td><img src="${ctx}/images/text_id.gif" width="100" height="30"/></td>
            <td><input type="text" name="userId" id="userId" class="ct_input_g" style="width:180px; height:19px" maxlength="50"/></td>
            <td width="20"></td>
          </tr>
          <tr>
            <td width="30"></td>
            <td><img src="${ctx}/images/text_pas.gif" width="100" height="30"/></td>
            <td><input type="password" name="password" class="ct_input_g" style="width:180px; height:19px" maxlength="50"/></td>
            <td width="20"></td>
          </tr>
          <tr>
            <td colspan="4" align="center">
              <table width="136" height="20" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="56"><img src="${ctx}/images/btn_login.gif" width="56" height="20" border="0"/></td>
                  <td width="10"></td>
                  <td width="70"><img src="${ctx}/images/btn_add.gif" width="70" height="20" border="0"/></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <div style="margin-top:20px; text-align:center;">
          <button type="button" onclick="kakaoLogin()">카카오 아이디로 로그인</button>
        </div>
      </td>
    </tr>
  </table>

</TD></TR>
</TABLE>
</div>
</form>

</body>
</html>
