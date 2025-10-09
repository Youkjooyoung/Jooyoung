/* ====== (A) Google Credential 콜백 : 전역에 등록 ====== */
window.onGoogleCredential = function (res) {
  try {
    var id_token = res && res.credential;
    if (!id_token) { alert('Google 토큰이 없습니다.'); return; }

    var body = document.body;
    var CTX = (body && body.getAttribute('data-ctx')) || '';

    var tokenEl  = document.querySelector('meta[name="_csrf"]');
    var headerEl = document.querySelector('meta[name="_csrf_header"]');
    var token  = tokenEl  && tokenEl.getAttribute('content');
    var header = headerEl && headerEl.getAttribute('content');

    // x-www-form-urlencoded로 고정
    var form = new URLSearchParams(); form.set('id_token', id_token);
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    if (token && header) headers[header] = token;

    fetch(CTX + '/user/google/callback', {
      method: 'POST',
      headers: headers,
      body: form.toString()
    })
    .then(function(r){ return r.json(); })
    .then(function(r){
      if (r && r.success) { window.top.location.href = CTX + '/index.jsp'; }
      else { alert(r && r.message ? r.message : 'Google 로그인 실패'); }
    })
    .catch(function(e){ console.error(e); alert('Google 로그인 중 오류'); });

  } catch (e) {
    console.error(e); alert('Google 처리 실패');
  }
};

/* ====== (B) 나머지 로그인/카카오 ====== */
(function (w, d, $) {
  'use strict';
  if (!$) return;

  $(function () {
    var $body = $('body');
    var CTX   = $body.data('ctx') || '';
    var JSKEY = $body.data('kakao-jskey') || '';
    var KID   = $body.data('kakao-client') || '';

    var ORIGIN         = w.location.origin;
    var KAKAO_REDIRECT = ORIGIN + CTX + '/user/kakao/callback';
    var LOGIN_API      = CTX + '/user/json/login';

    function getCsrfHeaders() {
      var token  = $('meta[name="_csrf"]').attr('content');
      var header = $('meta[name="_csrf_header"]').attr('content');
      var h = { Accept: 'application/json', 'Content-Type': 'application/json' };
      if (token && header) { h[header] = token; }
      return h;
    }

    function doLogin() {
      var id = ($('#userId').val()||'').trim();
      var pw = ($('#password').val()||'').trim();
      if (!id){ alert('ID를 입력하세요.'); $('#userId').focus(); return; }
      if (!pw){ alert('패스워드를 입력하세요.'); $('#password').focus(); return; }

      $.ajax({
        url: LOGIN_API, method: 'POST', dataType: 'json',
        headers: getCsrfHeaders(),
        data: JSON.stringify({ userId: id, password: pw })
      })
      .done(function(res){ if (res && res.success) w.top.location.href = CTX + '/index.jsp';
                           else alert(res && res.message ? res.message : '로그인 실패'); })
      .fail(function(){ alert('로그인 중 오류'); });
    }

    $('#btnLoginSubmit').on('click', doLogin);
    $('#userId,#password').on('keydown', function(e){ if(e.key==='Enter'){ e.preventDefault(); doLogin(); }});
    $('#btnGoJoin').on('click', function(){ w.location.href = CTX + '/user/addUser'; });

    if (w.Kakao && typeof w.Kakao.init === 'function' && JSKEY) { try { w.Kakao.init(JSKEY); } catch (e) {} }
    $('#btnKakaoLogin').on('click', function () {
      if (!KID) { alert('카카오 설정이 올바르지 않습니다.'); return; }
      var url = 'https://kauth.kakao.com/oauth/authorize'
              + '?client_id='   + encodeURIComponent(KID)
              + '&redirect_uri=' + encodeURIComponent(KAKAO_REDIRECT)
              + '&response_type=code'
              + '&prompt=login';
      w.top.location.href = url;
    });
  });
})(window, document, window.jQuery);
