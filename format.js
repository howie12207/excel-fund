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

export const formatDateTime = (time) => {
    if (!time) return time;
    time = new Date(time);
    if (time.toString() === "Invalid Date") return "";
    const yyyy = time.getFullYear();
    const mm =
        time.getMonth() + 1 < 10
            ? "0" + (time.getMonth() + 1)
            : time.getMonth() + 1;
    const dd = time.getDate() < 10 ? "0" + time.getDate() : time.getDate();
    const hh = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    const MM =
        time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    const ss =
        time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds();
    return `${yyyy}-${mm}-${dd} ${hh}:${MM}:${ss}`;
};

export const formatDate = (time) => {
    if (!time) return time;
    time = new Date(time);
    return formatDateTime(time)?.slice(0, 7);
};
