package com.model2.mvc.service.product;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;

public interface ProductService {

	// 상품등록
	void addProduct(Product product) throws Exception;

	// 상품상세 보기 (조회수 증가 제어용 sessionKey)
	Product getProduct(int prodNo, String sessionKey) throws Exception;

	// 상품상세 보기 (조회수 증가 없음)
	Product getProduct(int prodNo) throws Exception;

	// 상품 리스트 (검색/정렬/페이징)
	Map<String, Object> getProductList(Search search, String sort) throws Exception;

	// 상품수정
	void updateProduct(Product product) throws Exception;

	// 상품삭제
	void deleteProduct(int prodNo) throws Exception;

	// 상세이미지 삭제/등록/조회
	void deleteProductImage(int imgId) throws Exception;

	void addProductImage(ProductImage image) throws Exception;

	List<ProductImage> getProductImages(int prodNo) throws Exception;

	// 관리자 전용 리스트(+최신 거래정보는 Service에서 합성)
	Map<String, Object> getProductListForManage(Search search) throws Exception;

	// 자동완성
	List<String> suggestProductNames(String prefix) throws Exception;

	List<String> suggestProductDetails(String keyword) throws Exception;
}
