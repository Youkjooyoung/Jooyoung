package com.model2.mvc.service.user;

import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;

public interface UserService {
	void addUser(User user) throws Exception;

	User getUser(String userId) throws Exception;

	Map<String, Object> getUserList(Search search) throws Exception;

	void updateUser(User user) throws Exception;

	boolean checkDuplication(String userId) throws Exception;

	boolean existsEmail(String email, String excludeUserId) throws Exception;

	boolean existsPhone(String phone, String excludeUserId) throws Exception;

	User getUserByKakaoId(String kakaoId) throws Exception;

	User getUserByGoogleId(String googleId) throws Exception;

	boolean isProfileComplete(User user);

	void completeProfile(User user) throws Exception;
}
