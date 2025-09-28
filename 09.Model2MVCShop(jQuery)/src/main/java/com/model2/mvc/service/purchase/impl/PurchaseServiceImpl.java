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

	@Override
	public void addPurchase(Purchase purchase) throws Exception {
		purchaseDao.addPurchase(purchase);
	}

	@Override
	public Purchase getPurchase(int tranNo) throws Exception {
		return purchaseDao.getPurchase(tranNo);
	}

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

	@Override
	public Map<String, Object> getSaleList(Search search) throws Exception {
		List<Purchase> list = purchaseDao.getSaleList(search);
		int totalCount = purchaseDao.getTotalCountSale(search);

		Map<String, Object> map = new HashMap<>();
		map.put("list", list);
		map.put("totalCount", totalCount);
		return map;
	}

	@Override
	public int updatePurchase(Purchase purchase) throws Exception {
		return purchaseDao.updatePurchase(purchase);
	}

	@Override
	public void updateTranCode(int tranNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("tranNo", tranNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCode(param);
	}

	@Override
	public void updateTranCodeByProd(int prodNo, String tranCode) throws Exception {
		Map<String, Object> param = new HashMap<>();
		param.put("prodNo", prodNo);
		param.put("tranCode", tranCode);
		purchaseDao.updateTranCodeByProd(param);
	}

	@Override
	public String getLatestTranCodeByProd(int prodNo) throws Exception {
		return purchaseDao.getLatestTranCodeByProd(prodNo);
	}

	@Override
	public Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> rows = purchaseDao.getLatestTranCodeByProdNos(prodNos);
		Map<Integer, String> result = new HashMap<>();

		for (Map<String, Object> r : rows) {
			// prodNo 키 변형 대응
			Object noObj = r.get("prodNo");
			if (noObj == null)
				noObj = r.get("PRODNO");
			if (noObj == null)
				noObj = r.get("PROD_NO");

			// tranCode 키 변형 대응
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

	@Override
	public Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception {
		return purchaseDao.getLatestPurchaseInfoByProdNos(prodNos);
	}

	@Override
	public List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception {
		return purchaseDao.getPurchaseHistoryByProduct(prodNo);
	}

	@Override
	public Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception {
		List<Map<String, Object>> rows = purchaseDao.getLatestActiveTranCodeByProdNos(prodNos);
		Map<Integer, String> result = new java.util.HashMap<>();
		for (Map<String, Object> r : rows) {
			Object noObj = (r.get("prodNo") != null) ? r.get("prodNo") : r.get("PROD_NO");
			Object codeObj = (r.get("tranCode") != null) ? r.get("tranCode") : r.get("TRAN_STATUS_CODE");
			if (noObj != null && codeObj != null)
				result.put(((Number) noObj).intValue(), codeObj.toString());
		}
		return result;
	}
}
