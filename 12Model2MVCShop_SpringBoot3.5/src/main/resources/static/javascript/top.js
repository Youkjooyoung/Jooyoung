((w,d,$)=>{
  'use strict';
  if(!$) return;

  const ctx = () => $('body').data('ctx') || '';
  const getMe = () => $.getJSON(`${ctx()}/user/json/me`, { _: Date.now() });
  const btn = (id, label) => `<button id="${id}" type="button" class="h-9 px-4 rounded-[10px] font-bold border border-gray-300 bg-white hover:bg-gray-50">${label}</button>`;
  const label = name => `<span class="px-2 text-gray-700 font-bold select-none">${name}님</span>`;

  const renderAuth = me => {
    const $box = $('.nv-auth'); if(!$box.length) return;
    const display = me && me.loggedIn ? (me.userName && me.userName.trim() ? me.userName : (me.userId || '사용자')) : null;
    const items = [ btn('btnSearchTop','상품 검색') ];
    if(me && me.loggedIn){
      items.unshift(label(display));
      if(String(me.role||'').toUpperCase()==='ADMIN') items.push(btn('btnManage','판매상품관리'));
      items.push(btn('btnLogout','로그아웃'));
    }else{
      items.push(btn('btnLogin','로그인'));
    }
    $box.html(items.join(''));
    $('body').data('role', me && me.role ? me.role : '');
  };

  const mountAuth = () => { getMe().done(renderAuth).fail(()=>renderAuth(null)); };
  const go = url => { location.href = url; };

  $(d).on('click', '#btnSearchTop', ()=>{
    if(w.__layout && w.__layout.go) w.__layout.go('searchProduct');
    else go(`${ctx()}/product/listProduct`);
  });
  $(d).on('click', '#btnManage', ()=> go(`${ctx()}/product/manage`));
  $(d).on('click', '#btnLogout', ()=> go(`${ctx()}/user/logout`));
  $(d).on('click', '#btnLogin',  ()=> go(`${ctx()}/user/loginView.jsp`));

  $('#btnMainMenu').on('click', ()=> $('#menuDropdown').toggleClass('hidden'));
  $(d).on('click', e => { if(!$(e.target).closest('#menuDropdown,#btnMainMenu').length) $('#menuDropdown').addClass('hidden'); });

  $('#btnHome').on('click', ()=> go(`${ctx()}/`));
  $('#btnHome').on('keydown', e => { if(e.key==='Enter') $('#btnHome').click(); });

  $(()=> mountAuth());
  $(d).on('view:afterload', ()=> mountAuth());
})(window, document, window.jQuery);
