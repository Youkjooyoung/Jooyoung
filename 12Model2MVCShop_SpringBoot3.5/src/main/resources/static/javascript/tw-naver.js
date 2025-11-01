window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        naver: {
          green: '#03c75a',
          dark:  '#02b857',
          ink:   '#079b48',
          gray:  { 50:'#f7f8f9', 100:'#f0f2f4', 200:'#e5e8eb', 400:'#98a2b3' }
        }
      },
      borderRadius: { nv: '12px' },
      boxShadow: { nv: '0 4px 14px rgba(0,0,0,.06)' },
      fontFamily: { sans: ['Pretendard','Noto Sans KR','system-ui','sans-serif'] }
    }
  }
};
