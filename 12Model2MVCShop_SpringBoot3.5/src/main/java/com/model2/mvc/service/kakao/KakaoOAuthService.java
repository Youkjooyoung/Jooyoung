package com.model2.mvc.service.kakao;

import com.model2.mvc.service.domain.User;

public interface KakaoOAuthService {
	String getAccessToken(String code) throws Exception;

	User getUserInfo(String accessToken) throws Exception;
}
