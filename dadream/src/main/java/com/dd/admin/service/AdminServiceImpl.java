package com.dd.admin.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.dd.admin.dao.AdminDAO;
import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.DlorderVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReportVO;
import com.dd.product.vo.OftVO;
import com.dd.product.vo.ProductVO;

@Service("adminSerivce")
@Transactional(propagation = Propagation.REQUIRED)
public class AdminServiceImpl implements AdminService {
	@Autowired
	private AdminDAO adminDAO;

	/* 신고목록 */
	@Override
	public List<ReportVO> reportsList() throws DataAccessException {
		return adminDAO.reportsList();
	}

	/* 신고내용 상세보기 */
	@Override
	public ReportVO reportView(int rp_Num) throws DataAccessException {
		return adminDAO.reportView(rp_Num);
	}

	/* 신고상태 변경 */
	@Override
	public void reportState(Map<String, Object> map) throws DataAccessException {
		adminDAO.reportState(map);
	}

	/* 신고삭제(관리자) */
	@Override
	public void deleteReport(int dl_ReportNum) throws DataAccessException {
		adminDAO.deleteReport(dl_ReportNum);
	}

	/* 신고삭제(여러개) */
	@Override
	public void deleteReport2(Map<String, Object> rpsMap) throws DataAccessException {
		adminDAO.deleteReport2(rpsMap);
	}

	/* 매물목록 */
	@Override
	public List<DealingVO> dealingsList() throws DataAccessException {
		return adminDAO.dealingsList();
	}

	/* 매물상세(관리자) */
	@Override
	public DealingVO adminDlView(int dl_Num) throws DataAccessException {
		return adminDAO.adminDlView(dl_Num);
	}

	/* 매물삭제(관리자) */
	@Override
	public void deleteDealing(Map<String, Object> dlsMap) throws DataAccessException {
		adminDAO.deleteDealing(dlsMap);
	}

	/* 유저 정보 */
	public List<MemberVO> adminMember() throws DataAccessException {
		return adminDAO.adminMember();
	}

	/* 상품조회 */
	@Override
	public List<ProductVO> adminpro() throws DataAccessException {
		return adminDAO.adminpro();
	}

	/* 공지사항 */
	@Override
	public List<NoticeVO> adminNoticeList() throws DataAccessException {
		return adminDAO.adminNoticeList();
	}

	/* 공지사항 상세보기 */
	@Override
	public NoticeVO adminNoticeView(int Notice_Num) throws DataAccessException {
		return adminDAO.adminNoticeView(Notice_Num);
	}

	/* 공지사항 수정 */
	@Override
	public void modNotice(NoticeVO noticeVO) throws DataAccessException {
		adminDAO.modNotice(noticeVO);
	}

	/* 공지사항 삭제 */
	@Override
	public void deleteNotice(Map<String, Object> ntsMap) throws DataAccessException {
		adminDAO.deleteNotice(ntsMap);
	}

	/* 공지사항 글쓰기 */
	@Override
	public void addNotice(NoticeVO noticeVO) throws DataAccessException {
		adminDAO.addNotice(noticeVO);
	}

//	허위 매물 막기 변경
	@Override
	public int levelPost(Map<String, Object> mem) throws Exception {
		return adminDAO.levelPost(mem);
	}
	/* 가구 매출 */
	@Override
	public List<Integer> proSum() throws Exception {
		return adminDAO.proSum();
	}

	/* 부동산 매출 */
	@Override
	public List<Integer> dlSum() throws Exception {
		return adminDAO.dlSum();
	}

	/* 가구매출 리스트 */
	@Override
	public List<OftVO> proList() throws Exception {
		return adminDAO.proList();
	}

	/* 부동산매출 리스트 */
	@Override
	public List<DlorderVO> dlList() throws Exception {
		return adminDAO.dlList();
	}
}
