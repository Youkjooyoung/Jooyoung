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

	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;

	public ProductController() {
	}

	@Value("${pageUnit}")
	private int pageUnit;
	@Value("${pageSize}")
	private int pageSize;

	@RequestMapping(value = "addProduct", method = RequestMethod.GET)
	public String addProduct() throws Exception {
		return "redirect:/product/addProductView.jsp";
	}

	@RequestMapping(value = "addProduct", method = RequestMethod.POST)
	public String addProduct(@ModelAttribute("product") Product product) throws Exception {
		productService.addProduct(product);
		return "redirect:/product/getProduct?prodNo=" + product.getProdNo();
	}

	@RequestMapping(value = "getProduct", method = RequestMethod.GET)
	public String getProduct(@RequestParam("prodNo") int prodNo, Model model, HttpServletRequest req) throws Exception {
		Product product = productService.getProduct(prodNo);
		model.addAttribute("product", product);
		model.addAttribute("productImages", productService.getProductImages(prodNo));

		String xrw = req.getHeader("X-Requested-With");
		if ("XMLHttpRequest".equalsIgnoreCase(xrw)) {
			return "forward:/product/getProduct.jsp";
		}
		model.addAttribute("entry", "/product/getProduct?prodNo=" + prodNo + " .container:first");
		return "/index.jsp";
	}

	@RequestMapping(value = "updateProduct", method = RequestMethod.GET)
	public String updateProduct(@RequestParam("prodNo") int prodNo, Model model, HttpServletRequest req)
			throws Exception {

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

	@RequestMapping(value = "updateProduct", method = RequestMethod.POST)
	public String updateProduct(@ModelAttribute("product") Product product) throws Exception {
		productService.updateProduct(product);
		return "redirect:/product/getProduct?prodNo=" + product.getProdNo();
	}

	@RequestMapping(value = "deleteProduct", method = RequestMethod.POST)
	public String deleteProduct(@RequestParam("prodNo") int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
		return "redirect:/product/listProduct";
	}

	@RequestMapping("listProduct")
	public String listProduct(@ModelAttribute("search") Search search,
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort, Model model)
			throws Exception {

		if (search.getCurrentPage() == 0)
			search.setCurrentPage(1);
		search.setPageSize(pageSize);

		Map<String, Object> map = productService.getProductList(search, sort);
		int totalCount = ((Integer) map.get("totalCount")).intValue();
		Page resultPage = new Page(search.getCurrentPage(), totalCount, pageUnit, search.getPageSize());

		model.addAttribute("list", map.get("list"));
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);

		return "product/listProduct";
	}
}
