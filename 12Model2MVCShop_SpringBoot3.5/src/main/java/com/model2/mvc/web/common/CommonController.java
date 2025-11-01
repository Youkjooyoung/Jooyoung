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

	@GetMapping("/layout/top.jsp")
	public String top(Model model) {
		model.addAttribute("kakaoClientId", kakaoClientId);
		model.addAttribute("kakaoLogoutRedirectUri", kakaoLogoutRedirectUri);
		return "layout/top";
	}

	@GetMapping("/layout/left.jsp")
	public String left() {
		return "layout/left";
	}

	@GetMapping("/layout/home.jsp")
	public String main() {
		return "layout/home";
	}
}