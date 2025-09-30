package com.model2.mvc.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Date 유틸 (JDK 1.8 기준) - 제조일자 등 문자열을 안전하게 정규화/포맷 - 모든 메서드는 null-safe
 */
public final class DateUtil {

	private DateUtil() {
	}

	/** 기존 호환: "2025-09-30" → "20250930", null-safe */
	public static String cleanManuDate(String manuDate) {
		if (manuDate == null)
			return null;
		return manuDate.replaceAll("-", "");
	}

	/** "yyyy-MM-dd" 또는 "yyyyMMdd" → Date (실패 시 null) */
	public static Date parseYmd(String in) {
		if (in == null || in.trim().isEmpty())
			return null;
		String s = in.trim();
		if (s.matches("\\d{4}-\\d{2}-\\d{2}")) {
			return parse(s, "yyyy-MM-dd");
		} else if (s.matches("\\d{8}")) {
			return parse(s, "yyyyMMdd");
		}
		return null;
	}

	/** Date → "yyyy-MM-dd" */
	public static String formatYmd(Date date) {
		if (date == null)
			return null;
		return new SimpleDateFormat("yyyy-MM-dd").format(date);
	}

	/** Date → "yyyyMMdd" */
	public static String formatCompactYmd(Date date) {
		if (date == null)
			return null;
		return new SimpleDateFormat("yyyyMMdd").format(date);
	}

	private static Date parse(String s, String pattern) {
		try {
			SimpleDateFormat f = new SimpleDateFormat(pattern);
			f.setLenient(false);
			return f.parse(s);
		} catch (ParseException e) {
			return null;
		}
	}
}
