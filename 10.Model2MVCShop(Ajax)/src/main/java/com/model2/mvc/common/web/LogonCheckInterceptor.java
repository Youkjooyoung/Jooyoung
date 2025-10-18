package com.model2.mvc.common.web;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import com.model2.mvc.service.domain.User;

@Component
public class LogonCheckInterceptor extends HandlerInterceptorAdapter {

    private boolean isAjax(HttpServletRequest req) {
        String xrw = req.getHeader("X-Requested-With");
        String accept = req.getHeader("Accept");
        return "XMLHttpRequest".equalsIgnoreCase(xrw) || (accept != null && accept.contains("application/json"));
    }

    private boolean isWhitelist(String uri) {
        return uri.contains("/index.jsp")
            || uri.contains("/layout/top.jsp")
            || uri.contains("/layout/left.jsp")
            || uri.contains("/user/login")
            || uri.contains("/user/addUser")
            || uri.contains("/user/checkDuplication")
            || uri.contains("/user/kakao/callback")
            || uri.contains("/user/google/callback")
            || uri.contains("/user/logout")
            || uri.contains("/user/json/logout")
            || uri.contains("/user/onboard")
            || uri.startsWith("/css/") 
            || uri.startsWith("/images/") 
            || uri.startsWith("/javascript/")
            || uri.startsWith("/upload/");
    }

    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res, Object handler) throws Exception {
        HttpSession session = req.getSession(false);
        String uri = req.getRequestURI();

        // 화이트리스트는 무조건 통과
        if (isWhitelist(uri)) return true;

        User user = (session != null) ? (User) session.getAttribute("user") : null;

        if (user != null) {
            // 로그인 사용자는 회원가입/로그인 페이지 재진입만 차단
            if (uri.contains("addUser") || uri.contains("login") || uri.contains("checkDuplication")) {
                req.getRequestDispatcher("/index.jsp").forward(req, res);
                return false;
            }
            return true;
        }

        // 미로그인 + Ajax이면 401
        if (isAjax(req)) {
            res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            res.setContentType("application/json;charset=UTF-8");
            res.getWriter().write("{\"success\":false,\"message\":\"UNAUTHORIZED\"}");
            return false;
        }

        // 미로그인 + 일반요청이면 인덱스로
        req.getRequestDispatcher("/index.jsp").forward(req, res);
        return false;
    }
}

