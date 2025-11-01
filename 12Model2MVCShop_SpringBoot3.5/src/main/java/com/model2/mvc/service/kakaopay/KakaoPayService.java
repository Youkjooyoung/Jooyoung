package com.model2.mvc.service.kakaopay;

import java.util.Map;

public interface KakaoPayService {
	Map<String, Object> readyPayment(Map<String, Object> param) throws Exception;

	Map<String, Object> approvePayment(Map<String, Object> param) throws Exception;
}
