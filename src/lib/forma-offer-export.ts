import { offerTeamRows, offerTotals, usd, SERVICE_GROUPS, type Offer } from "@/lib/forma-offer";
async function checked(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("Document indisponible");
  return r.arrayBuffer();
}
const generated = new WeakMap<Offer, Promise<Uint8Array>>();
export function officialOfferPdf(offer: Offer) {
  const cached = generated.get(offer);
  if (cached) return cached;
  const promise = generateOfficialOfferPdf(offer);
  generated.set(offer, promise);
  promise.catch(() => generated.delete(offer));
  return promise;
}
async function generateOfficialOfferPdf(offer: Offer) {
  const [{ PDFDocument, rgb }, { default: fontkit }, template, fontBytes] = await Promise.all([
    import("pdf-lib"),
    import("@pdf-lib/fontkit"),
    checked("/documents/forma-offre-modele.pdf"),
    checked("/fonts/forma-document.ttf"),
  ]);
  const pdf = await PDFDocument.load(template);
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(fontBytes, { subset: true });
  const pages = pdf.getPages();
  const text = (
    i: number,
    v: string,
    x: number,
    top: number,
    width: number,
    size = 11,
    light = false,
  ) => {
    const p = pages[i];
    if (!p) return;
    v = v.replace(/[\r\n]+/g, " ");
    const m = font.widthOfTextAtSize(v, size);
    const s = m > width ? (size * width) / m : size;
    p.drawText(v, {
      x,
      y: p.getHeight() - top - s,
      size: s,
      font,
      color: light ? rgb(0.92, 0.91, 0.88) : rgb(0.1, 0.1, 0.1),
    });
  };
  text(
    0,
    offer.clientName,
    Math.max(220, (960 - font.widthOfTextAtSize(offer.clientName, 18)) / 2),
    393,
    520,
    18,
    true,
  );
  text(
    0,
    `Kinshasa, République Démocratique du Congo — ${new Date(offer.date + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`,
    300,
    486,
    370,
    11,
    true,
  );
  text(2, `À l’attention de la Direction Générale de ${offer.clientName}`, 50, 134, 540, 14);
  text(2, offer.signatory || "____________________", 683, 362, 195, 10, true);
  const positions: [number, number, number][] = [
    [390, 214, 180],
    [140, 314, 210],
    [603, 314, 230],
    [140, 402, 210],
    [603, 402, 230],
    [330, 487, 300],
  ];
  offerTeamRows(offer).forEach((row, i) => {
    const p = positions[i];
    if (p)
      text(5, `Nom : ${row.name || "________________________"}`, p[0], p[1], p[2], 9.5, i === 0);
  });
  const servicePositions: [number, number][] = [
    [52, 204],
    [52, 231],
    [52, 258],
    [52, 285],
    [52, 312],
    [52, 390],
    [52, 417],
    [52, 444],
    [513, 204],
    [513, 231],
    [513, 258],
    [513, 336],
    [513, 363],
    [513, 390],
    [513, 417],
  ];
  const ordered = [
    SERVICE_GROUPS[0],
    SERVICE_GROUPS[3],
    SERVICE_GROUPS[1],
    SERVICE_GROUPS[2],
  ].flatMap((g) => g?.items ?? []);
  ordered.forEach((s, i) => {
    const p = servicePositions[i];
    if (p && offer.services.includes(s)) text(4, "×", p[0], p[1], 10, 12);
  });
  const page = pages[6];
  if (page) {
    page.drawRectangle({ x: 43, y: 354, width: 877, height: 30, color: rgb(0.1, 0.1, 0.1) });
    ["Prestation", "Unité", "Tarif HT", "Qté", "Montant HT"].forEach((v, i) =>
      text(
        6,
        v,
        [50, 490, 640, 755, 810][i] ?? 50,
        166,
        [420, 140, 110, 50, 110][i] ?? 110,
        11,
        true,
      ),
    );
    offer.lines
      .filter((l) => l.qty > 0)
      .forEach((l, i) => {
        [l.label, l.unit, usd(l.price), String(l.qty), usd(l.price * l.qty)].forEach((v, j) =>
          text(
            6,
            v,
            [50, 490, 640, 755, 810][j] ?? 50,
            201 + i * 28,
            [425, 140, 105, 48, 105][j] ?? 105,
            10,
          ),
        );
      });
    const t = offerTotals(offer);
    text(
      6,
      `Sous-total HT : ${usd(t.subtotal)}   ·   Remise (${offer.discountPct} %) : ${usd(t.discount)}   ·   Total HT : ${usd(t.total)}`,
      50,
      440,
      860,
      12,
    );
  }
  text(13, offer.signatory || "____________________", 445, 275, 260, 12, true);
  text(13, "+243 977 528 234", 445, 315, 260, 12, true);
  text(13, "formaeventandsecurity@gmail.com", 445, 355, 340, 12, true);
  text(13, "forma-connect-solutions.lovable.app", 445, 395, 340, 11, true);
  text(13, "144, av. Ngandu, Q/Mpasa I, C/Nsele, Kinshasa", 330, 450, 520, 11, true);
  if (offer.notes.trim()) {
    let p = pdf.addPage([960, 540]);
    let y = 430;
    const draw = (v: string, s: number) => {
      p.drawText(v, { x: 50, y, size: s, font, color: rgb(0.1, 0.1, 0.1) });
      y -= s + 10;
    };
    draw("Conditions particulières", 24);
    let line = "";
    for (const word of offer.notes.split(/\s+/)) {
      if (font.widthOfTextAtSize(`${line} ${word}`, 12) > 850 && line) {
        draw(line, 12);
        line = "";
        if (y < 55) {
          p = pdf.addPage([960, 540]);
          y = 470;
        }
      }
      line += `${line ? " " : ""}${word}`;
    }
    if (line) draw(line, 12);
  }
  pdf.setTitle(`Offre officielle FORMA — ${offer.clientName}`);
  return pdf.save();
}
export async function downloadOffer(offer: Offer, format: "pdf" | "pptx") {
  const bytes = await officialOfferPdf(offer);
  const name = `FORMA-offre-${offer.clientName.replace(/[^a-zA-Z0-9À-ÿ-]/g, "-").slice(0, 70)}`;
  if (format === "pdf") {
    const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.pdf`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return;
  }
  const [{ default: PptxGenJS }, pdfjs] = await Promise.all([
    import("pptxgenjs"),
    import("pdfjs-dist"),
  ]);
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).href;
  const task = pdfjs.getDocument({ data: new Uint8Array(bytes) });
  const source = await task.promise;
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "FORMA Event Services & Security";
  pptx.title = `Offre — ${offer.clientName}`;
  try {
    for (let i = 1; i <= source.numPages; i++) {
      const p = await source.getPage(i);
      const viewport = p.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Export impossible");
      await p.render({ canvasContext: context, viewport }).promise;
      pptx
        .addSlide()
        .addImage({ data: canvas.toDataURL("image/png"), x: 0, y: 0, w: 13.333333, h: 7.5 });
      canvas.width = 0;
      canvas.height = 0;
    }
    const blob = await pptx.write({ outputType: "blob" });
    const { default: JSZip } = await import("jszip");
    const zip = await JSZip.loadAsync(blob as Blob);
    const entry = zip.file("ppt/presentation.xml");
    if (entry) {
      let xml = await entry.async("string");
      const notes = xml.match(/<p:notesMasterIdLst[\s\S]*?<\/p:notesMasterIdLst>/)?.[0];
      if (notes) {
        xml = xml.replace(notes, "");
        zip.file("ppt/presentation.xml", xml);
      }
    }
    const result = await zip.generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    });
    const url = URL.createObjectURL(result);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.pptx`;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  } finally {
    await task.destroy();
  }
}
