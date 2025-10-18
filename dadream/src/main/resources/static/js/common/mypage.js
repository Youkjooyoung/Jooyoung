
/*//////////////////////////////회원정보 변경////////////////////////////////////////*/

	
let infoPwdCheck2 = document.querySelector("#infoPwdCheck2");
let passwordcheck = document.querySelector(".passwordcheck");
let infoPwdCheck = document.querySelector("#infoPwdCheck");
let infoEmailCheck = document.querySelector("#infoEmailCheck");
let infoPhoneCheck = document.querySelector("#infoPhoneCheck");
let infoAddress2Check = document.querySelector("#infoAddress2Check");
let infoAddress3Check = document.querySelector("#infoAddress3Check");
		let userId = document.querySelector("#userId")		
let cnt = 1;
document.querySelector("#change").addEventListener("click", (e) => {
	e.preventDefault();
	if (cnt === 1) {
		let check = document.createElement("input");
		let btn = document.createElement("input");
		btn.setAttribute("type", "button");
		btn.setAttribute("id", "btn");
		btn.setAttribute("value", "비밀번호확인");
		check.setAttribute("type", "password");
		check.setAttribute("placeholder", "기존 비밀번호");
		passwordcheck.appendChild(check);
		passwordcheck.appendChild(btn);
		check.focus();
		cnt = 2;
		btn.addEventListener("click", async (e) => {
			console.log(check.value);
			if (e.target.matches("#btn")) {
				let pwd = await fetch("/infoCheck.do", {
					method: "POST",
					headers: {
						"content-type": "application/json"
					},
					body: JSON.stringify({
						user_Id: userId.value,
						user_Pwd: check.value
					})

				})
				if (pwd.status === 200) {
					let res = await pwd.json();
					if (res.userCheck === 1) {
						alert("확인되었습니다");
						passwordcheck.setAttribute("style", "display:none;");
						infoPwdCheck.removeAttribute("disabled");
						infoPwdCheck2.removeAttribute("disabled");
						infoEmailCheck.removeAttribute("disabled");
						infoPhoneCheck.removeAttribute("disabled");
						infoAddress2Check.removeAttribute("disabled");
						infoAddress3Check.removeAttribute("disabled");
						document.querySelector("#change").setAttribute("value",
							"수정하기");
						document.querySelector("#change").classList.add(
							"changeMod");
					} else {
						alert("비밀번호가 틀립니다.");
					}
					document.querySelector(".changeMod").addEventListener(
						"click", async (e) => {
							if (e.target.matches(".changeMod")) {
								if (!confirm("수정하시겠습니까?")) {
									return;
								}
								if (infoPwdCheck.value !== infoPwdCheck2
									.value) {
									alert("비밀번호가 일치하지않습니다.");
									infopwdCheck.focus();
									infoPwdCheck.value = '';
									infoPwdCheck2.value = '';
									return;
								}
								let mod = await fetch("/memberMod.do", {
									method: "POST",
									headers: {
										"content-type": "application/json"
									},
									body: JSON.stringify({
										user_Id: userId.value,
										user_Pwd: infoPwdCheck
											.value,
										user_Email: infoEmailCheck
											.value,
										user_Phone: infoPhoneCheck
											.value,
										user_Address2: infoAddress2Check
											.value,
										user_Address3: infoAddress3Check
											.value
									})
								})
								if (mod.status === 200) {
									let response = await mod.json();
									if (response.check === 1) {
										alert("수정이 완료되었습니다.");
										infoPwdCheck.disabled = true;
										infoPwdCheck2.disabled = true;
										infoEmailCheck.disabled = true;
										infoPhoneCheck.disabled = true;
										infoAddress2Check.disabled =
											true;
										infoAddress3Check.disabled =
											true;
										location.reload();
									}
								}
							}

						})
				}
			}
		})
	} else {
		e.preventDefault()
	}
})



/*//////////////////////////////회원정보////////////////////////////////////////*/
$(function() {
	$("#alert-success").hide();
	$("#alert-danger").hide();
	$("input").keyup(function() {
		var pwd1 = $("#pwd1").val();
		var pwd2 = $("#pwd2").val();
		if (pwd1 != "" || pwd2 != "") {
			if (pwd1 == pwd2) {
				$("#alert-success").show();
				$("#alert-danger").hide();
				$("submit").removeAttr("disabled");
			} else {
				$("#alert-success").hide();
				$("#alert-danger").show();
				$("submit").attr("disabled", "disabled");
			}
		}
	});
})

/*//////////////////////////////내가등록한방 삭제함수////////////////////////////////////////*/

function deleteSub(){
			if (!confirm("삭제하시겠습니까?")) {
				return false;
			}
		}

        