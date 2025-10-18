//------------------썸네일 코드-------------------------------------------------//
                        document.addEventListener('DOMContentLoaded', () => {
            document.querySelector("#dealing_Image").addEventListener("change", async e => {
                const preview = document.querySelector("#preview");
                document.querySelector(".imgh1").innerHTML = "이미지 업로드 완료";
                let reader = new FileReader();
                reader.onloadend = finished => {
                    preview.setAttribute('src', finished.target.result);
                    console.log(finished.target.result);
                }
                reader.readAsDataURL(e.target.files.item(0));
            })
        });
        
        
//-------------------------------------경고창------------------------------------//
        (function () {


            $("#summernote").summernote("code", {
                height: 300, // 에디터 높이
                minHeight: 300, // 최소 높이
                maxHeight: null, // 최대 높이(null 제한없음)
                focus: false, // 에디터 로딩후 포커스를 맞출지 여부
                lang: "ko-KR", // 한글 설정
                toolbar: [
                    ['fontname', ['fontname']], // 글꼴 설정
                    ['fontsize', ['fontsize']], // 글자 크기 설정
                    ['style', ['bold', 'italic', 'underline', 'strikethrough',
                        'clear'
                    ]], // 굵기, 기울임꼴, 밑줄,취소 선, 서식지우기
                    ['color', ['forecolor', 'color']], // 글자색
                    ['table', ['table']], // 표만들기
                    ['para', ['ul', 'ol', 'paragraph']], // 글머리 기호, 번호매기기, 문단정렬
                    ['height', ['height']], // 줄간격
                    ['insert', ['picture', 'link', 'video']], // 그림첨부, 링크만들기, 동영상첨부
                    ['view', ['fullscreen', 'codeview', 'help']] // 코드보기, 확대해서보기, 도움말
                ],
                // 추가한 글꼴
                fontNames: ['Arial', 'Arial Black', '맑은 고딕', '궁서',
                    '굴림체', '굴림', '돋음체', '바탕체'
                ],
                // 추가한 폰트사이즈
                fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '22', '24',
                    '28', '30',
                    '36', '50', '72'
                ]
            });


        })();
        
        
        //////////////////////////////////////유효성 경고창//////////////////////////////////////
        
        document.querySelector("#submitbtn").addEventListener("click", () => {
            event.preventDefault();
            check();
            
        });
        let check = ()=>{

        
        let dealing_Image = document.querySelector("#dealing_Image").value.trim();
        let dl_Title = document.querySelector("#dl_Title").value.trim();
        let sample5_address = document.querySelector("#sample5_address").value.trim();
        let dl_Price = document.querySelector("#dl_Price").value.trim();
        let dl_Option = document.querySelector("#dl_Option").value.trim();
        let dl_Form = document.querySelector("#dl_Form").value.trim();
        let dl_Form2 = document.querySelector("#dl_Form2").value.trim();
        let dl_Room = document.querySelector("#dl_Room").value.trim();
        let dl_Size = document.querySelector("#dl_Size").value.trim();
        let summernote = document.querySelector("#summernote").value.trim();
        let FORMTAG =document.querySelector("#FORMTAG");
        if (dealing_Image === '') {
            alert("이미지를 넣어주세요");
            dealing_Image.focus();
            return ;
        } else if (dl_Title === '') {
            alert("매물명 을 입력해주세요");
            dl_Title.focus();
            return ;
        } else if (sample5_address === '') {
            alert("주소를 입력해주세요");
            sample5_address.focus();
            return ;
        } else if (dl_Price === '') {
            alert("가격을 입력해주세요");
            dl_Price.focus();
            return ;
        } else if (dl_Option === '') {
            alert("옵션을 입력해주세요");
            dl_Price.focus();
            return ;
        } else if (dl_Form === '') {
            alert("건물을 입력해주세요");
            dl_From.focus();
            return ;
        } else if (dl_Form2 === '') {
            alert("구매방식 입력해주세요");
            dl_From2.focus();
            return ;
        } else if (dl_Room === '') {
            alert("방 개수 를 입력해주세요");
            dl_Room.focus();
            return ;
        } else if (dl_Size === '') {
            alert("평수 를 입력해주세요");
            dl_Size.focus();
            return ;
        } else if (summernote === '') {
            alert("상세설명 을 입력해주세요");
            summernote.focus();
            return ;
        }FORMTAG.submit();
            
    }
    
    
     //////////////////////////////////////지도 API//////////////////////////////////////
    
    
    
    
    
    