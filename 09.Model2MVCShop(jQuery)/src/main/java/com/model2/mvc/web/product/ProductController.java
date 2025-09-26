package com.model2.mvc.web.product;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.common.util.DateUtil;
import com.model2.mvc.common.util.FileUploadHelper;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.product.ProductService;
import com.model2.mvc.service.purchase.PurchaseService;

@Controller
@RequestMapping("/product/*")
public class ProductController {

	@Qualifier("productServiceImpl")
	private final PurchaseService purchaseService;
	private final ProductService productService;

	@Value("#{commonProperties['pageUnit'] ?: 5}")
	private int pageUnit;

	@Value("#{commonProperties['pageSize'] ?: 5}")
	private int pageSize;

	public ProductController(ProductService productService, PurchaseService purchaseService) {
		this.productService = productService;
		this.purchaseService = purchaseService;
	}

	// =============== 등록 ===============
	@PostMapping("addProduct")
	public String addProduct(@ModelAttribute Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] uploadFiles,
			HttpServletRequest request, HttpSession session) throws Exception {

		product.setManuDate(cleanDate(product.getManuDate()));
		productService.addProduct(product);

		if (uploadFiles != null && uploadFiles.length > 0) {
			String uploadPath = resolveUploadPath(request);
			List<ProductImage> images = FileUploadHelper.saveFiles(uploadFiles, product.getProdNo(), uploadPath);

			if (!images.isEmpty()) {
				// 대표 이미지 파일명만 세팅 후 서비스에 위임
				product.setFileName(images.get(0).getFileName());
				productService.updateProduct(product); // IMAGE_FILE 반영

				for (ProductImage img : images) {
					productService.addProductImage(img);
				}
			}
		}

		return isAdmin(session) ? "redirect:/product/listProduct?menu=manage"
				: "redirect:/product/listProduct?menu=search";
	}

	// =============== 상세 ===============
	@GetMapping("getProduct")
	public String getProduct(@RequestParam("prodNo") int prodNo, HttpSession session, Model model) throws Exception {

		String userId = getUserId(session);
		String viewedKey = "viewed:" + prodNo + ":" + userId;
		boolean firstView = session.getAttribute(viewedKey) == null;
		if (firstView) {
			session.setAttribute(viewedKey, true);
		}

		// 상품 상세 조회
		Product product = productService.getProduct(prodNo, firstView ? viewedKey : null);
		List<ProductImage> productImages = productService.getProductImages(prodNo);
		String latestCode = purchaseService.getLatestTranCodeByProd(prodNo);

		model.addAttribute("product", product);
		model.addAttribute("productImages", productImages);
		model.addAttribute("latestCode", latestCode);

		// ==============================
		// ★ 최근 본 상품 관리 (세션)
		// ==============================
		@SuppressWarnings("unchecked")
		List<Product> recentList = (List<Product>) session.getAttribute("recentList");
		if (recentList == null) {
			recentList = new ArrayList<>();
		}

		// 중복 제거
		recentList.removeIf(p -> p.getProdNo() == product.getProdNo());

		// 앞쪽에 추가
		recentList.add(0, product);

		// 최대 5개까지만 유지
		if (recentList.size() > 5) {
			recentList = recentList.subList(0, 5);
		}

		session.setAttribute("recentList", recentList);

		return "product/getProduct";
	}

	// =============== 수정 화면 ===============
	@GetMapping("updateProduct")
	public String updateProductView(@RequestParam("prodNo") int prodNo, Model model) throws Exception {
		model.addAttribute("product", productService.getProduct(prodNo));
		model.addAttribute("productImages", productService.getProductImages(prodNo));
		return "forward:/product/updateProduct.jsp";
	}

	// =============== 수정 처리 ===============
	@PostMapping("updateProduct")
	public String updateProduct(@ModelAttribute Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] uploadFiles,
			@RequestParam(value = "deleteImageIds", required = false) List<Integer> deleteImageIds,
			HttpServletRequest request) throws Exception {

		if (!CollectionUtils.isEmpty(deleteImageIds)) {
			for (Integer imgId : deleteImageIds) {
				productService.deleteProductImage(imgId);
			}
		}

		handleFileUpload(uploadFiles, product, resolveUploadPath(request));

		product.setManuDate(cleanDate(product.getManuDate()));
		productService.updateProduct(product);

		return "redirect:/product/getProduct?prodNo=" + product.getProdNo();
	}

	// =============== 삭제 ===============
	@PostMapping("deleteProduct")
	public String deleteProduct(@RequestParam("prodNo") int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
		return "redirect:/product/listProduct?menu=manage";
	}

	// =============== 목록 ===============
	@GetMapping("listProduct")
	public String listProduct(@ModelAttribute("search") Search search,
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort, Model model)
			throws Exception {

		// 기본값 통일
		if (search.getCurrentPage() <= 0)
			search.setCurrentPage(1);
		if (search.getPageSize() <= 0)
			search.setPageSize(5); // << 한 가지 규칙만 사용

		Map<String, Object> result = productService.getProductList(search, sort);
		int totalCount = (int) result.getOrDefault("totalCount", 0);

		Page resultPage = new Page(search.getCurrentPage(), totalCount, pageUnit, // 블록 단위 (규칙: '<'은 1페이지, '>'은 블록 이동)
				search.getPageSize());

		// JSP에서 쓰는 모델 키들
		model.addAttribute("list", result.get("list"));
		model.addAttribute("latestCodeMap", result.get("latestCodeMap")); // 상태 표시에 사용 중이면 유지
		model.addAttribute("resultPage", resultPage);

		return "forward:/product/listProduct.jsp";
	}

	// --------- helpers ---------
	private String resolveUploadPath(HttpServletRequest request) {
		return "C:/upload/"; // 무조건 C:/upload 밑으로 저장
	}

	private void handleFileUpload(MultipartFile[] uploadFiles, Product product, String uploadPath) throws Exception {
		if (uploadFiles == null || uploadFiles.length == 0 || uploadFiles[0].isEmpty()) {
			return;
		}

		List<ProductImage> images = FileUploadHelper.saveFiles(uploadFiles, product.getProdNo(), uploadPath);
		if (images != null && !images.isEmpty()) {
			for (ProductImage img : images) {
				productService.addProductImage(img);
			}
			// 대표 이미지 설정
			product.setFileName(images.get(0).getFileName());
			productService.updateProduct(product);
		}
	}

	private String cleanDate(String manuDate) {
		return (manuDate != null) ? DateUtil.cleanManuDate(manuDate) : null;
	}

	private String getUserId(HttpSession session) {
		User user = (User) session.getAttribute("user");
		return (user != null) ? user.getUserId() : "guest";
	}

	private boolean isAdmin(HttpSession session) {
		User user = (User) session.getAttribute("user");
		return user != null && "admin".equals(user.getUserId());
	}

}
