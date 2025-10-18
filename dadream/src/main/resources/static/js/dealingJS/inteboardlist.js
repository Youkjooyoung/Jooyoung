		function fn_addboard(isLogOn, addboard, login) {
			if (isLogOn != '' && isLogOn != 'false') {
				location.href = addboard;
		
			} else {
				alert("로그인 후 글쓰기가 가능합니다.")
				location.href = login + '?action=/login.do';
			}
		
		}
		function fn_search() {
			$("#listForm").submit();
			return false;
		}
		
