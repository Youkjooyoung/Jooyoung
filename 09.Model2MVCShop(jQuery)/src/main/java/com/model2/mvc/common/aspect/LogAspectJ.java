package com.model2.mvc.common.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LogAspectJ {

	private static final Logger logger = LoggerFactory.getLogger(LogAspectJ.class);

	public Object invoke(ProceedingJoinPoint joinPoint) throws Throwable {

		String className = joinPoint.getTarget().getClass().getSimpleName();
		String methodName = joinPoint.getSignature().getName();

		if (logger.isDebugEnabled()) {
			logger.debug("[AOP-BEFORE] {}.{}", className, methodName);

			Object[] args = joinPoint.getArgs();
			if (args != null && args.length > 0) {
				logger.debug("  ▶ args[0]: {}", args[0]);
			}
		}

		Object result = joinPoint.proceed();

		if (logger.isDebugEnabled()) {
			logger.debug("[AOP-AFTER] {}.{} → return={}", className, methodName, result);
		}

		return result;
	}
}
