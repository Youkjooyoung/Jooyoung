package com.model2.mvc.common.web;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

@ControllerAdvice
public class GlobalExceptionHandler {

	public GlobalExceptionHandler() {
	}

	@ExceptionHandler(NullPointerException.class)
	public ModelAndView handleNpe(NullPointerException ex) {
		ModelAndView mv = new ModelAndView("/common/nullError.jsp");
		mv.addObject("exception", ex);
		mv.addObject("message", ex.getMessage());
		return mv;
	}

	@ExceptionHandler(NumberFormatException.class)
	public ModelAndView handleNfe(NumberFormatException ex) {
		ModelAndView mv = new ModelAndView("/common/numberFormatError.jsp");
		mv.addObject("exception", ex);
		mv.addObject("message", ex.getMessage());
		return mv;
	}

	@ExceptionHandler(Exception.class)
	public ModelAndView handleDefault(Exception ex) {
		ModelAndView mv = new ModelAndView("common/error.jsp");
		mv.addObject("exception", ex);
		mv.addObject("message", ex.getMessage());
		return mv;
	}

}