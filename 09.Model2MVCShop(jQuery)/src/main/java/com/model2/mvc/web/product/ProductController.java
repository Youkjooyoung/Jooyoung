package com.model2.mvc.web.product;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
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

	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;

	@Autowired
	@Qualifier("purchaseServiceImpl")
	private PurchaseService purchaseService;

	@Value("#{commonProperties['pageUnit'] ?: 3}")
	private int pageUnit;

	@Value("#{commonProperties['pageSize'] ?: 3}")
	private int pageSize;

	private static final String UPLOAD_DIR = "C:/upload/uploadFiles/";

	public ProductController(ProductService productService, PurchaseService purchaseService) {
		this.productService = productService;
		this.purchaseService = purchaseService;
	}

	// =============== 등록 ==================
	@PostMapping("addProduct")
	public String addProduct(@ModelAttribute Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files, HttpSession session)
			throws Exception {

		product.setManuDate(clean(product.getManuDate()));
		productService.addProduct(product);
		attachImagesAndSetPrimary(product, files);
		return isAdmin(session) ? "redirect:/product/listProduct?menu=manage"
				: "redirect:/product/listProduct?menu=search";
	}

	// =============== 상세 ==================
	@GetMapping("getProduct")
	public String getProduct(@RequestParam("prodNo") int prodNo, HttpSession session, Model model) throws Exception {
		String userId = currentUserId(session);
		String viewedKey = "viewed:" + prodNo + ":" + userId;
		boolean first = session.getAttribute(viewedKey) == null;
		if (first)
			session.setAttribute(viewedKey, true);

		Product p = productService.getProduct(prodNo, first ? viewedKey : null);
		List<ProductImage> imgs = productService.getProductImages(prodNo);
		String latestCode = purchaseService.getLatestTranCodeByProd(prodNo);

		model.addAttribute("product", p);
		model.addAttribute("productImages", imgs);
		model.addAttribute("latestCode", latestCode);

		pushRecent(session, p);
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
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files,
			@RequestParam(value = "deleteImageIds", required = false) List<Integer> deleteIds) throws Exception {

		deleteImages(deleteIds);
		attachImagesAndSetPrimary(product, files);
		product.setManuDate(clean(product.getManuDate()));
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
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort,
			@RequestParam(value = "menu", required = false) String menu, HttpSession session, Model model)
			throws Exception {

		if (search.getCurrentPage() <= 0)
			search.setCurrentPage(1);
		if (search.getPageSize() <= 0)
			search.setPageSize(5);

		Map<String, Object> result = productService.getProductList(search, sort);
		@SuppressWarnings("unchecked")
		List<Product> list = (List<Product>) result.get("list");
		int totalCount = (int) result.getOrDefault("totalCount", 0);

		List<Integer> prodNos = new java.util.ArrayList<>();
		if (list != null)
			for (Product p : list)
				prodNos.add(p.getProdNo());

		Map<Integer, Map<String, Object>> latestInfo = purchaseService.getLatestPurchaseInfoByProdNos(prodNos);

		model.addAttribute("list", list);
		model.addAttribute("latestInfo", latestInfo);
		model.addAttribute("resultPage", new Page(search.getCurrentPage(), totalCount, pageUnit, search.getPageSize()));
		model.addAttribute("latestCodeMap", result.get("latestCodeMap"));
		model.addAttribute("latestInfoMap", result.get("latestInfoMap"));

		User user = (User) session.getAttribute("user");
		boolean admin = (user != null) && ("admin".equals(user.getUserId()) || "admin".equals(user.getRole()));
		return (admin && "manage".equalsIgnoreCase(menu)) ? "forward:/product/listManageProduct.jsp"
				: "forward:/product/listProduct.jsp";
	}

	// ---------- 내부 헬퍼(컨트롤러 내부에만 유지) ----------
	private void attachImagesAndSetPrimary(Product product, MultipartFile[] files) throws Exception {
		if (files == null || files.length == 0 || files[0].isEmpty())
			return;
		List<ProductImage> saved = FileUploadHelper.saveFiles(files, product.getProdNo(), UPLOAD_DIR);
		if (CollectionUtils.isEmpty(saved))
			return;
		for (ProductImage img : saved)
			productService.addProductImage(img);
		product.setFileName(saved.get(0).getFileName());
		productService.updateProduct(product);
	}

	// =============== 상세 이미지 삭제===============
	private void deleteImages(List<Integer> ids) throws Exception {
		if (CollectionUtils.isEmpty(ids))
			return;
		for (Integer id : ids)
			productService.deleteProductImage(id);
	}

	// =============== 제조일자 문자열 ===============
	private String clean(String manuDate) {
		return manuDate != null ? DateUtil.cleanManuDate(manuDate) : null;
	}

	// =============== 세션(관리자 OR USER) ===============
	private boolean isAdmin(HttpSession s) {
		User u = (User) s.getAttribute("user");
		return u != null && "admin".equals(u.getUserId());
	}

	// =============== 사용자 ID OR Guest ===============
	private String currentUserId(HttpSession s) {
		User u = (User) s.getAttribute("user");
		return u != null ? u.getUserId() : "guest";
	}

	// =============== 상세보기화면에서의 본상품 ===============
	@SuppressWarnings("unchecked")
	private void pushRecent(HttpSession s, Product p) {
		List<Product> list = (List<Product>) s.getAttribute("recentList");
		if (list == null)
			list = new ArrayList<>();
		list.removeIf(x -> x.getProdNo() == p.getProdNo());
		list.add(0, p);
		if (list.size() > 5)
			list = list.subList(0, 5);
		s.setAttribute("recentList", list);
	}
}
