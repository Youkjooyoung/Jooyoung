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
	    return "/".equals(uri)
	        || uri.contains("/index.jsp")
	        || uri.startsWith("/layout/")
	        || uri.contains("/user/login")
	        || uri.contains("/user/addUser")
	        || uri.contains("/user/checkDuplication")
	        || uri.contains("/user/kakao/")
	        || uri.contains("/user/google/")
	        || uri.contains("/user/logout")
	        || uri.contains("/user/json/logout")
	        || uri.contains("/user/json/me")
	        || uri.startsWith("/api/products")
	        || uri.startsWith("/css/")
	        || uri.startsWith("/images/")
	        || uri.startsWith("/javascript/")
	        || uri.startsWith("/upload/");
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
		HttpSession session = req.getSession(false);
		String uri = req.getRequestURI();

		if (isWhitelist(uri))
			return true;

		User user = (session != null) ? (User) session.getAttribute("user") : null;

		if (user != null) {
			if (uri.contains("addUser") || uri.contains("login") || uri.contains("checkDuplication")) {
				req.getRequestDispatcher("/index.jsp").forward(req, res);
				return false;
			}
			return true;
		}

		if (isAjax(req)) {
			res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			res.setContentType("application/json;charset=UTF-8");
			res.getWriter().write("{\"success\":false,\"message\":\"UNAUTHORIZED\"}");
			return false;
		}

		req.getRequestDispatcher("/index.jsp").forward(req, res);
		return false;
	}
}
