package com.model2.mvc.config;

import org.springframework.beans.factory.config.PropertiesFactoryBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class CommonPropertiesConfig {

	@Bean(name = "commonProperties")
	public PropertiesFactoryBean commonProperties() {
		PropertiesFactoryBean bean = new PropertiesFactoryBean();
		bean.setLocation(new ClassPathResource("config/common.properties"));
		return bean;
	}
}
