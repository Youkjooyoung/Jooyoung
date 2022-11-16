		 (function () {
            var w = window;
            if (w.ChannelIO) {
                return (window.console.error || window.console.log || function () {})(
                    'ChannelIO script included twice.');
            }
            var ch = function () {
                ch.c(arguments);
            };
            ch.q = [];
            ch.c = function (args) {
                ch.q.push(args);
            };
            w.ChannelIO = ch;

            function l() {
                if (w.ChannelIOInitialized) {
                    return;
                }
                w.ChannelIOInitialized = true;
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.async = true;
                s.src = 'https://cdn.channel.io/plugin/ch-plugin-web.js';
                s.charset = 'UTF-8';
                var x = document.getElementsByTagName('script')[0];
                x.parentNode.insertBefore(s, x);
            }
            if (document.readyState === 'complete') {
                l();
            } else if (window.attachEvent) {
                window.attachEvent('onload', l);
            } else {
                window.addEventListener('DOMContentLoaded', l, false);
                window.addEventListener('load', l, false);
            }
        })();
        ChannelIO('boot', {
            "pluginKey": "df04e6aa-33a1-40b0-b598-de67826a821e"
        });

        //  End Channel Plugin 

        // main tab
        let a = document.querySelector(".a");
        let b = document.querySelector(".b");

        let c = document.querySelector(".detaling");
        let d = document.querySelector(".pro");

        //  부동산을 클릭하였을때
        a.addEventListener('click', function () {
            b.classList.remove("blue");
            a.classList.add("red");
            d.classList.add("hide");
            c.classList.remove("hide");
        })

        // 가구를 클릭하였을때
        b.addEventListener('click', function () {
            a.classList.remove("red");
            b.classList.add("blue");

            c.classList.add("hide");
            d.classList.remove("hide");

        })
        
