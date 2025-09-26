package com.model2.mvc.web.product;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.common.util.FileUploadHelper;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductRestController {

	private final ProductService productService;

	public ProductRestController(ProductService productService) {
		this.productService = productService;
	}

	// =============== 등록 ===============
	@PostMapping(consumes = "multipart/form-data")
	public Product create(@ModelAttribute Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files, HttpServletRequest request)
			throws Exception {

		if (files != null && files.length > 0 && !files[0].isEmpty()) {
			product.setFileName(files[0].getOriginalFilename());
		}
		productService.addProduct(product);

		String uploadPath = request.getSession().getServletContext().getRealPath("/images/uploadFiles/");
		List<ProductImage> images = FileUploadHelper.saveFiles(files, product.getProdNo(), uploadPath);
		if (!CollectionUtils.isEmpty(images)) {
			for (ProductImage img : images)
				productService.addProductImage(img);
		}
		return product;
	}

	// =============== 상세(조회수 증가 없음) ===============
	@GetMapping("/{prodNo}")
	public Product get(@PathVariable int prodNo) throws Exception {
		return productService.getProduct(prodNo);
	}

	// =============== 수정 ===============
	@PutMapping(value = "/{prodNo}", consumes = "multipart/form-data")
	public Product update(@PathVariable int prodNo, @ModelAttribute Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files, HttpServletRequest request)
			throws Exception {

		product.setProdNo(prodNo);

		String uploadPath = request.getSession().getServletContext().getRealPath("/images/uploadFiles/");
		List<ProductImage> images = FileUploadHelper.saveFiles(files, prodNo, uploadPath);
		if (!CollectionUtils.isEmpty(images)) {
			for (ProductImage img : images)
				productService.addProductImage(img);
		}

		productService.updateProduct(product);
		return productService.getProduct(prodNo);
	}

	// =============== 삭제 ===============
	@DeleteMapping("/{prodNo}")
	public void delete(@PathVariable int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
	}

	// =============== 목록 ===============
	@GetMapping
	public Map<String, Object> list(@ModelAttribute Search search,
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort) throws Exception {
		if (search.getCurrentPage() <= 0)
			search.setCurrentPage(1);
		if (search.getPageSize() <= 0)
			search.setPageSize(10);

		Map<String, Object> map = productService.getProductList(search, sort);
		int totalCount = (int) map.getOrDefault("totalCount", 0);
		map.put("page", new Page(search.getCurrentPage(), totalCount, 5, search.getPageSize()));
		return map;
	}

	// =============== 이미지 ===============
	@GetMapping("/{prodNo}/images")
	public List<ProductImage> images(@PathVariable int prodNo) throws Exception {
		return productService.getProductImages(prodNo);
	}

	@DeleteMapping("/images/{imgId}")
	public void deleteImage(@PathVariable int imgId) throws Exception {
		productService.deleteProductImage(imgId);
	}
}
