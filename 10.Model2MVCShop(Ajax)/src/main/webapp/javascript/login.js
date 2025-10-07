(function (w, d, $) {
  'use strict';
  if (!$) return;

  $(function () {
    var $body = $('body');

    // ====== 서버에서 주입된 값 ======
    var ORIGIN = window.location.origin;
    var CTX   = $body.data('ctx') || '';
    var KID   = $body.data('kakao-client') || '';
    var RURI  = ORIGIN + CTX + '/user/kakao/callback';
    var JSKEY = $body.data('kakao-jskey') || '';

    // ====== 공통 유틸 ======
    var SELECTOR = {
      id: 'input[name="userId"], #userId',
      pw: 'input[name="password"], #password',
      btnLoginImg: function () { return "img[src='" + CTX + "/images/btn_login.gif']"; },
      btnJoinImg:  function () { return "img[src='" + CTX + "/images/btn_add.gif']";  },
      btnLoginText: '#btnLoginSubmit',
      btnKakao: '#btnKakaoLogin',
      btnGoogle: '#btnGoogleLogin'
    };

    var isBusy = false;
    function setBusy(flag) {
      isBusy = !!flag;
      var $btns = $(SELECTOR.btnLoginImg()).add($(SELECTOR.btnLoginText));
      $btns.css('pointer-events', flag ? 'none' : '')
           .css('opacity',        flag ? 0.6     : 1);
    }

    function getCsrfHeaders() {
      var token  = $('meta[name="_csrf"]').attr('content');
      var header = $('meta[name="_csrf_header"]').attr('content');
      var h = { Accept: 'application/json', 'Content-Type': 'application/json' };
      if (token && header) { h[header] = token; }
      return h;
    }

    function trimVal(sel) {
      var v = $(sel).val();
      return (v == null ? '' : String(v)).trim();
    }

    function goFramesAfterLogin(userId) {
      try {
        if (w.parent && w.parent.frames && w.parent.frames['topFrame']) {
          w.parent.frames['topFrame'].location.href  = CTX + '/layout/top.jsp';
          w.parent.frames['leftFrame'].location.href = CTX + '/layout/left.jsp';
          w.parent.frames['rightFrame'].location.href = CTX + '/user/getUser?userId=' + encodeURIComponent(userId || '');
        } else {
          w.top.location.href = CTX + '/index.jsp';
        }
      } catch (e) {
        w.top.location.href = CTX + '/index.jsp';
      }
    }

    // ====== Kakao SDK init ======
    if (w.Kakao && typeof w.Kakao.init === 'function' && JSKEY) {
      try { w.Kakao.init(JSKEY); } catch (e) {}
    }

    // ====== 카카오 로그인 ======
    $(SELECTOR.btnKakao).on('click', function () {
      if (!KID || !RURI) {
        alert('카카오 설정이 올바르지 않습니다.');
        return;
      }
      var url = 'https://kauth.kakao.com/oauth/authorize'
              + '?client_id=' + encodeURIComponent(KID)
              + '&redirect_uri=' + encodeURIComponent(RURI)
              + '&response_type=code'
              + '&prompt=login'
			  + '&prompt=login';
      w.top.location.href = url;
    });

    // ====== 구글 로그인 ======
    $(SELECTOR.btnGoogle).on('click', function () {
      var clientId   = $body.data('google-client');
      var redirectUri = ORIGIN + CTX + '/user/google/callback';

      if (!clientId || !redirectUri) {
        alert('구글 설정이 올바르지 않습니다.');
        return;
      }

      var url = 'https://accounts.google.com/o/oauth2/v2/auth'
              + '?client_id=' + encodeURIComponent(clientId)
              + '&redirect_uri=' + encodeURIComponent(redirectUri)
              + '&response_type=code'
              + '&scope=openid%20email%20profile'
			  + '&prompt=select_account'; 
      w.top.location.href = url;
    });

    // ====== 일반 로그인 처리 ======
    function doLogin() {
      if (isBusy) return;
      var id = trimVal(SELECTOR.id);
      var pw = trimVal(SELECTOR.pw);

      if (!id) { alert('ID를 입력하지 않으셨습니다.'); $(SELECTOR.id).focus(); return; }
      if (!pw) { alert('패스워드를 입력하지 않으셨습니다.'); $(SELECTOR.pw).focus(); return; }

      setBusy(true);

      $.ajax({
        url: CTX + '/user/json/login',
        method: 'POST',
        dataType: 'json',
        headers: getCsrfHeaders(),
        data: JSON.stringify({ userId: id, password: pw })
      })
      .done(function (res) {
        if (res && res.success) {
          if (res.user && res.user.userId) {
            goFramesAfterLogin(res.user.userId);
          } else {
            w.top.location.href = CTX + '/index.jsp';
          }
        } else {
          alert(res.message || '아이디/패스워드를 확인하시고 다시 로그인해주세요.');
        }
      })
      .fail(function (xhr) {
        if (xhr && xhr.status === 401) {
          alert('인증에 실패했습니다. 아이디/패스워드를 확인하세요.');
        } else {
          alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
        }
      })
      .always(function () {
        setBusy(false);
      });
    }

    // 버튼 이벤트 바인딩
    $(SELECTOR.btnLoginImg()).add(SELECTOR.btnLoginText).on('click', doLogin);

    // Enter 키 로그인
    $(SELECTOR.id + ',' + SELECTOR.pw).on('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        doLogin();
      }
    });

    // ====== 회원가입 이동 ======
    $(SELECTOR.btnJoinImg()).on('click', function () {
      w.location.href = CTX + '/user/addUser';
    });

    // 포커스 UX
    var $id = $(SELECTOR.id);
    if ($id.length) { $id.focus(); }
  });
})(window, document, window.jQuery);
