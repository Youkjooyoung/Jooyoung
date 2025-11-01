package com.model2.mvc.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.model2.mvc.common.web.LogonCheckInterceptor;
import com.model2.mvc.common.web.ProfileCompletionInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final ProfileCompletionInterceptor profileCompletionInterceptor;

	public WebConfig(ProfileCompletionInterceptor profileCompletionInterceptor) {
		this.profileCompletionInterceptor = profileCompletionInterceptor;
	}

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new LogonCheckInterceptor()).addPathPatterns("/user/**")
		.excludePathPatterns(
			    "/user/json/me",
			    "/user/json/login",
			    "/user/json/addUser",
			    "/user/json/checkDuplication/**",
			    "/user/json/existsEmail",
			    "/user/json/existsPhone",
			    "/user/oauth/**",
			    "/css/**", "/images/**", "/javascript/**", "/webjars/**",
			    "/user/loginView.jsp",
			    "/user/addUserView.jsp"
			);

		registry.addInterceptor(profileCompletionInterceptor).addPathPatterns(
				"/purchase/**",
				"/product/addProduct*",
				"/product/updateProduct*",
				"/product/deleteProduct*");
	}

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/css/**").addResourceLocations("classpath:/static/css/");
		registry.addResourceHandler("/images/**").addResourceLocations("classpath:/static/images/");
		registry.addResourceHandler("/javascript/**").addResourceLocations("classpath:/static/javascript/");
		registry.addResourceHandler("/webjars/**").addResourceLocations("classpath:/META-INF/resources/webjars/");
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		registry.addMapping("/**").allowedOriginPatterns("*").allowedMethods("*").allowedHeaders("*")
				.allowCredentials(true);
	}
}
