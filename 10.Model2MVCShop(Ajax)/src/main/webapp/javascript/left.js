/* left.js : jQuery 3.x 호환, 프레임 네비게이션 전담 */
$(function () {
  var ctx = (document.body && document.body.getAttribute('data-ctx')) || '';

  function openHistory() {
    window.open(
      ctx + '/layout/recentProduct.jsp',
      'recentProduct',
      'left=300,top=200,width=500,height=400,scrollbars=yes,resizable=no'
    );
  }

  function getTopUserId() {
    try {
      var tf = window.parent && window.parent.frames ? window.parent.frames['topFrame'] : null;
      if (!tf) return '';
      var doc = tf.document || tf.contentDocument;
      if (!doc) return '';
      var el = doc.getElementById('userIdForTop');
      return el && el.value ? el.value : '';
    } catch (e) {
      return '';
    }
  }

  function goRight(url) {
    try {
      if (window.parent && window.parent.frames && window.parent.frames['rightFrame']) {
        window.parent.frames['rightFrame'].location.href = url;
      } else {
        window.top.location.href = url;
      }
    } catch (e) {
      window.top.location.href = url;
    }
  }

  // 메뉴 라우팅
  $(document).on('click', '.Depth03', function () {
    var code = $(this).attr('data-nav');
    var url = '';

    if (code === 'myInfo') {
      var uid = getTopUserId();
      url = ctx + '/user/getUser' + (uid ? ('?userId=' + encodeURIComponent(uid)) : '');
    } else if (code === 'userList') {
      url = ctx + '/user/listUser';
    } else if (code === 'addProduct') {
      url = ctx + '/product/addProductView.jsp';
    } else if (code === 'manageProduct') {
      url = ctx + '/product/listProduct?menu=manage';
    } else if (code === 'searchProduct') {
      url = ctx + '/product/listProduct?menu=search';
    } else if (code === 'myPurchase') {
      url = ctx + '/purchase/list';
    } else if (code === 'recent') {
      openHistory();
      return;
    }

    if (url) goRight(url);
  });
});
