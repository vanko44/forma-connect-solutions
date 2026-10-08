import { FORMA_ADDRESS, FORMA_EMAIL, FORMA_PHONE } from "./forma-contact";
import { missionFinance, usd, type MissionOrder } from "./mission-order";
export async function missionPdf(m: MissionOrder) {
  const [{ PDFDocument, rgb }, { default: fontkit }] = await Promise.all([import("pdf-lib"), import("@pdf-lib/fontkit")]);
  const pdf = await PDFDocument.create(); pdf.registerFontkit(fontkit);
  const checked = async (url: string) => { const r = await fetch(url); if (!r.ok) throw new Error("Document indisponible"); return r.arrayBuffer(); };
  const [fontBytes, logoBytes] = await Promise.all([checked("/fonts/forma-document.ttf"), checked("/images/forma-logo.jpeg")]);
  const font = await pdf.embedFont(fontBytes, { subset: true }); const logo = await pdf.embedJpg(logoBytes);
  let page = pdf.addPage([595, 842]); let y = 700;
  const newPage = () => { page = pdf.addPage([595,842]); y=770; };
  page.drawImage(logo, { x:44,y:746,width:60,height:60 });
  page.drawText("FORMA EVENT & SECURITY", { x:120,y:782,size:17,font,color:rgb(.04,.04,.04) });
  page.drawText("RCCM CD/KNM/RCCM/25-A-10490", { x:120,y:761,size:10,font });
  const text = (value: string, size=11) => {
    for (const para of value.split("\n")) {
      let line="";
      for (const word of para.split(/\s+/)) {
        const candidate = line ? line + " " + word : word;
        if (line && font.widthOfTextAtSize(candidate,size)>507) {
          if(y<60)newPage();page.drawText(line,{x:44,y,size,font});y-=size+6;line="";
        }
        if (font.widthOfTextAtSize(word,size)>507) {
          for (const char of word) {
            if(font.widthOfTextAtSize(line+char,size)>507){if(y<60)newPage();page.drawText(line,{x:44,y,size,font});y-=size+6;line="";}
            line+=char;
          }
        } else line = line ? line + " " + word : word;
      }
      if(y<60)newPage(); page.drawText(line,{x:44,y,size,font});y-=size+7;
    }
  };
  text("ORDRE DE MISSION — " + m.order_number,18);y-=12;
  text(`${m.title}\n${m.pole} · ${m.status}`);y-=10;
  text(`PARTENAIRE : ${m.partner_name}\nTéléphone : ${m.partner_phone || "—"}\nEmail : ${m.partner_email || "—"}\nCLIENT / SITE : ${m.client_site}\nLIEU : ${m.location}\nDATES : ${m.start_date} au ${m.end_date}\nSUPERVISEUR FORMA : ${m.supervisor}`);
  y-=10;text("CAHIER DES CHARGES / CONSIGNES",13);text(m.instructions || "À compléter");
  y-=10;text("RÈGLEMENTS",13);text(`Montant convenu : ${usd(m.amount)}\nAcompte / règlements versés : ${usd(m.paid_amount)}\nSolde restant : ${usd(missionFinance(m.amount,m.paid_amount).balance)}\nÉchéance : ${m.due_date || "À convenir"}\nPaiement : ${missionFinance(m.amount,m.paid_amount).status}`);
  y-=10;text("ENGAGEMENTS",13);text("Le partenaire s’engage à exécuter la mission conformément au cahier des charges, aux consignes du superviseur FORMA et aux exigences de qualité convenues. Il préserve la confidentialité des informations du client et de FORMA. Les livrables sont soumis au contrôle de FORMA. Toute modification de périmètre ou de montant fait l’objet d’un accord écrit entre les parties.");
  if(y<180)newPage();y-=20;
  for (const [x,label] of [[44,"Direction FORMA"],[320,"Partenaire"]] as const) {
    page.drawText(label,{x,y,size:11,font});
    page.drawText("Nom et signature :",{x,y:y-20,size:11,font});
    page.drawText("________________________",{x,y:y-65,size:11,font});
  }
  const pages=pdf.getPages();pages.forEach((p,i)=>{p.drawText(`${FORMA_ADDRESS}`,{x:44,y:34,size:8,font});p.drawText(`${FORMA_PHONE} · ${FORMA_EMAIL} | ${i+1}/${pages.length}`,{x:44,y:20,size:8,font});});
  return pdf.save();
}
export async function openMissionPdf(m: MissionOrder, print=false) {
  const tab = print ? window.open("", "_blank") : null;
  try {
    const bytes=await missionPdf(m);const url=URL.createObjectURL(new Blob([new Uint8Array(bytes)],{type:"application/pdf"}));
    if(print) { if(tab)tab.location.href=url;else throw new Error("Autorisez l’ouverture du document pour imprimer."); }
    else { const a=document.createElement("a");a.href=url;a.download=`${m.order_number}.pdf`;a.click(); }
    setTimeout(()=>URL.revokeObjectURL(url),120000);
  } catch(e) {tab?.close();throw e;}
}