package com.model2.mvc.web.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CommonController {

	@Value("${kakao.clientId}")
	private String kakaoClientId;

	@Value("${kakao.logoutRedirectUri}")
	private String kakaoLogoutRedirectUri;

//	// ✅ index.jsp 기본 페이지
//	@GetMapping({ "/", "/index.jsp" })
//	public String index() {
//		return "index.jsp";
//	}

	// ✅ top.jsp (카카오 연동 데이터 전달)
	@GetMapping("/layout/top.jsp")
	public String top(Model model) {
		model.addAttribute("kakaoClientId", kakaoClientId);
		model.addAttribute("kakaoLogoutRedirectUri", kakaoLogoutRedirectUri);
		return "layout/top.jsp";
	}

	// ✅ left.jsp
	@GetMapping("/layout/left.jsp")
	public String left() {
		return "layout/left.jsp";
	}

	// ✅ main.jsp
	@GetMapping("/layout/home.fragment.jsp")
	public String main() {
		return "layout/home.fragment.jsp";
	}
}
