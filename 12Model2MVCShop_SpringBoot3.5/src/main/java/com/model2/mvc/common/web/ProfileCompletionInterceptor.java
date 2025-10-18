package com.model2.mvc.common.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.user.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@Component
public class ProfileCompletionInterceptor implements HandlerInterceptor {

	@Autowired
	private UserService userService;

	private boolean isAjax(HttpServletRequest req) {
		String xrw = req.getHeader("X-Requested-With");
		String accept = req.getHeader("Accept");
		return "XMLHttpRequest".equalsIgnoreCase(xrw) || (accept != null && accept.contains("application/json"));
	}

	private boolean isOnboardingPath(String uri) {
		return uri.contains("/user/onboard");
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
		HttpSession session = req.getSession(false);
		String uri = req.getRequestURI();

		if (uri.contains("/purchase/product/") && uri.contains("/ack-cancel")) {
			return true;
		}

		if (session == null || session.getAttribute("user") == null) {
			if (isAjax(req)) {
				res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
				res.setContentType("application/json;charset=UTF-8");
				res.getWriter().write("{\"success\":false,\"redirect\":\"/user/loginView.jsp\"}");
				return false;
			}
			res.sendRedirect(req.getContextPath() + "/user/loginView.jsp");
			return false;
		}

		if (isOnboardingPath(uri))
			return true;

		User user = (User) session.getAttribute("user");
		if ("admin".equalsIgnoreCase(user.getRole())) {
			return true;
		}

		if (!userService.isProfileComplete(user)) {
			if (isAjax(req)) {
				res.setStatus(HttpServletResponse.SC_FORBIDDEN);
				res.setContentType("application/json;charset=UTF-8");
				res.getWriter().write("{\"success\":false,\"redirect\":\"/user/onboardView.jsp\"}");
				return false;
			}
			res.sendRedirect(req.getContextPath() + "/user/onboardView.jsp");
			return false;
		}
		return true;
	}
}
