package com.model2.mvc.web.user;

import java.net.URLEncoder;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.model2.mvc.common.Page;
import com.model2.mvc.common.Search;
import com.model2.mvc.service.domain.User;
import com.model2.mvc.service.kakao.KakaoOAuthService;
import com.model2.mvc.service.kakao.KakaoService;
import com.model2.mvc.service.user.UserService;

//==> 회원관리 Controller
@Controller
@RequestMapping("/user/*")
public class UserController {
	
	///Field
	@Autowired
	@Qualifier("userServiceImpl")
	private UserService userService;

	@Autowired
	@Qualifier("kakaoService")
	private KakaoService kakaoService;

	@Autowired
	@Qualifier("kakaoOAuthService")
	private KakaoOAuthService kakaoOAuthService;

	// Kakao OAuth 설정값
	@Value("#{commonProperties['kakao.clientId']}")
	private String kakaoClientId;

	@Value("#{commonProperties['kakao.logoutRedirectUri']}")
	private String kakaoLogoutRedirectUri;

	@Value("#{commonProperties['pageUnit']}")
	private int pageUnit;

	@Value("#{commonProperties['pageSize']}")
	private int pageSize;

	public UserController(){
		System.out.println(this.getClass());
	}
	
	@RequestMapping( value="addUser", method=RequestMethod.GET )
	public String addUser() throws Exception{
	
		System.out.println("/user/addUser : GET");
		
		return "redirect:/user/addUserView.jsp";
	}
	
	@RequestMapping( value="addUser", method=RequestMethod.POST )
	public String addUser( @ModelAttribute("user") User user ) throws Exception {

		System.out.println("/user/addUser : POST");
		//Business Logic
		userService.addUser(user);
		
		return "redirect:/user/loginView.jsp";
	}
	

	@RequestMapping( value="getUser", method=RequestMethod.GET )
	public String getUser( @RequestParam("userId") String userId , Model model ) throws Exception {
		
		System.out.println("/user/getUser : GET");
		//Business Logic
		User user = userService.getUser(userId);
		// Model 과 View 연결
		model.addAttribute("user", user);
		
		return "forward:/user/getUser.jsp";
	}
	

	@RequestMapping( value="updateUser", method=RequestMethod.GET )
	public String updateUser( @RequestParam("userId") String userId , Model model ) throws Exception{

		System.out.println("/user/updateUser : GET");
		//Business Logic
		User user = userService.getUser(userId);
		// Model 과 View 연결
		model.addAttribute("user", user);
		
		return "forward:/user/updateUser.jsp";
	}

	@RequestMapping( value="updateUser", method=RequestMethod.POST )
	public String updateUser( @ModelAttribute("user") User user , Model model , HttpSession session) throws Exception{

		System.out.println("/user/updateUser : POST");
		//Business Logic
		userService.updateUser(user);
		
		String sessionId=((User)session.getAttribute("user")).getUserId();
		if(sessionId.equals(user.getUserId())){
			session.setAttribute("user", user);
		}
		
		return "redirect:/user/getUser?userId="+user.getUserId();
	}
	
	
	@RequestMapping( value="login", method=RequestMethod.GET )
	public String login() throws Exception{
		
		System.out.println("/user/logon : GET");

		return "redirect:/user/loginView.jsp";
	}
	
	@RequestMapping( value="login", method=RequestMethod.POST )
	public String login(@ModelAttribute("user") User user , HttpSession session ) throws Exception{
		
		System.out.println("/user/login : POST");
		//Business Logic
		User dbUser=userService.getUser(user.getUserId());
		
		if( user.getPassword().equals(dbUser.getPassword())){
			session.setAttribute("user", dbUser);
		}
		
		return "redirect:/index.jsp";
	}
		
	//카카오 API 로그아웃 호출
	@RequestMapping(value="logout", method={RequestMethod.GET, RequestMethod.POST})
	public String logout(HttpSession session) throws Exception {
	    System.out.println("/user/logout : LOGOUT");

	    String loginType = (String) session.getAttribute("loginType");
	    session.invalidate();

	    if ("kakao".equals(loginType)) {
	        String kakaoLogoutUrl = "https://kauth.kakao.com/oauth/logout"
	                + "?client_id=" + kakaoClientId
	                + "&logout_redirect_uri=" + URLEncoder.encode(kakaoLogoutRedirectUri, "UTF-8");
	        return "redirect:" + kakaoLogoutUrl;
	    }

	    return "redirect:http://localhost:8080";
	}

	
	
	@RequestMapping( value="checkDuplication", method=RequestMethod.POST )
	public String checkDuplication( @RequestParam("userId") String userId , Model model ) throws Exception{
		
		System.out.println("/user/checkDuplication : POST");
		//Business Logic
		boolean result=userService.checkDuplication(userId);
		// Model 과 View 연결
		model.addAttribute("result", new Boolean(result));
		model.addAttribute("userId", userId);

		return "forward:/user/checkDuplication.jsp";
	}

	
	@RequestMapping( value="listUser" )
	public String listUser( @ModelAttribute("search") Search search , Model model , HttpServletRequest request) throws Exception{
		
		System.out.println("/user/listUser : GET / POST");
		
		if(search.getCurrentPage() ==0 ){
			search.setCurrentPage(1);
		}
		search.setPageSize(pageSize);
		
		// Business logic 수행
		Map<String , Object> map=userService.getUserList(search);
		
		Page resultPage = new Page( search.getCurrentPage(), ((Integer)map.get("totalCount")).intValue(), pageUnit, pageSize);
		System.out.println(resultPage);
		
		// Model 과 View 연결
		model.addAttribute("list", map.get("list"));
		model.addAttribute("resultPage", resultPage);
		model.addAttribute("search", search);
		
		return "forward:/user/listUser.jsp";
	}
	
	@GetMapping("/kakao/callback")
	public String kakaoCallback(@RequestParam("code") String code, HttpSession session) throws Exception {
		String accessToken = kakaoOAuthService.getAccessToken(code);
		User kakaoUser = kakaoOAuthService.getUserInfo(accessToken);

		User dbUser = userService.getUserByKakaoId(kakaoUser.getKakaoId());
		if (dbUser == null) {
			userService.addUser(kakaoUser);
			dbUser = kakaoUser;
		} else {
			boolean patch = false;
			if ((dbUser.getEmail() == null || dbUser.getEmail().isEmpty()) && kakaoUser.getEmail() != null) {
				dbUser.setEmail(kakaoUser.getEmail());
				patch = true;
			}
			if ((dbUser.getUserName() == null || dbUser.getUserName().isEmpty()) && kakaoUser.getUserName() != null) {
				dbUser.setUserName(kakaoUser.getUserName());
				patch = true;
			}
			if ((dbUser.getProfileImg() == null || dbUser.getProfileImg().isEmpty())
					&& kakaoUser.getProfileImg() != null) {
				dbUser.setProfileImg(kakaoUser.getProfileImg());
				patch = true;
			}
			if (patch)
				userService.updateUser(dbUser);
		}

		// 표시용 아이디(세션): 이메일 > 닉네임 > kakaoId
		String displayId = (dbUser.getEmail() != null && !dbUser.getEmail().isEmpty()) ? dbUser.getEmail()
				: (dbUser.getUserName() != null && !dbUser.getUserName().isEmpty()) ? dbUser.getUserName()
						: dbUser.getKakaoId();

		session.setAttribute("user", dbUser);
		session.setAttribute("loginType", "kakao");
		session.setAttribute("kakaoAccessToken", accessToken);
		session.setAttribute("displayId", displayId);

		if (!userService.isProfileComplete(dbUser)) {
			return "redirect:/user/onboardView.jsp";
		}
		return "redirect:/index.jsp";
	}
	
	/** 온보딩 완료(JSON) - JSP와 100% 디커플링 */
	@RequestMapping(value = "/json/completeProfile", method = RequestMethod.POST, produces = "application/json; charset=UTF-8")
	public @ResponseBody Map<String, Object> completeProfileJson(@RequestBody User req, HttpSession session)
			throws Exception {
		User loginUser = (User) session.getAttribute("user");
		// 보안: 세션 사용자 기준으로만 업데이트
		req.setUserId(loginUser.getUserId());

		userService.completeProfile(req);
		// 최신 정보로 세션 갱신
		User refreshed = userService.getUser(req.getUserId());
		session.setAttribute("user", refreshed);

		Map<String, Object> result = new java.util.HashMap<>();
		result.put("success", true);
		result.put("redirect", "/index.jsp");
		return result;
	}
}