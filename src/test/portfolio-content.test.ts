import { describe, expect, it } from "vitest";

import * as content from "@/data/portfolio";

describe("portfolio content rules", () => {
  it("keeps the CV and the Resume as two separate original PDFs", () => {
    expect(content.documents.cv.filename).toBe("Soheb CV.pdf");
    expect(content.documents.resume.filename).toBe("Md Soheb Ansari.pdf");
    expect(content.documents.cv.filename).not.toBe(content.documents.resume.filename);
  });

  it("uses no em dashes anywhere in the site copy", () => {
    expect(JSON.stringify(content)).not.toContain("\u2014");
  });

  it("marks DiagnoFRA's simulated analysis instead of claiming a working AI model", () => {
    const diagno = content.projects.find((p) => p.id === "diagnofra");
    expect(diagno?.status?.planned).toContain("Trained ML model for fault classification");
    expect(diagno?.status?.working).not.toContain("Trained ML model for fault classification");
  });
});
