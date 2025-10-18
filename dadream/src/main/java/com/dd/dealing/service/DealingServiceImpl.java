package com.dd.dealing.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.dd.dealing.dao.DealingDAO;
import com.dd.dealing.vo.BoardVO;
import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.JjimVO;
import com.dd.dealing.vo.KakaoLoginVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReplyVO;
import com.dd.dealing.vo.ReportVO;

@Service("dealingService")
@Transactional(propagation = Propagation.REQUIRED)
public class DealingServiceImpl implements DealingService {
	@Autowired
	private DealingDAO dealingDAO;

//	마이페이지에서 필요회원에대한 정보
	public MemberVO members(String user_Id) throws Exception {
		return dealingDAO.members(user_Id);
	}

//	회원가입
	@Override
	public int addMember(MemberVO member) throws DataAccessException {
		return dealingDAO.insertMember(member);
	}

//	회원가입 아이디 중복체크
	@Override
	public int idcheck(String user_Id) throws DataAccessException {

		int result = dealingDAO.idcheck(user_Id);
		return result;
	}

	/* 회원탈퇴 */
	@Override
	public void removeMem(String user_Id) throws Exception {
		dealingDAO.removeMem(user_Id);
	}

	/* 회원탈퇴 비번 체크 */
	@Override
	public int pwdCheck(@Param("user_Pwd") String user_Pwd, @Param("user_Id") String user_Id) throws Exception {
		int result = dealingDAO.pwdCheck(user_Pwd, user_Id);
		return result;

	}

//	로그인확인
	@Override
	public MemberVO login(MemberVO memberVO) throws Exception {
		return dealingDAO.loginById(memberVO);
	}

//	카카오 로그인 
	public int kakaologin(Map<String, Object> user) throws Exception {
		return dealingDAO.kakaologin(user);
	}

//	카카오 아이디 이름 반환
	public KakaoLoginVO kakaoresult(Map<String, Object> user) throws Exception {
		return dealingDAO.kakaoresult(user);
	}

	// 공실 검색
	@Override
	public List<DealingVO> gongsilSearch(Map<String, Object> gsMap) throws DataAccessException {
		List<DealingVO> dlReqp = dealingDAO.gongsilSearch(gsMap);
		return dlReqp;
	}

	// 매물 수정
	@Override
	public DealingVO modDealing(Map<String, Object> modDlmap) throws DataAccessException {
		DealingVO modDealingVO = dealingDAO.modDealing(modDlmap);
		return modDealingVO;
	}

	@Override
	public void modDealing2(Map<String, Object> dealingMap) throws DataAccessException {
		dealingDAO.modDealing2(dealingMap);
	}

	@Override
	public void deleteDealing(int dl_Num) throws DataAccessException {
		dealingDAO.deleteDealing(dl_Num);
	}

	// 매물등록
	@Override
	public int addNewdealing(Map<String, Object> dealingMap) throws DataAccessException {
		return dealingDAO.addNewdealing(dealingMap);
	}

//	매물 조회수
	public void viewCount(int dl_Num) throws DataAccessException {
		dealingDAO.viewCount(dl_Num);
	}

//	매물 전부 리스트 검색
	public List<DealingVO> allListdealing() throws DataAccessException {
		List<DealingVO> allListdealing = dealingDAO.allListdealing();
		return allListdealing;
	}

	// 지도 검색(건물형태 버튼)
	@Override
	public List<DealingVO> selectMap(Map<String, Object> dlSearch) throws DataAccessException {
		List<DealingVO> dlMap = dealingDAO.selectMap(dlSearch);
		return dlMap;
	}

	// 지도 검색(건물형태 버튼)
	@Override
	public List<DealingVO> selectMap3(Map<String, Object> dlSearch) throws DataAccessException {
		List<DealingVO> dlMap = dealingDAO.selectMap3(dlSearch);
		return dlMap;
	}

	// 지도창에서 검색
	@Override
	public List<DealingVO> selectMap2(Map<String, Object> dlMap) throws DataAccessException {
		List<DealingVO> dlReqp = dealingDAO.selectMap2(dlMap);
		return dlReqp;
	}

	/* 현재위치 검색 */
	@Override
	public List<DealingVO> hereMe(Map<String, Object> hereMap) throws DataAccessException {
		List<DealingVO> hereList = dealingDAO.hereMe(hereMap);
		return hereList;
	}

	/* 로컬스토리지 보류 */
	/* 메인페이지 검색조건 리스트 */
//	@Override
//	public List<DealingVO> dlMainMap(Map<String, Object> mainMap) throws DataAccessException {
//		List<DealingVO> dlMain = dealingDAO.dlMainMap(mainMap);
//		return dlMain;
//	}

	// 게시글 목록 조회
	@Override
	public List<BoardVO> listArticles() throws Exception {
		List<BoardVO> articlesList = null;
		articlesList = dealingDAO.selectAllArticlesList();
		return articlesList;
	}

	// 인테리어 상세보기
	@Override
	public BoardVO getBoardContents(int inte_Num) throws Exception {
		return dealingDAO.getBoardContents(inte_Num);
	}

	// 인테리어 글 등록
	@Override
	public int insertboard(Map<String, Object> boardMap) throws DataAccessException {
		return dealingDAO.insertboard(boardMap);
	}

	// 인테리어 글 수정
	@Override
	public void updateBoard(BoardVO boardVO) throws Exception {
		dealingDAO.updateBoard(boardVO);
	}

	// 인테리어 글 삭제
	@Override
	public void removeArticle(int inte_Num) throws Exception {
		dealingDAO.deleteArticle(inte_Num);
	}

	// 인테리어 수정
	@Override
	public void modArticle(Map<String, Object> boardMap) throws Exception {
		dealingDAO.updateArticle(boardMap);
	}

	/* 공지사항 상세보기 */
	@Override
	public NoticeVO getNoticeContents(int notice_Num) throws DataAccessException {
		return dealingDAO.getNoticeContents(notice_Num);
	}

	/* 공지사항 조회수 */
	@Override
	public void updateViewCnt(int viewCnt) throws Exception {
		dealingDAO.updateViewCnt(viewCnt);
	}

	// 공지사항 게시판 목록 조회
	@Override
	public List<NoticeVO> listNoticles() throws Exception {
		return dealingDAO.selectAllNoticlesList();
	}

	// 공지사항 글 등록
	@Override
	public int insertnotice(Map<String, Object> noticeMap) throws DataAccessException {
		return dealingDAO.insertnotice(noticeMap);
	}

	/* 공지사항 글 수정 */
	@Override
	public void noticeupdate(NoticeVO noticeVO) throws Exception {
		dealingDAO.noticeupdate(noticeVO);
	}

	/* 공지사항 글 삭제 */
	@Override
	public void removeNoticle(int notice_Num) throws Exception {
		dealingDAO.deleteNoticle(notice_Num);
	}

	@Override
	public void updateNotice(NoticeVO noticeVO) throws Exception {
		dealingDAO.updateNotice(noticeVO);
	}

	@Override
	public void modNoticle(Map noticeMap) throws Exception {
		dealingDAO.updateNoticle(noticeMap);
	}

	// 조회수 증가
	@Override
	public void updateView(int viewCounts) throws Exception {
		dealingDAO.updateView(viewCounts);
	}

	// 댓글 등록
	@Override
	public int rewrite(ReplyVO reply) throws Exception {
		return dealingDAO.rewrite(reply);
	}

	// 댓글 리스트
	@Override
	public ArrayList<ReplyVO> list(int inte_Num) throws Exception {
		return dealingDAO.list(inte_Num);
	}

	// 댓글 수정
	@Override
	public int modify(ReplyVO reply) throws Exception {
		System.out.println(reply);
		return dealingDAO.modify(reply);
	}

	// 댓글 삭제
	@Override
	public int remove(int reply_Num) throws Exception {
		return dealingDAO.remove(reply_Num);
	}

//	신고하기
	@Override
	public int addReport(Map<String, Object> report) throws DataAccessException {
		return dealingDAO.insertReport(report);
	}

	// 마이페이지 비밀번호 확인
	@Override
	public int infoCheck(MemberVO member) throws Exception {
		return dealingDAO.infoCheck(member);
	}

//	마이페이지 정보 변경
	@Override
	public int memberMod(MemberVO member) throws Exception {
		int check = 0;
		check = dealingDAO.modPwd(member);
		if (check == 1) {
			return dealingDAO.memMod(member);
		} else {

			return dealingDAO.memberMod(member);
		}

	}

	// 매물상세보기
	@Override
	public DealingVO getDealingContents(int dl_Num) throws Exception {
		return dealingDAO.getDealingContents(dl_Num);
	}

	/* 마이페이지 신고리스트 */
	@Override
	public List<ReportVO> myReport(String user_Id) throws DataAccessException {
		return dealingDAO.myReport(user_Id);
	}

	/* 마이페이지 신고리스트 */
	@Override
	public List<DealingVO> myDealing(String user_Id) throws DataAccessException {
		return dealingDAO.myDealing(user_Id);
	}

	// 마이페이지 내가 쓴 글
	@Override
	public List<BoardVO> myboardList(String user_Id) throws Exception {
		return dealingDAO.myboardList(user_Id);
	}

	/* 마이페이지 찜 목록 */
	@Override
	public List<JjimVO> myJjim(String user_Id) throws DataAccessException {
		return dealingDAO.myJjim(user_Id);
	}

	/* 찜 여부 체크 */
	@Override
	public int jjimCheck(Map jjimMap) throws Exception {
		int result = dealingDAO.jjimCheck(jjimMap);
		return result;
	}

	/* 찜 하기 */
	@Override
	public void jjim(Map jjimMap) throws Exception {
		dealingDAO.jjim(jjimMap);

	}

	/* 찜 취소 */
	@Override
	public void jjimRemove(Map jjimMap) throws Exception {
		dealingDAO.jjimRemove(jjimMap);

	}

	//	공실구매
	public int dlorder(Map<String, Object> map) throws DataAccessException {
		return dealingDAO.dlorder(map);
	}
	
	// 공실 구매하면 솔드아웃
		public void dlsold(String dl_Num) throws DataAccessException {
			dealingDAO.dlsold(dl_Num);
		}
}
