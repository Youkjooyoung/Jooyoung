(function(w, $, d) {
	'use strict'; if (!$) return;

	function ensureReasonModal() {
		var $dlg = $('#reasonViewDlg');
		if ($dlg.length) return $dlg;
		$dlg = $(
			'<div id="reasonViewDlg" class="dlg-mask" role="dialog" aria-modal="true" aria-label="취소 사유">' +
			'<div class="dlg">' +
			'<div class="dlg-hd">취소 사유</div>' +
			'<div class="dlg-bd"><div class="reason-ct" style="white-space:pre-wrap;min-height:80px;"></div></div>' +
			'<div class="dlg-ft"><button type="button" class="ct_btn01 dlg-close">닫기</button></div>' +
			'</div>' +
			'</div>'
		).appendTo('body');
		$dlg.on('click', '.dlg-close', function() { $dlg.hide(); });
		return $dlg;
	}

	// [사유보기] - 서버에서 내려준 data-reason을 우선 사용
	$(d).off('click', '.btn-reason').on('click', '.btn-reason', function(e) {
		e.preventDefault(); e.stopPropagation();

		var $btn = $(this);
		var txt = ($btn.data('reason') || '').toString().trim();

		// 혹시 비어있다면(이전 데이터 등) 행의 data-tranno로 fallback해서 로컬스토리지/쿠키 조회 (선택)
		if (!txt) {
			var tranNo = $btn.data('tranno') || $btn.closest('tr').data('tranno');
			if (tranNo) {
				try { txt = localStorage.getItem('cr:' + tranNo) || ''; } catch (_) { }
				if (!txt) {
					var m = document.cookie.match(new RegExp('(?:^|; )' + ('cr_' + tranNo).replace(/([.$?*|{}\[\]\(\)\\\/\+^])/g, '\\$1') + '=([^;]*)'));
					txt = m ? decodeURIComponent(m[1]) : '';
				}
			}
		}

		if (!txt) txt = '(저장된 사유가 없습니다)';
		var $dlg = ensureReasonModal();
		$dlg.find('.reason-ct').text(txt);
		$dlg.show();
	});

})(window, window.jQuery, document);
