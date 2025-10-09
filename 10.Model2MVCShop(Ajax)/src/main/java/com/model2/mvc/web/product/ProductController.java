package com.model2.mvc.web.product;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
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

	public ProductController(ProductService productService, PurchaseService purchaseService) {
		this.productService = productService;
		this.purchaseService = purchaseService;
	}

	// =============== 등록 ==================
	@PostMapping("addProduct")
	public String addProduct(@ModelAttribute Product product,
	                         @RequestParam(value = "uploadFiles", required = false) MultipartFile[] files,
	                         HttpServletRequest request,
	                         HttpSession session) throws Exception {

	    if (product.getStockQty() == 0) {
	        product.setStockQty(1);
	    }
	    product.setManuDate(clean(product.getManuDate()));
	    productService.addProduct(product);
	    List<ProductImage> saved = FileUploadHelper.saveFiles(files, product.getProdNo(), request);
	    if (saved != null && !saved.isEmpty()) {
	        for (ProductImage img : saved) {
	            productService.addProductImage(img);
	        }
	        product.setFileName(saved.get(0).getFileName());
	        productService.updateProduct(product);
	    }

	    return isAdmin(session)
	            ? "redirect:/product/listProduct?menu=manage"
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

		Map<Integer, Map<String, Object>> info = purchaseService.getLatestPurchaseInfoByProdNos(Arrays.asList(prodNo));
		String latestCode = null;
		if (info != null && info.get(prodNo) != null) {
			Object codeObj = info.get(prodNo).get("tranCode");
			latestCode = (codeObj == null) ? null : String.valueOf(codeObj);
		}

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
	public String updateProduct(@ModelAttribute Product form,
	                            @RequestParam(value = "uploadFiles", required = false) MultipartFile[] files,
	                            @RequestParam(value = "deleteImageIds", required = false) List<Integer> deleteIds,
	                            HttpServletRequest request) throws Exception {

	    Product p = productService.getProduct(form.getProdNo());
	    if (p == null) {
	        return "redirect:/product/listProduct";
	    }

	    if (form.getProdName() != null && !form.getProdName().trim().isEmpty()) {
	        p.setProdName(form.getProdName().trim());
	    }
	    if (form.getProdDetail() != null) {
	        p.setProdDetail(form.getProdDetail()); 
	    }
	    if (form.getManuDate() != null && !form.getManuDate().trim().isEmpty()) {
	        p.setManuDate(clean(form.getManuDate()));
	    }

	    String priceParam = request.getParameter("price");
	    if (priceParam != null && !priceParam.trim().isEmpty()) {
	        p.setPrice(priceParam); 
	    }
	    // 재고
	    String sqParam = request.getParameter("stockQty");
	    if (sqParam != null && !sqParam.trim().isEmpty()) {
	        try {
	            int sq = Integer.parseInt(sqParam.trim());
	            if (sq >= 0) p.setStockQty(sq);
	        } catch (NumberFormatException ignore) {}
	    }

	    deleteImages(deleteIds);
	    attachImagesAndSetPrimary(p, files, request);
	    productService.updateProduct(p);

	    return "redirect:/product/getProduct?prodNo=" + p.getProdNo();
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

		if (search == null) {
			search = new Search();
		}
		if (search.getCurrentPage() <= 0) {
			search.setCurrentPage(1);
		}
		if (search.getPageSize() <= 0) {
			search.setPageSize(pageSize);
		}

		User user = (User) session.getAttribute("user");
		boolean isAdmin = (user != null) && "admin".equalsIgnoreCase(user.getUserId());

		Map<String, Object> result = productService.getProductList(search, sort);

		List<Product> list = (List<Product>) result.get("list");
		int totalCount = (int) result.get("totalCount");

		model.addAttribute("list", list);
		model.addAttribute("totalCount", totalCount);
		model.addAttribute("resultPage", new Page(search.getCurrentPage(), totalCount, pageUnit, search.getPageSize()));

		if (isAdmin && "manage".equalsIgnoreCase(menu)) {
			Map<String, Object> manageMap = productService.getProductListForManage(search);
			model.addAttribute("list", manageMap.get("list"));
			model.addAttribute("totalCount", manageMap.get("totalCount"));
			model.addAttribute("latestInfo", manageMap.get("latestInfo"));
			return "forward:/product/listManageProduct.jsp";
		}

		return "forward:/product/listProduct.jsp";
	}

	// ---------- 내부 헬퍼(컨트롤러 내부에만 유지) ----------
	private void attachImagesAndSetPrimary(Product product, MultipartFile[] files, HttpServletRequest request) throws Exception {
	    if (files == null || files.length == 0 || files[0].isEmpty())
	        return;
	    List<ProductImage> saved = FileUploadHelper.saveFiles(files, product.getProdNo(), request);
	    if (CollectionUtils.isEmpty(saved))
	        return;
	    for (ProductImage img : saved) {
	        productService.addProductImage(img);
	    }
	    product.setFileName(saved.get(0).getFileName());
	    productService.updateProduct(product);

	    System.out.println("대표 이미지 저장 완료: " + saved.get(0).getFileName());
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
