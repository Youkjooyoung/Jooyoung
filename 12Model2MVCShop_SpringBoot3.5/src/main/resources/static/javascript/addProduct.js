// /javascript/addProduct.js
((w, d, $) => {
	'use strict';
	if (!$) return;

	let inited = false;
	let editor = null;

	// ==============================
	// 1. ToastUI Editor 로더
	// ==============================
	const ensureToastUI = (cb) => {
		if (w.toastui && w.toastui.Editor) return cb();

		const l = d.createElement('link');
		l.rel = 'stylesheet';
		l.href = 'https://uicdn.toast.com/editor/latest/toastui-editor.min.css';
		d.head.appendChild(l);

		const s = d.createElement('script');
		s.src = 'https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js';
		s.onload = cb;
		d.head.appendChild(s);
	};

	// ==============================
	// 2. 초기화 함수
	// ==============================
	const init = () => {
		if (inited) return;
		inited = true;

		const $root = $('#mainArea [data-page="product-add"]');
		if (!$root.length) return;

		const CTX = $root.data('ctx') || $('body').data('ctx') || '';

		// ---- date utils ----
		const z2 = (n) => (n < 10 ? '0' : '') + n;
		const ymd = (y, m, d) => `${y}-${z2(m)}-${z2(d)}`;

		const parseYmd = (v) => {
			const t = String(v || '').replace(/\D/g, '');
			if (t.length !== 8) return null;
			const y = +t.slice(0, 4);
			const m = +t.slice(4, 6) - 1;
			const d = +t.slice(6, 8);
			const dt = new Date(y, m, d);
			return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d ? dt : null;
		};

		const setISO = ($input, iso) => {
			$input.val(iso);
			const $hidden = $root.find('#manuDateHidden');
			if ($hidden.length) $hidden.val(iso.replace(/-/g, ''));
		};

		const closePicker = () => {
			$('.nv-datepicker,.nv-dp-mask').remove();
			$(d).off('keydown.nvdp');
		};

		// ---- datepicker (네이버 스타일) ----
		const grid = (base, selISO) => {
			const y = base.getFullYear();
			const m = base.getMonth();
			const f = new Date(y, m, 1);
			const s = new Date(y, m, 1 - f.getDay());
			const days = ['일', '월', '화', '수', '목', '금', '토'];
			let html = '<div class="nv-dp-grid">';
			for (let i = 0; i < 7; i++) html += `<div class="nv-dp-cell is-dow">${days[i]}</div>`;
			const t = new Date();
			const tISO = ymd(t.getFullYear(), t.getMonth() + 1, t.getDate());

			for (let r = 0; r < 6; r++) {
				for (let c = 0; c < 7; c++) {
					const cur = new Date(s.getFullYear(), s.getMonth(), s.getDate() + r * 7 + c);
					const iso = ymd(cur.getFullYear(), cur.getMonth() + 1, cur.getDate());
					const cls =
						'nv-dp-cell' +
						(cur.getMonth() !== m ? ' is-muted' : '') +
						(iso === tISO ? ' is-today' : '') +
						(iso === selISO ? ' is-sel' : '');
					html += `<div class="${cls}" data-iso="${iso}" role="button" tabindex="0">${cur.getDate()}</div>`;
				}
			}
			html += '</div>';
			return html;
		};

		const openPicker = ($input) => {
			if (!$input || !$input.length) return;
			closePicker();

			let sel = $input.val();
			let base = parseYmd(sel) || new Date();

			const $mask = $('<div class="nv-dp-mask"></div>').appendTo('body');
			const $dp = $('<div class="nv-datepicker" role="dialog" aria-label="날짜 선택"></div>').appendTo('body');
			const $ttl = $('<div class="nv-dp-title"></div>');
			const $prev  = $('<button type="button" class="nv-dp-btn" aria-label="이전 달">‹</button>');
			const $today = $('<button type="button" class="nv-dp-btn" aria-label="오늘">오늘</button>');
			const $next  = $('<button type="button" class="nv-dp-btn" aria-label="다음 달">›</button>');
			const $nav = $('<div class="nv-dp-hd"></div>').append($prev, $today, $next);
			$dp.append($nav, $ttl);

			const render = () => {
				$ttl.text(`${base.getFullYear()}년 ${base.getMonth() + 1}월`);
				$dp.find('.nv-dp-grid').remove();
				$dp.append(grid(base, sel));
			};

			const rect = $input[0].getBoundingClientRect();
			const left = rect.left + (w.pageXOffset || d.documentElement.scrollLeft || 0);
			const top = rect.bottom + (w.pageYOffset || d.documentElement.scrollTop || 0) + 6;

			$dp.css({
			  position: 'absolute',
			  left: `${left}px`,
			  top: `${top}px`,
			  zIndex: 9999,
			  background: '#fff',
			  border: '1px solid #dfe3e6',
			  borderRadius: '12px',
			  boxShadow: '0 6px 20px rgba(0,0,0,.12)',
			  padding: '12px',
			  width: '320px',
			  fontFamily: "'Noto Sans KR', sans-serif",
			});

			$prev.on('click', () => {
				base = new Date(base.getFullYear(), base.getMonth() - 1, 1);
				render();
			});
			$next.on('click', () => {
				base = new Date(base.getFullYear(), base.getMonth() + 1, 1);
				render();
			});
			$today.on('click', () => {
				const t = new Date();
				base = new Date(t.getFullYear(), t.getMonth(), 1);
				render();

				setISO($input, ymd(t.getFullYear(), t.getMonth() + 1, t.getDate()));
				closePicker();
			});

			$dp.on('click', '.nv-dp-cell:not(.is-dow)', function() {
				sel = $(this).data('iso');
				setISO($input, sel);
				closePicker();
			});

			$mask.on('click', closePicker);
			$(d).on('keydown.nvdp', (e) => {
				if (e.which === 27) closePicker();
			});
			render();
		};

		// ---- datepicker 이벤트 ----
		$root.on('focus', '#manuDate', function() {
			openPicker($(this));
		});
		$root.on('click', '.nv-cal-btn', function() {
			openPicker($root.find('#manuDate'));
		});
		$root.on('change blur', '#manuDate', function() {
			const dt = parseYmd($(this).val());
			if (dt) setISO($(this), ymd(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()));
		});

		// ---- price format ----
		$root.off('keyup.price').on('keyup.price', '#price', function() {
			const raw = this.value.replace(/[^\d]/g, '');
			this.value = raw ? Number(raw).toLocaleString('ko-KR') : '';
		});

		// ---- image preview ----
		$root.on('change', '#uploadFiles', function() {
			const $preview = $root.find('#preview-container');
			$preview.empty();

			const files = this.files;
			if (!files || !files.length) return;

			const MAX_PER_ROW = 5;

			$.each(files, (i, f) => {
				if (!f.type.match(/^image\//)) return;
				const fr = new FileReader();

				fr.onload = (e) => {
					const $thumb = $(`
		        <div class="nv-thumb">
		          <img src="${e.target.result}" alt="미리보기 이미지">
		          <button type="button" title="삭제" class="nv-thumb-del">&times;</button>
		        </div>
		      `);
					$thumb.find('.nv-thumb-del').on('click', () => $thumb.remove());
					$preview.append($thumb);
				};
				fr.readAsDataURL(f);
			});
		});

		// ---- ToastUI Editor 초기화 ----
		if (w.toastui && w.toastui.Editor && $root.find('#editor').length) {
			editor = new toastui.Editor({
				el: d.querySelector('#editor'),
				height: '300px',
				initialEditType: 'wysiwyg',
				previewStyle: 'vertical',
				placeholder: '상품 상세내용을 입력하세요.',
			});
		}

		// ---- submit via REST ----
		$root.on('click', '#btnAdd', (e) => {
			e.preventDefault();

			const name = $root.find('#prodName').val().trim();
			const detail = editor && editor.getHTML ? editor.getHTML().trim() : '';
			const manu = $root.find('#manuDate').val().trim();
			const priceRaw = $root.find('#price').val().replace(/[^\d]/g, '');
			const stockQty = $root.find('#stockQty').val().trim();
			const files = $root.find('#uploadFiles')[0].files;

			const plainDetail = $('<div>').html(detail).text().trim();
			const detailLength = plainDetail.length;

			if (!name) return alert('상품명을 입력하세요.');
			if (!detail || detailLength < 20) return alert('상품상세정보를 최소 20자 이상 입력하세요.');
			if (!manu) return alert('제조일자를 선택하세요.');
			if (!priceRaw) return alert('가격을 입력하세요.');
			if (parseInt(priceRaw, 10) <= 0) return alert('가격은 0보다 커야 합니다.');
			if (!stockQty || isNaN(stockQty) || parseInt(stockQty, 10) <= 0)
				return alert('재고수량을 1개 이상 입력하세요.');
			if (!files || files.length === 0) return alert('대표 이미지를 1개 이상 첨부하세요.');

			if (!confirm('상품을 등록하시겠습니까?')) return;

			const fd = new FormData();
			fd.append('prodName', name);
			fd.append('prodDetail', detail);
			fd.append('manuDate', manu.replace(/\D/g, '').slice(0, 8));
			fd.append('price', priceRaw);
			fd.append('stockQty', stockQty);
			for (let i = 0; i < files.length; i++) fd.append('uploadFiles', files[i]);

			$.ajax({
				url: `${CTX}/api/products`,
				method: 'POST',
				data: fd,
				processData: false,
				contentType: false,
			})
				.done((p) => {
					if (p && p.prodNo) {
						location.href = `${CTX}/product/getProduct?prodNo=${p.prodNo}`;
					} else {
						alert('등록은 되었으나 상품번호를 받지 못했습니다. 목록으로 이동합니다.');
						location.href = `${CTX}/product/listProduct`;
					}
				})
				.fail((xhr) => {
					alert(`등록 실패 (${xhr.status})`);
				});
		});
	};

	// ==============================
	// 3. SPA용 로딩 이벤트
	// ==============================
	$(d).on('view:afterload', (_e, payload) => {
		if (payload && payload.page === 'product-add') {
			ensureToastUI(init);
		}
	});

	$(() => {
		if ($('#mainArea [data-page="product-add"]').length) {
			ensureToastUI(init);
		}
	});
})(window, document, window.jQuery);
