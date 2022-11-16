/*---------------------------------------유효성검사---------------------------------------- */
function check() {

	//값 불러오기
	let getId = document.getElementById("user_Id");
	let getPw = document.getElementById("user_Pwd");
	let getPwCheck = document.getElementById("user_Pwd2");
	let getMail = document.getElementById("user_Email");
	let getName = document.getElementById("user_Name");



	//value 불러오기
	let user_Id = getId.value;
	let user_Pwd = getPw.value;
	let user_Pwd2 = getPwCheck.value;
	let user_Email = getMail.value;
	let user_Name = getName.value;


	//유효성 검사(정규식패턴)
	let regExp = /^[a-zA-Z0-9]{4,12}$/; //아이디 
	let regPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()+|=])[A-Za-z\d~!@#$%^&*()+|=]{8,16}$/; //비밀번호
	let regName = /^[가-힝]{2,}$/; //이름
	let regMail = /[a-z0-9]{2,}@[a-z0-9-]{2,}.[a-z0-9]{2,}/i; //이메일

	if (!regExp.test(user_Id)) { //id
		alert("아이디를 다시 입력하세요.");
		getId.value = "";
		getId.focus();
		return false;
	} else if (!regPw.test(user_Pwd)) { //password
		alert("비밀번호를 다시 입력하세요.");
		getPw.value = "";
		getPw.focus();
		return false;
	} else if (!(user_Pwd2.slice(0, user_Pwd2.length) == user_Pwd.slice(0, user_Pwd.length))) { //password 동일한지 확인
		alert("비밀번호가 일치하지 않습니다.");
		getPwCheck.value = "";
		getPwCheck.focus();
		return false;
	} else if ((user_Pwd.slice(0, user_Pwd2.length) == user_Id.slice(0, user_Id.length))) { //password랑 id 다른지 확인
		alert("비밀번호랑 ID가 동일합니다.");
		getPw.value = "";
		getPwCheck.value = "";
		getPw.focus();
		return false;
	} else if (!regMail.test(user_Email)) { //메일주소 확인
		alert("이메일형식에 맞게 작성하세요.");
		getMail.value = "";
		getMail.focus();
		return false;
	} else if (!regName.test(user_Name)) { //이름 확인
		alert("이름을 다시입력하세요.");
		getName.value = "";
		getName.focus();
		return false;
	} else if (ID !== 0) {
		alert("아이디 중복 체크 하여 주십쇼")
	}else if(success !== 1 ){
		alert("휴대폰 인증을 하여주십쇼")
	}
	else {
		document.querySelector("#userform").submit();
	}

}

/*---------------------------------------중복체그---------------------------------------- */

let ID = '';
const idcheck = document.querySelector("#idcheck");
idcheck.addEventListener("click", async (e) => {
	const idcheckresult = document.querySelector(".idcheckresult");
	const userId = document.querySelector("#user_Id").value;
	console.log(userId);
	e.preventDefault();
	const res = await fetch('/idcheck.do', {
		method: 'POST',
		headers: {
			'content-type': 'application/json'
		},
		body: JSON.stringify({
			user_Id: userId,

		})

	});
	if (res.status === 200) {
		let jsondata = await res.json();
		if (jsondata.resultCode !== 0) {
			alert("중복된 아이디가 있습니다");
			document.querySelector("#user_Id").value = '';
			return;
		} else if (jsondata.resultCode === 0) {
			alert("사용가능한 아이디입니다.");
			ID = 0;
		}
	} else {
		alert('예상치 못한 오류가 발생하였습니다.');
	}


});




/*---------------------------------------실시간 유효성검사---------------------------------------- */
document.querySelector("#userform").addEventListener("keyup", () => {

	$(document).ready(function() {
		// 기본형태 $('#registerForm').validate(); 유효성 검사를 적용 validate signup form on keyup
		// and submit 확장옵션
		$('#userform').validate({
			rules: {
				user_Id: {
					required: true,
					minlength: 4,
					remote: "Validate"
				},
				user_Pwd: "required",
				user_Pwd2: {
					required: true,
					equalTo: '#user_Pwd'
				},
				user_Name: {
					required: true
				},
				user_Email: {
					required: true,
					email: true
				}
			},
			messages: {
				user_Id: {
					required: "아이디를 입력하세요.",
					minlength: jQuery.validator.format("아이디는 {0}자 이상 입력해주세요!"),
					
				},
				user_Pwd: "비밀번호를 입력하세요.",
				user_Pwd2: {
					required: "비밀번호를 입력하시요.",
					equalTo: "비밀번호를 다시 확인하세요"
				},
				user_Name: {
					required: "이름을 입력하세요."
				},
				user_Email: {
					required: "이메일을 입력하세요.",
					email: "이메일 형식에 맞게 입력하세요."
				}
			},



			submitHandler: function(frm) {
				frm.submit();
				//유효성 검사를 통과시 전송
			},
			success: function(e) {
				//
			}

		});

	}); //end ready()
})
