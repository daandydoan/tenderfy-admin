// Shared Brand Kit editor — a self-contained modal used by both the client
// detail page and the block builder. Call window.openBrandEditor(brand, opts).
//   brand : a brand object with { colours[], type[], logo?, font, bodyFont, primary, secondary, background }
//   opts  : { title?, onSave?(brand) }
// Requires tenant-data.js (FONTS) and the shared .modal-overlay/.cfm/.btn/.fld/.fin CSS.
(function(){
  const FONTS = window.FONTS || ['Outfit','Inter','Poppins','Lora','Roboto'];
  const LOADED = ['Outfit','Inter','Poppins','Lora','Roboto'];
  function ensureFont(name){
    if(!name || LOADED.includes(name)) return;
    const id='gf-'+name.replace(/\s+/g,'-'); if(document.getElementById(id)) return;
    const l=document.createElement('link'); l.id=id; l.rel='stylesheet';
    l.href='https://fonts.googleapis.com/css2?family='+name.replace(/\s+/g,'+')+':wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }
  const fontOptions = sel => FONTS.map(f=>`<option${f===sel?' selected':''}>${f}</option>`).join('');

  function css(){
    if(document.getElementById('brand-editor-css')) return;
    const s=document.createElement('style'); s.id='brand-editor-css';
    s.textContent=`
      #brandEditor .cfm.bk-edit{max-width:660px;width:94vw;text-align:left}
      .bk-scroll{max-height:62vh;overflow:auto;margin:8px 0 14px;padding-right:4px}
      .bk-h{font-size:11px;text-transform:uppercase;letter-spacing:.4px;color:var(--light);font-weight:700;margin:18px 0 9px;display:flex;align-items:center;justify-content:space-between}
      .bk-h:first-child{margin-top:0}
      .bk-add{color:var(--teal);font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:3px}
      .bk-add:hover{text-decoration:underline}
      .bk-row{display:flex;align-items:center;gap:7px;margin-bottom:8px}
      .bk-in{padding:7px 8px;border:1px solid var(--border);border-radius:7px;font-family:inherit;font-size:12.5px;min-width:0;color:var(--ink);background:#fff}
      .bk-col{width:34px;height:32px;padding:2px;border:1px solid var(--border);border-radius:7px;background:#fff;cursor:pointer;flex-shrink:0}
      .bk-row .del{color:var(--light);cursor:pointer;font-size:18px;flex-shrink:0}
      .bk-row .del:hover{color:#d5493f}
      .bk-fonts{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      .bk-logo-row{display:flex;align-items:center;gap:12px}
      .bk-logo-prev{width:52px;height:52px;border-radius:10px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;object-fit:cover;background:#f4f7f6;color:var(--light);flex-shrink:0}
      .bk-colhead,.bk-typehead{display:flex;gap:7px;font-size:10px;text-transform:uppercase;letter-spacing:.3px;color:var(--light);font-weight:700;margin-bottom:4px;padding:0 2px}
    `;
    document.head.appendChild(s);
  }

  let host=null, wColours=[], wType=[], wLogo=null, colKey=0, S={brand:null,onSave:null};
  const $ = sel => host.querySelector(sel);

  function build(){
    if(host) return; css();
    host=document.createElement('div'); host.className='modal-overlay'; host.id='brandEditor';
    host.innerHTML=`<div class="cfm bk-edit">
      <h3 id="be-title">Brand Kit</h3>
      <div style="color:var(--gray);font-size:12.5px;margin:-2px 0 6px">Logo, colours, fonts and type styles for this brand.</div>
      <div class="bk-scroll">
        <div class="bk-h">Logo</div>
        <div class="bk-logo-row" id="be-logo"></div>
        <div class="bk-h">Colours <span class="bk-add" id="be-addColour"><span class="ms" style="font-size:15px">add</span> Add colour</span></div>
        <div class="bk-colhead"><span style="width:34px"></span><span style="width:82px">Value</span><span style="flex:1">Name</span><span style="width:104px">Type</span><span style="width:18px"></span></div>
        <div id="be-colours"></div>
        <div class="bk-h">Fonts</div>
        <div class="bk-fonts"><div class="fld"><label>Heading font</label><select class="fin" id="be-font"></select></div><div class="fld"><label>Body font</label><select class="fin" id="be-bodyfont"></select></div></div>
        <span class="bk-add" id="be-uploadFont" style="margin-top:4px"><span class="ms" style="font-size:15px">upload</span> Upload a font file</span>
        <div class="bk-h">Type styles <span class="bk-add" id="be-addType"><span class="ms" style="font-size:15px">add</span> Add type style</span></div>
        <div class="bk-typehead"><span style="flex:1">Name</span><span style="width:50px">Size</span><span style="width:50px">Line</span><span style="width:72px">Weight</span><span style="width:92px">Font</span><span style="width:104px">Colour</span><span style="width:18px"></span></div>
        <div id="be-types"></div>
      </div>
      <div class="cfm-acts"><a class="btn btn-outline" id="be-cancel">Cancel</a><a class="btn btn-primary" id="be-save"><span class="ms" style="font-size:17px">save</span> Save Brand Kit</a></div>
    </div>`;
    document.body.appendChild(host);

    host.addEventListener('click',e=>{ if(e.target===host) close(); });
    $('#be-cancel').addEventListener('click',close);
    $('#be-uploadFont').addEventListener('click',()=>window.showToast&&showToast('Font upload — hook up a .woff/.ttf here'));
    $('#be-font').addEventListener('change',e=>ensureFont(e.target.value));
    $('#be-bodyfont').addEventListener('change',e=>ensureFont(e.target.value));
    $('#be-addColour').addEventListener('click',()=>{ wColours.push({key:'col'+(++colKey),name:'New colour',value:'#38988A',scope:'brand'}); renderColours(); renderTypes(); });
    $('#be-addType').addEventListener('click',()=>{ wType.push({name:'New style',size:14,lh:20,weight:'400',font:'body',color:(wColours[0]?wColours[0].key:'primary')}); renderTypes(); });

    const cw=$('#be-colours');
    cw.addEventListener('input',e=>{ const row=e.target.closest('.bk-row'); if(!row)return; const i=+row.dataset.i;
      if(e.target.classList.contains('bk-col')){ wColours[i].value=e.target.value; row.querySelector('.bk-hex').value=e.target.value.toUpperCase(); }
      else if(e.target.classList.contains('bk-hex')){ const v=e.target.value.trim(); if(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)){ wColours[i].value=v; row.querySelector('.bk-col').value=v; } }
      else if(e.target.classList.contains('bk-name')) wColours[i].name=e.target.value;
    });
    cw.addEventListener('change',e=>{ const row=e.target.closest('.bk-row'); if(row&&e.target.classList.contains('bk-scope')) wColours[+row.dataset.i].scope=e.target.value; });
    cw.addEventListener('click',e=>{ if(e.target.closest('[data-del]')){ wColours.splice(+e.target.closest('.bk-row').dataset.i,1); renderColours(); renderTypes(); } });

    const tw=$('#be-types');
    tw.addEventListener('input',e=>{ const row=e.target.closest('.bk-row'); if(!row)return; const i=+row.dataset.i;
      if(e.target.classList.contains('bk-tname')) wType[i].name=e.target.value;
      else if(e.target.classList.contains('bk-size')) wType[i].size=+e.target.value||0;
      else if(e.target.classList.contains('bk-lh')) wType[i].lh=+e.target.value||0;
    });
    tw.addEventListener('change',e=>{ const row=e.target.closest('.bk-row'); if(!row)return; const i=+row.dataset.i;
      if(e.target.classList.contains('bk-weight')) wType[i].weight=e.target.value;
      else if(e.target.classList.contains('bk-tfont')) wType[i].font=e.target.value;
      else if(e.target.classList.contains('bk-tcolor')) wType[i].color=e.target.value;
    });
    tw.addEventListener('click',e=>{ if(e.target.closest('[data-del]')){ wType.splice(+e.target.closest('.bk-row').dataset.i,1); renderTypes(); } });

    $('#be-save').addEventListener('click',save);
  }

  function renderLogo(){
    $('#be-logo').innerHTML = (wLogo?`<img class="bk-logo-prev" src="${wLogo}">`:`<span class="bk-logo-prev"><span class="ms">image</span></span>`)
      +`<label class="bk-add" style="cursor:pointer"><span class="ms" style="font-size:15px">upload</span> ${wLogo?'Replace':'Upload logo'}<input type="file" accept="image/*" id="be-logoFile" style="display:none"></label>`
      +(wLogo?`<span class="bk-add" id="be-logoRemove" style="color:#d5493f">Remove</span>`:'');
    $('#be-logoFile').addEventListener('change',e=>{ const f=e.target.files[0]; if(!f)return; const rd=new FileReader(); rd.onload=()=>{ wLogo=rd.result; renderLogo(); }; rd.readAsDataURL(f); });
    const rm=$('#be-logoRemove'); if(rm) rm.addEventListener('click',()=>{ wLogo=null; renderLogo(); });
  }
  function renderColours(){
    $('#be-colours').innerHTML = wColours.map((c,i)=>`
      <div class="bk-row" data-i="${i}"><input type="color" class="bk-col" value="${c.value}"><input class="bk-in bk-hex" value="${c.value}" style="width:82px"><input class="bk-in bk-name" value="${c.name}" style="flex:1" placeholder="Name"><select class="bk-in bk-scope" style="width:104px"><option value="brand">Brand</option><option value="derived">Derived</option><option value="shared">Shared</option></select><span class="ms del" data-del title="Remove">close</span></div>`).join('');
    wColours.forEach((c,i)=>$(`#be-colours .bk-row[data-i="${i}"] .bk-scope`).value=c.scope||'brand');
  }
  function renderTypes(){
    const opts=wColours.map(c=>`<option value="${c.key}">${c.name}</option>`).join('');
    $('#be-types').innerHTML = wType.map((s,i)=>`
      <div class="bk-row" data-i="${i}"><input class="bk-in bk-tname" value="${s.name}" style="flex:1" placeholder="Name"><input class="bk-in bk-size" type="number" value="${s.size}" style="width:50px"><input class="bk-in bk-lh" type="number" value="${s.lh}" style="width:50px"><select class="bk-in bk-weight" style="width:72px"><option>300</option><option>400</option><option>500</option><option>600</option><option>700</option></select><select class="bk-in bk-tfont" style="width:92px"><option value="heading">Heading</option><option value="body">Body</option></select><select class="bk-in bk-tcolor" style="width:104px">${opts}</select><span class="ms del" data-del title="Remove">close</span></div>`).join('');
    wType.forEach((s,i)=>{ const r=$(`#be-types .bk-row[data-i="${i}"]`); r.querySelector('.bk-weight').value=s.weight; r.querySelector('.bk-tfont').value=s.font; r.querySelector('.bk-tcolor').value=s.color; });
  }
  function close(){ host.classList.remove('open'); }
  function save(){
    const b=S.brand;
    b.colours=JSON.parse(JSON.stringify(wColours));
    b.type=JSON.parse(JSON.stringify(wType));
    b.logo=wLogo;
    b.font=$('#be-font').value; b.bodyFont=$('#be-bodyfont').value;
    const gv=k=>{ const c=b.colours.find(x=>x.key===k); return c?c.value:undefined; };
    if(gv('primary')) b.primary=gv('primary'); if(gv('secondary')) b.secondary=gv('secondary'); if(gv('background')) b.background=gv('background');
    ensureFont(b.font); ensureFont(b.bodyFont);
    close();
    if(window.showToast) showToast('Brand Kit updated');
    if(S.onSave) S.onSave(b);
  }

  window.openBrandEditor = function(brand, opts){
    opts=opts||{}; build();
    S.brand=brand; S.onSave=opts.onSave||null;
    wColours=JSON.parse(JSON.stringify(brand.colours||[]));
    wType=JSON.parse(JSON.stringify(brand.type||[]));
    wLogo=brand.logo||null;
    FONTS.forEach(ensureFont);
    $('#be-title').textContent=opts.title||'Brand Kit';
    $('#be-font').innerHTML=fontOptions(brand.font);
    $('#be-bodyfont').innerHTML=fontOptions(brand.bodyFont);
    renderLogo(); renderColours(); renderTypes();
    host.classList.add('open');
  };
})();
