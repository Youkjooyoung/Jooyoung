package com.model2.mvc.service.product;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;

public interface ProductDao {

	// 상품등록
	public void addProduct(Product product) throws Exception;

	// 상품상세 조회
	public Product getProduct(int prodNo) throws Exception;

	// 상품리스트 조회
	List<Product> getProductList(Map<String, Object> param) throws Exception;

	// 상품수정
	public void updateProduct(Product product) throws Exception;

	// 상품삭제
	public void deleteProduct(int prodNo) throws Exception;

	// 게시판 Page 처리를 위한 전체Row
	public int getTotalCount(Search search) throws Exception;

	// 상품이미지 삭제
	void deleteProductImage(int imgId) throws Exception;

	// 상품이미지 추가
	void addProductImage(ProductImage image) throws Exception;

	// 상품이미지 가져오기/다중
	List<ProductImage> getProductImages(int prodNo) throws Exception;

	// 조회수
	public void updateViewCount(int prodNo) throws Exception;

	// 관리자 상품리스트
	List<Product> getProductListForManage(Map<String, Object> map) throws Exception;

	List<String> suggestProductNames(String prefix) throws Exception;

	List<String> suggestProductDetails(String keyword) throws Exception;

	int decreaseStock(int prodNo, int qty) throws Exception;

	int increaseStock(int prodNo, int qty) throws Exception;

}