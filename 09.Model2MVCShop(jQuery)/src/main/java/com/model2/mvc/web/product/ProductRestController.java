package com.model2.mvc.web.product;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
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

	@Autowired
	@Qualifier("productServiceImpl")
	private ProductService productService;

	@Value("#{commonProperties['pageUnit'] ?: 3}")
	private int pageUnit;

	private static final String UPLOAD_DIR = "C:/upload/uploadFiles/";

	public ProductRestController(ProductService productService) {
		this.productService = productService;
	}

	// 등록
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Product create(@ModelAttribute Product product,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files) throws Exception {
		productService.addProduct(product);
		attachImagesAndSetPrimary(product, files);
		return product;
	}

	// 상세
	@GetMapping(value = "/{prodNo}", produces = MediaType.APPLICATION_JSON_VALUE)
	public Product get(@PathVariable int prodNo) throws Exception {
		return productService.getProduct(prodNo);
	}

	// 수정
	@PostMapping(value = "/{prodNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Product update(@PathVariable int prodNo, @RequestParam("prodName") String prodName,
			@RequestParam(value = "prodDetail", required = false) String prodDetail,
			@RequestParam(value = "manuDate", required = false) String manuDate, @RequestParam("price") String price,
			@RequestParam(value = "deleteImageIds", required = false) List<Integer> deleteIds,
			@RequestParam(value = "uploadFiles", required = false) MultipartFile[] files) throws Exception {

		Product p = productService.getProduct(prodNo);
		p.setProdName(prodName);
		p.setProdDetail(prodDetail);
		p.setManuDate(manuDate);
		p.setPrice(price);

		deleteImages(deleteIds);
		attachImagesAndSetPrimary(p, files); // 있으면 대표 이미지 갱신
		productService.updateProduct(p);
		return productService.getProduct(prodNo);
	}

	// 삭제
	@DeleteMapping("/{prodNo}")
	public void delete(@PathVariable int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
	}

	// 목록(JSON)
	@GetMapping
	public Map<String, Object> list(@ModelAttribute Search search,
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort) throws Exception {
		if (search.getCurrentPage() <= 0)
			search.setCurrentPage(1);
		if (search.getPageSize() <= 0)
			search.setPageSize(5);

		Map<String, Object> map = productService.getProductList(search, sort);
		int total = (int) map.getOrDefault("totalCount", 0);
		map.put("page", new Page(search.getCurrentPage(), total, pageUnit, search.getPageSize()));
		return map;
	}

	// 상세이미지 목록
	@GetMapping("/{prodNo}/images")
	public List<ProductImage> images(@PathVariable int prodNo) throws Exception {
		return productService.getProductImages(prodNo);
	}

	// ---- 내부 헬퍼(컨트롤러 내부 한정) ----
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

	private void deleteImages(List<Integer> ids) throws Exception {
		if (CollectionUtils.isEmpty(ids))
			return;
		for (Integer id : ids)
			productService.deleteProductImage(id);
	}
}
