package com.dd.admin.dao;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Repository;

import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.DlorderVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReportVO;
import com.dd.product.vo.OftVO;
import com.dd.product.vo.ProductVO;

@Mapper
@Repository("adminDAO")
public interface AdminDAO {
	/* 신고목록 */
	public List<ReportVO> reportsList() throws DataAccessException;

	/* 신고내역 상세보기 */
	public ReportVO reportView(int rp_Num) throws DataAccessException;

	/* 신고상태 변경 */
	public void reportState(Map<String, Object> map) throws DataAccessException;

	/* 신고삭제 */
	public void deleteReport(int dl_ReportNum) throws DataAccessException;

	/* 신고삭제(여러개) */
	public void deleteReport2(Map<String, Object> rpsMap) throws DataAccessException;

	/* 매물목록 */
	public List<DealingVO> dealingsList() throws DataAccessException;

	/* 매물 상세보기(관리자) */
	public DealingVO adminDlView(int rp_Num) throws DataAccessException;

	/* 매물삭제(관리자) */
	public void deleteDealing(Map<String, Object> dlsMap) throws DataAccessException;

	/* 상품조회 */
	public List<ProductVO> adminpro() throws DataAccessException;

	/* 유저 정보 */
	public List<MemberVO> adminMember() throws DataAccessException;

	/* 공지사항 */
	public List<NoticeVO> adminNoticeList() throws DataAccessException;

	/* 공지사항 상세보기 */
	public NoticeVO adminNoticeView(int Notice_Num) throws DataAccessException;

	/* 공지사항 수정 */
	public void modNotice(NoticeVO noticeVO) throws DataAccessException;

	/* 공지사항 삭제 */
	public void deleteNotice(Map<String, Object> ntsMap) throws DataAccessException;

	/* 공지사항 글쓰기 */
	public void addNotice(NoticeVO noticeVO) throws DataAccessException;

//	허위 매물 막기 변경
	public int levelPost(Map<String, Object> mem) throws Exception;
	
	/* 가구 판매량 */
	public List<Integer> proSum() throws DataAccessException;

	/* 부동산 판매량 */
	public List<Integer> dlSum() throws DataAccessException;

	/* 가구판매량 리스트 */
	public List<OftVO> proList() throws DataAccessException;

	/* 부동산판매량 리스트 */
	public List<DlorderVO> dlList() throws DataAccessException;
}
