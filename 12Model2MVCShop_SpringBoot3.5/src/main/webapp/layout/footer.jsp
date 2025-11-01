<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>

<c:set var="ctx" value="${pageContext.request.contextPath}" />

<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<script src="https://cdn.tailwindcss.com?plugins=forms,typography"></script>
<script>
	tailwind.config = {
		theme : {
			extend : {
				colors : {
					naver : {
						green : '#03c75a',
						dark : '#02b857',
						gray : {
							50 : '#f7f8f9',
							100 : '#f0f2f4',
							200 : '#e5e8eb',
							400 : '#98a2b3'
						}
					}
				},
				borderRadius : {
					nv : '12px'
				},
				boxShadow : {
					nv : '0 4px 14px rgba(0,0,0,.06)'
				}
			}
		}
	};
</script>
</head>
<body class="bg-white" data-ctx="${ctx}">
	<div class="nv-footer border-t border-naver-gray-200 mt-10">
		<div
			class="nv-footer-inner container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-6 text-sm text-gray-700">
			<!-- 브랜드 섹션 -->
			<div class="footer-col space-y-1">
				<div class="footer-title text-naver-green font-bold text-lg">Model2
					MVC Shop</div>
				<div class="footer-text text-gray-600">Smart Code, Better
					Shopping</div>
				<div class="footer-text text-gray-600">MVC Inside, Simplicity
					Outside</div>
			</div>

			<!-- 고객센터 -->
			<div class="footer-col">
				<div class="footer-title text-naver-green font-bold mb-2">고객센터</div>
				<ul class="footer-list space-y-1 text-gray-700">
					<li><span class="cursor-pointer hover:text-naver-green"
						data-footer-nav="faq">FAQ</span></li>
					<li><span class="cursor-pointer hover:text-naver-green"
						data-footer-nav="notice">공지사항</span></li>
					<li><span class="cursor-pointer hover:text-naver-green"
						data-footer-nav="policy">이용약관</span></li>
					<li><span class="cursor-pointer hover:text-naver-green"
						data-footer-nav="privacy">개인정보처리방침</span></li>
				</ul>
			</div>

			<!-- 문의/운영정보 -->
			<div class="footer-col space-y-1">
				<div class="footer-title text-naver-green font-bold mb-2">문의</div>
				<div class="footer-text">이메일: support@example.com</div>
				<div class="footer-text">운영시간: 10:00 ~ 18:00 (주말/공휴일 제외)</div>
			</div>

		</div>
		<div
			class="footer-bottom text-center text-xs text-gray-500 border-t border-naver-gray-200 py-4 bg-naver-gray-50">
			© ${year} Model2 MVC Shop. All rights reserved.</div>
	</div>
</body>
</html>