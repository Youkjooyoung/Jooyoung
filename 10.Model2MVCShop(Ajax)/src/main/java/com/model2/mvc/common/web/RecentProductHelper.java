package com.model2.mvc.common.web;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpSession;

import com.model2.mvc.service.domain.Product;

/**
 * 최근 본 상품 Helper (세션) - 중복 제거(최근 항목 앞으로) - 최대 5개 유지 - 내부 리스트는 항상 새 인스턴스로 저장하여
 * 세션 공유副작용 방지
 */
public final class RecentProductHelper {

	private static final String SESSION_KEY = "recentList";
	private static final int MAX_SIZE = 5;

	private RecentProductHelper() {
	}

	/** 최근 목록 조회 (항상 새 리스트 반환) */
	@SuppressWarnings("unchecked")
	public static List<Product> get(HttpSession session) {
		Object o = session.getAttribute(SESSION_KEY);
		if (o instanceof List) {
			return new ArrayList<>((List<Product>) o);
		}
		return new ArrayList<>();
	}

	/** 최근 목록에 추가(중복 제거 + 맨앞 삽입 + MAX_SIZE 유지) */
	public static void push(HttpSession session, Product product) {
		if (product == null)
			return;
		List<Product> list = get(session);
		list.removeIf(p -> p != null && p.getProdNo() == product.getProdNo());
		list.add(0, product);
		if (list.size() > MAX_SIZE) {
			list = new ArrayList<>(list.subList(0, MAX_SIZE));
		}
		session.setAttribute(SESSION_KEY, list);
	}

	/** 특정 상품 제거 */
	public static void remove(HttpSession session, int prodNo) {
		List<Product> list = get(session);
		list.removeIf(p -> p != null && p.getProdNo() == prodNo);
		session.setAttribute(SESSION_KEY, list);
	}

	/** 전체 초기화 */
	public static void clear(HttpSession session) {
		session.removeAttribute(SESSION_KEY);
	}
}
