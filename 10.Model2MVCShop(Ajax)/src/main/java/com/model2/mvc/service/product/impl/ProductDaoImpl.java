package com.model2.mvc.service.product.impl;

import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Product;
import com.model2.mvc.service.domain.ProductImage;
import com.model2.mvc.service.product.ProductDao;

@Repository("productDaoImpl")
public class ProductDaoImpl implements ProductDao {

	@Autowired
	@Qualifier("sqlSessionTemplate")
	private SqlSession sqlSession;

	public ProductDaoImpl() {
		System.out.println(this.getClass());
	}

	// 상품등록
	public void addProduct(Product product) throws Exception {
		sqlSession.insert("ProductMapper.addProduct", product);
	}

	// 상품이미지 등록
	public void addProductImage(ProductImage image) throws Exception {
		sqlSession.insert("ProductMapper.addProductImage", image);
	}

	// 상품상세조회
	public Product getProduct(int prodNo) throws Exception {
		Product product = sqlSession.selectOne("ProductMapper.getProduct", prodNo);
		return (product != null) ? product : new Product();
	}

	// 상품이미지조회
	public List<ProductImage> getProductImages(int prodNo) throws Exception {
		List<ProductImage> list = sqlSession.selectList("ProductMapper.getProductImages", prodNo);
		return (list != null) ? list : Collections.emptyList();
	}

	// 상품수정
	public void updateProduct(Product product) throws Exception {
		sqlSession.update("ProductMapper.updateProduct", product);
	}

	// 상품삭제
	public void deleteProduct(int prodNo) throws Exception {
		sqlSession.delete("ProductMapper.deleteProduct", prodNo);
	}

	// 상품이미지삭제
	public void deleteProductImage(int imgId) throws Exception {
		sqlSession.delete("ProductMapper.deleteProductImage", imgId);
	}

	// 상품목록
	public List<Product> getProductList(Map<String, Object> map) throws Exception {
		List<Product> list = sqlSession.selectList("ProductMapper.getProductList", map);
		return (list != null) ? list : Collections.emptyList();
	}

	// 총 상품 수
	public int getTotalCount(Search search) throws Exception {
		Integer count = sqlSession.selectOne("ProductMapper.getTotalCount", search);
		return (count != null) ? count : 0;
	}

	// 조회수 증가
	public void updateViewCount(int prodNo) throws Exception {
		sqlSession.update("ProductMapper.updateViewCount", prodNo);
	}

	// ===== 자동완성 (상품명) =====
	public List<String> suggestProductNames(String prefix) throws Exception {
		if (prefix == null || prefix.trim().isEmpty()) {
			return java.util.Collections.emptyList();
		}
		Map<String, Object> p = new java.util.HashMap<>();
		p.put("keyword", prefix.trim());
		return sqlSession.selectList("ProductMapper.suggestProductNames", p);
	}

	// ===== 자동완성 (상세내용) =====
	public List<String> suggestProductDetails(String keyword) throws Exception {
		if (keyword == null || keyword.trim().isEmpty()) {
			return java.util.Collections.emptyList();
		}
		Map<String, Object> p = new java.util.HashMap<>();
		p.put("keyword", keyword.trim());
		return sqlSession.selectList("ProductMapper.suggestProductDetails", p);
	}

	// ===== 관리자 상품리스트 =====
	public List<Product> getProductListForManage(Map<String, Object> map) throws Exception {
		return sqlSession.selectList("ProductMapper.getProductListForManage", map);
	}

	// 재고 차감
	public int decreaseStock(int prodNo, int qty) throws Exception {
		Map<String, Object> p = new java.util.HashMap<>();
		p.put("prodNo", prodNo);
		p.put("qty", qty);
		int rows = sqlSession.update("ProductMapper.decreaseStock", p);
		System.out.println("[DAO] decreaseStock(prodNo=" + prodNo + ", qty=" + qty + ") → rows=" + rows);
		return rows;
	}

	// 재고 증가
	public int increaseStock(int prodNo, int qty) throws Exception {
		Map<String, Object> p = new java.util.HashMap<>();
		p.put("prodNo", prodNo);
		p.put("qty", qty);
		int rows = sqlSession.update("ProductMapper.increaseStock", p);
		System.out.println("[DAO] increaseStock(prodNo=" + prodNo + ", qty=" + qty + ") → rows=" + rows);
		return rows;
	}
}
