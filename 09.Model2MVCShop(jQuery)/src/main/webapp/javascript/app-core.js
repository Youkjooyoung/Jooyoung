// /javascript/app-core.js
(function(w, d, $) {
	'use strict';
	if (!$) return;

	function ctx() { return $('body').data('ctx') || $('base').attr('href') || ''; }
	function qs(p) { return $.param(p || {}); }
	function go(path, p) { w.location.href = ctx() + path + (p && Object.keys(p).length ? ('?' + qs(p)) : ''); }
	function post(path, p) {
		var $f = $('<form>').css('display', 'none');
		$f.attr('action', ctx() + path);
		$f.attr('method', 'post');
		$.each(p || {}, function(k, v) { $('<input>', { type: 'hidden', name: k, value: v }).appendTo($f); });
		$(d.body).append($f); $f.trigger('submit');
	}
	function ajaxPost(url, data) { return $.ajax({ url: ctx() + url, type: 'POST', data: data || {} }); }
	function popup(url, name, feat) {
		var u = url.indexOf('http') === 0 ? url : (ctx() + url);
		var wn; try { wn = w.open(u, name || '_blank', feat || 'width=900,height=650,scrollbars=yes,resizable=yes'); } catch (e) { }
		if (!wn || wn.closed || typeof wn.closed === 'undefined') { w.location.assign(u); } else { try { wn.focus(); } catch (_) { } }
		return wn;
	}
	function digits(s) { return (s || '').replace(/\D/g, ''); }
	function lock($btn, fn) {
		if ($btn.prop('disabled')) return;
		$btn.prop('disabled', true);
		try { fn && fn(); } finally { setTimeout(function() { $btn.prop('disabled', false); }, 300); }
	}

	w.App = { ctx: ctx, qs: qs, go: go, post: post, ajaxPost: ajaxPost, popup: popup, digits: digits, lock: lock };
})(window, document, window.jQuery);
