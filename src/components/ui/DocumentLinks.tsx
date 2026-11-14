import { Download, FileText } from "lucide-react";

import { documents } from "@/data/portfolio";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

/**
 * CV and Resume are two separate original PDFs. Until a file is added, its
 * slot is shown as pending rather than as a link that goes nowhere.
 */
export function DocumentLinks({ className, compact = false }: { className?: string; compact?: boolean }) {
  const docs = [documents.resume, documents.cv];
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {docs.map((doc, i) =>
        doc.href ? (
          <a
            key={doc.filename}
            href={doc.href}
            download={doc.filename}
            type="application/pdf"
            className={buttonVariants({ variant: i === 0 ? "signal" : "frame", size: compact ? "sm" : "lg" })}
          >
            <Download aria-hidden /> {doc.label}
          </a>
        ) : (
          <span
            key={doc.filename}
            className={cn(
              buttonVariants({ variant: "frame", size: compact ? "sm" : "lg" }),
              "cursor-default border-dashed text-faint hover:border-line-strong hover:text-faint",
            )}
            title={`${doc.filename} has not been added yet`}
          >
            <FileText aria-hidden /> {doc.label.replace("Download ", "")}: file pending
          </span>
        ),
      )}
    </div>
  );
}
