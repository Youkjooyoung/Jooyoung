package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseService {

	// 구매등록
	void addPurchase(Purchase purchase) throws Exception;

	// 구매상세
	Purchase getPurchase(int tranNo) throws Exception;

	// 구매내역(사용자)
	Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception;

	// 판매내역(관리자)
	Map<String, Object> getSaleList(Search search) throws Exception;

	// 구매정보수정
	int updatePurchase(Purchase purchase) throws Exception;

	// 상태코드 변경(거래번호)
	void updateTranCode(int tranNo, String tranCode) throws Exception;

	// 상태코드 변경(상품번호)
	void updateTranCodeByProd(int prodNo, String tranCode) throws Exception;

	// 최신 상태코드(단일 상품)
	String getLatestTranCodeByProd(int prodNo) throws Exception;

	// 최신 상태코드(여러 상품)
	Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	// 최신 구매정보(여러 상품)
	Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception;

	// 특정 상품의 구매 이력
	List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception;

	// 활성 상태(001~004) 최신(여러 상품)
	Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	// 구매취소(사유 기록 + 코드 004)
	void cancelPurchaseWithReason(int tranNo, String reason) throws Exception;
}
