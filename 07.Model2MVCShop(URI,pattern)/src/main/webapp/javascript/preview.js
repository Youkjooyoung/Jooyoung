let selectedFiles = []; // 누적 파일 관리용

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("uploadFiles");
  if (input) {
    input.addEventListener("change", (event) => handleFileSelect(event));
  }
});

function handleFileSelect(event) {
  const input = event.target;
  const newFiles = Array.from(input.files);

  // 새로 선택된 파일들을 기존 배열에 합치기
  selectedFiles = selectedFiles.concat(newFiles);

  // DataTransfer로 다시 채워 넣기
  const dt = new DataTransfer();
  selectedFiles.forEach(file => dt.items.add(file));
  input.files = dt.files;

  updatePreview(input);
}

function updatePreview(input) {
  const container = document.getElementById("preview-container");
  container.innerHTML = ""; // 프리뷰 초기화

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
      btn.style.padding = "2px 5px";
      btn.style.borderRadius = "50%";

      // 삭제 버튼 → 배열에서 제거 후 갱신
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
