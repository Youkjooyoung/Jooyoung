package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Mapper;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

@Mapper
public interface PurchaseDao {

	void addPurchase(Purchase purchase) throws Exception;

	Purchase getPurchase(int tranNo) throws Exception;

	List<Purchase> getPurchaseList(Map<String, Object> param) throws Exception;

	int getTotalCountPurchase(Map<String, Object> param) throws Exception;

	List<Purchase> getSaleList(Search search) throws Exception;

	int getTotalCountSale(Search search) throws Exception;

	int updatePurchase(Purchase purchase) throws Exception;

	void updateTranCode(Map<String, Object> param) throws Exception;

	void updateTranCodeByProd(Map<String, Object> param) throws Exception;

	String getLatestTranCodeByProd(int prodNo) throws Exception;

	List<Map<String, Object>> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	// ★ Map으로 받기 위해 key 지정(컬럼명 prodNo)
	@MapKey("prodNo")
	Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception;

	List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception;

	List<Map<String, Object>> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	void updateCancelInfo(int tranNo, String reason) throws Exception;
}
