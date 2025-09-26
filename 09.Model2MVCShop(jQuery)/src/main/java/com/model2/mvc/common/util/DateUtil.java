package com.model2.mvc.common.util;

/**
 * Date 관련 유틸 클래스 - 제조일자(yyyy-MM-dd)를 yyyyMMdd 형식으로 정리 - 추후 다른 모듈에서도 재사용 가능
 */
public class DateUtil {

	private DateUtil() {
		// 인스턴스 생성 방지
	}

	/**
	 * 제조일자 포맷을 yyyyMMdd로 정리
	 * 
	 * @param manuDate 입력값(예: "2025-09-30" 또는 "20250930")
	 * @return 정리된 값(예: "20250930"), null-safe
	 */
	public static String cleanManuDate(String manuDate) {
		if (manuDate == null) {
			return null;
		}
		return manuDate.replaceAll("-", "");
	}
}
