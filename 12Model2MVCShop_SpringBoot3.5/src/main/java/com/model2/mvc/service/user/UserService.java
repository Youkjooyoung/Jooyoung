package com.model2.mvc.service.user;

import java.util.Map;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;

//==> 회원관리에서 서비스할 내용 추상화/캡슐화한 Service  Interface Definition  
public interface UserService {

	// 회원가입
	public void addUser(User user) throws Exception;

	// 내정보확인 / 로그인
	public User getUser(String userId) throws Exception;

	// 회원정보리스트
	public Map<String, Object> getUserList(Search search) throws Exception;

	// 회원정보수정
	public void updateUser(User user) throws Exception;

	// 회원 ID 중복 확인
	public boolean checkDuplication(String userId) throws Exception;

	boolean existsEmail(String email, String excludeUserId) throws Exception;

	boolean existsPhone(String phone, String excludeUserId) throws Exception;

	// 소셜 연동
	User getUserByKakaoId(String kakaoId) throws Exception;

	User getUserByGoogleId(String googleId) throws Exception;

	// 프로필 필수정보 완료 여부
	boolean isProfileComplete(User user);

}