"use client";

import { useCallback, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface UseExportPDFOptions {
  contentRef: React.RefObject<HTMLDivElement | null>;
  fileName: string;
}

export function useExportPDF({ contentRef, fileName }: UseExportPDFOptions) {
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const print = useReactToPrint({
    contentRef,
    documentTitle: fileName,
    pageStyle: `
      @page {
        size: A4;
        margin: 0 !important;
      }
      @media print {
        *,
        *::before,
        *::after {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
        }
        .resume-body-text {
          text-align: justify !important;
          text-justify: inter-word !important;
          text-align-last: left !important;
          hyphens: auto !important;
          -webkit-hyphens: auto !important;
          overflow-wrap: break-word !important;
        }
      }
    `,
  });

  const exportPDF = useCallback(async () => {
    setIsExportingPDF(true);
    try {
      await Promise.resolve(print());
    } finally {
      setIsExportingPDF(false);
    }
  }, [print]);

  return { exportPDF, isExportingPDF };
}
