		function readURL(input) {
			if (input.files && input.files[0]) {
				var reader = new FileReader();
				reader.onload = function(e) {
					$('#preview').attr('src', e.target.result);
				}
				reader.readAsDataURL(input.files[0]);
			}
		}
		function backToList(obj) {
			obj.action = "${contextPath}/noticelist.do";
			obj.submit();
		}
		var cnt = 1;
		function fn_addFile() {
			$("#d_file").append("<br>" + "<input type='file' name='file" + cnt + "' />");
			cnt++;
		}
		function _onSubmit() {
			if (!confirm("수정하시겠습니까?")) {
				return false;
			}
		}
		function fn_modify_noticle(obj) {
			obj.action = "${contextPath}/notice/update_action";
			obj.submit();
		}