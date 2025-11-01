package com.model2.mvc.service.user.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.user.UserDao;
import com.model2.mvc.service.user.UserService;;

@Service("userServiceImpl")

@Transactional()
public class UserServiceImpl implements UserService {

	@Autowired
	@Qualifier("userDao")
	private UserDao userDao;

	public void setUserDao(UserDao userDao) {
		this.userDao = userDao;
	}

	public UserServiceImpl() {
	}

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

	public User getUserByKakaoId(String kakaoId) throws Exception {
		return userDao.getUserByKakaoId(kakaoId);
	}

	public User getUserByGoogleId(String googleId) throws Exception {
		return userDao.getUserByGoogleId(googleId);
	}

	public boolean isProfileComplete(User user) {
		return notEmpty(user.getUserName()) && notEmpty(user.getEmail()) && notEmpty(user.getPhone())
				&& notEmpty(user.getAddr());
	}

	public boolean existsEmail(String email, String excludeUserId) throws Exception {
		if (email == null || email.isEmpty())
			return false;
		return userDao.countByEmail(email, excludeUserId) > 0;
	}

	public boolean existsPhone(String phone, String excludeUserId) throws Exception {
		if (phone == null || phone.isEmpty())
			return false;
		return userDao.countByPhone(phone, excludeUserId) > 0;
	}

	public void completeProfile(User user) throws Exception {
		userDao.updateUserProfile(user);
	}

	private boolean isEmpty(String s) {
		return s == null || s.trim().isEmpty();
	}

	private boolean notEmpty(String s) {
		return !isEmpty(s);
	}
}