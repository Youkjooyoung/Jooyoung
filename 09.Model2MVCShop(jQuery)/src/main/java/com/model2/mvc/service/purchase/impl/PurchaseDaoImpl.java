package com.model2.mvc.service.purchase.impl;

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

	// 구매등록
	@Override
	public void addPurchase(Purchase purchase) throws Exception {
		sqlSession.insert("PurchaseMapper.addPurchase", purchase);
	}

	// 구매상세조회
	@Override
	public Purchase getPurchase(int tranNo) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getPurchase", tranNo);
	}

	// 구매내역조회(사용자)
	@Override
	public List<Purchase> getPurchaseList(Map<String, Object> param) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getPurchaseList", param);
	}

	// 구매내역 총건수조회(사용자)
	@Override
	public int getTotalCountPurchase(Map<String, Object> param) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getTotalCountPurchase", param);
	}

	// 판매내역조회(관리자)
	@Override
	public List<Purchase> getSaleList(Search search) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getSaleList", search);
	}

	// 판매내역 총건수조회(관리자)
	@Override
	public int getTotalCountSale(Search search) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getTotalCountSale", search);
	}

	// 구매정보수정
	@Override
	public int updatePurchase(Purchase purchase) throws Exception {
		return sqlSession.update("PurchaseMapper.updatePurchase", purchase);
	}

	// 거래상태코드변경(거래번호)
	@Override
	public void updateTranCode(Map<String, Object> param) throws Exception {
		sqlSession.update("PurchaseMapper.updateTranCode", param);
	}

	// 거래상태코드변경(상품번호)
	@Override
	public void updateTranCodeByProd(Map<String, Object> param) throws Exception {
		sqlSession.update("PurchaseMapper.updateTranCodeByProd", param);
	}

	// 최신거래상태조회(상품번호)
	@Override
	public String getLatestTranCodeByProd(int prodNo) throws Exception {
		return sqlSession.selectOne("PurchaseMapper.getLatestTranCodeByProd", prodNo);
	}

	// 최신거래상태조회(여러상품)
	@Override
	public List<Map<String, Object>> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getLatestTranCodeByProdNos", prodNos);
	}

	// 최신구매정보조회(여러상품)
	@Override
	public Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> list = sqlSession.selectList("PurchaseMapper.getLatestPurchaseInfoByProdNos",
				prodNos);
		return list.stream().collect(Collectors.toMap(row -> ((Number) row.get("prodNo")).intValue(), row -> row));
	}

	// 최신활성거래상태조회(여러상품)
	@Override
	public List<Map<String, Object>> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getLatestActiveTranCodeByProdNos", prodNos);
	}

	// 구매이력조회(상품)
	@Override
	public List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception {
		return sqlSession.selectList("PurchaseMapper.getPurchaseHistoryByProduct", prodNo);
	}

}
