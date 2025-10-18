// /javascript/home.js
(function(w, d, $) {
	'use strict';
	if (!$) return;

	// Slick 의존(외부 CDN) - 필요한 시점에만 초기화
	function ensureSlickThen(init) {
		if ($.fn.slick) { init(); return; }
		const add = (tag) => document.head.appendChild(tag);

		const l1 = document.createElement('link');
		l1.rel = 'stylesheet';
		l1.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css';
		add(l1);

		// 테마 CSS(도트/화살표)
		const l2 = document.createElement('link');
		l2.rel = 'stylesheet';
		l2.href = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css';
		add(l2);

		const s1 = document.createElement('script');
		s1.src = 'https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js';
		s1.onload = init;
		add(s1);
	}

	function initHome($root) {
		const CTX = $('body').data('ctx') || '';
		const $slider = $root.find('.product-slider');
		if (!$slider.length) return;

		// 혹시 재초기화 상황 대비
		if ($slider.hasClass('slick-initialized')) {
			try { $slider.slick('unslick'); } catch (_) { }
		}
		$slider.empty();

		$.getJSON(CTX + '/api/products?currentPage=1&pageSize=8')
			.done(function(res) {
				if (!(res && res.list && res.list.length)) {
					$slider.append('<p class="text-muted">추천 상품이 없습니다.</p>');
					return;
				}

				res.list.forEach(function(p) {
					const file = p.fileName ? encodeURIComponent(p.fileName) : 'noimage.png';
					const src = CTX + '/images/uploadFiles/' + file;
					const svgMarkup =
					  `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
					    <rect width="100%" height="100%" fill="#f8f9fa"/>
					    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
					          font-family="Arial" font-size="16" fill="#adb5bd">no image</text>
					   </svg>`;

					const onerr = "this.onerror=null;this.src='data:image/svg+xml;utf8," +
					  encodeURIComponent(svgMarkup) + "';";

					const card = $('<div class="product-card" />')
						.attr('data-prodno', p.prodNo || '')
						.append($('<img/>', { src: src, alt: p.prodName || '', onerror: onerr }))
						.append($('<div class="name"/>').text(p.prodName || ''))
						.append($('<div class="price"/>').text((p.price || 0).toLocaleString('ko-KR') + '원'));

					$slider.append(card);
				});

				// 카드 클릭 → 상세
				$slider.on('click', '.product-card', function () {
				  const no  = $(this).data('prodno');
				  const url = `${CTX}/product/getProduct?prodNo=${encodeURIComponent(no)}`;
				  const partial = `${url} .container:first`;
				  if (window.__layout && __layout.loadMain) __layout.loadMain(partial);
				  else location.href = url;
				});


				ensureSlickThen(function() {
					$slider.slick({
						centerMode: true,
						slidesToShow: 4,         // 넓은 화면 4열
						slidesToScroll: 1,
						infinite: true,
						autoplay: true,
						autoplaySpeed: 5000,
						arrows: true,
						dots: true,
						waitForAnimate: false,
						responsive: [
							{ breakpoint: 1280, settings: { slidesToShow: 3 } },
							{ breakpoint: 900, settings: { slidesToShow: 2 } },
							{ breakpoint: 600, settings: { slidesToShow: 1 } }
						]
					});
				});
			})
			.fail(function() {
				$slider.append('<p class="text-red">추천 상품을 불러오지 못했습니다.</p>');
			});
	}

	// 뷰 로드 후 훅
	$(document).on('view:afterload', function(_e, payload) {
		const $main = payload && payload.$main ? payload.$main : $('#mainArea');
		const $home = $main.find('[data-page="home"], [data-view="home"]');
		if ($home.length) initHome($home);
	});

	// 최초 진입
	$(function() {
		const $home = $('#mainArea').find('[data-page="home"], [data-view="home"]');
		if ($home.length) initHome($home);
	});
})(window, document, window.jQuery);
