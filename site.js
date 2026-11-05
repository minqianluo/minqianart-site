/* MinqianArt site behaviour: language switcher, light/dark theme, mobile menu */
(function(){
  var D=window.MA_I18N||{langs:['en'],dict:{}}, root=document.documentElement, LS=window.localStorage;
  function get(k){try{return LS.getItem(k)}catch(e){return null}}
  function put(k,v){try{LS.setItem(k,v)}catch(e){}}
  var els=[].slice.call(document.querySelectorAll('[data-i18n]')), en=new Map();
  els.forEach(function(e){en.set(e,e.innerHTML)});
  var tEl=document.querySelector('title[data-i18n-title]'), tEn=document.title;
  var ariaEls=[].slice.call(document.querySelectorAll('[data-i18n-aria]'));
  ariaEls.forEach(function(e){e._en=e.getAttribute('aria-label')});
  function tr(k,l,fb){var d=D.dict[k];return (l!=='en'&&d&&d[l])||fb}
  var cur='en';
  function setLang(l){
    if(D.langs.indexOf(l)<0) l='en'; cur=l;
    els.forEach(function(e){e.innerHTML=tr(e.getAttribute('data-i18n'),l,en.get(e))});
    if(tEl){var s=tEl.getAttribute('data-suffix')||'';document.title=l==='en'?tEn:tr(tEl.getAttribute('data-i18n-title'),l,tEn.replace(s,''))+s}
    root.setAttribute('lang',l);
    [].forEach.call(document.querySelectorAll('.lang-sel'),function(s){s.value=l});
    put('ma-lang',l); themeLabels(); if(typeof realign=='function') realign();
  }
  function isDark(){return root.getAttribute('data-theme')==='dark'}
  function themeLabels(){
    var k=isDark()?'Light mode':'Dark mode';
    [].forEach.call(document.querySelectorAll('.theme-btn'),function(b){
      var en0=k, key=b.getAttribute(isDark()?'data-i18n-aria-light':'data-i18n-aria');
      b.setAttribute('aria-label',tr(key,cur,en0)); b.setAttribute('title',tr(key,cur,en0));
      b.setAttribute('aria-pressed',isDark()?'true':'false');});
  }
  function setTheme(t){ if(t==='dark') root.setAttribute('data-theme','dark'); else root.removeAttribute('data-theme'); put('ma-theme',t); themeLabels(); }
  [].forEach.call(document.querySelectorAll('.lang-sel'),function(s){s.addEventListener('change',function(){setLang(s.value)})});
  [].forEach.call(document.querySelectorAll('.theme-btn'),function(b){b.addEventListener('click',function(){setTheme(isDark()?'light':'dark')})});
  /* mobile hamburger: the first header nav draws the three-bar icon */
  var burger=document.querySelector('header.site nav:first-child'), body=document.body;
  if(burger && document.getElementById('m-menu')){
    burger.setAttribute('role','button'); burger.setAttribute('aria-controls','m-menu'); burger.setAttribute('aria-label','Menu');
    burger.addEventListener('click',function(ev){
      if(!window.matchMedia('(max-width:600px)').matches) return;
      ev.preventDefault(); body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded',body.classList.contains('menu-open'));
    });
    [].forEach.call(document.querySelectorAll('#m-menu a'),function(a){a.addEventListener('click',function(){body.classList.remove('menu-open')})});
  }

  /* keep the flower borders aligned with their sections when text length changes */
  var CAND="body > *:not(.fborder):not(.mborder):not(script), body > section > *, body > footer > *, body > footer > .fgrid > *";
  function realign(){
    if(window.MA_NO_ANCHOR) return;
    var mob=window.matchMedia('(max-width:600px)').matches, box=document.querySelector(mob?'.mborder':'.fborder');
    if(!box) return;
    var C=document.querySelectorAll(CAND), ct=box.getBoundingClientRect().top;
    [].forEach.call(box.querySelectorAll('img[data-anc]'),function(img){
      var a=C[+img.getAttribute('data-anc')]; if(!a) return;
      img.style.top=(a.getBoundingClientRect().top-ct+parseFloat(img.getAttribute('data-dy')))+'px';
    });
    /* mobile: never let page-border flowers cover hero text */
    var hero=document.querySelector('.hero');
    var imgs=document.querySelectorAll('.mborder img, .fborder img');
    if(!window.matchMedia('(max-width:760px)').matches || !hero){
      [].forEach.call(imgs,function(img){img.style.visibility='';});
    } else {
      var nodes=hero.querySelectorAll('.kicker,h1,h2,p,.sig,.btn,.ribbon,.nameplate,.nameplate *');
      var tboxes=[];
      for(var i=0;i<nodes.length;i++){
        var t=nodes[i].getBoundingClientRect();
        if(t.width>1&&t.height>1) tboxes.push(t);
      }
      [].forEach.call(document.querySelectorAll('.mborder img'),function(img){
        var r=img.getBoundingClientRect(), hit=false;
        for(var j=0;j<tboxes.length;j++){
          var t=tboxes[j];
          var w=Math.min(r.right,t.right)-Math.max(r.left,t.left);
          var h=Math.min(r.bottom,t.bottom)-Math.max(r.top,t.top);
          if(w>4&&h>4){hit=true;break;}
        }
        img.style.visibility=hit?'hidden':'';
      });
    }
  }
  window.addEventListener('load',realign); window.addEventListener('resize',realign);
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(realign);

  /* mobile About links scroll to bio inside hero */
  document.addEventListener('click',function(ev){
    var a=ev.target.closest && ev.target.closest('a[href="#about"]');
    if(!a) return;
    if(!window.matchMedia('(max-width:760px)').matches) return;
    var t=document.getElementById('about-hero');
    if(!t) return;
    ev.preventDefault();
    t.scrollIntoView({behavior:'smooth',block:'start'});
    document.body.classList.remove('menu-open');
    try{history.replaceState(null,'','#about-hero')}catch(e){}
  });

  setLang(get('ma-lang')||'en');
  setTheme(get('ma-theme')==='light'?'light':'dark');
})();
