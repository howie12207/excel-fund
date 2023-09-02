import XLSX from "xlsx";
import { thousandToNumber, toThousand, formatDate } from "./format.js";
import Decimal from "decimal.js";

const FILE_PATH = "./基金.xlsx";
const FILE_PATH_NEW = `./統整基金_${formatDate(new Date())}.xlsx`;
const DEFAULT_SHEET = "輸入";
const LABEL_SHEET = "表";
const LABEL_CURRENCY = "幣別";
const LABEL_DOLLAR = "金額";
const LABEL_BUY_SELL = "買賣";
const LABEL_AMOUNT = "單位數";

let workbook = XLSX.readFile(FILE_PATH);

// 刪除多餘的表
const newSheet = workbook.Sheets[DEFAULT_SHEET];
const newWorkbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(newWorkbook, newSheet, DEFAULT_SHEET);
XLSX.writeFile(newWorkbook, FILE_PATH_NEW, { bookType: "xlsx" });
workbook = XLSX.readFile(FILE_PATH_NEW);

// 表分類
const dataBySheetName = {};
XLSX.utils.sheet_to_json(newSheet).forEach((row) => {
    const sheetName = row[LABEL_SHEET];
    if (!dataBySheetName[sheetName]) {
        dataBySheetName[sheetName] = [];
    }

    // 刪除 表 欄
    delete row[LABEL_SHEET];

    const dollar = toThousand(thousandToNumber(row[LABEL_DOLLAR]));
    const amount = toThousand(thousandToNumber(row[LABEL_AMOUNT]));
    dataBySheetName[sheetName].push({
        ...row,
        [LABEL_DOLLAR]: dollar,
        [LABEL_AMOUNT]: amount,
    });
});

// 寫入各表
for (const sheetName in dataBySheetName) {
    const data = dataBySheetName[sheetName];

    // 加總
    const totalList = {};
    data.forEach((row) => {
        const currency = row[LABEL_CURRENCY];
        const dollar = thousandToNumber(row[LABEL_DOLLAR]);
        const buySell = row[LABEL_BUY_SELL];
        const amount = thousandToNumber(row[LABEL_AMOUNT]);

        if (!totalList[currency]) {
            totalList[currency] = { dollar: 0, amount: 0 };
        }
        if (buySell === "買") {
            totalList[currency].dollar = new Decimal(totalList[currency].dollar)
                .plus(dollar)
                .toNumber();
            totalList[currency].amount = new Decimal(totalList[currency].amount)
                .plus(amount)
                .toNumber();
        } else if (buySell === "賣") {
            totalList[currency].dollar = new Decimal(totalList[currency].dollar)
                .minus(dollar)
                .toNumber();
            totalList[currency].amount = new Decimal(totalList[currency].amount)
                .minus(amount)
                .toNumber();
        }
    });
    const lastRowIndex = data.length;
    const list = Object.entries(totalList);
    for (let i = 0; i < list.length; i++) {
        data[lastRowIndex + 1 + i] = {
            [LABEL_CURRENCY]: list[i][0],
            [LABEL_DOLLAR]: toThousand(list[i][1]["dollar"]),
            [LABEL_AMOUNT]: toThousand(list[i][1]["amount"]),
        };
    }

    const newData = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, newData, sheetName);
}

XLSX.writeFile(workbook, FILE_PATH_NEW, { bookType: "xlsx" });
