package com.model2.mvc.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

public final class DateUtil {

	private DateUtil() {
	}

	public static String cleanManuDate(String manuDate) {
		if (manuDate == null)
			return null;
		return manuDate.replaceAll("-", "");
	}

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

	public static String formatYmd(Date date) {
		if (date == null)
			return null;
		return new SimpleDateFormat("yyyy-MM-dd").format(date);
	}

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
