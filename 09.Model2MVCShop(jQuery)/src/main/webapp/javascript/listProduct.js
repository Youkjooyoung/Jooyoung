// /javascript/listProduct.js
(function($, w, d) {
	'use strict'; if (!$) return;

	function collect(reset) {
		if (reset) return { currentPage: 1, searchCondition: '0', searchKeyword: '', pageSize: $('#pageSize').val() || 10, sort: '' };
		return {
			currentPage: 1,
			searchCondition: $('#searchCondition').val() || '0',
			searchKeyword: $.trim($('#searchKeyword').val() || ''),
			pageSize: $('#pageSize').val() || 10,
			sort: $('#sort').val() || ''
		};
	}
	function move(page, reset) { var p = collect(reset); p.currentPage = page || 1; App.go('/product/listProduct', p); }

	$(d)
		.on('click', '#btnSearch', function(e) {
			e.preventDefault();
			var cond = $('#searchCondition').val(), kw = $.trim($('#searchKeyword').val() || '');
			if (cond !== '0' && !kw) { alert('검색어를 입력하세요.'); return; }
			move(1, false);
		})
		.on('keydown', '#searchKeyword', function(e) { if (e.which === 13) { e.preventDefault(); $('#btnSearch').click(); } })
		.on('click', '#btnAll', function(e) { e.preventDefault(); move(1, true); })
		.on('change', '#pageSize', function() { move(1, false); })
		.on('click', '.sort-btn', function() { $('#sort').val($(this).data('sort')); move(1, false); })
		.on('click', '.prod-link', function() { var no = $(this).data('prodno'); if (no) App.go('/product/getProduct', { prodNo: no }); })
		.on('click', '.btn-buy', function() { var no = $(this).data('prodno'); if (no) App.go('/purchase/add', { prodNo: no }); })

		// Hover 썸네일
		.on('mouseenter', '.prod-link', function(e) {
			var name = $(this).data('filename'); if (!name) return;
			var path = App.ctx() + '/upload/uploadFiles/' + encodeURIComponent(name);
			$('#hoverThumb').html('<img src="' + path + '" width="150" height="150" alt="thumbnail">')
				.css({ top: e.pageY + 15, left: e.pageX + 15, display: 'block' });
		})
		.on('mousemove', '.prod-link', function(e) { $('#hoverThumb').css({ top: e.pageY + 15, left: e.pageX + 15 }); })
		.on('mouseleave', '.prod-link', function() { $('#hoverThumb').hide().empty(); })

		.on('click', '.page-link', function() {
			if ($(this).hasClass('disabled')) return;
			var p = parseInt($(this).data('page'), 10);
			if (p) move(p, false);
		});

	// pageNavigator.jsp 에서 호출
	w.fncGetUserList = function(page) { move(page || 1, false); };
})(jQuery, window, document);
