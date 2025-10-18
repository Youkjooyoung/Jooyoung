package com.model2.mvc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.model2.mvc.common.web.LogonCheckInterceptor;
import com.model2.mvc.common.web.ProfileCompletionInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final ProfileCompletionInterceptor profileCompletionInterceptor;

	public WebConfig(ProfileCompletionInterceptor profileCompletionInterceptor) {
		System.out.println("==> WebConfig default Constructor call.............");
		this.profileCompletionInterceptor = profileCompletionInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LogonCheckInterceptor()).addPathPatterns("/user/*");
		registry.addInterceptor(profileCompletionInterceptor).addPathPatterns("/purchase/**", "/product/addProduct*",
				"/product/updateProduct*", "/product/deleteProduct*");
	}
}
