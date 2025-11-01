package com.model2.mvc.common.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogAspectJ {

	/// Constructor
	public LogAspectJ() {
	}

	@Around("execution(* com.model2.mvc.service..*Impl.*(..)  )")
	public Object invoke(ProceedingJoinPoint joinPoint) throws Throwable {

		if (joinPoint.getArgs().length != 0) {
		}
		Object obj = joinPoint.proceed();

		return obj;
	}

}