package com.groupd.bms.util;

import jakarta.servlet.http.HttpServletRequest;

public class Util {
    

    /**
	 * 사용자 IP 주소 반환
	 * @param request HttpServletRequest
	 * @return IP 주소 문자열
	 */
	public static String getUserIP(HttpServletRequest request) {
		String clientIP = request.getHeader("X-Forwarded-For");
		if (clientIP == null || clientIP.length() == 0 || "unknown".equalsIgnoreCase(clientIP)) {
			clientIP = request.getRemoteAddr();
		}
		return clientIP;
	}

	// 숫자 변환 함수 (기본값: 0)
	public static int parseIntOrDefault(String parameter) {
		return parseIntOrDefault(parameter, 0); // 기본값 0
	}

	/**
	 * 숫자 변환 함수 (사용자 정의 기본값 지원)
	 * @param parameter 요청에서 가져온 문자열 매개변수
	 * @param defaultValue 기본값
	 * @return 변환된 정수 값 또는 기본값
	 */
	public static int parseIntOrDefault(String parameter, int defaultValue) {
		// 입력값이 null 또는 빈 문자열이면 기본값 반환
		if (parameter == null || parameter.trim().isEmpty()) {
			return defaultValue;
		}
		try {
			return Integer.parseInt(parameter); // 정상적으로 숫자로 변환
		} catch (NumberFormatException e) {
			return defaultValue; // 변환 실패 시 기본값 반환
		}
	}

	// 문자열 변환 함수 (기본값: "")
	public static String getStringOrDefault(String parameter) {
		return getStringOrDefault(parameter, ""); // 기본값 ""
	}

	/**
	 * 문자열 변환 함수 (사용자 정의 기본값 지원)
	 * @param parameter 요청에서 가져온 문자열 매개변수
	 * @param defaultValue 기본값
	 * @return 유효한 문자열 또는 기본값
	 */
	public static String getStringOrDefault(String parameter, String defaultValue) {
		if (parameter == null || parameter.trim().isEmpty()) {
			return defaultValue; // null 또는 빈 문자열일 경우 기본값 반환
		}
		return parameter; // 유효한 문자열 반환
	}

	
}
