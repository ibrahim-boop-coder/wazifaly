(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const TIERS={1000:{n:'Starter Switch',d:30,t:'01'},3000:{n:'Pro Accelerator',d:20,t:'02'},5000:{n:'Priority Executive',d:15,t:'03'}};
const fmt=d=>d.toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'});
const pkr=n=>'PKR '+Number(n).toLocaleString('en-US');
const LOGO='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="miter" aria-hidden="true"><path d="M2 9l6.5 16L16 12l7.5 13L30 9"/><path d="M11 5l5-3.5L21 5" stroke-width="2.5"/></svg>';
const store={get:()=>{try{return JSON.parse(localStorage.getItem('wzf_records')||'{}')}catch(e){return{}}},set:o=>{try{localStorage.setItem('wzf_records',JSON.stringify(o))}catch(e){}}};
const dayAgo=n=>new Date(Date.now()-n*864e5).toISOString();
const DEMO={'WZF-2026-1001':{id:'WZF-2026-1001',tier:3000,name:'Demo Candidate A',start:dayAgo(6)},'WZF-2026-2002':{id:'WZF-2026-2002',tier:5000,name:'Demo Candidate B',start:dayAgo(3)}};

// Header + footer
const hd=$('#site-header');
if(hd){hd.outerHTML=`<header class="nav"><div class="wrap"><a class="logo" href="index.html" aria-label="Wazifly home">${LOGO}Wazifly</a><button class="burger" aria-label="Menu" aria-expanded="false">☰</button><nav class="links" id="links"><a href="index.html">Home</a><a href="index.html#plans">Plans &amp; SLA</a><a href="index.html#guarantee">Guarantee Protocol</a><a href="track.html">Track Status</a><a class="btn" href="apply.html">Apply Now</a></nav></div></header>`;
 const b=$('.burger'),l=$('#links');b.onclick=()=>{b.setAttribute('aria-expanded',l.classList.toggle('open'))};$$('#links a').forEach(a=>a.onclick=()=>l.classList.remove('open'));}
const ft=$('#site-footer');
if(ft)ft.outerHTML=`<footer><div class="wrap"><div class="grid g3"><div><div class="logo">${LOGO}Wazifly</div><p style="color:#A1A1AA;max-width:300px">Career acceleration and direct job placement for professionals in Pakistan, backed by a money-back guarantee.</p></div><div><b>Company</b><a href="apply.html">Apply Now</a><a href="track.html">Track Status</a><a href="contact.html">Contact</a><a href="mailto:info@wazifly.com">info@wazifly.com</a></div><div><b>Legal</b><a href="terms.html">Terms &amp; Conditions</a><a href="refund-policy.html">Refund Policy</a><a href="privacy.html">Privacy Policy</a><a href="sitemap.xml">Sitemap</a></div></div><div class="bar">© ${new Date().getFullYear()} Wazifly (wazifly.com). All rights reserved.</div></div></footer>`;

// SLA calculator
const cs=$('#calcTier');
if(cs){const o=$('#calcOut');const run=()=>{const t=TIERS[cs.value],d=new Date();d.setDate(d.getDate()+t.d);o.innerHTML=`<span class="mute">Interview deadline</span><div class="price dl">${fmt(d)}</div><span class="mute mono">${t.d}-day guarantee · starts today</span>`;$('#calcCta').href='apply.html?tier='+cs.value};cs.onchange=run;run();}

// Apply flow
const f=$('#applyForm');
if(f){
 const q=new URLSearchParams(location.search).get('tier');
 if(TIERS[q])$(`input[name=tier][value="${q}"]`).checked=true;
 const steps=$$('.step');let cur=0;const show=i=>{cur=i;steps.forEach((s,j)=>s.classList.toggle('on',j===i));$('#stepLbl').textContent=`Step ${i+1} of 2`;$('.prog i').style.width=(i+1)*50+'%';scrollTo({top:0})};
 const err=(id,m)=>{$('#e_'+id).textContent=m;return !m};
 const ext=(el,list)=>{const fl=el.files[0];return fl&&list.includes(fl.name.split('.').pop().toLowerCase())};
 const v1=()=>{let ok=true;const g=n=>f.elements[n].value.trim();
  ok&=err('name',g('name').length>2?'':'Enter your full name.');
  ok&=err('wa',/^(\+92|0)3\d{9}$/.test(g('wa').replace(/[\s-]/g,''))?'':'Use a Pakistani mobile number, e.g. 0300 1234567.');
  ok&=err('email',/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g('email'))?'':'Enter a valid email address.');
  ok&=err('role',g('role')?'':'Enter your current role.');ok&=err('target',g('target')?'':'Enter your target post.');
  ok&=err('city',g('city')?'':'Enter a target city.');ok&=err('exp',g('exp')!==''&&g('exp')>=0?'':'Enter years of experience.');
  return !!ok};
 const bad=m=>{$('#'+m).textContent='Some details are missing or invalid. Check the fields marked in red.';const e=$$('.err').find(x=>x.id[0]==='e'&&x.textContent);e&&e.scrollIntoView({block:'center',behavior:'smooth'})};
 $('#next').onclick=()=>{if(v1()){$('#m1').textContent='';show(1)}else bad('m1')};$('#back').onclick=()=>show(0);
 $$('input[name=method]').forEach(r=>r.onchange=()=>$$('.pay').forEach(p=>p.classList.toggle('on',p.dataset.m===r.value)));
 f.onsubmit=e=>{e.preventDefault();if(!v1())return show(0);let ok=true;
  ok&=err('method',f.elements.method.value?'':'Select a payment method.');
  ok&=err('tid',f.elements.tid.value.trim().length>=6?'':'Enter the transaction ID from your payment confirmation.');
  if(!ok)return bad('m2');
  const all=store.get();let id;do{id='WZF-'+new Date().getFullYear()+'-'+(1000+Math.floor(Math.random()*9000))}while(all[id]||DEMO[id]);
  const g=n=>f.elements[n].value.trim();
  all[id]={id,tier:+f.elements.tier.value,name:g('name'),wa:g('wa'),email:g('email'),role:g('role'),target:g('target'),city:g('city'),exp:g('exp'),method:f.elements.method.value,tid:g('tid'),cv:'via WhatsApp',start:new Date().toISOString()};
  store.set(all);const r=all[id],t=TIERS[r.tier],dl=new Date(r.start);dl.setDate(dl.getDate()+t.d);
  const wa='mailto:info@wazifly.com?subject='+encodeURIComponent('Wazifly '+id+' - CV & payment proof')+'&body='+encodeURIComponent(`Assalam o Alaikum Wazifly.
Reference ID: ${id}
Name: ${r.name}
Plan: Tier ${t.t} - ${t.n} (${pkr(r.tier)})
Target: ${r.target}, ${r.city}
Payment: ${r.method}, TID ${r.tid}

Attached: 1) my CV  2) my payment screenshot`);
  $('#formArea').style.display='none';
  $('#certArea').innerHTML=`<div class="noprint"><h2>Last step: email your CV and payment proof</h2><p class="sub">Tap the button, then attach your <b>CV</b> and your <b>payment screenshot</b> and send. If the button does not open your email app, send them to <b>info@wazifly.com</b> with <span class="mono">${id}</span> in the subject. We verify payment and start within 24 hours.</p><p><a class="btn" href="${wa}">Email CV &amp; payment proof</a></p><p><button class="btn" onclick="print()">Print / Save as PDF</button> <a class="btn o" href="track.html?id=${id}">Track status</a></p></div>
  <div class="cert" id="cert"><div class="logo">${LOGO}Wazifly</div><h2 style="margin-top:20px">Guarantee Certificate &amp; Receipt</h2><p class="mono" style="font-size:1.3rem;margin-top:14px">${id}</p>
  <dl><dt>Candidate</dt><dd>${esc(r.name)}</dd><dt>Plan</dt><dd>Tier ${t.t} — ${t.n}</dd><dt>Amount paid</dt><dd class="mono">${pkr(r.tier)}</dd><dt>Payment</dt><dd>${esc(r.method)} · TID ${esc(r.tid)}</dd><dt>Start date</dt><dd>${fmt(new Date(r.start))}</dd><dt>Guarantee window</dt><dd class="mono dl">${t.d} days</dd><dt>Interview deadline</dt><dd class="dl"><b>${fmt(dl)}</b></dd><dt>Target</dt><dd>${esc(r.target)}, ${esc(r.city)}</dd></dl>
  <p class="mute" style="margin-top:24px">If no interview is secured by the deadline, Wazifly refunds the amount paid, less applicable taxes and surcharges, under the Refund Policy (wazifly.com/refund-policy), subject to fair-play conditions. Valid once payment is verified.</p></div>`;
 };
}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

// Tracker
const tf=$('#trackForm');
if(tf){const out=$('#trackOut');
 const look=raw=>{const id=raw.trim().toUpperCase(),r={...DEMO,...store.get()}[id];
  if(!r){out.innerHTML=`<p class="err">No record found for “${esc(id)}”. Check the ID on your certificate (format WZF-2026-1234).</p>`;return}
  const t=TIERS[r.tier],s=new Date(r.start),dl=new Date(s);dl.setDate(dl.getDate()+t.d);
  const el=Math.max(0,Math.floor((Date.now()-s)/864e5)),left=Math.max(0,t.d-el);
  const ev=[[0,'Enrollment and payment verified'],[1,'CV audit completed'],[2,'Profile matched to target companies'],[3,'CV dispatched to verified HR databases']];
  if(r.tier>=3000){ev.push([4,'CV rewritten and ATS-optimized']);for(let n=5;n<=el;n++)ev.push([n,`Day ${n} update logged (WhatsApp/Email)`])}
  if(r.tier===5000){ev.push([6,'Direct agency recommendation sent to partners'],[8,'1-on-1 interview preparation session'])}
  [7,14,21,28].filter(n=>n<t.d).forEach(n=>ev.push([n,`Weekly status report (Day ${n})`]));ev.push([t.d,'Guarantee window closes']);
  ev.sort((a,b)=>a[0]-b[0]);
  out.innerHTML=`<div class="card"><span class="pill">${r.id}</span><h2 style="margin-top:14px">Tier ${t.t} — ${t.n}</h2><div class="metrics"><div><b class="dl">${left}</b><span>days remaining</span></div><div><b class="dl">${fmt(dl)}</b><span>deadline</span></div><div><b class="${left>0?'ok':'dl'}">${left>0?'Protected':'Window closed'}</b><span>refund protection</span></div></div>
  <p class="sub">${left>0?`Your interview guarantee is active until ${fmt(dl)}.`:'The guarantee window has ended. If you did not receive an interview, you may request a refund (less taxes and surcharges) within 7 days.'}</p><ul class="tl">${ev.map(([n,x])=>`<li class="${n<=el?'done':''}"><b class="mono">Day ${n}</b> — ${x}</li>`).join('')}</ul></div>`};
 tf.onsubmit=e=>{e.preventDefault();look($('#refId').value)};
 const p=new URLSearchParams(location.search).get('id');if(p){$('#refId').value=p;look(p)}
}

// Contact tabs + forms
$$('.tabs button').forEach(b=>b.onclick=()=>{$$('.tabs button').forEach(x=>x.classList.toggle('on',x===b));$$('.panel').forEach(p=>p.classList.toggle('on',p.id===b.dataset.t))});
$$('form.contact').forEach(fm=>fm.onsubmit=e=>{e.preventDefault();if(!fm.checkValidity())return fm.reportValidity();fm.querySelector('.ok').textContent='Message received. We reply within one business day.';fm.reset()});


// Plan finder
if($('#q1')){const o=$('#finderOut'),why={1000:'Your CV is strong and you have time, so direct distribution is enough.',3000:'A sharper ATS-ready CV and daily updates will move you fastest within a month.',5000:'You want speed or coaching, so interview preparation and a direct agency recommendation fit best.'};
 const run=()=>{const a=$('#q1').value,b=$('#q2').value,c=$('#q3').value,t=(a==='a'||c==='y')?5000:(a==='c'&&b==='s')?1000:3000,T=TIERS[t];o.innerHTML=`<p><b>Best fit: Tier ${T.t} — ${T.n}</b> <span class="mono">${pkr(t)} · ${T.d}-day guarantee</span></p><p class="sub">${why[t]}</p><p><a class="btn" href="apply.html?tier=${t}">Choose ${T.n}</a></p>`};
 ['q1','q2','q3'].forEach(i=>$('#'+i).onchange=run);run()}
// Gen-Z touches: reveal on scroll + sticky mobile CTA
if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.1});$$('.card,section h2,.metrics,details').forEach(el=>{el.classList.add('rv');io.observe(el)})}
if(!f){const c=document.createElement('a');c.className='btn sticky-cta';c.href='apply.html';c.textContent='Get my reference';document.body.appendChild(c)}
})();
