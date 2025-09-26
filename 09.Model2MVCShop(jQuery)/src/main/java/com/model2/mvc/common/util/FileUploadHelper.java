package com.model2.mvc.common.util;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.service.domain.ProductImage;

/**
 * 파일 업로드 공용 Helper - 파일 저장 - ProductImage 리스트 반환
 */
public class FileUploadHelper {

	private FileUploadHelper() {
		// 인스턴스 생성 방지
	}

	/**
	 * MultipartFile 배열을 저장하고 ProductImage 리스트 반환
	 *
	 * @param files      업로드된 파일 배열
	 * @param prodNo     상품 번호
	 * @param uploadPath 실제 저장 경로
	 * @return 저장된 파일 목록(ProductImage 리스트)
	 * @throws Exception
	 */
	public static List<ProductImage> saveFiles(MultipartFile[] files, int prodNo, String uploadPath) throws Exception {
		List<ProductImage> result = new ArrayList<>();

		if (files == null || files.length == 0) {
			return result;
		}

		File dir = new File(uploadPath);
		if (!dir.exists()) {
			dir.mkdirs();
		}

		for (MultipartFile file : files) {
			if (file.isEmpty())
				continue;

			// 유니크 파일명 생성
			String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
			file.transferTo(new File(uploadPath, fileName));

			// ProductImage 생성
			ProductImage img = new ProductImage();
			img.setProdNo(prodNo);
			img.setFileName(fileName);

			result.add(img);
		}

		return result;
	}
}
