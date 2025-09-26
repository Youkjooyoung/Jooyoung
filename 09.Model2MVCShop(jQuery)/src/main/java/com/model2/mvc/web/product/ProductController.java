package com.model2.mvc.web.product;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
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

	private final ProductService productService;
	private final PurchaseService purchaseService;
	@Autowired
	private org.mybatis.spring.SqlSessionTemplate sqlSession;
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
			List<ProductImage> images = FileUploadHelper.saveFiles(uploadFiles, product.getProdNo(),
					resolveUploadPath(request));

			if (!images.isEmpty()) {
				// 대표 이미지(Product 테이블 IMAGE_FILE) 설정
				product.setFileName(images.get(0).getFileName());

				sqlSession.update("ProductMapper.updateProductFileName", product);

				for (ProductImage img : images) {
					sqlSession.insert("ProductMapper.addProductImage", img);
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
	public String listProduct(@RequestParam(value = "menu", required = false) String menu,
			@RequestParam(value = "sort", required = false) String sort, @ModelAttribute Search search, Model model)
			throws Exception {

		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		if (search.getPageSize() == 0)
			search.setPageSize(pageSize);

		search.setSort(sort);

		Map<String, Object> map = productService.getProductList(search, sort);
		List<Product> productList = (List<Product>) map.get("list");

		List<Integer> prodNos = productList.stream().map(Product::getProdNo).collect(Collectors.toList());
		Map<Integer, String> latestCodeMap = purchaseService.getLatestTranCodeByProdNos(prodNos);

		model.addAttribute("list", productList);
		model.addAttribute("resultPage",
				new Page(search.getCurrentPage(), (Integer) map.get("totalCount"), pageUnit, search.getPageSize()));
		model.addAttribute("search", search);
		model.addAttribute("sort", sort);
		model.addAttribute("latestCodeMap", latestCodeMap);

		return "manage".equals(menu) ? "product/listManageProduct" : "product/listProduct";
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
