// /javascript/listProduct.js
((w, d, $) => {
	'use strict'; if (!$) return;

	// ================== App 공통 유틸 ==================
	if (!w.App) w.App = {};
	App.debounce = App.debounce || ((fn, ms) => { let t; return function() { const a = arguments, c = this; clearTimeout(t); t = setTimeout(() => fn.apply(c, a), ms || 0); }; });
	App.esc = App.esc || ((s) => String(s ?? '').replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])));
	App.digits = App.digits || ((s) => String(s || '').replace(/\D+/g, ''));
	App.ctx = App.ctx || (() => $('body').data('ctx') || '');
	App.go = App.go || ((path, params) => {
		const ctx = App.ctx(); let url = ctx + path;
		if (params && typeof URLSearchParams !== 'undefined') {
			const sp = new URLSearchParams(params); url += (url.indexOf('?') >= 0 ? '&' : '?') + sp.toString();
		}
		location.href = url;
	});
	
	// ================== 네이버 톤 notice 모달================== 
	App.ensureUiCss = App.ensureUiCss || (() => {
	  if (document.getElementById('nv-ui-style')) return;
	  const css = `
	  .nv-mask{position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:9998;opacity:0;transition:opacity .12s}
	  .nv-mask.show{opacity:1}
	  .nv-dialog{position:fixed;left:50%;top:50%;transform:translate(-50%,-48%);min-width:260px;max-width:80vw;background:#fff;border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,.2);z-index:9999;opacity:0;transition:opacity .12s,transform .12s;font-family:inherit}
	  .nv-dialog.show{opacity:1;transform:translate(-50%,-50%)}
	  .nv-dialog .nv-bd{padding:18px 20px;font-size:14px;color:#191919}
	  .nv-dialog .nv-ft{padding:10px 16px 16px;text-align:right}
	  .nv-dialog .nv-btn{border:0;border-radius:9999px;padding:8px 16px;background:#03c75a;color:#fff;font-weight:700;cursor:pointer}
	  .nv-dialog .nv-btn:hover{background:#02b150}`;
	  const style = document.createElement('style');
	  style.id = 'nv-ui-style'; style.textContent = css;
	  document.head.appendChild(style);
	});
	App.notice = App.notice || (msg => {
	  App.ensureUiCss();
	  const $mask = $('<div class="nv-mask"></div>');
	  const $dlg = $(
	    '<div class="nv-dialog" role="dialog" aria-modal="true">' +
	      '<div class="nv-bd"></div>' +
	      '<div class="nv-ft"><button type="button" class="nv-btn">확인</button></div>' +
	    '</div>');
	  $dlg.find('.nv-bd').text(String(msg || ''));
	  $('body').append($mask, $dlg);
	  setTimeout(() => { $mask.addClass('show'); $dlg.addClass('show'); }, 10);
	  const close = () => { $mask.remove(); $dlg.remove(); };
	  $mask.on('click', close);
	  $dlg.on('click', '.nv-btn', close);
	});
	
	App.toast = App.toast || function (msg, ms) {
	  ms = ms || 1800;
	  var el = document.getElementById('nvToast');
	  if (!el) {
	    el = document.createElement('div');
	    el.id = 'nvToast';
	    el.className = 'nv-toast';
	    document.body.appendChild(el);
	  }
	  el.textContent = msg;
	  el.classList.add('show');
	  clearTimeout(el._t);
	  el._t = setTimeout(() => el.classList.remove('show'), ms);
	};

	// ================== 모듈 ==================
	const NS = '.lp';
	const NS_INF = '.inf';
	const S = '#mainArea [data-page="product-search"]';
	const pageSizeFor = (v) => (v === 'thumb' ? 9 : 10);      // 3×3

	const buildNoImage = () => {
		const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial" font-size="16" fill="#adb5bd">no image</text>
      </svg>`;
		return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
	};
	const noImage = buildNoImage();

	const init = () => {
		const $screen = $(S).first();
		if (!$screen.length) return;

		// ==================  상태 ================== 
		const state = {
			view: $screen.find('#gridBody').is(':visible') ? 'thumb' : 'list',
			page: 1,
			pageSize: 0,
			loading: false,
			done: false,
			cond: '0',
			kw: '',
			sort: '',
			minPrice: null,
			maxPrice: null
		};
		state.pageSize = pageSizeFor(state.view);

		// ==================  엘리먼트 ================== 
		let $list, $grid, $load, $eol, $sentinel;
		let listXhr = null, acXhr = null, io = null, paused = false;

		const pick = () => {
			$list = $screen.find('#listBody');
			$grid = $screen.find('#gridBody');
			$load = $screen.find('#infiniteLoader');
			$eol = $screen.find('#endOfList');
			$sentinel = $screen.find('#infiniteSentinel');
			if (!$sentinel.length) {
				$sentinel = $('<div id="infiniteSentinel" style="height:1px;"></div>');
				(state.view === 'thumb' ? $grid : $list).after($sentinel);
			}
		};

		// ==================  가격 슬라이더 ================== 
		const setupPriceSlider = () => {
		  const STEP = 5000;                 // 5천원
		  const RMAX_MIN = 200000;           // 최대가격의 최소값 = 20만원
		  const SNAP_NEAR = 15000;           // 스냅 임계
		  const TICKS = [200000, 500000, 1000000, 1500000];

		  const $rMin = $screen.find('#rMin');
		  const $rMax = $screen.find('#rMax');
		  const $fill = $screen.find('.nv-pr-fill');
		  const $minV = $screen.find('#priceMinView');
		  const $maxV = $screen.find('#priceMaxView');
		  const $pr   = $screen.find('.nv-pr');

		  const MAX = Number($screen.data('maxprice') || $rMax.attr('max') || 2000000);
		  const MIN = 0;

		  // ================== 눈금 생성 ================== 
		  const buildTicks = () => {
		    const rawTicks = TICKS.filter(v => v > MIN && v < MAX);
		    $pr.find('.nv-pr-ticks').remove();
		    const $ticks = $('<div class="nv-pr-ticks" aria-hidden="true"></div>');
		    rawTicks.forEach(v => {
		      const pct = (v - MIN) / (MAX - MIN) * 100;
		      const label = (v/10000).toLocaleString('ko-KR') + '만원';
		      $ticks.append(`<div class="nv-pr-tick" style="left:${pct}%">${label}</div>`);
		    });
		    $pr.append($ticks);
		  };

		  const hMin = Number($screen.find('#minPrice').val() || MIN);
		  const hMax = Number($screen.find('#maxPrice').val() || MAX);
		  $rMin.attr({ min: MIN,      max: MAX, step: STEP }).val(hMin);
		  $rMax.attr({ min: RMAX_MIN, max: MAX, step: STEP }).val(Math.max(hMax, RMAX_MIN));

		  const fmt  = (n) => Number(n||0).toLocaleString('ko-KR');
		  const quant= (v) => Math.round(v / STEP) * STEP;
		  const snap = (val) => {
		    const points = [MIN, ...TICKS.filter(v => v > MIN && v < MAX), MAX];
		    let best = val, diff = Infinity;
		    for (const p of points){ const d = Math.abs(val - p); if (d < diff){ diff = d; best = p; } }
		    return (diff <= SNAP_NEAR) ? best : val;
		  };

		  const paint = () => {
		    const v1 = Number($rMin.val()), v2 = Number($rMax.val());
		    const p1 = (v1 - MIN) / (MAX - MIN) * 100;
		    const p2 = (v2 - MIN) / (MAX - MIN) * 100;
		    $fill.css({ left: p1 + '%', width: (p2 - p1) + '%' });
		    $minV.text(fmt(v1)); $maxV.text(fmt(v2));
		    $screen.find('#minPrice').val(v1); $screen.find('#maxPrice').val(v2);
		  };

		  const clamp = () => {
		    let v1 = Number($rMin.val());
		    let v2 = Number($rMax.val());
		    v1 = Math.max(MIN, Math.min(v1, MAX - STEP));
		    v2 = Math.max(RMAX_MIN, Math.min(v2, MAX));
		    if (v1 > v2 - STEP) v1 = v2 - STEP;
		    v1 = snap(v1); v2 = snap(Math.max(v2, RMAX_MIN));
		    if (v1 > v2 - STEP) v1 = Math.max(MIN, v2 - STEP);
		    $rMin.val(v1); $rMax.val(v2);
		  };

		  // ===  바 클릭으로 가장 가까운 핸들 이동 ===
		  const moveByClick = (e) => {
		    if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'input') return;

		    const rect = $pr[0].getBoundingClientRect();
		    let ratio = (e.clientX - rect.left) / rect.width;
		    ratio = Math.max(0, Math.min(1, ratio));

		    let val = MIN + (MAX - MIN) * ratio;
		    val = snap(quant(val));

		    const curMin = Number($rMin.val());
		    const curMax = Number($rMax.val());

		    if (Math.abs(val - curMin) <= Math.abs(val - curMax)) {
		      val = Math.min(val, curMax - STEP);
		      $rMin.val(Math.max(MIN, val));
		    } else {
		      //==================  오른쪽(최대) 이동 (최소 20만원)================== 
		      val = Math.max(val, RMAX_MIN);
		      val = Math.max(val, curMin + STEP);
		      $rMax.val(Math.min(MAX, val));
		    }
		    clamp(); paint(); reset();
		  };

		  // ================== 초기 렌더================== 
		  buildTicks();
		  clamp(); paint();

		  // ================== 드래그 중/끝================== 
		  $screen.on('input'+NS,  '#rMin,#rMax', () => { clamp(); paint(); });
		  $screen.on('change'+NS, '#rMin,#rMax', () => { clamp(); paint(); reset(); });

		  // ================== 바 클릭으로 이동================== 
		  $screen.on('click'+NS, '.nv-pr, .nv-pr-track, .nv-pr-fill', moveByClick);

		  // ================== 전체보기 초기화================== 
		  $screen.on('nv:price:reset'+NS, () => {
		    $rMin.val(MIN); $rMax.val(MAX);
		    clamp(); paint();
		  });
		};


		// ==================  도우미================== 
		const ctx = () => App.ctx();
		const apiUrl = (p) => ctx() + '/api/products?' + $.param({ ...(p || {}), _: Date.now() });
		const acUrl = (type, kw) => ctx() + '/api/products/suggest?' + $.param({ type, keyword: $.trim(kw || ''), _: Date.now() });

		const safeAbort = (xhrRef) => { try { if (xhrRef && xhrRef.readyState !== 4) xhrRef.abort(); } catch (_) { } };
		const pause = () => { paused = true; };
		const resume = () => { paused = false; };
		const isAdmin = () => String($('body').data('role') || '').toUpperCase() === 'ADMIN';

		const hasNext = (res, len) => {
			if (!res) return len === state.pageSize;
			if (typeof res.hasNext !== 'undefined') return !!res.hasNext;
			if (typeof res.last !== 'undefined') return !res.last;
			if (typeof res.isLast !== 'undefined') return !res.isLast;
			const total = parseInt(res.totalCount || res.total, 10);
			if (!isNaN(total)) return (state.page * state.pageSize) < total;
			return len === state.pageSize;
		};

		const syncViewToggle = () => {
			const isThumb = (state.view === 'thumb');
			$screen.find('#btnListView').toggleClass('is-active', !isThumb).attr('aria-pressed', String(!isThumb));
			$screen.find('#btnThumbView').toggleClass('is-active', isThumb).attr('aria-pressed', String(isThumb));
		};

		const switchViewTo = (v) => {
			if (state.view === v) return;
			state.view = v;
			state.pageSize = pageSizeFor(state.view);
			$screen.find('#listTableWrap').toggle(v === 'list');
			$screen.find('#gridBody').toggle(v === 'thumb');
			syncViewToggle();
			reset();
		};

		const thumbImg = (p) => p.fileName ? (ctx() + '/upload/' + encodeURIComponent(p.fileName)) : noImage;

		// ==================  렌더================== 
		const renderRowList = (p) => {
			const stock = Number(p.stockQty || 0);
			const soldOut = stock <= 0;
			const manageHtml = (!soldOut && !isAdmin())
			? `<button type="button" class="btn-green btn-buy" data-prodno="${p.prodNo}" data-stock="${stock}">구매하기</button>`
			    : `<button type="button" class="btn-red" disabled aria-disabled="true">품절</button>`;
			const statusHtml = soldOut ? '<span class="text-red">품절</span>' : '판매중';
			return (
				`<tr data-prodno="${p.prodNo}" data-stock="${stock}">
          <td>${p.prodNo}</td>
          <td><span class="prod-link" data-prodno="${p.prodNo}">${App.esc(p.prodName)}</span></td>
          <td>${Number(p.price || 0).toLocaleString('ko-KR')} 원</td>
          <td>${p.formattedManuDate || p.manuDate || ''}</td>
          <td>${p.viewCount || 0}</td>
          <td>${statusHtml}</td>
          <td>${manageHtml}</td>
        </tr>`
			);
		};

		const renderRowThumb = (p) => {
			const stock = Number(p.stockQty || 0);
			const soldOut = stock <= 0;
			const ctaHtml = (!soldOut && !isAdmin())
			? `<button type="button" class="btn-green btn-buy" data-prodno="${p.prodNo}" data-stock="${stock}">구매하기</button>`
			    : `<button type="button" class="btn-red" disabled aria-disabled="true">품절</button>`;
			return (
				`<div class="thumb-card" data-prodno="${p.prodNo}" data-stock="${stock}">
          <div class="thumb-img"><img alt="" src="${thumbImg(p)}" loading="lazy"></div>
          <div class="thumb-info">
            <div class="thumb-name prod-link" data-prodno="${p.prodNo}">${App.esc(p.prodName)}</div>
            <div class="thumb-price">${Number(p.price || 0).toLocaleString('ko-KR')} 원</div>
            <div class="thumb-etc">${p.formattedManuDate || p.manuDate || ''} · 조회 ${p.viewCount || 0}</div>
          </div>
          <div class="thumb-cta">${ctaHtml}</div>
        </div>`
			);
		};

		const renderRow = (p) => (state.view === 'thumb' ? renderRowThumb(p) : renderRowList(p));

		const append = (list) => {
			const html = $.map(list, renderRow).join('');
			if (!html) return;
			if (state.view === 'thumb') $grid.append(html).show();
			else $list.append(html).closest('#listTableWrap').show();

			if ($sentinel && $sentinel.length) {
				$sentinel.detach();
				(state.view === 'thumb' ? $grid : $list).after($sentinel);
			}
		};

		// ==================  통신 ================== 
		const load = () => {
			if (state.loading || state.done || paused) return;
			safeAbort(listXhr);
			state.loading = true; pause();
			$load.text('불러오는 중...').show(); $eol.hide();

			const p = {
				currentPage: state.page,
				pageSize: state.pageSize,
				searchCondition: state.cond,
				searchKeyword: state.kw,
				sort: state.sort
			};
			if (state.minPrice != null) p.minPrice = state.minPrice;
			if (state.maxPrice != null) p.maxPrice = state.maxPrice;

			listXhr = $.getJSON(apiUrl(p))
				.done((res) => {
					const list = (res && res.list) ? res.list : [];
					if (!list.length) {
						if (state.page === 1) { $list.empty(); $grid.empty(); $eol.text('검색 결과가 없습니다.'); }
						state.done = true; $eol.show(); return;
					}
					append(list);
					state.page++;
					state.done = !hasNext(res, list.length);
					if (state.done) $eol.show();
				})
				.fail((x) => {
					if (x && x.statusText === 'abort') return;
					console.error(x);
					if (state.page === 1) { state.done = true; $eol.text('목록을 불러오지 못했습니다.').show(); }
				})
				.always(() => { state.loading = false; resume(); $load.hide(); });
		};

		const tryLoad = App.debounce(() => { if (!state.loading && !state.done) load(); }, 120);

		const observe = () => {
			$(w).off(NS_INF).on('scroll' + NS_INF + ' resize' + NS_INF, tryLoad);
			if (io) { try { io.disconnect(); } catch (_) { } io = null; }
			try {
				io = new IntersectionObserver((ents) => {
					if (paused || state.loading || state.done) return;
					if (ents.some((e) => e.isIntersecting)) load();
				}, { root: null, rootMargin: '240px 0px 240px 0px', threshold: 0.01 });
				if ($sentinel[0]) io.observe($sentinel[0]);
			} catch (_) { /* 폴백 */ }
			load();
		};

		const readFilters = () => {
			state.cond = $screen.find('#searchCondition').val() || '0';
			state.kw = $.trim($screen.find('#searchKeyword').val() || '');
			state.sort = $screen.find('#sort').val() || '';
			const min = App.digits($screen.find('#minPrice').val()); state.minPrice = min ? parseInt(min, 10) : null;
			const max = App.digits($screen.find('#maxPrice').val()); state.maxPrice = max ? parseInt(max, 10) : null;
		};

		const reset = () => {
			pick();
			state.page = 1; state.done = false; state.loading = false;
			readFilters();
			$list.empty(); $grid.empty(); $eol.hide(); $load.hide();
			observe();
		};

		// ==================  이벤트 ================== 
		$screen.off(NS);
		setupPriceSlider();

		// ================== 보기 전환================== 
		$screen.on('click' + NS, '#btnListView', () => switchViewTo('list'));
		$screen.on('click' + NS, '#btnThumbView', () => switchViewTo('thumb'));
		$screen.on('keydown' + NS, '.seg', (e) => {
			if (e.key === 'ArrowRight' && state.view !== 'thumb') $screen.find('#btnThumbView').trigger('click');
			if (e.key === 'ArrowLeft' && state.view !== 'list') $screen.find('#btnListView').trigger('click');
		});

		// ================== 검색================== 
		$screen.on('click' + NS, '#btnSearch', reset);

		// ================== 전체보기(슬라이더까지 완전 초기화)================== 
		$screen.on('click' + NS, '#btnAll', () => {
			$screen.find('#searchCondition').val('0');
			$screen.find('#searchKeyword').val('');
			$screen.find('#sort').val('');
			$screen.find('#minPrice').val('');
			$screen.find('#maxPrice').val('');
			$screen.find('.sort-btn').removeClass('active');
			$screen.trigger('nv:price:reset');
			reset();
		});

		// ================== 정렬================== 
		$screen.on('click' + NS, '.sort-btn', function() {
			$screen.find('.sort-btn').removeClass('active');
			$(this).addClass('active');
			$screen.find('#sort').val($(this).data('sort') || '');
			reset();
		});

		//==================  자동완성================== 
		(() => {
			const $kw = $screen.find('#searchKeyword');
			const $box = $screen.find('#acList');
			let acSel = -1;

			const renderAC = (items) => {
				if (!items || !items.length) { $box.empty().hide(); return; }
				const html = items.slice(0, 10).map((v, i) =>
					`<div class="ac-item${i === acSel ? ' active' : ''}" data-i="${i}">${App.esc(v)}</div>`).join('');
				$box.html(html).show().width($kw.outerWidth());
			};

			const fetchAC = App.debounce(() => {
				const v = $.trim($kw.val() || '');
				if (v.length < 1) { $box.empty().hide(); return; }
				try { if (acXhr && acXhr.readyState !== 4) acXhr.abort(); } catch (_) { }
				const tSel = $screen.find('#searchCondition').val() || 'prodName';
				const type = (tSel === 'prodDetail') ? 'prodDetail' : 'prodName';
				acXhr = $.getJSON(acUrl(type, v)).done((res) => { renderAC((res && res.items) || []); acSel = -1; });
			}, 120);

			$screen.on('input' + NS + ' focus' + NS, '#searchKeyword', fetchAC);
			$screen.on('blur' + NS, '#searchKeyword', () => setTimeout(() => $box.hide(), 150));
			$screen.on('keydown' + NS, '#searchKeyword', (e) => {
				const max = $box.children().length - 1; if (max < 0) { if (e.key === 'Enter') reset(); return; }
				if (e.key === 'ArrowDown') { acSel = Math.min(max, acSel + 1); $box.children().removeClass('active').eq(acSel).addClass('active'); e.preventDefault(); }
				else if (e.key === 'ArrowUp') { acSel = Math.max(0, acSel - 1); $box.children().removeClass('active').eq(acSel).addClass('active'); e.preventDefault(); }
				else if (e.key === 'Enter') { if (acSel >= 0) { $kw.val($box.children().eq(acSel).text()); $box.hide(); reset(); } else { reset(); } }
				else if (e.key === 'Escape') { $box.hide(); }
			});
			$screen.on('mousedown' + NS, '.ac-item', function() { $kw.val($(this).text()); $box.hide(); reset(); });
		})();

		// ================== 이동/구매 ================== 
		$screen.on('click' + NS, '.prod-link', function() {
			const no = $(this).data('prodno');
			const pageUrl = `${ctx()}/product/getProduct?prodNo=${encodeURIComponent(no)}`;
			const partialUrl = `${pageUrl} .container:first`;
			if (w.__layout && __layout.loadMain) __layout.loadMain(partialUrl);
			else location.href = pageUrl;
		});

		$screen.on('click' + NS, '.btn-buy', function () {
		  const $btn  = $(this);
		  const $row  = $btn.closest('[data-prodno]');
		  const stock = parseInt(($btn.attr('data-stock') ?? $row.attr('data-stock') ?? '0'), 10);

		  if (!Number.isFinite(stock) || stock <= 0) { App.notice('품절된 상품입니다.'); return; }

		  const no   = $btn.attr('data-prodno') || $row.attr('data-prodno');
		  const ctrl = `${ctx()}/purchase/addPurchase?prodNo=${encodeURIComponent(no)}`;
		  const part = `${ctrl} .container:first`;
		  if (window.__layout && __layout.loadMain) __layout.loadMain(part);
		  else location.href = ctrl;
		});

		// ==================  최초 ================== 
		pick();
		syncViewToggle();
		reset();
	};

	// ================== SPA 훅 & 초기 진입 ================== 
	$(d).on('view:afterload', (_e, payload) => { if (payload && payload.page === 'product-search') init(); });
	$(() => { if ($(S).length) init(); });

})(window, document, window.jQuery);
