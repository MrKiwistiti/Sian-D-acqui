import { jsPDF } from "jspdf";

/** Données projet (compatibles avec ta version actuelle) */
export interface ProjectData {
  id: string;
  name: string;
  baseline: string;
  description: string;
  sector: string;
  maturity: string;
  location: string;
  founded?: number;
  website?: string;
  email?: string;
  founders?: string[];
  needs: string[];
}

export function generatePitchDeckPDF(project: ProjectData) {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const primary = [17, 102, 255];
  const text = [20, 20, 20];
  const gray = [240, 240, 240];

  let y = 20;

  // --- Header ---
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(26);
  pdf.setTextColor(primary[0], primary[1], primary[2]);
  pdf.text(project.name, 20, y);

  y += 10;
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(12);
  pdf.setTextColor(100, 100, 100);
  pdf.text(project.baseline, 20, y);

  y += 15;

  // Section box helper
  const addSection = (title: string, lines: string[]) => {
    const boxHeight = lines.length * 6 + 12;
    pdf.setFillColor(gray[0], gray[1], gray[2]);
    pdf.roundedRect(15, y, pageWidth - 30, boxHeight, 3, 3, "F");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(primary[0], primary[1], primary[2]);
    pdf.text(title, 20, y + 8);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.setTextColor(text[0], text[1], text[2]);

    let innerY = y + 16;
    lines.forEach((line) => {
      pdf.text(line, 25, innerY);
      innerY += 6;
    });

    y += boxHeight + 8;
  };

  // --- Sections ---
  addSection("Description", [project.description]);

  const infos: string[] = [
    `Secteur : ${project.sector}`,
    `Maturité : ${project.maturity}`,
    `Localisation : ${project.location}`,
  ];
  if (project.founded) infos.push(`Fondée en : ${project.founded}`);
  addSection("Infos clés", infos);

  if (project.founders && project.founders.length > 0) {
    addSection("Fondateurs", project.founders.map((f) => `${f}`));
  }

  if (project.needs?.length > 0) {
    addSection("Besoins", project.needs.map((n) => `• ${n}`));
  }

  const contact: string[] = [];
  if (project.email) contact.push(`Email : ${project.email}`);
  if (project.website) contact.push(`Site web : ${project.website}`);
  addSection("Contact", contact);

  // Footer
  pdf.setFont("helvetica", "italic");
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);
  pdf.text(
    "JEB Incubator - Document confidentiel",
    pageWidth / 2,
    pageHeight - 10,
    { align: "center" }
  );
  pdf.save(`${project.name.replace(/[^a-zA-Z0-9]/g, "_")}_PitchDeck.pdf`);
}
