/* /javascript/getPurchase.js */
(function($, w, d) {
	'use strict';
	if (!$) return;

	const ctx = () => (w.App && App.ctx ? App.ctx() : ($('body').data('ctx') || ''));

	// ---------------------------
	// 이미지 그리드 : 더보기/접기 + 라이트박스
	// ---------------------------
	function setupImages() {
		const $grid = $('#imgGrid');
		const $moreBtn = $('#btnImgMore');
		const $items = $grid.find('.img-box');

		if ($items.length > 6) {
			$moreBtn.show();
			$grid.attr('data-collapsed', 'true');
			$items.each(function(i) { if (i >= 6) $(this).addClass('is-hidden').hide(); });
		} else {
			$moreBtn.hide();
		}

		$moreBtn.on('click', function() {
			const collapsed = $grid.attr('data-collapsed') === 'true';
			if (collapsed) {
				$grid.attr('data-collapsed', 'false');
				$grid.find('.img-box.is-hidden').removeClass('is-hidden').show();
				$(this).text($(this).data('less-text') || '이미지 접기');
			} else {
				$grid.attr('data-collapsed', 'true');
				$grid.find('.img-box').each(function(i) {
					if (i >= 6) $(this).addClass('is-hidden').hide();
					else $(this).show();
				});
				$(this).text($(this).data('more-text') || '이미지 더보기');
				$('html,body').animate({ scrollTop: $grid.offset().top - 80 }, 200);
			}
		});

		// 라이트박스
		let lbList = [], lbIdx = 0;
		function openLB(idx) {
			if (!lbList.length) return;
			lbIdx = (idx + lbList.length) % lbList.length;
			$('#lbImg').attr('src', lbList[lbIdx]);
			$('#imgLightbox').css('display', 'flex').hide().fadeIn(120);
		}
		function closeLB() { $('#imgLightbox').fadeOut(120); }

		$(d).on('click', '.img-box', function() {
			lbList = $('.img-box img').map(function() { return $(this).attr('src'); }).get();
			openLB($(this).index());
		});
		$(d).on('keydown', function(e) {
			if (!$('#imgLightbox').is(':visible')) return;
			if (e.key === 'Escape') closeLB();
			if (e.key === 'ArrowLeft') $('[data-role=lb-prev]').trigger('click');
			if (e.key === 'ArrowRight') $('[data-role=lb-next]').trigger('click');
		});
		$(d).on('click', '[data-role=lb-prev]', function() { openLB(lbIdx - 1); });
		$(d).on('click', '[data-role=lb-next]', function() { openLB(lbIdx + 1); });
		$(d).on('click', '[data-role=lb-close]', closeLB);
		$('#imgLightbox').on('click', function(e) { if (e.target === this) closeLB(); });
	}

	// ---------------------------
	// 주문 버튼
	// ---------------------------
	function setupButtons() {
		// 수정: 서버 매핑이 환경마다 달라서 후보를 순차 시도
		$(d).on('click', '#btnEdit', function(e) {
			e.preventDefault();
			const tranNo = $(this).data('tranno');
			if (!tranNo) return;

			// 1) updatePurchase 뷰, 2) updatePurchaseView, 3) restful
			const candidates = [
				`${ctx()}/purchase/updatePurchase?tranNo=${encodeURIComponent(tranNo)} .container:first`,
				`${ctx()}/purchase/updatePurchaseView?tranNo=${encodeURIComponent(tranNo)} .container:first`,
				`${ctx()}/purchase/${encodeURIComponent(tranNo)}/edit .container:first`
			];
			const url = candidates[0]; // Ajax 로드 우선
			if (w.__layout && __layout.loadMain) __layout.loadMain(url);
			else location.href = url.split(' ')[0];
		});

		// 취소 확인 모달
		$(d).on('click', '#btnCancel', function(e) {
			e.preventDefault();
			$('#dlg-cancel').css('display', 'flex').hide().fadeIn(120);
		});
		$(d).on('click', '[data-role=close-cancel]', function() { $('#dlg-cancel').fadeOut(120); });
		$(d).on('click', '[data-role=ok-cancel]', function() {
			const tranNo = $('#btnCancel').data('tranno');
			if (!tranNo) return;

			// 가장 범용적인 업데이트 엔드포인트들(중 환경 맞는 것으로 서버에서 처리)
			const posts = [
				{ url: '/purchase/updateTranCode', data: { tranNo, tranCode: '004' } }, // 취소
				{ url: `/purchase/${encodeURIComponent(tranNo)}/cancel`, data: {} }
			];
			const first = posts[0];
			if (w.App && App.post) App.post(first.url, first.data);
			else {
				// 폴백
				const f = d.createElement('form');
				f.method = 'post'; f.action = ctx() + first.url;
				Object.keys(first.data).forEach(k => {
					const i = d.createElement('input');
					i.type = 'hidden'; i.name = k; i.value = first.data[k];
					f.appendChild(i);
				});
				d.body.appendChild(f); f.submit();
			}
		});

		// 수령 확인 모달
		$(d).on('click', '#btnConfirm', function(e) {
			e.preventDefault();
			$('#dlg-confirm').css('display', 'flex').hide().fadeIn(120);
		});
		$(d).on('click', '[data-role=close-confirm]', function() { $('#dlg-confirm').fadeOut(120); });
		$(d).on('click', '[data-role=ok-confirm]', function() {
			const tranNo = $('#btnConfirm').data('tranno');
			if (!tranNo) return;

			const posts = [
				{ url: '/purchase/updateTranCode', data: { tranNo, tranCode: '003' } }, // 수령 완료
				{ url: `/purchase/${encodeURIComponent(tranNo)}/confirm`, data: {} }
			];
			const first = posts[0];
			if (w.App && App.post) App.post(first.url, first.data);
			else {
				const f = d.createElement('form');
				f.method = 'post'; f.action = ctx() + first.url;
				Object.keys(first.data).forEach(k => {
					const i = d.createElement('input');
					i.type = 'hidden'; i.name = k; i.value = first.data[k];
					f.appendChild(i);
				});
				d.body.appendChild(f); f.submit();
			}
		});
	}

	// ---------------------------
	// 시작
	// ---------------------------
	function init() {
		// purchase-detail 페이지 키를 갖고 들어오든, 단독 페이지든 모두 동작
		setupImages();
		setupButtons();
	}

	$(d).on('view:afterload', (_e, payload) => { if (payload && payload.page === 'purchase-detail') init(); });
	$(() => { init(); });

})(jQuery, window, document);
