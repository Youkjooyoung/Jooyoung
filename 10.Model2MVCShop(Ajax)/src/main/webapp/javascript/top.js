// /javascript/top.js
(function (w, d, $) {
  'use strict';
  if (!w || !d || !w.jQuery) return;

  var ctx = (d.body && d.body.dataset && d.body.dataset.ctx) ? d.body.dataset.ctx : '';

  function goRight(url) {
    try {
      var p = w.parent || null;
      if (p && p.frames && p.frames['rightFrame']) {
        p.frames['rightFrame'].location.href = url;
        return;
      }
    } catch (e) {
    }
    w.location.href = url;
  }

  // 로그인 상태 체크 후 버튼 렌더링
  function renderAuth() {
    $.ajax({
      url: ctx + '/user/json/me',
      method: 'GET',
      dataType: 'json',
      success: function (user) {
        var $auth = $('.nv-auth');
        $auth.empty();

        if (user && user.userId) {
          $auth.append('<span id="btnLogout" class="btn-gray btn-sm">로그아웃</span>');
        } else {
          $auth.append('<span id="btnLogin" class="btn-green btn-sm">로그인</span>');
          $auth.append('<span id="btnJoin"  class="btn-gray btn-sm">회원가입</span>');
        }
      },
      error: function (xhr, status, err) {
        alert("renderAuth() 실패: " + status);
        $('.nv-auth').html('<span class="btn-gray btn-sm">오류</span>');
      }
    });
  }

  $(function () {
    renderAuth();

    // 동적 버튼 이벤트 위임
    $(d).on('click', '#btnLogin', function () {
      goRight(ctx + '/user/loginView.jsp');
    });
	
    $(d).on('click', '#btnJoin', function () {
      goRight(ctx + '/user/addUserView.jsp');
	  
    });
	$(d).on('click', '#btnLogout', function () {
	  if (!confirm("로그아웃 하시겠습니까?")) {
	    return; // ❌ 취소 누르면 아무 동작 안 함
	  }
	//로그아웃
	  $.ajax({
	    url: ctx + '/user/json/logout',
	    method: 'POST',
	    success: function (res) {
	      console.log("✅ 로그아웃 성공:", res);
	      if (res.success) {
	        var loginType = res.loginType || '';
	        var KID = $('body').data('kakao-client');
	        var RLOGOUT = $('body').data('kakao-logout') || (ctx + '/index.jsp');

	        if (loginType === 'kakao' && KID && RLOGOUT) {
	          console.log("➡ 카카오 로그아웃 URL 이동:", RLOGOUT);
	          var url = 'https://kauth.kakao.com/oauth/logout'
	                    + '?client_id=' + encodeURIComponent(KID)
	                    + '&logout_redirect_uri=' + encodeURIComponent(RLOGOUT);
	          window.top.location.href = url;
	        } else {
	          console.log("➡ 일반/구글 로그아웃 → index.jsp 이동");
	          location.href = ctx + '/index.jsp';
	        }
	      }
	    },
	    error: function (xhr, status, err) {
	      console.error("❌ 로그아웃 실패:", status, err, xhr.responseText);
	      alert("로그아웃 실패");
	    }
	  });
	});
  });
})(window, document, jQuery);
