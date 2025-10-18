package com.model2.mvc.web.product;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.product.ProductService;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping("/product/*")
public class ProductController {

	// ===== Field =====
	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;

	public ProductController() {
		System.out.println(this.getClass());
	}

	// 공통 페이징 프로퍼티 (common.properties 로드)
	@Value("${pageUnit}")
	private int pageUnit;
	@Value("${pageSize}")
	private int pageSize;

	// ===== 등록 화면 =====
	@RequestMapping(value = "addProduct", method = RequestMethod.GET)
	public String addProduct() throws Exception {
		System.out.println("/product/addProduct : GET");
		return "redirect:/product/addProductView.jsp";
	}

	// ===== 등록 처리 =====
	@RequestMapping(value = "addProduct", method = RequestMethod.POST)
	public String addProduct(@ModelAttribute("product") Product product) throws Exception {
		System.out.println("/product/addProduct : POST");
		// Business Logic
		productService.addProduct(product);

		// 등록 후 상세로 이동(UserController 패턴 준용: addUser -> loginView 대신, 상품은 상세로)
		return "redirect:/product/getProduct?prodNo=" + product.getProdNo();
	}

	// 상세
	@RequestMapping(value = "getProduct", method = RequestMethod.GET)
	public String getProduct(@RequestParam("prodNo") int prodNo, Model model, HttpServletRequest req) throws Exception {
		Product product = productService.getProduct(prodNo);
		model.addAttribute("product", product);
		model.addAttribute("productImages", productService.getProductImages(prodNo));

		String xrw = req.getHeader("X-Requested-With");
		if ("XMLHttpRequest".equalsIgnoreCase(xrw)) {
			return "forward:/product/getProduct.jsp"; // 모델 유지
		}
		model.addAttribute("entry", "/product/getProduct?prodNo=" + prodNo + " .container:first");
		return "/index.jsp";
	}

	// 수정 화면
	@RequestMapping(value = "updateProduct", method = RequestMethod.GET)
	public String updateProduct(@RequestParam("prodNo") int prodNo,
	                            Model model,
	                            HttpServletRequest req) throws Exception {

	    Product product = productService.getProduct(prodNo);
	    model.addAttribute("product", product);
	    model.addAttribute("productImages", productService.getProductImages(prodNo));

	    boolean ajax = "XMLHttpRequest".equalsIgnoreCase(req.getHeader("X-Requested-With"));

	    if (ajax) {
	        return "forward:/product/updateProduct.jsp";
	    }
	    model.addAttribute("entry", "/product/updateProduct?prodNo=" + prodNo + " .container:first");
	    return "/index.jsp";
	}

	// ===== 수정 처리 =====
	@RequestMapping(value = "updateProduct", method = RequestMethod.POST)
	public String updateProduct(@ModelAttribute("product") Product product) throws Exception {
		System.out.println("/product/updateProduct : POST");
		// Business Logic
		productService.updateProduct(product);

		return "redirect:/product/getProduct?prodNo=" + product.getProdNo();
	}

	// ===== 삭제 처리(관리/운영 화면에서 호출) =====
	@RequestMapping(value = "deleteProduct", method = RequestMethod.POST)
	public String deleteProduct(@RequestParam("prodNo") int prodNo) throws Exception {
		System.out.println("/product/deleteProduct : POST");
		productService.deleteProduct(prodNo);

		// 목록으로 회귀
		return "redirect:/product/listProduct";
	}

	// ===== 목록 =====
	@RequestMapping("listProduct")
	public String listProduct(@ModelAttribute("search") Search search,
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort,
			@RequestParam(value = "menu", required = false, defaultValue = "search") String menu, Model model,
			HttpServletRequest req) throws Exception {
		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		search.setPageSize(pageSize);

		Map<String, Object> map = productService.getProductList(search, sort);
		int totalCount = ((Integer) map.get("totalCount")).intValue();
		Page resultPage = new Page(search.getCurrentPage(), totalCount, pageUnit, search.getPageSize());

		model.addAttribute("list", map.get("list"));
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);
		model.addAttribute("menu", menu);

		String xrw = req.getHeader("X-Requested-With");
		boolean ajax = "XMLHttpRequest".equalsIgnoreCase(xrw);
		if (ajax) {
			return "forward:" + ("manage".equalsIgnoreCase(menu) ? "/product/listManageProduct.jsp"
					: "/product/listProduct.fragment.jsp"); // ← 검색화면은 fragment 권장
		}
		// 일반 진입 : 레이아웃(index.jsp)로 감싸고 클라이언트에서 entry 로드
		model.addAttribute("entry", ("manage".equalsIgnoreCase(menu) ? "/product/listManageProduct.jsp .container:first"
				: "/product/listProduct.fragment.jsp .container:first"));
		return "/index.jsp";
	}
}
