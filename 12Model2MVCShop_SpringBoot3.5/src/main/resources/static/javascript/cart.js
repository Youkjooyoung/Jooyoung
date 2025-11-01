(() => {
  'use strict';
  const $ = window.jQuery;
  if (!$) return;
  const ctx = () => document.body.getAttribute('data-ctx') || '';

  const money = (n) => Number(n||0).toLocaleString('ko-KR')+' 원';
  const clamp = (v) => {
    const n = Math.floor(+v||1);
    return n < 1 ? 1 : n;
  };

  const rowAmount = ($tr) => {
    const unit = +($tr.data('unitprice')||0);
    const qty = clamp($tr.find('.qty').val());
    return unit * qty;
  };

  const redrawRow = ($tr) => {
    $tr.find('.amount').text(money(rowAmount($tr)));
  };

  const sumAll = () => {
    let sum = 0;
    $('#cartBody tr[data-cartid]').each((_, el) => { sum += rowAmount($(el)); });
    $('#sumCell').text(money(sum));
  };

  const updateQty = async ($tr, qty) => {
    const cartId = +$tr.data('cartid');
    const ok = await $.ajax({
      url: `${ctx()}/cart/json/updateCart`,
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify({ cartId, qty })
    }).catch(()=>false);
    return ok === true;
  };

  const deleteRow = async ($tr) => {
    const cartId = +$tr.data('cartid');
    const res = await $.ajax({ url: `${ctx()}/cart/json/deleteCart`, method:'POST', data:{ cartId } }).catch(()=>null);
    return res && res.success;
  };

  const buy = ($tr) => {
    const prodNo = +$tr.data('prodno');
    const qty = clamp($tr.find('.qty').val());
    location.href = `${ctx()}/purchase/add?prodNo=${encodeURIComponent(prodNo)}&qty=${encodeURIComponent(qty)}`;
  };

  const boot = () => {
    $('#cartBody tr[data-cartid]').each((_, tr) => redrawRow($(tr)));
    sumAll();

    $(document).on('click', '.btn-dec', async function(){
      const $tr = $(this).closest('tr');
      const $q = $tr.find('.qty');
      $q.val(clamp(($q.val()|0)-1));
      if (await updateQty($tr, clamp($q.val()))) { redrawRow($tr); sumAll(); } else { alert('수량 변경 실패'); }
    });

    $(document).on('click', '.btn-inc', async function(){
      const $tr = $(this).closest('tr');
      const $q = $tr.find('.qty');
      $q.val(clamp(($q.val()|0)+1));
      if (await updateQty($tr, clamp($q.val()))) { redrawRow($tr); sumAll(); } else { alert('수량 변경 실패'); }
    });

    $(document).on('change', '.qty', async function(){
      const $tr = $(this).closest('tr');
      $(this).val(clamp($(this).val()));
      if (await updateQty($tr, clamp($(this).val()))) { redrawRow($tr); sumAll(); } else { alert('수량 변경 실패'); }
    });

    $(document).on('click', '.btn-del', async function(){
      const $tr = $(this).closest('tr');
      const ok = await deleteRow($tr);
      if (ok) { $tr.remove(); sumAll(); } else { alert('삭제 실패'); }
    });

    $(document).on('click', '.btn-buy', function(){
      buy($(this).closest('tr'));
    });

    $('#btnRefresh').on('click', () => location.reload());
  };

  $(boot);
})();
