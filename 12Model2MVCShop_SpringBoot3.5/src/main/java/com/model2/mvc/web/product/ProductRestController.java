package com.model2.mvc.web.product;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.model2.mvc.common.Search;
import com.model2.mvc.common.util.FileUploadHelper;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/products")
public class ProductRestController {

	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;

	public ProductRestController() {
	}

	@GetMapping({ "", "/list" })
	public Map<String, Object> list(@RequestParam(name = "currentPage", defaultValue = "1") int currentPage,
			@RequestParam(name = "pageSize", defaultValue = "10") int pageSize,
			@RequestParam(name = "searchCondition", required = false) String searchCondition,
			@RequestParam(name = "searchKeyword", required = false) String searchKeyword,
			@RequestParam(name = "sort", required = false, defaultValue = "") String sort,
			@RequestParam(name = "minPrice", required = false) Integer minPrice,
			@RequestParam(name = "maxPrice", required = false) Integer maxPrice) throws Exception {

		Search search = new Search();
		search.setCurrentPage(currentPage <= 0 ? 1 : currentPage);
		search.setPageSize(pageSize <= 0 ? 10 : pageSize);
		search.setSearchCondition((searchCondition == null || "0".equals(searchCondition)) ? null : searchCondition);
		search.setSearchKeyword(searchKeyword);

		try {
			Search.class.getMethod("setMinPrice", Integer.class).invoke(search, minPrice);
			Search.class.getMethod("setMaxPrice", Integer.class).invoke(search, maxPrice);
		} catch (NoSuchMethodException ignore) {
		} catch (Exception e) {
			throw new RuntimeException(e);
		}

		return productService.getProductList(search, (sort == null ? "" : sort));
	}

	@GetMapping("/{prodNo}")
	public Product get(@PathVariable int prodNo) throws Exception {
		return productService.getProduct(prodNo);
	}

	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> create(@RequestParam String prodName, @RequestParam String prodDetail,
			@RequestParam String manuDate, @RequestParam String price, @RequestParam int stockQty,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files, HttpServletRequest request)
			throws Exception {

		Product p = new Product();
		p.setProdName(prodName);
		p.setProdDetail(prodDetail);
		p.setManuDate(manuDate.replaceAll("\\D", "").substring(0, 8));
		p.setPrice(price);
		p.setStockQty(stockQty);

		productService.addProduct(p);

		if (p.getProdNo() <= 0) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("error", "상품번호 생성 실패", "prodNo", p.getProdNo()));
		}

		List<ProductImage> savedImages = FileUploadHelper.saveFiles(files, p.getProdNo(), request);
		if (!CollectionUtils.isEmpty(savedImages)) {
			for (ProductImage img : savedImages) {
				productService.addProductImage(img);
			}
			p.setFileName(savedImages.get(0).getFileName());
			productService.updateProduct(p);
		}
		Product result = productService.getProduct(p.getProdNo());
		return ResponseEntity.ok(result);
	}

	@PutMapping(path = "/{prodNo}", consumes = MediaType.APPLICATION_JSON_VALUE)
	public Map<String, Object> update(@PathVariable int prodNo, @RequestBody Product product) throws Exception {
		product.setProdNo(prodNo);
		productService.updateProduct(product);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("prodNo", prodNo);
		return res;
	}

	@DeleteMapping("/{prodNo}")
	public Map<String, Object> delete(@PathVariable int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("prodNo", prodNo);
		return res;
	}

	@GetMapping("/{prodNo}/images")
	public List<ProductImage> images(@PathVariable int prodNo) throws Exception {
		return productService.getProductImages(prodNo);
	}

	@PostMapping(path = "/{prodNo}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Map<String, Object> uploadImages(@PathVariable int prodNo,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files, HttpServletRequest request)
			throws Exception {
		Map<String, Object> res = new HashMap<>();
		List<ProductImage> saved = FileUploadHelper.saveFiles(files, prodNo, request);

		if (!CollectionUtils.isEmpty(saved)) {
			for (ProductImage img : saved)
				productService.addProductImage(img);

			Product p = productService.getProduct(prodNo);
			if (p != null && (p.getFileName() == null || p.getFileName().isEmpty())) {
				p.setFileName(saved.get(0).getFileName());
				productService.updateProduct(p);
			}
		}
		res.put("success", true);
		res.put("count", saved == null ? 0 : saved.size());
		return res;
	}

	@DeleteMapping("/images/{imgId}")
	public Map<String, Object> deleteImage(@PathVariable int imgId) throws Exception {
		productService.deleteProductImage(imgId);
		Map<String, Object> res = new HashMap<>();
		res.put("success", true);
		res.put("imgId", imgId);
		return res;
	}

	@GetMapping("/suggest")
	public Map<String, Object> suggest(@RequestParam String type, @RequestParam String keyword) throws Exception {
		List<String> items = "prodDetail".equalsIgnoreCase(type) ? productService.suggestProductDetails(keyword)
				: productService.suggestProductNames(keyword);
		Map<String, Object> res = new HashMap<>();
		res.put("items", items);
		return res;
	}
}
