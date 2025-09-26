package com.model2.mvc.service.purchase.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Repository;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.purchase.PurchaseDao;

@Repository("purchaseDaoImpl")
public class PurchaseDaoImpl implements PurchaseDao {

	private final SqlSession sqlSession;

	public PurchaseDaoImpl(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	@Override
	public void addPurchase(Purchase purchase) throws Exception {
		sqlSession.insert("PurchaseMapper.addPurchase", purchase);
	}

	@Override
	public Purchase getPurchase(int tranNo) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getPurchase", tranNo);
	}

	@Override
	public List<Purchase> getPurchaseList(Map<String, Object> param) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getPurchaseList", param);
	}

	@Override
	public int getTotalCountPurchase(Map<String, Object> param) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getTotalCountPurchase", param);
	}

	@Override
	public List<Purchase> getSaleList(Search search) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getSaleList", search);
	}

	@Override
	public int getTotalCountSale(Search search) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getTotalCountSale", search);
	}

	@Override
	public int updatePurchase(Purchase purchase) throws Exception {
		return sqlSession.update("PurchaseMapper.updatePurchase", purchase);
	}

	@Override
	public void updateTranCode(Map<String, Object> param) throws Exception {
		sqlSession.update("PurchaseMapper.updateTranCode", param);
	}

	@Override
	public void updateTranCodeByProd(Map<String, Object> param) throws Exception {
		sqlSession.update("PurchaseMapper.updateTranCodeByProd", param);
	}

	@Override
	public String getLatestTranCodeByProd(int prodNo) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getLatestTranCodeByProd", prodNo);
	}

	@Override
	public List<Map<String, Object>> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getLatestTranCodeByProdNos", prodNos);
	}

	@Override
	public Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> list = sqlSession.selectList("PurchaseMapper.getLatestPurchaseInfoByProdNos",
				prodNos);
		return list.stream().collect(Collectors.toMap(row -> ((BigDecimal) row.get("prodNo")).intValue(), row -> row));
	}
}
