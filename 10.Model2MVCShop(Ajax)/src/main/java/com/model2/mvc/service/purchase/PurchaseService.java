package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseService {

	// 구매등록
	void addPurchase(Purchase purchase) throws Exception;

	// 구매상세조회
	Purchase getPurchase(int tranNo) throws Exception;

	// 구매내역조회(사용자)
	Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception;

	// 판매내역조회(관리자)
	Map<String, Object> getSaleList(Search search) throws Exception;

	// 구매정보수정
	int updatePurchase(Purchase purchase) throws Exception;

	// 거래상태코드변경(거래번호)
	void updateTranCode(int tranNo, String tranCode) throws Exception;

	// 거래상태코드변경(상품번호)
	void updateTranCodeByProd(int prodNo, String tranCode) throws Exception;

	// 최신거래상태조회(상품번호)
	String getLatestTranCodeByProd(int prodNo) throws Exception;

	// 최신거래상태조회(여러상품)
	Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	// 최신구매정보조회(여러상품)
	Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception;

	// 구매이력조회(상품)
	List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception;

	// 최신활성거래상태조회(여러상품)
	Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	void cancelPurchaseWithReason(int tranNo, String reason) throws Exception;

}
