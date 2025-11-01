(function (w) {
  const cfg = {
    theme: {
      extend: {
        colors: {
          'naver-green': '#03c75a',
          'naver-dark': '#00a74a',
          'naver-gray': '#f7f9fa'
        },
        boxShadow: {
          nv: '0 30px 80px rgba(0,0,0,0.07)',
          card: '0 2px 4px rgba(0,0,0,0.08)'
        },
        borderRadius: {
          nv: '20px'
        }
      }
    }
  };
  w.tailwind = w.tailwind || {};
  w.tailwind.config = cfg;
})(window);
