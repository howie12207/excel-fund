import XLSX from "xlsx";

const FILE_PATH = "./基金.xlsx";
const DEFAULT_SHEET = "輸入";

let workbook = XLSX.readFile(FILE_PATH);

// 刪除多餘的表
const newSheet = workbook.Sheets[DEFAULT_SHEET];
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, newSheet, DEFAULT_SHEET);
XLSX.writeFile(newWorkbook, FILE_PATH, { bookType: "xlsx", raw: true });
workbook = XLSX.readFile(FILE_PATH);

// 表分類
const dataBySheetName = {};
XLSX.utils.sheet_to_json(newSheet).forEach((row) => {
    const sheetName = row["表"];
    if (!dataBySheetName[sheetName]) {
        dataBySheetName[sheetName] = [];
    }
    delete row["表"];
    dataBySheetName[sheetName].push(row);
});

// 寫入各表
for (const sheetName in dataBySheetName) {
    const data = dataBySheetName[sheetName];

    const newData = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, newData, sheetName);
}

XLSX.writeFile(workbook, FILE_PATH, { bookType: "xlsx" });
