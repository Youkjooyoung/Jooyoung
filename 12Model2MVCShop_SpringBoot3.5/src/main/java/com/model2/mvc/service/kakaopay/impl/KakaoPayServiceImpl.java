package com.model2.mvc.service.kakaopay.impl;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.model2.mvc.service.kakaopay.KakaoPayService;

@Service("kakaoPayServiceImpl")
public class KakaoPayServiceImpl implements KakaoPayService {

	private static final String HOST = "https://kapi.kakao.com";
	private static final Map<String, Map<String, Object>> PAYMENT_CACHE = new ConcurrentHashMap<>();
	private static final Map<String, String> RID_TID = new ConcurrentHashMap<>();
	private static final Map<String, Map<String, Object>> RID_CACHE = new ConcurrentHashMap<>();

	@Value("${kakaopay.adminKey}")
	private String adminKey;
	@Value("${kakaopay.cid}")
	private String cid;
	@Value("${kakaopay.approvalUrl:}")
	private String approvalUrl;
	@Value("${kakaopay.cancelUrl:}")
	private String cancelUrl;
	@Value("${kakaopay.failUrl:}")
	private String failUrl;

	private final RestTemplate restTemplate = new RestTemplate();

	private HttpHeaders kakaoHeaders() {
		HttpHeaders h = new HttpHeaders();
		h.add("Authorization", "KakaoAK " + adminKey);
		h.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
		return h;
	}

	@Override
	public Map<String, Object> readyPayment(Map<String, Object> param) throws Exception {
		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("cid", cid);
		body.add("partner_order_id", "1001");
		body.add("partner_user_id", String.valueOf(param.get("userId")));
		body.add("item_name", String.valueOf(param.get("itemName")));
		body.add("quantity", String.valueOf(param.get("quantity")));
		body.add("total_amount", String.valueOf(param.get("totalAmount")));
		body.add("tax_free_amount", "0");

		String appr = String.valueOf(param.getOrDefault("approvalUrl", approvalUrl));
		String cancel = String.valueOf(param.getOrDefault("cancelUrl", cancelUrl));
		String fail = String.valueOf(param.getOrDefault("failUrl", failUrl));
		body.add("approval_url", appr);
		body.add("cancel_url", cancel);
		body.add("fail_url", fail);

		HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(body, kakaoHeaders());
		@SuppressWarnings("rawtypes")
		ResponseEntity<Map> res = restTemplate.exchange(URI.create(HOST + "/v1/payment/ready"), HttpMethod.POST, req,
				Map.class);

		String tid = (String) res.getBody().get("tid");
		PAYMENT_CACHE.put(tid, param);
		String rid = (String) param.get("rid");
		if (rid != null) {
			RID_TID.put(rid, tid);
			RID_CACHE.put(rid, param);
		}
		return res.getBody();
	}

	@Override
	public Map<String, Object> approvePayment(Map<String, Object> param) throws Exception {
		MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
		body.add("cid", cid);
		body.add("tid", String.valueOf(param.get("tid")));
		body.add("partner_order_id", "1001");
		body.add("partner_user_id", String.valueOf(param.get("userId")));
		body.add("pg_token", String.valueOf(param.get("pg_token")));

		HttpEntity<MultiValueMap<String, String>> req = new HttpEntity<>(body, kakaoHeaders());
		@SuppressWarnings("rawtypes")
		ResponseEntity<Map> res = restTemplate.exchange(URI.create(HOST + "/v1/payment/approve"), HttpMethod.POST, req,
				Map.class);
		return res.getBody();
	}

	public static Map<String, Object> getCachedPayInfo(String tid) {
		return PAYMENT_CACHE.get(tid);
	}

	public static void removeCachedPayInfo(String tid) {
		PAYMENT_CACHE.remove(tid);
	}

	public static void bindRidToTid(String rid, String tid) {
		if (rid != null && tid != null)
			RID_TID.put(rid, tid);
	}

	public static String resolveTidByRid(String rid) {
		return rid == null ? null : RID_TID.get(rid);
	}

	public static void removeRid(String rid) {
		if (rid != null) {
			RID_TID.remove(rid);
			RID_CACHE.remove(rid);
		}
	}

	public static Map<String, Object> getCachedByRid(String rid) {
		return RID_CACHE.get(rid);
	}
}
