package com.model2.mvc.service.purchase.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;
import com.model2.mvc.service.purchase.PurchaseDao;
import com.model2.mvc.service.purchase.PurchaseService;

@Service("purchaseServiceImpl")
public class PurchaseServiceImpl implements PurchaseService {

	private final PurchaseDao purchaseDao;

	@Autowired
	public PurchaseServiceImpl(@Qualifier("purchaseDaoImpl") PurchaseDao purchaseDao) {
		this.purchaseDao = purchaseDao;
		System.out.println("==> PurchaseServiceImpl 실행됨 : " + this.getClass());
	}

	// 구매등록
	@Override
	public void addPurchase(Purchase purchase) throws Exception {
		purchaseDao.addPurchase(purchase);
	}

	// 구매상세조회
	@Override
	public Purchase getPurchase(int tranNo) throws Exception {
		return purchaseDao.getPurchase(tranNo);
	}

	// 구매내역조회(사용자)
	@Override
	public Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("search", search);
		param.put("buyerId", buyerId);

		List<Purchase> list = purchaseDao.getPurchaseList(param);
		int totalCount = purchaseDao.getTotalCountPurchase(param);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("totalCount", totalCount);
		return map;
	}

	// 판매내역조회(관리자)
	@Override
	public Map<String, Object> getSaleList(Search search) throws Exception {
		List<Purchase> list = purchaseDao.getSaleList(search);
		int totalCount = purchaseDao.getTotalCountSale(search);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("totalCount", totalCount);
		return map;
	}

	// 구매정보수정
	@Override
	public int updatePurchase(Purchase purchase) throws Exception {
		return purchaseDao.updatePurchase(purchase);
	}

	// 거래상태코드변경(거래번호)
	@Override
	public void updateTranCode(int tranNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("tranNo", tranNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCode(param);
	}

	// 거래상태코드변경(상품번호)
	@Override
	public void updateTranCodeByProd(int prodNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("prodNo", prodNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCodeByProd(param);
	}

	// 최신거래상태조회(상품번호)
	@Override
	public String getLatestTranCodeByProd(int prodNo) throws Exception {
		return purchaseDao.getLatestTranCodeByProd(prodNo);
	}

	// 최신거래상태조회(여러상품)
	@Override
	public Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> rows = purchaseDao.getLatestTranCodeByProdNos(prodNos);
		Map<Integer, String> result = new HashMap<>();

		for (Map<String, Object> r : rows) {
			Object noObj = r.get("prodNo");
			if (noObj == null)
				noObj = r.get("PRODNO");
			if (noObj == null)
				noObj = r.get("PROD_NO");

			Object codeObj = r.get("tranCode");
			if (codeObj == null)
				codeObj = r.get("TRANCODE");
			if (codeObj == null)
				codeObj = r.get("TRAN_STATUS_CODE");

			if (noObj != null && codeObj != null) {
				result.put(((Number) noObj).intValue(), codeObj.toString());
			}
		}
		return result;
	}

	// 최신구매정보조회(여러상품)
	@Override
	public Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception {
		return purchaseDao.getLatestPurchaseInfoByProdNos(prodNos);
	}

	// 구매이력조회(상품)
	@Override
	public List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception {
		return purchaseDao.getPurchaseHistoryByProduct(prodNo);
	}

	// 최신활성거래상태조회(여러상품)
	@Override
	public Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> rows = purchaseDao.getLatestActiveTranCodeByProdNos(prodNos);
		Map<Integer, String> result = new HashMap<>();
		for (Map<String, Object> r : rows) {
			Object noObj = (r.get("prodNo") != null) ? r.get("prodNo") : r.get("PROD_NO");
			Object codeObj = (r.get("tranCode") != null) ? r.get("tranCode") : r.get("TRAN_STATUS_CODE");
			if (noObj != null && codeObj != null)
				result.put(((Number) noObj).intValue(), codeObj.toString());
		}
		return result;
	}
}
