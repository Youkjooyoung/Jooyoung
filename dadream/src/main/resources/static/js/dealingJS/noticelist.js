		function fn_addnotice(isLogOn, addnotice, login) {
				if(isLogOn != '' && isLogOn != 'false') {
					location.href=addnotice;
					
				} else {
					alert("로그인 후 글쓰기가 가능합니다.")
					location.href=login + '?action=/login.do';
				}
			}
