package com.model2.mvc.common.util;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.service.domain.ProductImage;

import jakarta.servlet.http.HttpServletRequest;

public final class FileUploadHelper {

	private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif",
			"image/webp");

	private FileUploadHelper() {
	}

	public static String getRealUploadDir() {
		String catalinaBase = System.getProperty("catalina.base");
		String appName = detectAppName();
		String uploadPath = catalinaBase + File.separator + "wtpwebapps" + File.separator + appName + File.separator
				+ "images" + File.separator + "uploadFiles" + File.separator;

		File dir = new File(uploadPath);
		if (!dir.exists())
			dir.mkdirs();

		return uploadPath;
	}

	private static String detectAppName() {
		try {
			String path = new File(".").getCanonicalPath();
			// Eclipse WTP 기준:
			// ...\.metadata\.plugins\org.eclipse.wst.server.core\tmp0\wtpwebapps\프로젝트명
			if (path.contains("wtpwebapps")) {
				return path.substring(path.lastIndexOf("wtpwebapps") + 11).split("[/\\\\]")[0];
			}
		} catch (IOException ignore) {
		}
		return "ROOT"; // fallback
	}

	public static String saveFile(MultipartFile file) throws IOException {
		if (file == null || file.isEmpty())
			return null;
		String uploadPath = getRealUploadDir();
		validateContentType(file);
		ensureDir(uploadPath);
		String safeOriginal = sanitize(file.getOriginalFilename());
		String storedName = UUID.randomUUID() + "_" + safeOriginal;
		file.transferTo(new File(uploadPath, storedName));

		return storedName;
	}

	public static List<ProductImage> saveFiles(MultipartFile[] files, int prodNo, HttpServletRequest request)
			throws IOException {
		if (files == null || files.length == 0 || files[0].isEmpty()) {
			return new ArrayList<>();
		}

		String uploadDir = request.getServletContext().getRealPath("/images/uploadFiles/");
		File dir = new File(uploadDir);
		if (!dir.exists())
			dir.mkdirs();

		List<ProductImage> list = new ArrayList<>();

		for (MultipartFile f : files) {
			if (f.isEmpty())
				continue;

			String uuid = UUID.randomUUID().toString();
			String ext = "";
			String original = f.getOriginalFilename();
			if (original != null && original.contains(".")) {
				ext = original.substring(original.lastIndexOf("."));
			}

			String fileName = uuid + ext;
			File dest = new File(dir, fileName);
			f.transferTo(dest);

			ProductImage img = new ProductImage();
			img.setProdNo(prodNo);
			img.setFileName(fileName);
			list.add(img);

		}

		return list;
	}

	public static void deleteQuietly(String fileName) {
		try {
			File file = new File(getRealUploadDir(), fileName);
			if (file.exists())
				file.delete();
		} catch (Exception ignore) {
		}
	}

	private static void ensureDir(String uploadPath) throws IOException {
		File dir = new File(uploadPath);
		if (!dir.exists() && !dir.mkdirs()) {
			throw new IOException("업로드 경로 생성 실패: " + uploadPath);
		}
	}

	private static void validateContentType(MultipartFile file) throws IOException {
		String ct = file.getContentType();
		if (ct == null)
			return;
		if (!ALLOWED_CONTENT_TYPES.contains(ct)) {
			throw new IOException("허용되지 않은 컨텐츠 타입: " + ct);
		}
	}

	private static String sanitize(String name) {
		if (name == null)
			return "unknown";
		String n = name.replace("\\", "/");
		int idx = n.lastIndexOf('/');
		if (idx >= 0)
			n = n.substring(idx + 1);
		return n.replaceAll("[\\r\\n\\t]", "_").replaceAll("[^A-Za-z0-9._\\-가-힣]", "_");
	}

	private static String getExt(String name) {
		if (name == null)
			return "jpg";
		int dot = name.lastIndexOf('.');
		String ext = (dot > -1 ? name.substring(dot + 1) : "").toLowerCase();
		if (ext.equals("jfif"))
			ext = "jpg";
		if (ext.isEmpty())
			ext = "jpg";
		return ext;
	}
}
