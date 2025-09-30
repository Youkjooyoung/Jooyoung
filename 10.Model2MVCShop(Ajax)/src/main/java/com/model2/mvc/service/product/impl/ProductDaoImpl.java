package com.model2.mvc.service.product.impl;

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

@Repository("productDao")
public class ProductDaoImpl implements ProductDao {

	/// Field
	@Autowired
	@Qualifier("sqlSessionTemplate")
	private SqlSession sqlSession;

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	/// Constructor
	public ProductDaoImpl() {
		System.out.println(this.getClass());
	}

	/// Method
	public void addProduct(Product product) throws Exception {
		sqlSession.insert("ProductMapper.addProduct", product);
	}

	public void addProductImage(ProductImage image) throws Exception {
		sqlSession.insert("ProductMapper.addProductImage", image);
	}

	public Product getProduct(int prodNo) throws Exception {
		return sqlSession.selectOne("ProductMapper.getProduct", prodNo);
	}

	public List<ProductImage> getProductImages(int prodNo) throws Exception {
		return sqlSession.selectList("ProductMapper.getProductImages", prodNo);
	}

	public void updateProduct(Product product) throws Exception {
		sqlSession.update("ProductMapper.updateProduct", product);
	}

	public void deleteProduct(int prodNo) throws Exception {
		sqlSession.delete("ProductMapper.deleteProduct", prodNo);
	}

	public void deleteProductImage(int imgId) throws Exception {
		sqlSession.delete("ProductMapper.deleteProductImage", imgId);
	}

	public List<Product> getProductList(Map<String, Object> param) throws Exception {
		return sqlSession.selectList("ProductMapper.getProductList", param);
	}

	public int getTotalCount(Search search) throws Exception {
		return sqlSession.selectOne("ProductMapper.getTotalCount", search);
	}

	public void updateViewCount(int prodNo) throws Exception {
		sqlSession.update("ProductMapper.updateViewCount", prodNo);
	}

	public List<Product> getProductListForManage(Map<String, Object> map) throws Exception {
		return sqlSession.selectList("ProductMapper.getProductListForManage", map);
	}

	public List<Map<String, Object>> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getLatestActiveTranCodeByProdNos", prodNos);
	}

	public List<String> suggestProductNames(Map<String, Object> param) throws Exception {
		return sqlSession.selectList("ProductMapper.suggestProductNames", param);
	}

	public List<String> suggestProductNames(String prefix) throws Exception {
		Map<String, Object> p = new java.util.HashMap<>();
		p.put("prefix", prefix);
		return sqlSession.selectList("ProductMapper.suggestProductNames", p);
	}

	public List<String> suggestProductDetails(String keyword) throws Exception {
		Map<String, Object> p = new java.util.HashMap<>();
		p.put("keyword", keyword);
		return sqlSession.selectList("ProductMapper.suggestProductDetails", p);
	}
}