package com.model2.mvc.web.user;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.*;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.user.UserService;

/**
 * UserRestController.java 회원 관리를 위한 RESTful API 컨트롤러 URL Prefix : /user/json/
 */
@RestController
@RequestMapping("/user/*")
public class UserRestController {

	@Autowired
	@Qualifier("userServiceImpl")
	private UserService userService;

	public UserRestController() {
		System.out.println("==> UserRestController 실행됨 : " + this.getClass());
	}

	/** 회원가입 */
	@PostMapping("json/addUser")
	public boolean addUser(@RequestBody User user) throws Exception {
		userService.addUser(user);
		return true;
	}

	/** 로그인 */
	@PostMapping("json/login")
	public Map<String, Object> login(@RequestBody User user, HttpSession session) throws Exception {
		Map<String, Object> result = new HashMap<>();
		User dbUser = userService.getUser(user.getUserId());

		if (dbUser != null && user.getPassword().equals(dbUser.getPassword())) {
			session.setAttribute("user", dbUser);
			session.setMaxInactiveInterval(60 * 60);
			result.put("success", true);
			result.put("user", dbUser);
		} else {
			result.put("success", false);
			result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
		}

		return result;
	}

	/** 로그아웃 */
	@PostMapping("json/logout")
	public Map<String, Object> logout(HttpSession session) {
		String loginType = (String) session.getAttribute("loginType");
		session.invalidate();
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("loginType", loginType);
		return result;
	}

	/** 회원 상세 조회 */
	@GetMapping("json/getUser/{userId}")
	public User getUser(@PathVariable String userId) throws Exception {
		return userService.getUser(userId);
	}

	/** 회원 목록 조회 */
	@PostMapping("json/getUserList")
	public Map<String, Object> getUserList(@RequestBody Search search) throws Exception {
		return userService.getUserList(search);
	}

	/** 회원 수정 */
	@PostMapping("json/updateUser")
	public boolean updateUser(@RequestBody User user) throws Exception {
		userService.updateUser(user);
		return true;
	}

	/** 아이디 중복 체크 */
	@GetMapping("json/checkDuplication/{userId}")
	public boolean checkDuplication(@PathVariable String userId) throws Exception {
		return userService.checkDuplication(userId);
	}

	/** 현재 로그인 사용자 조회 */
	@GetMapping("json/me")
	public Map<String, Object> me(HttpSession session) {
		Map<String, Object> res = new HashMap<>();
		User loginUser = (User) session.getAttribute("user");

		if (loginUser != null) {
			res.put("loggedIn", true);
			res.put("userId", loginUser.getUserId());
			res.put("userName", loginUser.getUserName());
			res.put("role", loginUser.getRole());
			res.put("phone", loginUser.getPhone());
			res.put("addr", loginUser.getAddr());
			res.put("email", loginUser.getEmail());
			res.put("zipcode", loginUser.getZipcode());
			res.put("addrDetail", loginUser.getAddrDetail());
		} else {
			res.put("loggedIn", false);
		}
		return res;
	}
	
	@PostMapping("json/completeProfile")
	public Map<String, Object> completeProfile(@RequestBody User req, HttpSession session) throws Exception {
		User loginUser = (User) session.getAttribute("user");
		if (loginUser == null) {
			throw new RuntimeException("세션이 만료되었습니다.");
		}
		req.setUserId(loginUser.getUserId());

		userService.completeProfile(req);

		User refreshed = userService.getUser(req.getUserId());
		session.setAttribute("user", refreshed);

		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("redirect", "/index.jsp");
		return result;
	}
}
