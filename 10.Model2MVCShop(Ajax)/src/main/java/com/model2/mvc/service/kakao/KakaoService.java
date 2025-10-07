package com.model2.mvc.service.kakao;

import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.model2.mvc.service.domain.User;

@Service("kakaoService")
public class KakaoService {

	// ✅ Access Token 발급
	public String getAccessToken(String code) throws Exception {
		RestTemplate restTemplate = new RestTemplate();

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", "c800109ff8046d4900c86659d4e9f89d"); // REST API 키
		params.add("redirect_uri", "http://localhost:8080/user/kakao/callback");
		params.add("code", code);

		ResponseEntity<Map> response = restTemplate.postForEntity("https://kauth.kakao.com/oauth/token", params,
				Map.class);

		return (String) response.getBody().get("access_token");
	}

	// ✅ 사용자 정보 가져오기
	public User getUserInfo(String accessToken) {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);

		HttpEntity<String> entity = new HttpEntity<>(headers);
		RestTemplate restTemplate = new RestTemplate();

		ResponseEntity<Map> response = restTemplate.exchange("https://kapi.kakao.com/v2/user/me", HttpMethod.GET,
				entity, Map.class);

		Map<String, Object> body = response.getBody();

		User user = new User();
		String kakaoId = body.get("id").toString();

		// ✅ UserId 생성 규칙 고정
		user.setUserId("kakao_" + kakaoId);
		user.setKakaoId(kakaoId);

		// ✅ 소셜 로그인 계정은 password placeholder 고정
		user.setPassword("kakao_login");

		// ✅ 기본 role 세팅
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

		// ✅ NULL 방지 기본값 처리
		if (user.getUserName() == null) {
			user.setUserName("kakao_user");
		}
		if (user.getEmail() == null) {
			user.setEmail("kakao_" + kakaoId + "@kakao.com");
		}

		return user;
	}
}
