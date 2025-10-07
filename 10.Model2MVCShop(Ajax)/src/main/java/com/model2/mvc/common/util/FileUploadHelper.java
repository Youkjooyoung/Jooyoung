package com.model2.mvc.common.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.service.domain.ProductImage;

/**
 * 업로드 공용 Helper - 디렉토리 자동 생성 - 파일명/경로 정화(Directory Traversal 방지) - 허용된 MIME만
 * 처리(선택적으로 완화 가능) - 빈 파일/사이즈 0을 건너뜀
 */
public final class FileUploadHelper {

	private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif",
			"image/webp");

	private FileUploadHelper() {
	}

	/** 단일 파일 저장 → 저장된 파일명 반환 (원본명 보관은 DB/필드에서 별도) */
	public static String saveFile(MultipartFile file, String uploadPath) throws IOException {
		if (file == null || file.isEmpty())
			return null;
		validateContentType(file);
		ensureDir(uploadPath);
		String safeOriginal = sanitize(file.getOriginalFilename());
		String storedName = UUID.randomUUID() + "_" + safeOriginal;
		file.transferTo(new File(uploadPath, storedName));
		return storedName;
	}

	/** 다중 저장 → ProductImage 리스트 반환 */
	public static List<ProductImage> saveFiles(MultipartFile[] files, int prodNo, String uploadPath)
			throws IOException {
		List<ProductImage> result = new ArrayList<>();
		if (files == null || files.length == 0)
			return result;

		ensureDir(uploadPath);

		for (MultipartFile f : files) {
			if (f == null || f.isEmpty())
				continue;
			validateContentType(f);

			String safeOriginal = sanitize(f.getOriginalFilename());
			String storedName = UUID.randomUUID() + "_" + safeOriginal;
			f.transferTo(new File(uploadPath, storedName));

			ProductImage img = new ProductImage();
			img.setProdNo(prodNo);
			img.setFileName(storedName);
			result.add(img);
		}
		return result;
	}

	/** 파일 삭제(실패 무시) */
	public static void deleteQuietly(String uploadPath, String fileName) {
		if (uploadPath == null || fileName == null)
			return;
		try {
			new File(uploadPath, fileName).delete();
		} catch (Exception ignore) {
		}
	}

	// ---------- 내부 유틸 ----------

	private static void ensureDir(String uploadPath) throws IOException {
		File dir = new File(uploadPath);
		if (!dir.exists() && !dir.mkdirs()) {
			throw new IOException("업로드 경로 생성 실패: " + uploadPath);
		}
		if (!dir.isDirectory()) {
			throw new IOException("업로드 경로가 디렉토리가 아님: " + uploadPath);
		}
	}

	private static void validateContentType(MultipartFile file) throws IOException {
		String ct = file.getContentType();
		if (ct == null)
			return; // 일부 환경에서 null인 경우 허용
		if (!ALLOWED_CONTENT_TYPES.contains(ct)) {
			throw new IOException("허용되지 않은 컨텐츠 타입: " + ct);
		}
	}

	/** 경로 구분자/제어문자 제거 */
	private static String sanitize(String name) {
		if (name == null)
			return "unknown";
		String n = name.replace("\\", "/");
		int idx = n.lastIndexOf('/');
		if (idx >= 0)
			n = n.substring(idx + 1);
		return n.replaceAll("[\\r\\n\\t]", "_").replaceAll("[^A-Za-z0-9._\\-가-힣]", "_");
	}
}
