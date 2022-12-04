import apiRequest from "./api.js";

/* A class to represent a memo */
export default class Memo {
    constructor(data) {
        this.id = null;
        this.title = null;
        this.date = null;
        this.text = null;
    }

    // returns an array of memo in the database
    static async listMemos() {
        let data = await apiRequest("GET", `/memo`);
        return data.memos;
    }

    // returns a single memo object if it exists
    static async loadMemo(id) {
        // if the memo is present, return the memo
        try {
            let res = await apiRequest("GET", `/memo/${id}`);
            return res;
        } catch(error) {
            alert(error.message);
        }
    }

    // create a single memo object
    static async createMemo(title, date, text) {
        try {
            let res = await apiRequest("POST", "/memo", JSON.stringify({ title, date, text }));
            return res;
        } catch(error) {
            alert(error.message);
        }
    }

    // delete a memo from the database
    static async deleteMemo(id) {
        try {
            let res = await apiRequest("DELETE", `/memo/${id}`);
        } catch(error) {
            alert(error.message);
        }
    }
}