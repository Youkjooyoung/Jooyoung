$(document).ready(function() {
	console.log();
	//boardview.jsp가 시작되자마자 inte_Num값을 가져오려면 document.ready 아래에 선언
	var inte_NumValue = $("input[name='inte_Num']").val();

	list(inte_NumValue);
	///////////////////////////////////리스트 함수///////////////////////////////////////////
	function list(inte_Num) {



		$("#load").on("click", function(e) {
			e.preventDefault();
			$(".Replyeachform:hidden").slice(0, 3).show();
			if ($(".Replyeachform:hidden").length == 0) {
				alert("마지막 댓글 입니다");

			}

		});

		$.getJSON("/replies/" + inte_Num, function(data) {


			var str = "";

			if (data.length > 0) {

				for (var i = 0; i < data.length; i++) {		//for 안에 넣으면 댓글 수만큼 반복되게 됨.


					str += `<div class="Replyeachform" style="display : none;">`
					str += `<div id="writer_Date">`
					str += `<li style="font-size:larger; font-weight:bolder;">${data[i].user_Id}</li>&nbsp;&nbsp;`
					str += `<li id="Date">${data[i].reply_regDate}</li>`

					if ($('#user_id').text() === data[i].user_Id) {


						str += `<div id="mod_del">`
						str += `<li id="Modify_Delete"><button type="button" class="update" data-reply_Num=${data[i].reply_Num} value=${data[i].reply_Num}>수정</button>` //value값에 넣어서 던져줌
						str += `<button type="button" class="remove" data-reply_Num=${data[i].reply_Num} value=${data[i].reply_Num}>삭제</button></li>`
						str += `</div>`


					}
					str += `</div>`

					str += `<li><textarea class="content_area" id="replycontent${data[i].reply_Num}">${data[i].reply_content}</textarea></li>`
					str += `</div>`






				}
			} else {
				str += `<div class="No_reply">`;
				str += `<h6><strong>등록된 댓글이 없습니다.</strong></h6>`;
				str += `</div>`;
			}
			$("#replyUL").html(str);

		});

		more();	//// <-----더보기함수  호출		
	}//list 함수 끝




	//////////////////////////////////댓글 쓰기////////////////////////////////////////////			
	$("#btn_add").on("click", function() {// 댓글 쓰기 쓰기 버튼을 클릭하면


		var reply_contentValue = $("#reply_content").val();
		var user_IdValue = $("#user_Id").val(); //세션값으로 받아옴
		var reply_regDateValue = $("#reply_regDate").val();
		var reply_NumValue = $("#reply_Num").val();

		add({
			inte_Num: inte_NumValue, reply_content: reply_contentValue, user_Id: user_IdValue
			, reply_regDate: reply_regDateValue, reply_Num: reply_NumValue
		});
		//댓글 쓰기를 위한 함수 호출
	})

	function add(reply_content) {
		$.ajax({			//비동기식 준비!
			type: "post",	//POST method 방식
			url: "/replies/new",		//컨트롤러 value맵핑 이름과 일치시켜주면됨
			data: JSON.stringify(reply_content),		// stringfy는 ajax형식에 맞게 보내기 위한 함수
			contentType: "application/json; charset=utf-8",	//필수적인 요소는 X, 웹에게 명령
			success: function(result) {
				if (result == "success") {
					alert("댓글등록 성공");
					location.reload();
				}
				$("#reply_content").val('')

			},
			error: function() {
				alert("로그인 후 이용하세요.");
				location.replace("/login.do");

			}

		})

	}		//add 함수 끝



	///////////////////////////////////댓글 수정  함수///////////////////////////////////////
	$("#chat").on("click", ".update", function() {		//수정 버튼을 클릭하면

		var reply_Num = this.value;  //value라는 애를 num에다가 넣어준다
		var reply_content = $("#replycontent" + reply_Num).val();  //"#replycontent"+reply_Num    ->이 자체가 id

		//			$(".update").val(reply_Num);
		//댓글 수정 하기 위한 함수  호출(댓글번호,댓글내용)
		var mod = {
			reply_Num: reply_Num,
			reply_content: reply_content
		};
		modify(mod);
	})





	function modify(reply_content) {


		$.ajax({
			type: "put",
			url: "/replies/modify",
			data: JSON.stringify(reply_content),
			//						dataType: 'json',
			//js가 값을 ajax에서 필요한 형태로 바꾸는 함
			contentType: "application/json; charset=utf-8",
			success: function(result) {
				if (result == "success") {
					alert("수정 성공")
					location.reload();
				}
			},
			error: function() {
				alert("수정실패")
			}

		})
	}




	/////////////////////////////////////댓글 삭제 함수/////////////////////////////////
	$("#chat").on("click", ".remove", function() {

		var reply_Num = this.value;

		var del = {
			reply_Num: reply_Num
		};

		remove(del);
	})

	function remove(reply_Num) {
		if (confirm("삭제하시겠습니까?")) {


			$.ajax({
				type: 'delete',
				url: '/replies/' + reply_Num.reply_Num,
				//					data : JSON.stringify(reply_Num),
				//					contentType:"application/json; charset=utf-8",
				success: function(result) {

					if (result == "success") {
						alert("삭제 성공");
						location.reload();
					}

				},
				error: function() {

					alert("삭제실패")
					location.replace("/board/{inte_Num}")
				}
			})
		}
	}


})

///////////////////////////////////////////초기 댓글 보여주기 개수 제한////////////////////////////////////////////////////////
			function more() {
				setTimeout(function() {
					$(".Replyeachform:hidden").slice(0, 5).show();
				}, 5);
			
			
			}




