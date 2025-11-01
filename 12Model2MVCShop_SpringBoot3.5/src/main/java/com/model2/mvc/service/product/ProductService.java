package com.model2.mvc.service.product;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;

public interface ProductService {

	void addProduct(Product product) throws Exception;

	Product getProduct(int prodNo, String sessionKey) throws Exception;

	Product getProduct(int prodNo) throws Exception;

	Map<String, Object> getProductList(Search search, String sort) throws Exception;

	void updateProduct(Product product) throws Exception;

	void deleteProduct(int prodNo) throws Exception;

	void deleteProductImage(int imgId) throws Exception;

	void addProductImage(ProductImage image) throws Exception;

	List<ProductImage> getProductImages(int prodNo) throws Exception;

	Map<String, Object> getProductListForManage(Search search) throws Exception;

	List<String> suggestProductNames(String prefix) throws Exception;

	List<String> suggestProductDetails(String keyword) throws Exception;
}
