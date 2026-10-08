const S=[
{q:"Kunden spørger: «Hvad betaler jeg egentlig om måneden for min ladepakke?»",ans:"kp0",
 why:"Prisen står i Produktoplysninger på kundebilledet, ved siden af produktet.",
 k:{nr:"100234",navn:"Lise Hansen (fiktiv)",adr:"Eksempelvej 12, 8000 Aarhus"},
 p:[["Ladepakke Privat","Aktiv","01-03-2025","299 kr."],["Ladeboks leje","Aktiv","01-03-2025","0 kr."]],
 l:[["Model","HomeCharge 11"],["Status","Online"],["Sidst online","I dag"],["Firmware","2.1.4"]],
 f:[["Seneste faktura","Betalt 01-09-2026"],["Betalingsform","Betalingsservice"],["Forfald","Ingen"],["Rykker","Nej"]]},
{q:"Kunden siger: «Min ladeboks lyser rødt og vil ikke starte.»",ans:"l1",
 why:"Fejlkoden står på fanen Ladeboks. E3 betyder manglende netforbindelse, og første skridt er at genstarte boksen.",
 k:{nr:"100871",navn:"Jonas Berg (fiktiv)",adr:"Testvej 5, 8200 Aarhus N"},
 p:[["Ladepakke Privat","Aktiv","12-05-2025","299 kr."]],
 l:[["Model","HomeCharge 22"],["Fejlkode","E3 – ingen netforbindelse. Genstart boksen"],["Sidst online","3 dage siden"],["Firmware","2.1.4"]],
 f:[["Seneste faktura","Betalt 01-09-2026"],["Betalingsform","Betalingsservice"],["Forfald","Ingen"],["Rykker","Nej"]]},
{q:"Kunden spørger: «Hvorfor er min faktura højere end sidste måned?»",ans:"f1",
 why:"Forklaringen står på fanen Fakturaer: forbruget lå over det inkluderede forbrug. Produktpriser viser ikke selve afvigelsen.",
 k:{nr:"101552",navn:"Maria Dahl (fiktiv)",adr:"Prøvegade 3, 8000 Aarhus"},
 p:[["Ladepakke Plus","Aktiv","20-01-2026","399 kr."]],
 l:[["Model","HomeCharge 11"],["Status","Online"],["Sidst online","I dag"],["Firmware","2.1.4"]],
 f:[["Seneste faktura","Betalt 01-09-2026"],["Forbrug september","412 kWh – 112 kWh over inkluderet"],["Inkluderet forbrug","300 kWh/md."],["Merpris","1,95 kr./kWh"]]}
];
let i=0,pts=0,tab="Kunde",hint=false,fb=null,done=false,wrong=0;
const app=document.getElementById("app"),e=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const fr=(id,l,v,w)=>`<div class="fr"><span>${l}</span><span class="v ${w?"w":""}" onclick="pick('${id}')">${e(v)}</span></div>`;
function pane(s){
 if(tab=="Startside")return `<div class="ttl">Startside</div><p>Velkommen. Brug fanerne øverst til at finde oplysninger om kunden.</p>`;
 if(tab=="Kunde"){const k=s.k;return `<div class="ttl">Kunde (Kundesystem)</div><div class="cols"><div>
 ${fr("k0","Kundenr.",k.nr)}${fr("k1","Navn",k.navn)}${fr("k2","Adresse",k.adr)}${fr("k3","CPR-nr","******-****",1)}${fr("k4","Kilde","0 - Konverteret",1)}${fr("k5","Må kontaktes","Ja",1)}</div><div>
 ${fr("k6","Status","2 - Aktiv")}${fr("k7","Soliditet","0 -")}${fr("k8","CPR Status","12 - Ej verificeret")}${fr("k9","Aktuel status RKI","Antal: 0")}${fr("k10","Abonnementstype","Privat")}</div><div>
 <fieldset><legend>Produktoplysninger</legend><table><tr><th>Produkt</th><th>Status</th><th>Statusdato</th><th>Pris/md.</th></tr>
 ${s.p.map((r,n)=>`<tr class="rw" onclick="pick('kp${n}')">${r.map(c=>`<td>${e(c)}</td>`).join("")}</tr>`).join("")}</table></fieldset></div></div>
 <div class="two"><fieldset><legend>Ejeroplysninger</legend><div class="gr"></div></fieldset><fieldset><legend>Kundegruppering</legend><div class="gr"></div></fieldset></div>`}
 const d=tab=="Ladeboks"?s.l:s.f,p=tab=="Ladeboks"?"l":"f";
 return `<div class="ttl">${tab}</div><fieldset><legend>${tab}soplysninger</legend>${d.map((r,n)=>fr(p+n,r[0],r[1])).join("")}</fieldset>`}
function render(){
 if(i>=S.length){app.innerHTML=`<div class="top"><h1>Opkaldene er slut</h1></div><div class="c"><p style="font-size:26px;margin:0"><b>${pts}</b> / ${S.length*100} point</p><p class="mu">Fejl var uden konsekvens. Det vigtige er, at du har øvet at finde oplysningen i systemet.</p><button class="g p" onclick="i=0;pts=0;start()">Spil igen</button></div>`;return}
 const s=S[i],T=["Startside","Kunde","Ladeboks","Fakturaer"],ht=s.ans[0]=="k"?"Kunde":s.ans[0]=="l"?"Ladeboks":"Fakturaer";
 let h=`<div class="top"><h1>OK Oplæring · Ladepakker</h1><span class="pts">${pts} point</span></div>
 <div class="c call"><div class="mu">Opkald ${i+1} af ${S.length} · Find svaret i systemet og klik på oplysningen</div><p style="margin:5px 0 0"><b>${e(s.q)}</b></p></div>
 <div class="sys"><div class="in"><div class="menu"><span>Filer</span><span>Vis</span><span>Hjælp</span></div><div class="tool"><i></i><i></i><span>Luk fanebland</span></div>
 <div class="tabs">${T.map(t=>`<b class="${t==tab?"on":""} ${hint&&t==ht?"hn":""}" onclick="tab='${t}';render()">${t=="Kunde"?"Kunde "+s.k.nr:t}</b>`).join("")}</div>
 <div class="pane">${pane(s)}</div></div></div>`;
 if(fb)h+=`<div class="fb ${fb.ok?"g":"b"}">${fb.t}</div>`;
 h+=done?`<button class="g p" onclick="i++;start()">${i==S.length-1?"Se resultat":"Næste opkald"}</button>`:`<button class="g" onclick="hint=true;fb={ok:false,t:'💡 Hint: Se efter fanen med orange kant.'};render()">Vis hint (−5)</button>`;
 app.innerHTML=h}
function pick(id){if(done)return;const s=S[i];
 if(id==s.ans){const g=Math.max(100-wrong*10-(hint?5:0),10);pts+=g;done=true;fb={ok:true,t:`✅ Korrekt! +${g} point. ${s.why}`}}
 else{wrong++;fb={ok:false,t:"❌ Det er ikke den oplysning, kunden efterspørger. Prøv en anden fane eller linje. Du mister kun lidt point."}}
 render()}
function start(){tab="Kunde";hint=false;fb=null;done=false;wrong=0;render()}
start();
