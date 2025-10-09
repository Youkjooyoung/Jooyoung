package com.model2.mvc.service.google;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.model2.mvc.service.domain.User;

@Service("googleOAuthService")
public class GoogleOAuthService {

	@Value("#{commonProperties['google.clientId']}")
	private String clientId;

	@Value("#{commonProperties['google.clientSecret']}")
	private String clientSecret;

	@Value("#{commonProperties['google.redirectUri']}")
	private String redirectUri;

	@Autowired
	private RestTemplate restTemplate;

	@Autowired
	private ObjectMapper objectMapper;

	// 1) AccessToken 요청
	public String getAccessToken(String code) throws Exception {
		String url = "https://oauth2.googleapis.com/token";

		// Content-Type: application/x-www-form-urlencoded
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(org.springframework.http.MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("code", code);
		params.add("client_id", clientId);
		params.add("client_secret", clientSecret);
		params.add("redirect_uri", redirectUri);
		params.add("grant_type", "authorization_code");

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);

		ResponseEntity<String> res = restTemplate.postForEntity(url, request, String.class);
		Map<String, Object> map = objectMapper.readValue(res.getBody(), Map.class);
		return (String) map.get("access_token");
	}

	// 2) 사용자 정보 조회
	public User getUserInfo(String accessToken) throws Exception {
		String url = "https://www.googleapis.com/oauth2/v2/userinfo";

		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(accessToken);
		HttpEntity<?> entity = new HttpEntity<>(headers);

		ResponseEntity<String> res = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
		Map<String, Object> map = objectMapper.readValue(res.getBody(), Map.class);

		User user = new User();
		user.setGoogleId((String) map.get("id"));
		user.setEmail((String) map.get("email"));
		user.setUserName((String) map.get("name"));
		user.setProfileImg((String) map.get("picture"));
		user.setRole("user");
		return user;
	}
}
