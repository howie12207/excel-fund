export const thousandToNumber = (num) => {
    if ((num + "").trim() == "") {
        return "";
    }
    num = String(num).replace(/,/gi, "");
    return num;
};

export const toThousand = (num) => {
    return parseFloat(num).toLocaleString();
};
