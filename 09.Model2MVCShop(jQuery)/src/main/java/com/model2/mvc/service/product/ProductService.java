package com.model2.mvc.service.product;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;

//==> 회원관리에서 서비스할 내용 추상화/캡슐화한 Service  Interface Definition  
public interface ProductService {

	// 상품등록
	public void addProduct(Product product) throws Exception;

	// 상품상세 보기 & 조회수
	public Product getProduct(int prodNo, String sessionKey) throws Exception;

	Product getProduct(int prodNo) throws Exception;

	// 상품리스트 조회
	public Map<String, Object> getProductList(Search search, String sort) throws Exception;

	// 상품정보수정
	public void updateProduct(Product product) throws Exception;

	// 상품삭제
	public void deleteProduct(int prodNo) throws Exception;

	// 상품이미지 삭제
	void deleteProductImage(int imgId) throws Exception;

	// 상품이미지 등록
	void addProductImage(ProductImage image) throws Exception;

	// 상품이미지 조회/다중
	List<ProductImage> getProductImages(int prodNo) throws Exception;

	Map<String,Object> getProductListForManage(Search search) throws Exception;
	


}