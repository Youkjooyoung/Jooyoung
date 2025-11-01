package com.model2.mvc.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

	public MainController() {
	}

	@GetMapping("/")
	public String index() {
		return "index";
	}

	@GetMapping("/home")
	public String homeCanonical() {
		return "redirect:/";
	}
}
