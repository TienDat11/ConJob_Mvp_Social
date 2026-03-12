"use client";

import { toPng } from "html-to-image";
import { useState } from "react";

interface UseExportImageOptions {
  contentRef: React.RefObject<HTMLDivElement>;
  fileName: string;
}

const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;
const PIXEL_RATIO = 2;

export function useExportImage({ contentRef, fileName }: UseExportImageOptions) {
  const [isExporting, setIsExporting] = useState(false);

  async function exportImage() {
    const element = contentRef.current;
    if (!element) return;

    setIsExporting(true);

    const wrapper = document.createElement("div");
    wrapper.style.cssText = [
      "position:fixed",
      "top:0",
      "left:-9999px",
      `width:${A4_WIDTH_PX}px`,
      `height:${A4_HEIGHT_PX}px`,
      "pointer-events:none",
    ].join(";");

    const clone = element.cloneNode(true) as HTMLDivElement;
    clone.style.cssText = [
      "transform:none",
      "transform-origin:top left",
      `width:${A4_WIDTH_PX}px`,
      `height:${A4_HEIGHT_PX}px`,
      "position:static",
      "overflow:visible",
    ].join(";");

    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    try {
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      );

      const actualHeight = clone.scrollHeight;

      clone.style.height = `${actualHeight}px`;
      wrapper.style.height = `${actualHeight}px`;

      const justifyStyle = clone.ownerDocument.createElement("style");
      justifyStyle.textContent = [
        ".resume-body-text {",
        "  text-align: justify !important;",
        "  text-justify: inter-word !important;",
        "  text-align-last: left !important;",
        "  hyphens: auto !important;",
        "  -webkit-hyphens: auto !important;",
        "  overflow-wrap: break-word !important;",
        "}",
      ].join("\n");
      clone.appendChild(justifyStyle);

      const dataUrl = await toPng(clone, {
        width: A4_WIDTH_PX,
        height: actualHeight,
        pixelRatio: PIXEL_RATIO,
        backgroundColor: "#ffffff",
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
    } finally {
      document.body.removeChild(wrapper);
      setIsExporting(false);
    }
  }

  return { exportImage, isExporting };
}
