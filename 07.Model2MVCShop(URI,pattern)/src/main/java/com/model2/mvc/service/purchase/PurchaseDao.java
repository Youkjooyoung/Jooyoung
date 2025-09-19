package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseDao {

	void addPurchase(Purchase purchase) throws Exception;

	Purchase getPurchase(int tranNo) throws Exception;

	List<Purchase> getPurchaseList(Map<String, Object> param) throws Exception;

	int getTotalCountPurchase(Map<String, Object> param) throws Exception;

	List<Purchase> getSaleList(Search search) throws Exception;

	int getTotalCountSale(Search search) throws Exception;

	void updatePurchase(Purchase purchase) throws Exception;

	void updateTranCode(Map<String, Object> param) throws Exception;

	void updateTranCodeByProd(Map<String, Object> param) throws Exception;

	String getLatestTranCodeByProd(int prodNo) throws Exception;

	List<Map<String, Object>> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;
}
