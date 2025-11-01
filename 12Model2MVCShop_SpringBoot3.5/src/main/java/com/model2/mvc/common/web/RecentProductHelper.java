package com.model2.mvc.common.web;

import java.util.ArrayList;
import java.util.List;

import com.model2.mvc.service.domain.Product;

import jakarta.servlet.http.HttpSession;

public final class RecentProductHelper {

	private static final String SESSION_KEY = "recentList";
	private static final int MAX_SIZE = 5;

	private RecentProductHelper() {
	}

	@SuppressWarnings("unchecked")
	public static List<Product> get(HttpSession session) {
		Object o = session.getAttribute(SESSION_KEY);
		if (o instanceof List) {
			return new ArrayList<>((List<Product>) o);
		}
		return new ArrayList<>();
	}

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

	public static void remove(HttpSession session, int prodNo) {
		List<Product> list = get(session);
		list.removeIf(p -> p != null && p.getProdNo() == prodNo);
		session.setAttribute(SESSION_KEY, list);
	}

	public static void clear(HttpSession session) {
		session.removeAttribute(SESSION_KEY);
	}
}
