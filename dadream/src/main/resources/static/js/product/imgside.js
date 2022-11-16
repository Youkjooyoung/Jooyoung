  var bxSlider1;
    $(document).ready(function () {
      bxSlider1 = $('.slider').bxSlider({
        slideWidth: 600, //슬라이드 넓이
        mode: 'horizontal', //슬라이드 모드 ex)'horizontal', 'vertical', 'fade'
        speed: 0, // ms
        pager: false, // 현재위치 페이징 표시 여부 밑에... 표시
        pause: 3000, //멈춰있는 시간
        moveSlider: 1, //슬라이더 이동기 개수
        slideMargin: 0, // 슬라이드간의 간격
        auto: false, // 자동 실행 여부
        autoHover: true, // 마우스 호버시 정지 여부
        controls: true, // 이전 다음 버튼 노출 여부
      });
    });