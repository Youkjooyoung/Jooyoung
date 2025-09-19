package com.model2.mvc.service.product.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductDao;
import com.model2.mvc.service.product.ProductService;;

//==> 회원관리 서비스 구현
@Service("productServiceImpl")
public class ProductServiceImpl implements ProductService {

	/// Field
	@Autowired
	@Qualifier("productDaoImpl")
	private ProductDao productDao;

	public void setProductDao(ProductDao productDao) {
		this.productDao = productDao;
	}

	/// Constructor
	public ProductServiceImpl() {
		System.out.println(this.getClass());
	}

	/// Method
	public void addProduct(Product product) throws Exception {
		productDao.addProduct(product);
	}

	public void addProductImage(ProductImage image) throws Exception {
		productDao.addProductImage(image);
	}

	public List<ProductImage> getProductImages(int prodNo) throws Exception {
		return productDao.getProductImages(prodNo);
	}

	public Product getProduct(int prodNo) throws Exception {
		return productDao.getProduct(prodNo);
	}

	public String findProduct(Product product) throws Exception {
		return productDao.findProduct(product);
	}

	public Map<String, Object> getProductList(Search search) throws Exception {
		List<Product> list = productDao.getProductList(search);
		int totalCount = productDao.getTotalCount(search);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("totalCount", totalCount);

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

}