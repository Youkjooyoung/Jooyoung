package com.model2.mvc.service.purchase;

import java.util.List;
import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.Purchase;

public interface PurchaseService {

	/**
	 * 새로운 구매 등록 - 사용자가 상품을 구매할 때 Purchase 객체를 INSERT
	 */
	void addPurchase(Purchase purchase) throws Exception;

	/**
	 * 단일 구매 상세 조회 - tranNo(거래번호) 기준으로 Purchase 1건 조회
	 */
	Purchase getPurchase(int tranNo) throws Exception;

	/**
	 * 구매 내역 목록 조회 (구매자 시점) - 특정 사용자(buyerId)의 구매 내역을 검색/페이징과 함께 조회 - 반환: list +
	 * totalCount 등 Map 구조
	 */
	Map<String, Object> getPurchaseList(Search search, String buyerId) throws Exception;

	/**
	 * 판매 내역 목록 조회 (관리자 시점) - 모든 구매 내역을 검색/페이징과 함께 조회 - 반환: list + totalCount 등 Map
	 * 구조
	 */
	Map<String, Object> getSaleList(Search search) throws Exception;

	/**
	 * 구매 정보 수정 - 배송지, 수령인, 요청사항 등 구매 상세정보 UPDATE
	 * 
	 * @return
	 */
	int updatePurchase(Purchase purchase) throws Exception;

	/**
	 * 거래 상태코드 변경 (거래번호 기준) - 주문완료 → 배송중 → 배송완료 → 취소 등 tranNo 단위로 상태 UPDATE
	 */
	void updateTranCode(int tranNo, String tranCode) throws Exception;

	/**
	 * 거래 상태코드 변경 (상품번호 기준) - 특정 상품(prodNo)의 최신 거래 상태를 UPDATE - 관리자 판매목록 화면에서 사용
	 */
	void updateTranCodeByProd(int prodNo, String tranCode) throws Exception;

	/**
	 * 단일 상품의 최신 거래 상태 조회 - 특정 상품(prodNo)의 가장 최근 거래 상태 코드 반환
	 */
	String getLatestTranCodeByProd(int prodNo) throws Exception;

	/**
	 * 여러 상품의 최신 거래 상태 조회 - 리스트 화면에서 상품별 상태 표시 용도 - 반환: {prodNo=tranCode} 형태의 Map
	 */
	Map<Integer, String> getLatestTranCodeByProdNos(List<Integer> prodNos) throws Exception;

	Map<Integer, Map<String, Object>> getLatestPurchaseInfoByProdNos(List<Integer> prodNos) throws Exception;

	List<Purchase> getPurchaseHistoryByProduct(int prodNo) throws Exception;

	Map<Integer, String> getLatestActiveTranCodeByProdNos(List<Integer> prodNos) throws Exception;
}
