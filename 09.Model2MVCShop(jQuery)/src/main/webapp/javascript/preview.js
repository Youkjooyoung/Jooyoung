let selectedFiles = []; // 새로 업로드할 파일 누적 관리

document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("uploadFiles");

	if (input) {
		input.addEventListener("change", (event) => handleFileSelect(event));
	}

	// 기존 이미지 삭제 버튼(X)
	document.querySelectorAll(".delete-existing").forEach(btn => {
		btn.addEventListener("click", function() {
			const imgId = this.dataset.imgid;
			const hidden = document.createElement("input");
			hidden.type = "hidden";
			hidden.name = "deleteImageIds";
			hidden.value = imgId;
			document.querySelector("form").appendChild(hidden);
			this.parentElement.remove();
		});
	});

	// 가격 입력 필드 ( 콤마 처리)
	const priceInput = document.querySelector("input[name='price']");
	if (priceInput) {
		let initVal = priceInput.value.replace(/,/g, "");
		if (initVal && !isNaN(initVal)) {
			priceInput.value = Number(initVal).toLocaleString("ko-KR");
		}

		priceInput.addEventListener("input", () => {
			let value = priceInput.value.replace(/,/g, "");
			if (!isNaN(value) && value !== "") {
				priceInput.value = Number(value).toLocaleString("ko-KR");
			} else {
				priceInput.value = "";
			}
		});

		const form = priceInput.closest("form");
		if (form) {
			form.addEventListener("submit", (e) => {
				//  validate 체크
				if (!validateForm(form)) {
					e.preventDefault();
					return false;
				}
				// 제출 직전 콤마 제거
				priceInput.value = priceInput.value.replace(/,/g, "");
			});
		}
	}
});

// ===============================
// 이미지 선택
// ===============================
function handleFileSelect(event) {
	const input = event.target;
	const newFiles = Array.from(input.files);
	selectedFiles = selectedFiles.concat(newFiles);

	const dt = new DataTransfer();
	selectedFiles.forEach(file => dt.items.add(file));
	input.files = dt.files;

	updatePreview(input);
}

// ===============================
// 미리보기
// ===============================
function updatePreview(input) {
	const container = document.getElementById("preview-container");
	if (!container) return;
	container.innerHTML = "";

	selectedFiles.forEach((file, index) => {
		if (!file.type.startsWith("image/")) return;
		const reader = new FileReader();
		reader.onload = function(e) {
			const wrapper = document.createElement("div");
			wrapper.style.position = "relative";
			wrapper.style.display = "inline-block";
			wrapper.style.marginRight = "5px";

			const img = document.createElement("img");
			img.src = e.target.result;
			img.style.width = "80px";
			img.style.height = "80px";
			img.style.objectFit = "cover";
			img.style.border = "1px solid #ccc";
			img.style.borderRadius = "4px";

			const btn = document.createElement("span");
			btn.innerHTML = "✖";
			btn.style.position = "absolute";
			btn.style.top = "2px";
			btn.style.right = "2px";
			btn.style.cursor = "pointer";
			btn.style.background = "rgba(0,0,0,0.6)";
			btn.style.color = "white";
			btn.style.fontSize = "12px";
			btn.style.width = "18px";
			btn.style.height = "18px";
			btn.style.textAlign = "center";
			btn.style.borderRadius = "50%";

			btn.onclick = function() {
				removeFile(index, input);
			};

			wrapper.appendChild(img);
			wrapper.appendChild(btn);
			container.appendChild(wrapper);
		};
		reader.readAsDataURL(file);
	});
}

// ===============================
// 파일 삭제
// ===============================
function removeFile(index, input) {
	selectedFiles.splice(index, 1);
	const dt = new DataTransfer();
	selectedFiles.forEach(file => dt.items.add(file));
	input.files = dt.files;
	updatePreview(input);
}

// ===============================
//  validate 체크 
// ===============================
function validateForm(form) {
	const prodName = form.querySelector("input[name='prodName']");
	const prodDetail = form.querySelector("input[name='prodDetail']");
	const manuDate = form.querySelector("input[name='manuDate']");
	const price = form.querySelector("input[name='price']");

	// 상품명
	if (!prodName.value.trim()) {
		alert("상품명을 입력하세요.");
		prodName.focus();
		return false;
	}

	// 상세정보
	if (!prodDetail.value.trim()) {
		alert("상품상세정보를 입력하세요.");
		prodDetail.focus();
		return false;
	}

/*	// 제조일자 (YYYYMMDD)
	const datePattern = /^[0-9]{8}$/;
	if (!datePattern.test(manuDate.value)) {
		alert("제조일자는 YYYYMMDD 형식으로 입력하세요.");
		manuDate.focus();
		return false;
	}
*/
	// 가격 (숫자만)
	const priceVal = price.value.replace(/,/g, "");
	if (!/^[0-9]+$/.test(priceVal)) {
		alert("가격은 숫자만 입력 가능합니다.");
		price.focus();
		return false;
	}

	// 이미지 최소 1장 (필수일 경우만)
	if (selectedFiles.length === 0) {
		alert("상품 이미지를 최소 1장 이상 업로드하세요.");
		return false;
	}

	return true;
}
