(() => {
  'use strict';
  const $ = window.jQuery;
  if (!$) return;
  const ctx = () => document.body.getAttribute('data-ctx') || '';

  const fetchSale = async (searchKeyword='') => {
    const payload = { currentPage:1, pageSize:50, searchKeyword, searchCondition:'0' };
    const res = await $.ajax({
      url: `${ctx()}/purchase/json/getSaleList`,
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(payload)
    }).catch(()=>null);
    return res && res.list ? res.list : [];
  };

  const money = (n) => Number(n||0).toLocaleString('ko-KR')+' 원';

  const draw = (rows) => {
    const $tb = $('#saleBody').empty();
    if (!rows.length) {
      $tb.append(`<tr><td class="p-6 text-center text-gray-500" colspan="7">판매 내역이 없습니다.</td></tr>`);
      return;
    }
    rows.forEach(p => {
      const total = p.paymentAmount && p.paymentAmount !== 0 ? p.paymentAmount : ((p.purchaseProd?.price||0) * (p.qty||1));
      const name = p.purchaseProd?.prodName || (`상품번호 ${p.purchaseProd?.prodNo||''}`);
      const buyer = p.buyer?.userId || '';
      const status = p.tranCode==='001'?'주문완료':p.tranCode==='002'?'물품수령대기':p.tranCode==='003'?'배송완료':p.tranCode==='004'?'취소요청':p.tranCode==='005'?'취소완료':'-';
      const row = `
        <tr class="border-t" data-tranno="${p.tranNo}" data-prodno="${p.purchaseProd?.prodNo||0}">
          <td class="p-3">${p.tranNo}</td>
          <td class="p-3">${name}</td>
          <td class="p-3">${p.qty||1}</td>
          <td class="p-3">${money(total)}</td>
          <td class="p-3">${buyer}</td>
          <td class="p-3">${status}</td>
          <td class="p-3 space-x-2">
            <button type="button" class="px-4 py-2 rounded-xl bg-gray-900 text-white btn-detail">상세</button>
            <button type="button" class="px-4 py-2 rounded-xl bg-naver text-white btn-ship">배송중</button>
            <button type="button" class="px-4 py-2 rounded-xl bg-gray-200 btn-ack-cancel">취소승인</button>
          </td>
        </tr>`;
      $tb.append(row);
    });
  };

  const postForm = (url, data) => {
    const f = document.createElement('form');
    f.method = 'post'; f.action = ctx()+url;
    Object.keys(data||{}).forEach(k => {
      const i = document.createElement('input');
      i.type='hidden'; i.name=k; i.value=data[k]; f.appendChild(i);
    });
    document.body.appendChild(f); f.submit();
  };

  const boot = async () => {
    draw(await fetchSale(''));

    $('#btnSearch').on('click', async () => {
      const kw = $('#kw').val().trim();
      draw(await fetchSale(kw));
    });

    $(document).on('click', '.btn-detail, tr[data-tranno] td', function(e){
      const tr = $(this).closest('tr[data-tranno]');
      const tranNo = tr.data('tranno');
      if (!tranNo) return;
      location.href = `${ctx()}/purchase/getPurchase?tranNo=${encodeURIComponent(tranNo)}`;
    });

    $(document).on('click', '.btn-ship', function(e){
      e.stopPropagation();
      const tr = $(this).closest('tr[data-tranno]');
      const prodNo = tr.data('prodno');
      if (!prodNo) return;
      postForm('/purchase/updateTranCodeByProd', { prodNo, tranCode:'002' });
    });

    $(document).on('click', '.btn-ack-cancel', function(e){
      e.stopPropagation();
      const tr = $(this).closest('tr[data-tranno]');
      const tranNo = tr.data('tranno');
      if (!tranNo) return;
      postForm('/purchase/ackCancelByTran', { tranNo });
    });
  };

  $(boot);
})();
