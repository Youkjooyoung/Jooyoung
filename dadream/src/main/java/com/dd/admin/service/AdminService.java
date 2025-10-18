package com.dd.admin.service;

import java.util.List;
import java.util.Map;

import org.springframework.dao.DataAccessException;

import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.DlorderVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReportVO;
import com.dd.product.vo.OftVO;
import com.dd.product.vo.ProductVO;

public interface AdminService {

	public List<ReportVO> reportsList() throws DataAccessException;

	public ReportVO reportView(int rp_Num) throws DataAccessException;

	public void reportState(Map<String, Object> map) throws DataAccessException;

	public void deleteReport(int dl_ReportNum) throws DataAccessException;

	public void deleteReport2(Map<String, Object> rpsMap) throws DataAccessException;

	public List<DealingVO> dealingsList() throws DataAccessException;

	public DealingVO adminDlView(int dl_Num) throws DataAccessException;

	public void deleteDealing(Map<String, Object> dlsMap) throws DataAccessException;

//	상품조회
	public List<ProductVO> adminpro() throws DataAccessException;

	/* 유저 정보 */
	public List<MemberVO> adminMember() throws DataAccessException;

	/* 공지사항 */
	public List<NoticeVO> adminNoticeList() throws DataAccessException;

	/* 공지사항 상세보기 */
	public NoticeVO adminNoticeView(int Notice_Num) throws DataAccessException;

	/* 공지사항 수정 */
	public void modNotice(NoticeVO noticeVO) throws DataAccessException;

	public void deleteNotice(Map<String, Object> ntsMap) throws DataAccessException;

	public void addNotice(NoticeVO noticeVO) throws DataAccessException;

//	허위 매물 막기 변경
	public int levelPost(Map<String, Object> mem) throws Exception;
	
	public List<Integer> proSum() throws Exception;

	public List<Integer> dlSum() throws Exception;

	public List<OftVO> proList() throws Exception;

	public List<DlorderVO> dlList() throws Exception;
}
