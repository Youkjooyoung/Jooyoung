package com.model2.mvc.service.product;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;

@Mapper
public interface ProductDao {

	void addProduct(Product product) throws Exception;

	Product getProduct(int prodNo) throws Exception;

	List<Product> getProductList(Map<String, Object> param) throws Exception;

	void updateProduct(Product product) throws Exception;

	void deleteProduct(int prodNo) throws Exception;

	int getTotalCount(Search search) throws Exception;

	void deleteProductImage(int imgId) throws Exception;

	void addProductImage(ProductImage image) throws Exception;

	List<ProductImage> getProductImages(int prodNo) throws Exception;

	void updateViewCount(int prodNo) throws Exception;

	List<Product> getProductListForManage(Map<String, Object> map) throws Exception;

	List<String> suggestProductNames(String prefix) throws Exception;

	List<String> suggestProductDetails(String keyword) throws Exception;

	int decreaseStock(int prodNo, int qty) throws Exception;

	int increaseStock(int prodNo, int qty) throws Exception;
}
