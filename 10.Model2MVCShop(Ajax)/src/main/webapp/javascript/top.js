// /javascript/top.js
(function (w, d, $) {
  'use strict';
  if (!w || !d || !w.jQuery) return;

  var ctx = (d.body && d.body.dataset && d.body.dataset.ctx) ? d.body.dataset.ctx : '';

  // ===== 공통 유틸 =====
  function goRight(url) {
    try {
      var p = w.parent || null;
      if (p && p.frames && p.frames['rightFrame']) {
        p.frames['rightFrame'].location.href = url;
        return;
      }
    } catch (e) {}
    w.location.href = url;
  }

  // ===== 로그인 상태 렌더링 =====
  function renderAuth() {
    $.ajax({
      url: ctx + '/user/json/me?_=' + Date.now(),
      method: 'GET',
      dataType: 'json',
      success: function (user) {
        var $auth = $('.nv-auth');
        $auth.empty();

        if (user && user.userId) {
          //  로그인 상태
          var userName = user.userName || user.userId || '사용자';
          var welcome = $('<span/>', {
            class: 'welcome-text',
            text: userName + '님 환영합니다',
            css: { 'margin-right': '10px', 'color': '#03c75a', 'font-weight': 'bold' }
          });

          var $logout = $('<span/>', {
            id: 'btnLogout',
            class: 'btn-gray btn-sm',
            text: '로그아웃'
          });

          $auth.append(welcome).append($logout);
        } else {
          //비로그인 상태
          $auth.append('<span id="btnLogin" class="btn-green btn-sm">로그인</span>');
          $auth.append('<span id="btnJoin"  class="btn-gray btn-sm">회원가입</span>');
        }
      },
      error: function (xhr, status, err) {
        alert("로그인 상태 확인 중 오류가 발생했습니다.");
        console.error("renderAuth() 실패:", status, err, xhr.responseText);
        $('.nv-auth').html('<span class="btn-gray btn-sm">오류</span>');
      }
    });
  }

  // ===== 로그아웃 =====
  function doLogout() {
    if (!confirm("로그아웃 하시겠습니까?")) return;

    $.ajax({
      url: ctx + '/user/json/logout',
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log(" 로그아웃 성공:", res);

        if (res.success) {
          var loginType = res.loginType || '';
          var KID = $('body').data('kakao-client');
          var RLOGOUT = $('body').data('kakao-logout') || (ctx + '/index.jsp');

          // Kakao 로그아웃
          if (loginType === 'kakao' && KID && RLOGOUT) {
            var url = 'https://kauth.kakao.com/oauth/logout'
                    + '?client_id=' + encodeURIComponent(KID)
                    + '&logout_redirect_uri=' + encodeURIComponent(RLOGOUT);
            console.log("➡ 카카오 로그아웃 URL 이동:", url);
            window.top.location.href = url;
          }

          // Google 로그아웃
          else if (loginType === 'google') {
            var gLogout = 'https://accounts.google.com/Logout';
            console.log("➡ 구글 로그아웃 처리:", gLogout);
            window.top.location.href = gLogout;
            setTimeout(function(){
              window.top.location.href = ctx + '/index.jsp';
            }, 1000);
          }

          // 일반 사용자 로그아웃
          else {
            console.log("➡ 일반 로그아웃 → index.jsp 이동");
            window.top.location.href = ctx + '/index.jsp';
          }

          // 로그아웃 후 좌측 메뉴 새로고침
          try {
            var p = window.parent;
            if (p && p.frames && p.frames['leftFrame']) {
              p.frames['leftFrame'].location.reload();
            }
          } catch (e) {
            console.warn(" leftFrame 새로고침 실패:", e);
          }
        }
      },
      error: function (xhr, status, err) {
        console.error("❌ 로그아웃 실패:", status, err, xhr.responseText);
        alert("로그아웃 중 오류가 발생했습니다.");
      }
    });
  }

  // ===== 초기 실행 =====
  $(function () {
    renderAuth();

    // 홈 버튼 클릭
    $(d).on('click', '#btnHome', function () {
      goRight(ctx + '/layout/main.jsp');
    });

    // 로그인 / 회원가입 / 로그아웃 버튼 이벤트 위임
    $(d).on('click', '#btnLogin', function () {
      goRight(ctx + '/user/loginView.jsp');
    });

    $(d).on('click', '#btnJoin', function () {
      goRight(ctx + '/user/addUserView.jsp');
    });

    $(d).on('click', '#btnLogout', function () {
      doLogout();
    });
  });

})(window, document, jQuery);
