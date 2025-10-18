package com.model2.mvc.service.product.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductDao;
import com.model2.mvc.service.product.ProductService;
import com.model2.mvc.service.purchase.PurchaseService;

@Service("productServiceImpl")
public class ProductServiceImpl implements ProductService {

	private final ProductDao productDao;
	private final PurchaseService purchaseService;

	@Autowired
	public ProductServiceImpl(@Qualifier("productDaoImpl") ProductDao productDao,
			@Qualifier("purchaseServiceImpl") PurchaseService purchaseService) {
		this.productDao = productDao;
		this.purchaseService = purchaseService;
		System.out.println("==> ProductServiceImpl 실행됨 : " + this.getClass());
	}

	@Transactional
	public void addProduct(Product product) throws Exception {
		productDao.addProduct(product);
	}

	public void addProductImage(ProductImage image) throws Exception {
		productDao.addProductImage(image);
	}

	public List<ProductImage> getProductImages(int prodNo) throws Exception {
		return productDao.getProductImages(prodNo);
	}

	public Product getProduct(int prodNo, String sessionKey) throws Exception {
		if (sessionKey == null) {
			productDao.updateViewCount(prodNo);
		}
		return productDao.getProduct(prodNo);
	}

	public Product getProduct(int prodNo) throws Exception {
		return productDao.getProduct(prodNo);
	}

	@Override
	public Map<String, Object> getProductList(Search search, String sort) throws Exception {
		if (search == null) {
			search = new Search();
		}
		if (search.getCurrentPage() <= 0) {
			search.setCurrentPage(1);
		}
		if (search.getPageSize() <= 0) {
			search.setPageSize(10);
		}

		Map<String, Object> param = new HashMap<>();
		param.put("searchCondition", search.getSearchCondition());
		param.put("searchKeyword", search.getSearchKeyword());
		param.put("startRowNum", search.getStartRowNum());
		param.put("endRowNum", search.getEndRowNum());
		param.put("sort", sort);
		param.put("minPrice", search.getMinPrice());
		param.put("maxPrice", search.getMaxPrice());

		List<Product> list = productDao.getProductList(param);
		int totalCount = productDao.getTotalCount(search);

		Map<String, Object> result = new HashMap<>();
		result.put("list", list);
		result.put("totalCount", totalCount);
		return result;
	}

	public void updateProduct(Product product) throws Exception {
		productDao.updateProduct(product);
	}

	public void deleteProduct(int prodNo) throws Exception {
		productDao.deleteProduct(prodNo);
	}

	public void deleteProductImage(int imgId) throws Exception {
		productDao.deleteProductImage(imgId);
	}

	// 관리자 전용 목록
	public Map<String, Object> getProductListForManage(Search search) throws Exception {
		if (search == null) {
			search = new Search();
		}
		if (search.getCurrentPage() == 0) {
			search.setCurrentPage(1);
		}
		if (search.getPageSize() == 0) {
			search.setPageSize(10);
		}

		int currentPage = search.getCurrentPage();
		int pageSize = search.getPageSize();
		int endRowNum = currentPage * pageSize;
		int startRowNum = endRowNum - pageSize + 1;

		Map<String, Object> in = new HashMap<>();
		in.put("searchCondition", search.getSearchCondition());
		in.put("searchKeyword", search.getSearchKeyword());
		in.put("sort", search.getSort());
		in.put("startRowNum",startRowNum);
		in.put("endRowNum", endRowNum);

		List<Product> list = productDao.getProductListForManage(in);
		int totalCount = productDao.getTotalCount(search);

		Map<Integer, Map<String, Object>> latestInfoMap = new HashMap<>();
		if (!list.isEmpty()) {
			List<Integer> prodNos = list.stream().map(Product::getProdNo).collect(Collectors.toList());
			latestInfoMap = purchaseService.getLatestPurchaseInfoByProdNos(prodNos);
		}

		Map<String, Object> out = new HashMap<>();
		out.put("list", list);
		out.put("totalCount", totalCount);
		out.put("latestInfo", latestInfoMap);

		return out;
	}

	public List<String> suggestProductNames(String prefix) throws Exception {
		return productDao.suggestProductNames(prefix);
	}

	public List<String> suggestProductDetails(String keyword) throws Exception {
		return productDao.suggestProductDetails(keyword);
	}
}
