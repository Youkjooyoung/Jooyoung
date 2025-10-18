package com.model2.mvc.service.kakao;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.model2.mvc.service.domain.User;

@Service("kakaoOAuthService")
public class KakaoOAuthServiceImpl implements KakaoOAuthService {

	@Value("${kakao.clientId}")
	private String clientId;

	@Value("${kakao.redirectUri}")
	private String redirectUri;

	// === 1) AccessToken 요청 ===
	@Override
	public String getAccessToken(String code) throws Exception {
		System.out.println("▶ [KakaoOAuth] AccessToken 요청 중...");

		String url = "https://kauth.kakao.com/oauth/token";
		RestTemplate restTemplate = new RestTemplate();

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("redirect_uri", redirectUri);
		params.add("code", code);

		ResponseEntity<Map> response = restTemplate.postForEntity(url, params, Map.class);
		return (String) response.getBody().get("access_token");
	}

	// === 2) 사용자 정보 조회 ===
	@Override
	public User getUserInfo(String accessToken) throws Exception {
		System.out.println("▶ [KakaoOAuth] 사용자 정보 요청 중...");

		String url = "https://kapi.kakao.com/v2/user/me";
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);

		HttpEntity<String> entity = new HttpEntity<>(headers);
		ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, entity, Map.class);
		Map<String, Object> body = response.getBody();

		String kakaoId = body.get("id").toString();

		User user = new User();
		user.setUserId("kakao_" + kakaoId);
		user.setKakaoId(kakaoId);
		user.setPassword("kakao_login");
		user.setRole("user");

		Map<String, Object> account = (Map<String, Object>) body.get("kakao_account");
		if (account != null) {
			user.setEmail((String) account.get("email"));

			Map<String, Object> profile = (Map<String, Object>) account.get("profile");
			if (profile != null) {
				user.setUserName((String) profile.get("nickname"));
				user.setProfileImg((String) profile.get("profile_image_url"));
			}
		}

		// 기본값 처리
		if (user.getUserName() == null)
			user.setUserName("kakao_user");
		if (user.getEmail() == null)
			user.setEmail("kakao_" + kakaoId + "@kakao.com");

		return user;
	}
}
