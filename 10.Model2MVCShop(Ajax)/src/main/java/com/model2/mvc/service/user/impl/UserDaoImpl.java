package com.model2.mvc.service.user.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Repository;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.user.UserDao;

//==> 회원관리 DAO CRUD 구현
@Repository("userDaoImpl")
public class UserDaoImpl implements UserDao {

	/// Field
	@Autowired
	@Qualifier("sqlSessionTemplate")
	private SqlSession sqlSession;

	public void setSqlSession(SqlSession sqlSession) {
		this.sqlSession = sqlSession;
	}

	/// Constructor
	public UserDaoImpl() {
		System.out.println(this.getClass());
	}

	/// Method
	public void addUser(User user) throws Exception {
		sqlSession.insert("UserMapper.addUser", user);
	}

	public User getUser(String userId) throws Exception {
		return sqlSession.selectOne("UserMapper.getUser", userId);
	}

	public void updateUser(User user) throws Exception {
		sqlSession.update("UserMapper.updateUser", user);
	}

	public List<User> getUserList(Search search) throws Exception {
		return sqlSession.selectList("UserMapper.getUserList", search);
	}

	// 게시판 Page 처리를 위한 전체 Row(totalCount) return
	public int getTotalCount(Search search) throws Exception {
		return sqlSession.selectOne("UserMapper.getTotalCount", search);
	}

	// 카카오 연동
	public User getUserByKakaoId(String kakaoId) throws Exception {
		return sqlSession.selectOne("UserMapper.getUserByKakaoId", kakaoId);
	}

	// 구글 연동
	public User getUserByGoogleId(String googleId) throws Exception {
		return sqlSession.selectOne("UserMapper.getUserByGoogleId", googleId);
	}

	public boolean checkDuplication(String userId) throws Exception {
		Integer cnt = sqlSession.selectOne("UserMapper.countByUserId", userId);
		return cnt != null && cnt > 0;
	}

	public int countByEmail(String email, String excludeUserId) {
		Map<String, Object> p = new HashMap<>();
		p.put("email", email);
		p.put("excludeUserId", excludeUserId);
		return sqlSession.selectOne("UserMapper.countByEmail", p);
	}

	public int countByPhone(String phone, String excludeUserId) {
		Map<String, Object> p = new HashMap<>();
		p.put("phone", phone);
		p.put("excludeUserId", excludeUserId);
		return sqlSession.selectOne("UserMapper.countByPhone", p);
	}

	public void updateUserProfile(User user) {
		sqlSession.update("UserMapper.updateUser", user);
	}
}