package com.model2.mvc.web.user;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.google.GoogleOAuthService;
import com.model2.mvc.service.kakao.KakaoOAuthService;
import com.model2.mvc.service.user.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/user/*")
public class UserRestController {

	@Autowired
	@Qualifier("userServiceImpl")
	private UserService userService;
	@Autowired
	@Qualifier("kakaoOAuthService")
	private KakaoOAuthService kakaoOAuthService;
	@Value("#{commonProperties['kakao.clientId']}")
	private String kakaoClientId;

	@Value("#{commonProperties['kakao.logoutRedirectUri']}")
	private String kakaoLogoutRedirectUri;

	@Autowired
	@Qualifier("googleOAuthService")
	private GoogleOAuthService googleOAuthService;

	@Value("#{commonProperties['google.clientId']}")
	private String googleClientId;

	@Value("#{commonProperties['google.redirectUri']}")
	private String googleRedirectUri;

	public UserRestController() {
		System.out.println("==> UserRestController 실행됨 : " + this.getClass());
	}

	@PostMapping("json/addUser")
	public boolean addUser(@RequestBody User user) throws Exception {
		userService.addUser(user);
		return true;
	}

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

	@PostMapping("json/logout")
	public Map<String, Object> logout(HttpSession session) {
		String loginType = (String) session.getAttribute("loginType");
		session.invalidate();
		Map<String, Object> result = new HashMap<>();
		result.put("success", true);
		result.put("loginType", loginType);
		return result;
	}

	@GetMapping("json/getUser/{userId}")
	public User getUser(@PathVariable String userId) throws Exception {
		return userService.getUser(userId);
	}

	@PostMapping("json/getUserList")
	public Map<String, Object> getUserList(@RequestBody Search search) throws Exception {
		return userService.getUserList(search);
	}

	@PostMapping("json/updateUser")
	public boolean updateUser(@RequestBody User user) throws Exception {
		userService.updateUser(user);
		return true;
	}

	@GetMapping("json/checkDuplication/{userId}")
	public boolean checkDuplication(@PathVariable String userId) throws Exception {
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

	@PostMapping("json/completeProfile")
	public Map<String, Object> completeProfile(@RequestBody User req, HttpSession session) throws Exception {
		System.out.println("===== [completeProfile] 요청 수신 =====");
		System.out.println("수신 데이터 : " + req);

		Map<String, Object> result = new HashMap<>();
		User loginUser = (User) session.getAttribute("user");
		if (loginUser == null) {
			result.put("success", false);
			result.put("message", "세션이 만료되었습니다. 다시 로그인해주세요.");
			return result;
		}
		String myId = loginUser.getUserId();
		req.setUserId(myId);

		if (req.getUserName() == null || req.getUserName().trim().isEmpty())
			return msg(false, "이름을 입력해주세요.");
		String email = req.getEmail();
		if (email == null || email.trim().isEmpty()
				|| !email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,10}$"))
			return msg(false, "이메일 형식이 올바르지 않습니다.");
		String phone = req.getPhone();
		if (phone == null || phone.trim().isEmpty() || !phone.matches("^\\d{2,3}-\\d{3,4}-\\d{4}$"))
			return msg(false, "전화번호 형식이 올바르지 않습니다. 예) 010-1234-5678");
		if (req.getZipcode() == null || req.getZipcode().trim().isEmpty())
			return msg(false, "우편번호를 입력해주세요.");
		if (req.getAddr() == null || req.getAddr().trim().isEmpty())
			return msg(false, "기본 주소를 입력해주세요.");
		if (userService.existsEmail(req.getEmail(), myId))
			return msg(false, "이미 사용 중인 이메일입니다.");
		if (userService.existsPhone(req.getPhone(), myId))
			return msg(false, "이미 사용 중인 전화번호입니다.");

		try {
			userService.completeProfile(req);
		} catch (Exception e) {
			e.printStackTrace();
			return msg(false, "DB 저장 중 오류가 발생했습니다.");
		}

		User refreshed = userService.getUser(myId);
		session.setAttribute("user", refreshed);
		result.put("success", true);
		result.put("redirect", "/index.jsp");
		System.out.println(" [completeProfile] 프로필 저장 완료 : " + refreshed.getUserId());
		return result;
	}

	private Map<String, Object> msg(boolean ok, String message) {
		Map<String, Object> res = new HashMap<>();
		res.put("success", ok);
		res.put("message", message);
		return res;
	}

	@GetMapping("json/existsEmail")
	public Map<String, Object> existsEmail(@RequestParam String email, HttpSession session) throws Exception {
		User me = (User) session.getAttribute("user");
		boolean exists = userService.existsEmail(email, me != null ? me.getUserId() : null);
		Map<String, Object> res = new HashMap<>();
		res.put("exists", exists);
		return res;
	}

	@GetMapping("json/existsPhone")
	public Map<String, Object> existsPhone(@RequestParam String phone, HttpSession session) throws Exception {
		User me = (User) session.getAttribute("user");
		boolean exists = userService.existsPhone(phone, me != null ? me.getUserId() : null);
		Map<String, Object> res = new HashMap<>();
		res.put("exists", exists);
		return res;
	}

}
