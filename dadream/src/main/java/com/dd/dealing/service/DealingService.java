package com.dd.dealing.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Param;
import org.springframework.dao.DataAccessException;

import com.dd.dealing.vo.BoardVO;
import com.dd.dealing.vo.DealingVO;
import com.dd.dealing.vo.JjimVO;
import com.dd.dealing.vo.KakaoLoginVO;
import com.dd.dealing.vo.MemberVO;
import com.dd.dealing.vo.NoticeVO;
import com.dd.dealing.vo.ReplyVO;
import com.dd.dealing.vo.ReportVO;

public interface DealingService {

	// 회원가입
	public int addMember(MemberVO member) throws DataAccessException;

//	회원가입 아이디 중복체크
	public int idcheck(String user_Id) throws DataAccessException;

//	로그인체크
	public MemberVO login(MemberVO memberVO) throws Exception;

	public void removeMem(String user_Id) throws Exception;

	public int pwdCheck(@Param("user_Pwd") String user_Pwd, @Param("user_Id") String user_Id) throws Exception;

//	카카오 로그인 
	public int kakaologin(Map<String, Object> user) throws Exception;

//	카카오 아이디 이름 반환
	public KakaoLoginVO kakaoresult(Map<String, Object> user) throws Exception;

//	지도검색
	public List<DealingVO> selectMap(Map<String, Object> dlSearch) throws DataAccessException;

	public List<DealingVO> selectMap3(Map<String, Object> dlSearch) throws DataAccessException;

	// 지도창에서 검색
	public List<DealingVO> selectMap2(Map<String, Object> dlMap) throws DataAccessException;

	// 공실센터 검색
	public List<DealingVO> gongsilSearch(Map<String, Object> gsMap) throws DataAccessException;

	// 매물수정 창 이동
	public DealingVO modDealing(Map<String, Object> modDlmap) throws DataAccessException;

	// 매물수정 하기
	public void modDealing2(Map<String, Object> dealingMap) throws DataAccessException;

	// 매물 삭제
	public void deleteDealing(int dl_Num) throws DataAccessException;

//	매물 전부검색
	public List<DealingVO> allListdealing() throws DataAccessException;

//	매물 조회수
	public void viewCount(int dl_Num) throws DataAccessException;

	// 매물등록
	public int addNewdealing(Map<String, Object> dealingMap) throws DataAccessException;

	// 인테리어게시판 등록
	public int insertboard(Map<String, Object> boardMap) throws DataAccessException;

	// 인테리어게시판 글 목록
	public List<BoardVO> listArticles() throws Exception;

	// 인테리어 게시글 수정완료
	public void modArticle(Map<String, Object> boardMap) throws Exception;

	// 인테리어 게시글 목록 가져오기
	public BoardVO getBoardContents(int inte_Num) throws Exception;

	// 인테리어 게시글 수정
	public void updateBoard(BoardVO boardVO) throws Exception;

	// 인테리어 게시글 삭제
	public void removeArticle(int inte_Num) throws Exception;

	// 공지사항 상세보기
	public NoticeVO getNoticeContents(int notice_Num) throws DataAccessException;

	// 공지사항 조회수
	public void updateViewCnt(int notice_Num) throws Exception;

	// 공지사항 글 목록
	public List<NoticeVO> listNoticles() throws Exception;

	// 공지사항 글 등록
	public int insertnotice(Map<String, Object> noticeMap) throws DataAccessException;

	// 공지사항 수정
	public void noticeupdate(NoticeVO noticeVO) throws Exception;

	// 공지사항 글 삭제
	public void removeNoticle(int notice_Num) throws Exception;

	// 공지사항 글 수정화면
	public void updateNotice(NoticeVO noticeVO) throws Exception;

	// 공지사항 수정 완료
	public void modNoticle(Map<String, Object> noticeMap) throws Exception;

	// 게시판 조회수 증가
	public void updateView(int viewCounts) throws Exception;

	// 댓글 작성
	public int rewrite(ReplyVO reply) throws Exception;

	// 댓글 목록
	public ArrayList<ReplyVO> list(int inte_Num) throws Exception;

	// 댓글 수정
	public int modify(ReplyVO reply) throws Exception;

	// 댓글 삭제
	public int remove(int reply_Num) throws Exception;

//	신고하기
	public int addReport(Map<String, Object> report) throws DataAccessException;

	// 마이페이지 비밀번호 확인
	public int infoCheck(MemberVO member) throws Exception;

//	마이페이지에서 필요회원에대한 정보
	public MemberVO members(String user_Id) throws Exception;

//	마이페이지 정보 변경
	public int memberMod(MemberVO member) throws Exception;

	// 매물상세보기
	public DealingVO getDealingContents(int dl_Num) throws Exception;

	// 마이페이지 신고리스트
	public List<ReportVO> myReport(String user_Id) throws DataAccessException;

	// 마이페이지 매물리스트
	public List<DealingVO> myDealing(String user_Id) throws DataAccessException;

	// 마이페이지 내가 쓴 게시글
	public List<BoardVO> myboardList(String user_Id) throws Exception;

	// 마이페이지 찜 목록
	public List<JjimVO> myJjim(String user_Id) throws DataAccessException;

	public int jjimCheck(Map jjimMap) throws Exception;

	public void jjim(Map jjimMap) throws Exception;

	public void jjimRemove(Map jjimMap) throws Exception;

	// 현재위치
	public List<DealingVO> hereMe(Map<String, Object> hereMap) throws DataAccessException;

	//	공실구매
	public int dlorder(Map<String, Object> map) throws DataAccessException;
	
	// 공실 구매하면 솔드아웃
	public void dlsold(String dl_Num) throws DataAccessException;
}
