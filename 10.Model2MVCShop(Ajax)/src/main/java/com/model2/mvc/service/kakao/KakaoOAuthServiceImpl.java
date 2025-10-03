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

	@Value("#{commonProperties['kakao.clientId']}")
	private String clientId;

	@Value("#{commonProperties['kakao.redirectUri']}")
	private String redirectUri;

	@Override
	public String getAccessToken(String code) throws Exception {
		RestTemplate rt = new RestTemplate();

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("grant_type", "authorization_code");
		params.add("client_id", clientId);
		params.add("redirect_uri", redirectUri);
		params.add("code", code);

		ResponseEntity<Map> res = rt.postForEntity("https://kauth.kakao.com/oauth/token", params, Map.class);

		return (String) res.getBody().get("access_token");
	}

	@Override
	public User getUserInfo(String accessToken) throws Exception {
		HttpHeaders headers = new HttpHeaders();
		headers.add("Authorization", "Bearer " + accessToken);

		HttpEntity<String> entity = new HttpEntity<>(headers);
		RestTemplate rt = new RestTemplate();

		ResponseEntity<Map> res = rt.exchange("https://kapi.kakao.com/v2/user/me", HttpMethod.GET, entity, Map.class);

		Map<String, Object> body = res.getBody();

		User user = new User();
		String kakaoId = body.get("id").toString();

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
		if (user.getUserName() == null)
			user.setUserName("kakao_user");
		if (user.getEmail() == null)
			user.setEmail("kakao_" + kakaoId + "@kakao.com");

		return user;
	}
}
