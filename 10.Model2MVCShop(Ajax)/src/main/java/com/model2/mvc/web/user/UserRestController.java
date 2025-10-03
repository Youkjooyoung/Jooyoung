package com.model2.mvc.web.user;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.user.UserService;

/**
 * UserRestController.java
 * 회원 관리를 위한 RESTful API 컨트롤러
 * URL Prefix : /user/json/
 */
@RestController
@RequestMapping("/user/*")
public class UserRestController {

    // UserService 주입 (userServiceImpl 빈을 주입)
    @Autowired
    @Qualifier("userServiceImpl")
    private UserService userService;

    public UserRestController() {
        System.out.println("==> UserRestController 실행됨 : " + this.getClass());
    }

    /**
     * 회원가입 요청 처리
     * @param user 회원 정보 (JSON 형식으로 전달됨)
     * @return 성공 여부 (true)
     */
    @PostMapping("json/addUser")
    public boolean addUser(@RequestBody User user) throws Exception {
        System.out.println("/user/json/addUser : POST 호출됨");
        userService.addUser(user);
        return true;
    }

    /**
     * 로그인 요청 처리
     * @param user 아이디 및 패스워드 정보 포함
     * @param session 로그인 성공 시 세션에 저장
     * @return DB에 저장된 사용자 정보 반환
     */
	@PostMapping("json/login")
	public Map<String, Object> login(@RequestBody User user, HttpSession session) throws Exception {
		Map<String, Object> result = new HashMap<>();
		User dbUser = userService.getUser(user.getUserId());

		if (dbUser != null && user.getPassword().equals(dbUser.getPassword())) {
			session.setAttribute("user", dbUser);
			result.put("success", true);
			result.put("user", dbUser);
		} else {
			result.put("success", false);
			result.put("message", "아이디 또는 비밀번호가 올바르지 않습니다.");
		}

		return result;
	}
    
    /** 로그아웃 (세션 무효화) */
    @PostMapping("json/logout")
    public Map<String, Object> logout(HttpSession session) {
        session.invalidate();
        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        return result;
    }

    /**
     * 회원 상세 조회
     * @param userId 조회할 회원의 ID
     * @return 사용자 정보 반환
     */
    @GetMapping("json/getUser/{userId}")
    public User getUser(@PathVariable String userId) throws Exception {
        System.out.println("/user/json/getUser : GET 호출됨");
        return userService.getUser(userId);
    }

    /**
     * 회원 리스트 조회 (검색 + 페이징 지원)
     * @param search 검색 조건 객체 (currentPage, searchKeyword 등 포함)
     * @return 회원 목록 및 전체 수 등의 정보 포함 Map 반환
     */
    @PostMapping("json/getUserList")
    public Map<String, Object> getUserList(@RequestBody Search search) throws Exception {
        System.out.println("/user/json/getUserList : POST 호출됨");
        return userService.getUserList(search);
    }

    /**
     * 회원 정보 수정
     * @param user 수정할 사용자 정보
     * @return 성공 여부 (true)
     */
    @PostMapping("json/updateUser")
    public boolean updateUser(@RequestBody User user) throws Exception {
        System.out.println("/user/json/updateUser : POST 호출됨");
        userService.updateUser(user);
        return true;
    }

    /**
     * 아이디 중복 확인
     * @param userId 중복 체크할 아이디
     * @return 중복 여부 (true: 중복 있음, false: 중복 없음)
     */
    @GetMapping("json/checkDuplication/{userId}")
    public boolean checkDuplication(@PathVariable String userId) throws Exception {
        System.out.println("/user/json/checkDuplication : GET 호출됨");
        return userService.checkDuplication(userId);
    }

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
}