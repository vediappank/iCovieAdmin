import * as XLSX from "xlsx";

export class ExportToExcel {
  static exportToExcel(tableId: string, name?: string) {
    
    let timeSpan = new Date().toISOString();
    let prefix = name || "ExportResult";
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    targetTableElm.style;
    let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{ sheet: prefix});
    
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}