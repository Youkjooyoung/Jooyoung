package com.model2.mvc.web.product;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

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

	public ProductRestController(ProductService productService) {
		this.productService = productService;
	}

	// 등록
	@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Product create(@ModelAttribute Product product,
	                      @RequestParam(value = "uploadFiles", required = false) MultipartFile[] files,
	                      HttpServletRequest request) throws Exception {

	    productService.addProduct(product);
	    List<ProductImage> saved = FileUploadHelper.saveFiles(files, product.getProdNo(), request);

	    if (saved != null && !saved.isEmpty()) {
	        for (ProductImage img : saved) {
	            productService.addProductImage(img);
	        }
	        product.setFileName(saved.get(0).getFileName());
	        productService.updateProduct(product);
	    }

	    return productService.getProduct(product.getProdNo());
	}

	// 상세
	@GetMapping(value = "/{prodNo}", produces = MediaType.APPLICATION_JSON_VALUE)
	public Product get(@PathVariable int prodNo) throws Exception {
		return productService.getProduct(prodNo);
	}

	// 수정
	@PostMapping(value = "/{prodNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Product update(@PathVariable int prodNo,
	                      @RequestParam("prodName") String prodName,
	                      @RequestParam(value = "prodDetail", required = false) String prodDetail,
	                      @RequestParam(value = "manuDate", required = false) String manuDate,
	                      @RequestParam("price") String price,
	                      @RequestParam(value = "deleteImageIds", required = false) List<Integer> deleteIds,
	                      @RequestParam(value = "uploadFiles", required = false) MultipartFile[] files,
	                      HttpServletRequest request) throws Exception { 

	    Product p = productService.getProduct(prodNo);
	    p.setProdName(prodName);
	    p.setProdDetail(prodDetail);
	    p.setManuDate(manuDate);
	    p.setPrice(price);

	    deleteImages(p, deleteIds, request);
	    List<ProductImage> saved = attachImagesAndSetPrimary(p, files, request);

	    if (saved != null && !saved.isEmpty()) {
	        p.setFileName(saved.get(0).getFileName());
	    } else if (deleteIds != null && !deleteIds.isEmpty()) {
	        p.setFileName(null);
	    }
	    productService.updateProduct(p);
	    return productService.getProduct(prodNo);
	}

	// 삭제
	@DeleteMapping("/{prodNo}")
	public Map<String, Object> delete(@PathVariable int prodNo) throws Exception {
		productService.deleteProduct(prodNo);
		Map<String, Object> res = new HashMap<>();
		res.put("result", "success");
		res.put("prodNo", prodNo);
		return res;
	}

	// 목록(JSON)
	@GetMapping("list")
	public Map<String, Object> list(@ModelAttribute Search search,
			@RequestParam(value = "sort", required = false, defaultValue = "") String sort) throws Exception {

		// 기본값 설정
		if (search.getCurrentPage() <= 0) {
			search.setCurrentPage(1);
		}
		if (search.getPageSize() <= 0) {
			search.setPageSize(10);
		}
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
	private List<ProductImage> attachImagesAndSetPrimary(Product product, MultipartFile[] files,HttpServletRequest request) throws Exception {
	    if (files == null || files.length == 0 || files[0].isEmpty())
	        return null;

	    List<ProductImage> saved = FileUploadHelper.saveFiles(files, product.getProdNo(), request);
	    if (CollectionUtils.isEmpty(saved))
	        return null;

	    for (ProductImage img : saved) {
	        productService.addProductImage(img);
	    }
	    product.setFileName(saved.get(0).getFileName());
	    System.out.println("대표 이미지 세팅 예정: " + saved.get(0).getFileName());

	    return saved;
	}

	private void deleteImages(Product product, List<Integer> ids, HttpServletRequest request) throws Exception {
	    if (CollectionUtils.isEmpty(ids))
	        return;

	    String uploadDir = request.getServletContext().getRealPath("/images/uploadFiles/");
	    List<ProductImage> allImgs = productService.getProductImages(product.getProdNo());
	    if (CollectionUtils.isEmpty(allImgs))
	        return;

	    for (Integer id : ids) {
	        if (id == null)
	            continue;

	        ProductImage target = allImgs.stream()
	            .filter(img -> img.getImgId() == id)
	            .findFirst()
	            .orElse(null);

	        if (target == null)
	            continue;

	        File file = new File(uploadDir, target.getFileName());
	        if (file.exists() && file.delete()) {
	            System.out.println("🗑️ 삭제 완료: " + file.getAbsolutePath());
	        }

	        productService.deleteProductImage(id);
	    }
	}

	// === AutoComplete ===
	@GetMapping("/suggest")
	public Map<String, Object> suggest(@RequestParam String type, @RequestParam String keyword) throws Exception {
		List<String> items;
		if ("prodDetail".equalsIgnoreCase(type)) {
			items = productService.suggestProductDetails(keyword);
		} else {
			items = productService.suggestProductNames(keyword);
		}
		Map<String, Object> res = new java.util.HashMap<>();
		res.put("items", items);
		return res;
	}

}
