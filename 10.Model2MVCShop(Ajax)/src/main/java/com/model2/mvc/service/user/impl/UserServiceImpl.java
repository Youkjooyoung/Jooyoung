package com.model2.mvc.service.user.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.user.UserDao;
import com.model2.mvc.service.user.UserService;;

//==> 회원관리 서비스 구현
@Service("userServiceImpl")
public class UserServiceImpl implements UserService {

	/// Field
	@Autowired
	@Qualifier("userDaoImpl")
	private UserDao userDao;

	@Value("#{commonProperties['user.defaultRole'] ?: 'user'}")
	private String defaultRole;

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	/// Constructor
	public UserServiceImpl() {
		System.out.println(this.getClass());
	}

	/// Method
	public void addUser(User user) throws Exception {
		userDao.addUser(user);
	}

	public User getUser(String userId) throws Exception {
		return userDao.getUser(userId);
	}

	public Map<String, Object> getUserList(Search search) throws Exception {
		List<User> list = userDao.getUserList(search);
		int totalCount = userDao.getTotalCount(search);

		Map<String, Object> map = new HashMap<String, Object>();
		map.put("list", list);
		map.put("totalCount", new Integer(totalCount));

		return map;
	}

	public void updateUser(User user) throws Exception {
		userDao.updateUser(user);
	}

	public boolean checkDuplication(String userId) throws Exception {
		boolean result = true;
		User user = userDao.getUser(userId);
		if (user != null) {
			result = false;
		}
		return result;
	}

	// 카카오 연동
	public User getUserByKakaoId(String kakaoId) throws Exception {
		return userDao.getUserByKakaoId(kakaoId);
	}

	// 구글 연동
	public User getUserByGoogleId(String googleId) throws Exception {
		return userDao.getUserByGoogleId(googleId);
	}

	// 추가정보
	public boolean isProfileComplete(User user) {
		// 필수 항목 예시: 이름/이메일/휴대폰/주소
		return notEmpty(user.getUserName()) && notEmpty(user.getEmail()) && notEmpty(user.getPhone())
				&& notEmpty(user.getAddr());
	}

	// 추가정보 저장
	public void completeProfile(User user) throws Exception {
		// 온보딩 저장은 곧 사용자 업데이트(중복 SQL 금지)
		userDao.updateUser(user);
	}

	private boolean isEmpty(String s) {
		return s == null || s.trim().isEmpty();
	}

	private boolean notEmpty(String s) {
		return !isEmpty(s);
	}
}