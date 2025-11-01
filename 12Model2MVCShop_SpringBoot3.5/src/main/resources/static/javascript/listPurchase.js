(() => {
  'use strict';
  const $ = window.jQuery;
  if (!$) return;
  const ctx = () => document.body.getAttribute('data-ctx') || '';

  const postForm = (url, data) => {
    const f = document.createElement('form');
    f.method = 'post'; f.action = ctx()+url;
    Object.keys(data||{}).forEach(k => {
      const i = document.createElement('input');
      i.type='hidden'; i.name=k; i.value=data[k]; f.appendChild(i);
    });
    document.body.appendChild(f); f.submit();
  };

  const boot = () => {
    const $root = $('[data-page="purchase-list"]');
    if (!$root.length) return;

    $(document).on('click', '.btn-detail, .purchase-link, tr[data-tranno] td', function(e){
      const tr = $(this).closest('tr[data-tranno]');
      const tranNo = tr.data('tranno');
      if (!tranNo) return;
      location.href = `${ctx()}/purchase/getPurchase?tranNo=${encodeURIComponent(tranNo)}`;
    });

    $(document).on('click', '.btn-confirm', function(e){
      e.stopPropagation();
      const tr = $(this).closest('tr[data-tranno]');
      const tranNo = tr.data('tranno');
      if (!tranNo) return;
      postForm('/purchase/updateTranCode', { tranNo, tranCode:'003' });
    });

    $(document).on('click', '.btn-cancel', function(e){
      e.stopPropagation();
      const tr = $(this).closest('tr[data-tranno]');
      const tranNo = tr.data('tranno');
      if (!tranNo) return;
      postForm('/purchase/updateTranCode', { tranNo, tranCode:'004' });
    });
  };

  $(boot);
})();
