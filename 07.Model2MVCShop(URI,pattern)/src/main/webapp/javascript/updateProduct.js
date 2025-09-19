let selectedFiles = []; // 새로 업로드할 파일 누적 관리

document.addEventListener("DOMContentLoaded", () => {
	const input = document.getElementById("uploadFiles");

	if (input) {
		input.addEventListener("change", (event) => handleFileSelect(event));
	}

	// 기존 이미지 삭제 버튼(X) 이벤트 등록
	document.querySelectorAll(".delete-existing").forEach(btn => {
		btn.addEventListener("click", function() {
			const imgId = this.dataset.imgid;

			// hidden input 추가 (deleteImageIds[])
			const hidden = document.createElement("input");
			hidden.type = "hidden";
			hidden.name = "deleteImageIds";
			hidden.value = imgId;
			document.querySelector("form").appendChild(hidden);

			// 화면에서 제거
			this.parentElement.remove();
		});
	});
});

function handleFileSelect(event) {
	const input = event.target;
	const newFiles = Array.from(input.files);

	// 누적
	selectedFiles = selectedFiles.concat(newFiles);

	// 서버 전송용 FileList 갱신
	const dt = new DataTransfer();
	selectedFiles.forEach(file => dt.items.add(file));
	input.files = dt.files;

	updatePreview(input);
}

function updatePreview(input) {
	const container = document.getElementById("preview-container");
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

function removeFile(index, input) {
	selectedFiles.splice(index, 1);

	const dt = new DataTransfer();
	selectedFiles.forEach(file => dt.items.add(file));
	input.files = dt.files;

	updatePreview(input);
}
