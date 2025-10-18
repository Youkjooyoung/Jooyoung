package com.model2.mvc.service.google;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.model2.mvc.service.domain.User;

@Service("googleOAuthService")
public class GoogleOAuthService {

	@Value("${google.clientId}")
	private String clientId;

	@Value("${google.clientSecret}")
	private String clientSecret;

	@Value("${google.redirectUri}")
	private String redirectUri;

	// === 1) AccessToken 요청 ===
	public String getAccessToken(String code) throws Exception {
		System.out.println("▶ [GoogleOAuth] AccessToken 요청 중...");

		String url = "https://oauth2.googleapis.com/token";
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

		MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
		params.add("code", code);
		params.add("client_id", clientId);
		params.add("client_secret", clientSecret);
		params.add("redirect_uri", redirectUri);
		params.add("grant_type", "authorization_code");

		HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
		ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> tokenMap = mapper.readValue(response.getBody(), Map.class);
		return (String) tokenMap.get("access_token");
	}

	// === 2) 사용자 정보 요청 ===
	public User getUserInfo(String accessToken) throws Exception {
		System.out.println("▶ [GoogleOAuth] 사용자 정보 요청 중...");

		String url = "https://www.googleapis.com/oauth2/v2/userinfo";
		RestTemplate restTemplate = new RestTemplate();

		HttpHeaders headers = new HttpHeaders();
		headers.setBearerAuth(accessToken);
		HttpEntity<?> entity = new HttpEntity<>(headers);

		ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> userMap = mapper.readValue(response.getBody(), Map.class);

		User user = new User();
		user.setGoogleId((String) userMap.get("id"));
		user.setEmail((String) userMap.get("email"));
		user.setUserName((String) userMap.get("name"));
		user.setProfileImg((String) userMap.get("picture"));
		user.setRole("user");

		return user;
	}
}
