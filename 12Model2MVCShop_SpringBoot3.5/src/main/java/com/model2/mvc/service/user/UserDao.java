package com.model2.mvc.service.user;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;

@Mapper
public interface UserDao {

	public void addUser(User user) throws Exception;

	public User getUser(String userId) throws Exception;

	public List<User> getUserList(Search search) throws Exception;

	public void updateUser(User user) throws Exception;

	public int getTotalCount(Search search) throws Exception;

	boolean checkDuplication(String userId) throws Exception;

	int countByEmail(@Param("email") String email, @Param("excludeUserId") String excludeUserId) throws Exception;

	int countByPhone(@Param("phone") String phone, @Param("excludeUserId") String excludeUserId) throws Exception;

	User getUserByKakaoId(String kakaoId) throws Exception;

	User getUserByGoogleId(String googleId) throws Exception;

	void updateUserProfile(User user) throws Exception;

}