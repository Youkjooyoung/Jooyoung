// /javascript/cancel-order.js
((w, d) => {
	'use strict';
	const $ = w.jQuery;
	if (!$) return;

	// ---------------- 공용 헬퍼 ----------------
	const ctx = () =>
		(w.App && App.ctx ? App.ctx() : d.body.getAttribute('data-ctx') || '');

	const setCookie = (k, v, days = 365) => {
		const ex = new Date();
		ex.setDate(ex.getDate() + days);
		document.cookie = `${k}=${encodeURIComponent(v)}; path=/; expires=${ex.toUTCString()}`;
	};

	// ---------------- 네이버 토스트 ----------------
	const nvToast = (msg) => {
		const $t = $('<div class="nv-toast"></div>')
			.text(msg)
			.appendTo('body')
			.css({
				position: 'fixed',
				left: '50%',
				bottom: '40px',
				transform: 'translateX(-50%)',
				background: '#03c75a',
				color: '#fff',
				padding: '12px 20px',
				borderRadius: '8px',
				boxShadow: '0 3px 10px rgba(0,0,0,.2)',
				zIndex: 99999,
				opacity: 0,
			})
			.animate({ opacity: 1 }, 180);

		setTimeout(() => {
			$t.fadeOut(300, () => $t.remove());
		}, 2200);
	};

	// ---------------- 네이버 Confirm ----------------
	const nvConfirm = (msg, onOk) => {
		let $dlg = $('#nvConfirmDialog');
		if (!$dlg.length) {
			const html = `
        <div id="nvConfirmDialog" class="dlg-mask" role="dialog" aria-modal="true" aria-label="확인창">
          <div class="dlg">
            <div class="dlg-hd">확인</div>
            <div class="dlg-bd"><p class="dlg-msg"></p></div>
            <div class="dlg-ft">
              <button type="button" class="ct_btn01 ok">확인</button>
              <button type="button" class="ct_btn01 cancel">취소</button>
            </div>
          </div>
        </div>`;
			$dlg = $(html).appendTo('body');
		}

		$dlg.find('.dlg-msg').text(msg);
		$dlg.fadeIn(120);

		$dlg.off('click.nv')
			.on('click.nv', '.ok', () => {
				$dlg.fadeOut(100);
				if (onOk) onOk();
			})
			.on('click.nv', '.cancel', () => $dlg.fadeOut(100))
			.on('click.nv', (e) => {
				if (e.target === e.currentTarget) $dlg.fadeOut(100);
			});
	};

	// ---------------- 주문취소 다이얼로그 ----------------
	const ensureDialog = () => {
		const $dlg = $('#cancelReasonDialog');
		if ($dlg.length) return $dlg;

		const html = `
      <div id="cancelReasonDialog" class="dlg-mask" role="dialog" aria-modal="true" aria-label="주문 취소 사유">
        <div class="dlg">
          <div class="dlg-hd">주문 취소 사유</div>
          <div class="dlg-bd">
            <textarea class="dlg-txt" placeholder="취소 사유를 입력하세요(필수)" rows="6" style="width:100%;"></textarea>
          </div>
          <div class="dlg-ft">
            <button type="button" class="ct_btn01 dlg-ok">확인</button>
            <button type="button" class="ct_btn01 dlg-cancel">닫기</button>
          </div>
        </div>
      </div>`;
		return $(html).appendTo('body');
	};

	const openCancelDialog = (tranNo, onDone) => {
		const $dlg = ensureDialog();
		const $txt = $dlg.find('.dlg-txt');
		try {
			$txt.val(localStorage.getItem(`cr:${tranNo}`) || '');
		} catch (_) { }

		$dlg.show();

		$dlg
			.off('click.dlg')
			.on('click.dlg', '.dlg-cancel', () => $dlg.hide())
			.on('click.dlg', '.dlg-ok', () => {
				const reason = $.trim($txt.val());
				if (!reason) {
					nvToast('취소 사유를 입력해 주세요.');
					$txt.focus();
					return;
				}
				try {
					localStorage.setItem(`cr:${tranNo}`, reason);
				} catch (_) { }
				setCookie(`cr_${tranNo}`, reason);
				$dlg.hide();
				if (onDone) onDone(reason);
			});
	};

	// ---------------- POST 전송 (form 생성) ----------------
	const postCancel = (url, data) => {
		const $f = $('<form>').css('display', 'none');
		$f.attr({ action: url, method: 'post' });
		$.each(data || {}, (k, v) => {
			$('<input type="hidden">').attr({ name: k, value: v }).appendTo($f);
		});
		$(d.body).append($f);
		$f[0].submit();
	};

	// ---------------- 버튼 이벤트 ----------------
	$(() => {
		$(d)
			.off('click', '#btnCancel')
			.on('click', '#btnCancel', (e) => {
				e.preventDefault();
				e.stopPropagation();

				const $btn = $(e.currentTarget);
				const tranNo = $btn.data('tranno') || $btn.data('tranNo');
				const url =
					$btn.data('url') || `${ctx()}/purchase/${encodeURIComponent(tranNo)}/cancel`;

				if (!tranNo) {
					nvToast('거래번호가 없습니다.');
					return;
				}

				openCancelDialog(tranNo, () => {
					nvConfirm('주문을 정말 취소하시겠습니까?', () => {
						let reason = '';
						try {
							reason = localStorage.getItem(`cr:${tranNo}`) || '';
						} catch (_) { }
						postCancel(url, { reason });
					});
				});
			});
	});
})(window, document);
