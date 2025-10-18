 /*이미지 슬라이드 스크립트*/
 $(document).ready(function () {
            $('.pro_slider').bxSlider({
                slideWidth: 1130,
                auto: true,
                speed: 500,
                pause: 3000,
                mode: 'fade',
                autoHover: true,
                pager: true,
                controls: false
            });
        });