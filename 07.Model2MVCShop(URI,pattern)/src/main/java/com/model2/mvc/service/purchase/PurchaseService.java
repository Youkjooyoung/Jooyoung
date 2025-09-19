package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseService {

	void addPurchase(Purchase purchase) throws Exception;

	Purchase getPurchase(int tranNo) throws Exception;

	Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception;

	Map<String, Object> getSaleList(Search search) throws Exception;

	void updatePurchase(Purchase purchase) throws Exception;

	void updateTranCode(int tranNo, String tranCode) throws Exception;

	void updateTranCodeByProd(int prodNo, String tranCode) throws Exception;

	// 상태 조회
	String getLatestTranCodeByProd(int prodNo) throws Exception;

	Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;
}
