package com.model2.mvc.common.web;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.model2.mvc.service.domain.User;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class LogonCheckInterceptor implements HandlerInterceptor {

	private boolean isAjax(HttpServletRequest req) {
		String xrw = req.getHeader("X-Requested-With");
		String accept = req.getHeader("Accept");
		return "XMLHttpRequest".equalsIgnoreCase(xrw)
				|| (accept != null && accept.contains("application/json"));
	}

	private boolean isWhitelist(String uri) {
		return
			// === 공통 접근 허용 JSP ===
			uri.contains("/index.jsp") ||
			uri.contains("/layout/top.jsp") ||
			uri.contains("/layout/left.jsp") ||

			// === 사용자 관련 ===
			uri.contains("/user/login") ||
			uri.contains("/user/addUser") ||
			uri.contains("/user/checkDuplication") ||
			uri.contains("/user/kakao/callback") ||
			uri.contains("/user/google/callback") ||
			uri.contains("/user/logout") ||
			uri.contains("/user/json/logout") ||

			// ✅ 로그인 확인용 Ajax 허용
			uri.contains("/user/json/me") ||

			// ✅ 메인화면 추천상품 Ajax 허용
			uri.contains("/api/products/list") ||

			// === 정적 리소스 ===
			uri.contains("/user/onboard") ||
			uri.startsWith("/css/") ||
			uri.startsWith("/images/") ||
			uri.startsWith("/javascript/") ||
			uri.startsWith("/upload/");
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
		HttpSession session = req.getSession(false);
		String uri = req.getRequestURI();

		if (isWhitelist(uri))
			return true;

		User user = (session != null) ? (User) session.getAttribute("user") : null;

		// 로그인 상태
		if (user != null) {
			if (uri.contains("addUser") || uri.contains("login") || uri.contains("checkDuplication")) {
				req.getRequestDispatcher("/index.jsp").forward(req, res);
				return false;
			}
			return true;
		}

		// 비로그인 + Ajax 요청
		if (isAjax(req)) {
			res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			res.setContentType("application/json;charset=UTF-8");
			res.getWriter().write("{\"success\":false,\"message\":\"UNAUTHORIZED\"}");
			return false;
		}

		// 비로그인 + 일반 요청
		req.getRequestDispatcher("/index.jsp").forward(req, res);
		return false;
	}
}
