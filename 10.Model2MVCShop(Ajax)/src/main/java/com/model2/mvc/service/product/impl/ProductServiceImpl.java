package com.model2.mvc.service.product.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductDao;
import com.model2.mvc.service.product.ProductService;
import com.model2.mvc.service.purchase.PurchaseService;;

@Service("productServiceImpl")
public class ProductServiceImpl implements ProductService {

	/// Field
	@Qualifier("productDaoImpl")
	@Resource(name = "productDao")
	private ProductDao productDao;
	private PurchaseService purchaseService;

	public void setProductDao(ProductDao productDao) {
		this.productDao = productDao;

	}

	/// Constructor
	@Autowired
	public ProductServiceImpl(@Qualifier("productDao") ProductDao productDao,
			@Qualifier("purchaseServiceImpl") PurchaseService purchaseService) {
		this.productDao = productDao;
		this.purchaseService = purchaseService;
		System.out.println("==> ProductServiceImpl 실행됨 : " + this.getClass());
	}

	/// Method
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

	@Override
	public Product getProduct(int prodNo, String sessionKey) throws Exception {
		// 세션 키 검사 (prodNo + userId 조합)
		if (sessionKey == null) {
			// 조회수 증가
			productDao.updateViewCount(prodNo);
			return productDao.getProduct(prodNo);
		}

		return productDao.getProduct(prodNo);
	}

	public Product getProduct(int prodNo) throws Exception {
		return productDao.getProduct(prodNo); // 단순 조회
	}

	public Map<String, Object> getProductList(Search search, String sort) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("searchCondition", search.getSearchCondition());
		param.put("searchKeyword", search.getSearchKeyword());
		param.put("startRowNum", search.getStartRowNum());
		param.put("endRowNum", search.getEndRowNum());
		param.put("sort", sort);

		List<Product> list = productDao.getProductList(param);
		int totalCount = productDao.getTotalCount(search);

		// 상품별 최신 거래상태 조회 (001/002/003/004)
		Map<Integer, String> latestCodeMap = new HashMap<>();
		Map<Integer, Map<String, Object>> latestInfoMap = new HashMap<>();
		if (!list.isEmpty()) {
			List<Integer> prodNos = list.stream().map(Product::getProdNo).collect(Collectors.toList());
			latestCodeMap = purchaseService.getLatestTranCodeByProdNos(prodNos);
			latestInfoMap = purchaseService.getLatestPurchaseInfoByProdNos(prodNos);
		}

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("totalCount", totalCount);
		map.put("latestCodeMap", latestCodeMap);
		map.put("latestInfoMap", latestInfoMap);
		return map;
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

	@Override
	public Map<String, Object> getProductListForManage(Search search) throws Exception {
		// 페이징 계산 (기존 규칙 사용)
		int currentPage = (search.getCurrentPage() == 0) ? 1 : search.getCurrentPage();
		int pageSize = (search.getPageSize() == 0) ? 10 : search.getPageSize();
		int endRowNum = currentPage * pageSize;
		int startRowNum = endRowNum - pageSize + 1;

		Map<String, Object> in = new HashMap<>();
		in.put("searchCondition", search.getSearchCondition());
		in.put("searchKeyword", search.getSearchKeyword());
		in.put("sort", search.getSort());
		in.put("startRowNum", startRowNum);
		in.put("endRowNum", endRowNum);

		List<Product> list = productDao.getProductListForManage(in);
		int totalCount = productDao.getTotalCount(search);

		Map<String, Object> out = new HashMap<>();
		out.put("list", list);
		out.put("totalCount", totalCount);
		return out;
	}

}