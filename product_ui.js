/* Interactive frame + subject selectors on product pages */
(function(){
  function $(sel,root){return (root||document).querySelector(sel)}
  function $$(sel,root){return [].slice.call((root||document).querySelectorAll(sel))}
  var pdp=$('.pdp'); if(!pdp) return;
  var cfg={
    mini:{base:85, extra:0, maxSubj:1},
    '6in':{base:120, extra:25, maxSubj:3},
    '10in':{base:199, extra:35, maxSubj:3}
  };
  var kind=pdp.getAttribute('data-product')||'';
  var C=cfg[kind]; if(!C) return;
  var main=$('#p-main-frame',pdp);
  var priceEl=$('.buy .price',pdp)||$('.price',pdp);
  var addBtn=$('.btn.add',pdp);
  var subjects=1;

  function money(n){return '$'+n}
  function updatePrice(){
    var total=C.base + Math.max(0,subjects-1)*C.extra;
    if(priceEl) priceEl.textContent=money(total);
    if(addBtn){
      var t=addBtn.textContent.replace(/\$\d+/g, money(total));
      // keep i18n: only replace trailing price portion if present
      addBtn.textContent=addBtn.textContent.replace(/·\s*\$\d+/, '· '+money(total));
      if(!/\$\d+/.test(addBtn.textContent)) addBtn.textContent=addBtn.textContent.replace(/\s*$/, '')+' · '+money(total);
    }
  }

  function selectFrame(btn){
    $$('.frames .fopt',pdp).forEach(function(b){
      b.classList.toggle('on', b===btn);
      b.setAttribute('aria-pressed', b===btn?'true':'false');
    });
    if(!main) return;
    var src=btn.getAttribute('data-frame-src');
    var cls=btn.getAttribute('data-frame-class');
    var shape=btn.getAttribute('data-shape')||'oval';
    var img=$('.frame',main); if(img && src) img.src=src;
    // reset shape classes
    main.className='fr real '+cls+' '+shape;
    main.style.width=main.style.width||main.getAttribute('data-w')||'380px';
    // thumbs
    $$('.thumbs .th[data-frame]',pdp).forEach(function(th){
      th.classList.toggle('on', th.getAttribute('data-frame')===btn.getAttribute('data-frame'));
    });
  }

  $$('.frames .fopt',pdp).forEach(function(btn){
    btn.setAttribute('role','button');
    btn.setAttribute('tabindex','0');
    if(!btn.hasAttribute('aria-pressed')) btn.setAttribute('aria-pressed', btn.classList.contains('on')?'true':'false');
    btn.addEventListener('click', function(){ selectFrame(btn); });
    btn.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); selectFrame(btn);} });
  });

  $$('.subj [data-subjects], .subj span',pdp).forEach(function(el){
    var n=parseInt(el.getAttribute('data-subjects')||el.textContent,10);
    if(!(n>=1)) return;
    el.setAttribute('role','button'); el.setAttribute('tabindex','0');
    function pick(){
      if(n>C.maxSubj) return;
      subjects=n;
      $$('.subj [data-subjects], .subj span',pdp).forEach(function(s){
        var sn=parseInt(s.getAttribute('data-subjects')||'0',10);
        var on=sn===subjects;
        s.classList.toggle('on', on);
        s.setAttribute('aria-pressed', on?'true':'false');
      });
      updatePrice();
    }
    el.addEventListener('click', pick);
    el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); pick(); }});
  });

  // thumb click -> frame
  $$('.thumbs .th[data-frame]',pdp).forEach(function(th){
    th.style.cursor='pointer';
    th.addEventListener('click', function(){
      var id=th.getAttribute('data-frame');
      var btn=$('.frames .fopt[data-frame="'+id+'"]',pdp);
      if(btn) selectFrame(btn);
    });
  });

  updatePrice();
})();
