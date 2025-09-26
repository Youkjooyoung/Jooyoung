package com.model2.mvc.common.web;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import com.model2.mvc.service.domain.Product;

/**
 * 최근 본 상품(Session) 관리 Helper - 세션에서 최근 본 상품 리스트를 추가/조회/유지 - 최대 5개까지만 저장
 */
public class RecentProductHelper {

	private static final String SESSION_KEY = "recentList";
	private static final int MAX_SIZE = 5;

	private RecentProductHelper() {
		// 인스턴스 생성 방지
	}

	@SuppressWarnings("unchecked")
	public static List<Product> getRecentList(HttpSession session) {
		List<Product> list = (List<Product>) session.getAttribute(SESSION_KEY);
		return (list != null) ? list : new ArrayList<>();
	}

	public static void addProduct(HttpSession session, Product product) {
		List<Product> list = getRecentList(session);

		// 동일 상품이 이미 있다면 제거
		list.removeIf(p -> p.getProdNo() == product.getProdNo());

		// 맨 앞에 추가
		list.add(0, product);

		// 최대 개수 유지
		if (list.size() > MAX_SIZE) {
			list = list.subList(0, MAX_SIZE);
		}

		session.setAttribute(SESSION_KEY, list);
	}
}
