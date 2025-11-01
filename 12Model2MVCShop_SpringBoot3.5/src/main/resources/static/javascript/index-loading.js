(()=>{
  'use strict';
  const body=document.body;
  const logo=document.getElementById('loadingLogo');
  if(!body||!logo)return;
  const ctx=body.getAttribute('data-ctx')||'';
  const trimEnd=s=>s.replace(/\/+$/,'');
  const root=trimEnd(ctx)||'';
  const path=trimEnd(location.pathname);
  const isHome=path===root||path===root+'/';
  if(!isHome){logo.classList.add('hidden');return;}
  const forceFlag=sessionStorage.getItem('forceShowLoader');
  const alreadyLoaded=sessionStorage.getItem('hasLoaded');
  const showThenHide=()=>{
    logo.classList.remove('hidden','opacity-0');
    logo.classList.add('flex');
    setTimeout(()=>{logo.classList.add('opacity-0');setTimeout(()=>{logo.classList.add('hidden');},300);},800);
  };
  if(forceFlag==='1'){sessionStorage.removeItem('forceShowLoader');showThenHide();sessionStorage.setItem('hasLoaded','true');return;}
  if(!alreadyLoaded){showThenHide();sessionStorage.setItem('hasLoaded','true');}else{logo.classList.add('hidden');}
})();
