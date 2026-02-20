/// <reference types="vite/client" />
declare const GITHUB_RUNTIME_PERMANENT_NAME: string
declare const BASE_KV_SERVICE_URL: string

interface SparkAPI {
  llmPrompt(strings: TemplateStringsArray, ...values: any[]): string[];
  llm(prompt: string[], model?: string, json?: boolean): Promise<string>;
}

declare const spark: SparkAPI;

interface Window {
  spark: SparkAPI;
}

declare module 'jspdf' {
  class jsPDF {
    constructor(...args: any[]);
    text(text: string, x: number, y: number, options?: any): jsPDF;
    setFontSize(size: number): jsPDF;
    setFont(font: string, style?: string): jsPDF;
    setTextColor(...args: any[]): jsPDF;
    setDrawColor(...args: any[]): jsPDF;
    setFillColor(...args: any[]): jsPDF;
    rect(x: number, y: number, w: number, h: number, style?: string): jsPDF;
    roundedRect(x: number, y: number, w: number, h: number, rx: number, ry: number, style?: string): jsPDF;
    line(x1: number, y1: number, x2: number, y2: number): jsPDF;
    addPage(): jsPDF;
    save(filename: string): jsPDF;
    output(type: string): any;
    getNumberOfPages(): number;
    setPage(page: number): jsPDF;
    internal: { pageSize: { getWidth: () => number; getHeight: () => number } };
    addImage(data: string, format: string, x: number, y: number, w: number, h: number): jsPDF;
  }
  export default jsPDF;
}

declare module 'html2canvas' {
  function html2canvas(element: HTMLElement, options?: any): Promise<HTMLCanvasElement>;
  export default html2canvas;
}