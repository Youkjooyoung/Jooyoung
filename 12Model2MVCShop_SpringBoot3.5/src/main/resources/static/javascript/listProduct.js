/* /javascript/listProduct.js */
((w, d, $) => {
	'use strict';
	if (!$) return;

	const S = '#mainArea [data-page="product-search"], #appMain [data-page="product-search"]';
	const NS = '.lp';
	const NS_INF = '.lpinf';

	const pageSizeFor = (v) => (v === 'thumb' ? 9 : 10);

	const buildNoImage = () => {
		const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial" font-size="16" fill="#adb5bd">no image</text>
      </svg>`;
		return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
	};
	const NO_IMG = buildNoImage();
	const ctx = () => (w.App && App.ctx ? App.ctx() : ($('body').data('ctx') || ''));

	const apiUrl = (p) => ctx() + '/api/products?' + $.param({ ...(p || {}), _: Date.now() });
	const acUrl = (type, kw) => ctx() + '/api/products/suggest?' + $.param({ type, keyword: $.trim(kw || ''), _: Date.now() });

	function init() {
		const $screen = $(S).first();
		if (!$screen.length) return;

		const state = {
			view: $screen.find('#gridBody').is(':visible') ? 'thumb' : 'list', page: 1, pageSize: 0,
			loading: false, done: false, cond: '0', kw: '', sort: '', minPrice: null, maxPrice: null
		};
		state.pageSize = pageSizeFor(state.view);

		let reqKey = 0;
		let $list, $grid, $load, $eol, $sentinel;
		let listXhr = null, acXhr = null, io = null, paused = false;

		const pause = () => { paused = true; }; const resume = () => { paused = false; };
		const safeAbort = (xhr) => {
			try {
				if (xhr && xhr.readyState !== 4) xhr.abort();
			} catch (_) {
			}
		};
		const isAdmin = () => String($('body').data('role') || '').toUpperCase() === 'ADMIN';

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

		// ── 가격 슬라이더(표시/히든 동기화)
		const setupPriceSlider = () => {

			const STEP = 10000;
			const TICKS = [200000, 500000, 1000000, 1500000];

			const $rMin = $screen.find('#rMin');
			const $rMax = $screen.find('#rMax');
			const $fill = $screen.find('.nv-pr-fill');
			const $pr = $screen.find('.nv-pr');

			const $minV = $screen.find('#priceMinView');
			const $maxV = $screen.find('#priceMaxView');
			const $rangeTxt = $screen.find('#priceRangeText');

			const MAX = Number($screen.data('maxprice') || $rMax.attr('max') || 2000000);
			const MIN = 0;
			const RMAX_MIN = MIN;

			const fmt = (n) => Number(n || 0).toLocaleString('ko-KR');
			const show = (a, b) => {
				if ($minV.length) $minV.text(fmt(a));
				if ($maxV.length) $maxV.text(fmt(b));
				if ($rangeTxt.length) $rangeTxt.text(`${fmt(a)} ~ ${fmt(b)} 원`);
			};
			const syncHidden = (a, b) => {
				$screen.find('#minPrice').val(a);
				$screen.find('#maxPrice').val(b);
			};

			// 눈금
			const buildTicks = () => {
				const raw = TICKS.filter(v => v > MIN && v < MAX);
				$pr.find('.nv-pr-ticks').remove();
				const $ticks = $('<div class="nv-pr-ticks" aria-hidden="true"></div>');
				raw.forEach(v => {
					const pct = (v - MIN) / (MAX - MIN) * 100;
					const label = (v / 10000).toLocaleString('ko-KR') + '만원';
					$ticks.append(`<div class="nv-pr-tick" style="left:${pct}%">${label}</div>`);
				});
				$pr.append($ticks);
			};

			const quant = v => Math.round(v / STEP) * STEP;
			const snap = (val) => {
				const pts = [MIN, ...TICKS.filter(v => v > MIN && v < MAX), MAX];
				let best = val, diff = Infinity;
				for (const p of pts) {
					const d = Math.abs(val - p);
					if (d < diff) { diff = d; best = p; }
				}
				return (diff <= STEP * 1.5) ? best : val;
			};

			// 초기값
			const hMin = Number($screen.find('#minPrice').val() || MIN);
			const hMax = Number($screen.find('#maxPrice').val() || MAX);
			$rMin.attr({ min: MIN, max: MAX, step: STEP }).val(hMin);
			$rMax.attr({ min: RMAX_MIN, max: MAX, step: STEP }).val(Math.max(hMax, RMAX_MIN));

			let active = null;

			const clamp = () => {
				let v1 = Number($rMin.val());
				let v2 = Number($rMax.val());

				v1 = Math.max(MIN, Math.min(v1, MAX - STEP));
				v2 = Math.max(RMAX_MIN, Math.min(v2, MAX));

				if (active === 'min' && v1 > v2 - STEP) v1 = v2 - STEP;
				if (active === 'max' && v2 < v1 + STEP) v2 = Math.max(v1 + STEP, RMAX_MIN);

				v1 = quant(snap(v1));
				v2 = quant(snap(v2));

				v1 = Math.max(MIN, Math.min(v1, v2 - STEP));
				v2 = Math.max(Math.max(v1 + STEP, RMAX_MIN), Math.min(v2, MAX));

				$rMin.val(v1);
				$rMax.val(v2);
			};

			const paint = () => {
				const v1 = Number($rMin.val());
				const v2 = Number($rMax.val());
				const p1 = (v1 - MIN) / (MAX - MIN) * 100;
				const p2 = (v2 - MIN) / (MAX - MIN) * 100;
				$fill.css({ left: p1 + '%', width: (p2 - p1) + '%' });
				show(v1, v2);
				syncHidden(v1, v2);
			};

			const moveByClick = (e) => {
				if ((e.target.tagName || '').toLowerCase() === 'input') return;
				const rect = $pr[0].getBoundingClientRect();
				let ratio = (e.clientX - rect.left) / rect.width;
				ratio = Math.max(0, Math.min(1, ratio));
				let val = MIN + (MAX - MIN) * ratio;
				val = quant(snap(val));

				const curMin = Number($rMin.val());
				const curMax = Number($rMax.val());
				const nearMin = Math.abs(val - curMin) <= Math.abs(val - curMax);

				if (nearMin) {
					active = 'min';
					val = Math.min(val, curMax - STEP);
					$rMin.val(Math.max(MIN, val));
				} else {
					active = 'max';
					val = Math.max(val, Math.max(curMin + STEP, RMAX_MIN));
					$rMax.val(Math.min(MAX, val));
				}
				clamp();
				paint();
			};

			buildTicks();
			clamp();
			paint();

			const setActiveMin = () => { active = 'min'; };
			const setActiveMax = () => { active = 'max'; };

			$screen
				.on('pointerdown' + NS + ' mousedown' + NS + ' touchstart' + NS + ' focus' + NS, '#rMin', setActiveMin)
				.on('pointerdown' + NS + ' mousedown' + NS + ' touchstart' + NS + ' focus' + NS, '#rMax', setActiveMax)
				.on('input' + NS, '#rMin,#rMax', function() { active = (this.id === 'rMax') ? 'max' : 'min'; clamp(); paint(); })
				.on('change' + NS, '#rMin,#rMax', function() { active = (this.id === 'rMax') ? 'max' : 'min'; clamp(); paint(); })
				.on('click' + NS, '.nv-pr, .nv-pr-track, .nv-pr-fill', moveByClick)
				.on('nv:price:reset' + NS, () => { active = null; $rMin.val(MIN); $rMax.val(MAX); clamp(); paint(); });
		};

		const thumbImg = (p) => p.fileName ? (ctx() + '/upload/' + encodeURIComponent(p.fileName)) : NO_IMG;

		const renderRowList = (p) => {
			const stock = Number(p.stockQty || 0), soldOut = stock <= 0;
			const statusHtml = soldOut ? '<span class="text-red">품절</span>' : '판매중';
			const btnHtml = (!soldOut && !isAdmin())
				? `<button type="button" class="btn-green btn-buy" data-prodno="${p.prodNo}" data-stock="${stock}">구매하기</button>`
				: `<button type="button" class="btn-red" disabled aria-disabled="true">품절</button>`;
			return `
        <tr data-prodno="${p.prodNo}" data-stock="${stock}">
          <td>${p.prodNo}</td>
          <td><span class="prod-link" data-prodno="${p.prodNo}">${App.esc(p.prodName)}</span></td>
          <td>${Number(p.price || 0).toLocaleString('ko-KR')} 원</td>
          <td>${p.formattedManuDate || p.manuDate || ''}</td>
          <td>${p.viewCount || 0}</td>
          <td>${statusHtml}</td>
          <td>${btnHtml}</td>
        </tr>`;
		};

		const renderRowThumb = (p) => {
			const stock = Number(p.stockQty || 0), soldOut = stock <= 0;
			const btnHtml = (!soldOut && !isAdmin())
				? `<button type="button" class="btn-green btn-buy" data-prodno="${p.prodNo}" data-stock="${stock}">구매하기</button>`
				: `<button type="button" class="btn-red" disabled aria-disabled="true">품절</button>`;
			return `
        <div class="thumb-card" data-prodno="${p.prodNo}" data-stock="${stock}">
          <div class="thumb-img prod-link" data-prodno="${p.prodNo}" role="link" tabindex="0">
            <img alt="" src="${thumbImg(p)}" onerror="App.noimg && App.noimg(event)" loading="lazy">
          </div>
          <div class="thumb-info">
            <div class="thumb-name prod-link" data-prodno="${p.prodNo}">${App.esc(p.prodName)}</div>
            <div class="thumb-price">${Number(p.price || 0).toLocaleString('ko-KR')} 원</div>
            <div class="thumb-etc">${p.formattedManuDate || p.manuDate || ''} · 조회 ${p.viewCount || 0}</div>
          </div>
          <div class="thumb-cta">${btnHtml}</div>
        </div>`;
		};

		const renderRow = (p) => (state.view === 'thumb' ? renderRowThumb(p) : renderRowList(p));
		const append = (list) => {
			const html = $.map(list, renderRow).join('');
			if (!html) return;
			if (state.view === 'thumb') { $grid.append(html).removeClass('nv-hide').show(); $screen.find('#listTableWrap').addClass('nv-hide'); }
			else { $list.append(html).closest('#listTableWrap').removeClass('nv-hide').show(); $grid.addClass('nv-hide'); }
			if ($sentinel && $sentinel.length) { $sentinel.detach(); (state.view === 'thumb' ? $grid : $list).after($sentinel); }
		};

		const hasNext = (res, len) => {
			if (!res)
				return len === state.pageSize;
			if (typeof res.hasNext !== 'undefined')
				return !!res.hasNext;
			if (typeof res.last !== 'undefined')
				return !res.last;
			if (typeof res.isLast !== 'undefined')
				return !res.isLast;
			const total = parseInt(res.totalCount || res.total, 10);
			if (!isNaN(total))
				return (state.page * state.pageSize) < total;
			return len === state.pageSize;
		};

		const readFilters = () => {
			state.cond = $screen.find('#searchCondition').val() || '0';
			state.kw = $.trim($screen.find('#searchKeyword').val() || '');
			state.sort = $screen.find('#sort').val() || '';

			const $rMin = $screen.find('#rMin'), $rMax = $screen.find('#rMax');
			const MAX = Number($screen.data('maxprice') || $rMax.attr('max') || 2000000);
			const MIN = 0;

			let minStr = ($screen.find('#minPrice').val() ?? '').toString();
			let maxStr = ($screen.find('#maxPrice').val() ?? '').toString();

			if (!minStr) minStr = ($rMin.val() ?? '').toString();
			if (!maxStr) maxStr = ($rMax.val() ?? '').toString();

			let min = parseInt(App.digits(minStr) || MIN, 10);
			let max = parseInt(App.digits(maxStr) || MAX, 10);

			if (!Number.isFinite(min)) min = MIN;
			if (!Number.isFinite(max)) max = MAX;
			if (min > max) { const t = min; min = max; max = t; }

			state.minPrice = min;
			state.maxPrice = max;
		};

		const load = () => {
			if (state.loading || state.done || paused) return;
			safeAbort(listXhr);
			state.loading = true; pause();

			const myKey = reqKey;
			$load.text('불러오는 중...').show(); $eol.hide();

			const p = {
				currentPage: state.page,
				pageSize: state.pageSize,
				searchCondition: state.cond,
				searchKeyword: state.kw,
				sort: state.sort
			};

			const priceKeysMin = ['minPrice', 'priceMin', 'min', 'min_price', 'startPrice', 'priceFrom'];
			const priceKeysMax = ['maxPrice', 'priceMax', 'max', 'max_price', 'endPrice', 'priceTo'];
			if (state.minPrice != null) priceKeysMin.forEach(k => p[k] = state.minPrice);
			if (state.maxPrice != null) priceKeysMax.forEach(k => p[k] = state.maxPrice);

			listXhr = $.getJSON(apiUrl(p))
				.done((res) => {
					if (myKey !== reqKey) return;
					const list = (res && res.list) ? res.list : [];
					if (!list.length) {
						if (state.page === 1) { $list.empty(); $grid.empty(); $eol.text('검색 결과가 없습니다.'); }
						state.done = true; $eol.show();
						return;
					}
					append(list);
					state.page++;
					state.done = !hasNext(res, list.length);
					if (state.done) $eol.show();
				})
				.fail((x) => {
					if (x && x.statusText === 'abort')
						return;
					if (myKey !== reqKey)
						return;
					if (state.page === 1) {
						state.done = true; $eol.text('목록을 불러오지 못했습니다.').show();
					}
				})
				.always(() => {
					if (myKey === reqKey) {
						state.loading = false; resume(); $load.hide();
					}
				});
		};

		const tryLoad = App.debounce(() => { if (!state.loading && !state.done) load(); }, 120);
		const observe = () => {
			$(w).off(NS_INF).on('scroll' + NS_INF + ' resize' + NS_INF, tryLoad);
			if (io) {
				try {
					io.disconnect();

				} catch (_) {
				} io = null;
			}

			try {
				io = new IntersectionObserver((ents) => {
					if (paused || state.loading || state.done)
						return;

					if (ents.some((e) => e.isIntersecting)) load();
				},
					{
						root: null, rootMargin: '240px 0px 240px 0px', threshold: 0.01
					});
				if ($sentinel[0]) io.observe($sentinel[0]);
			} catch (_) {
			}
			load();
		};

		const syncViewToggle = () => {
			const isThumb = (state.view === 'thumb');
			$screen.find('#btnListView').toggleClass('is-active', !isThumb).attr('aria-pressed', String(!isThumb));
			$screen.find('#btnThumbView').toggleClass('is-active', isThumb).attr('aria-pressed', String(isThumb));
		};

		const switchViewTo = (v) => {
			if (state.view === v) return;
			state.view = v; state.pageSize = pageSizeFor(state.view);

			const $wrapList = $screen.find('#listTableWrap');
			const $gridBody = $screen.find('#gridBody');

			$wrapList.addClass('nv-hide').attr('aria-hidden', 'true');
			$gridBody.addClass('nv-hide').attr('aria-hidden', 'true').css('display', '');

			if (v === 'list') $wrapList.removeClass('nv-hide').attr('aria-hidden', 'false');
			else $gridBody.removeClass('nv-hide').attr('aria-hidden', 'false');

			syncViewToggle();
			setTimeout(() => {
				if (state.view === 'list') { $wrapList.removeClass('nv-hide').attr('aria-hidden', 'false'); $gridBody.addClass('nv-hide').attr('aria-hidden', 'true'); }
				else { $gridBody.removeClass('nv-hide').attr('aria-hidden', 'false'); $wrapList.addClass('nv-hide').attr('aria-hidden', 'true'); }
			}, 0);
			reset();
		};

		const reset = () => {
			safeAbort(listXhr); reqKey++;
			pick();
			state.page = 1; state.done = false; state.loading = false;
			readFilters();
			$list.empty(); $grid.empty(); $eol.hide(); $load.hide();
			observe();
		};

		(function() {
			const $kw = $screen.find('#searchKeyword'), $box = $screen.find('#acList'); let acSel = -1;
			const renderAC = (items) => {
				if (!items || !items.length) { $box.empty().hide(); return; }
				const html = items.slice(0, 10).map((v, i) => `<div class="ac-item${i === acSel ? ' active' : ''}" data-i="${i}">${App.esc(v)}</div>`).join('');
				$box.html(html).show().width($kw.outerWidth());
			};
			const fetchAC = App.debounce(() => {
				const v = $.trim($kw.val() || ''); if (v.length < 1) { $box.empty().hide(); return; }
				try { if (acXhr && acXhr.readyState !== 4) acXhr.abort(); } catch (_) { }
				const tSel = $screen.find('#searchCondition').val() || 'prodName';
				const type = (tSel === 'prodDetail') ? 'prodDetail' : 'prodName';
				acXhr = $.getJSON(acUrl(type, v)).done((res) => { renderAC((res && res.items) || []); acSel = -1; });
			}, 120);

			$screen.on('input' + NS + ' focus' + NS, '#searchKeyword', fetchAC);
			$screen.on('blur' + NS, '#searchKeyword', () => setTimeout(() => $box.hide(), 150));
			$screen.on('keydown' + NS, '#searchKeyword', (e) => {
				const max = $box.children().length - 1;
				if (max < 0) {
					if (e.key === 'Enter') reset();
					return;
				}
				if (e.key === 'ArrowDown') {
					acSel = Math.min(max, acSel + 1);
					$box.children().removeClass('active').eq(acSel).addClass('active');
					e.preventDefault();
				}
				else if
					(e.key === 'ArrowUp') {
					acSel = Math.max(0, acSel - 1);
					$box.children().removeClass('active').eq(acSel).addClass('active');
					e.preventDefault();
				}
				else if
					(e.key === 'Enter') {
					if (acSel >= 0) {
						$kw.val($box.children().eq(acSel).text());
						$box.hide(); reset();
					} else {
						reset();
					}
				}
				else if
					(e.key === 'Escape') {
					$box.hide();
				}
			});
			$screen.on('mousedown' + NS, '.ac-item', function() {
				$kw.val($(this).text());
				$box.hide();
				reset();
			});
			$(d).on('mousedown' + NS, (e) => {
				if (!$(e.target).closest('.ac-wrap').length) $box.hide();
			});
		})
			();

		$screen.off(NS);
		setupPriceSlider();

		$screen.on('click' + NS, '#btnListView', () => switchViewTo('list'));
		$screen.on('click' + NS, '#btnThumbView', () => switchViewTo('thumb'));
		$screen.on('keydown' + NS, '.seg', (e) => {
			if (e.key === 'ArrowRight' && state.view !== 'thumb') $screen.find('#btnThumbView').trigger('click');
			if (e.key === 'ArrowLeft' && state.view !== 'list') $screen.find('#btnListView').trigger('click');
		});

		$screen.on('click' + NS, '#btnSearch', reset);
		$screen.on('click' + NS, '#btnAll', () => {
			$screen.find('#searchCondition').val('0');
			$screen.find('#searchKeyword').val('');
			$screen.find('#sort').val('');
			$screen.find('#minPrice').val('');
			$screen.find('#maxPrice').val('');
			$screen.find('.sort-btn').removeClass('active');
			$screen.trigger('nv:price:reset'); reset();
		});

		$screen.on('click' + NS, '.sort-btn', function() {
			$screen.find('.sort-btn').removeClass('active');
			$(this).addClass('active');
			$screen.find('#sort').val($(this).data('sort') || '');
			reset();
		});

		$screen.on('click' + NS, '.prod-link', function() {
			const no = $(this).data('prodno');
			const part = `${ctx()}/product/getProduct?prodNo=${encodeURIComponent(no)} .container:first`;
			if (w.__layout && __layout.loadMain) __layout.loadMain(part);
			else location.href = `${ctx()}/product/getProduct?prodNo=${encodeURIComponent(no)}`;
		});

		$screen.on('click' + NS, '.btn-buy', function() {
			const $btn = $(this), $row = $btn.closest('[data-prodno]');
			const stock = parseInt(($btn.attr('data-stock') ?? $row.attr('data-stock') ?? '0'), 10);
			if (!Number.isFinite(stock) || stock <= 0) { alert('품절된 상품입니다.'); return; }
			const no = $btn.attr('data-prodno') || $row.attr('data-prodno');
			const part = `${ctx()}/purchase/addPurchase?prodNo=${encodeURIComponent(no)} .container:first`;
			if (w.__layout && __layout.loadMain) __layout.loadMain(part);
			else location.href = `${ctx()}/purchase/addPurchase?prodNo=${encodeURIComponent(no)}`;
		});

		pick(); (function sync() {
			const isThumb = (state.view === 'thumb');
			$screen.find('#btnListView').toggleClass('is-active', !isThumb).attr('aria-pressed', String(!isThumb));
			$screen.find('#btnThumbView').toggleClass('is-active', isThumb).attr('aria-pressed', String(isThumb));
		})
			();
		reset();
	}

	$(d).on('view:afterload', (_e, payload) => {
		if (payload && payload.page === 'product-search') init();
	});
	$(() => {
		if ($(S).length) init();
	});

})(window, document, window.jQuery);
