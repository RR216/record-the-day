import Memo from "./memo.js";

class App {
    constructor() {
        this.memoTemplate;
        this.memosUl;

        // bind all functions
        this._onDeleteMemo = this._onDeleteMemo.bind(this);
    }

    async setup() {
        this.memoTemplate = document.querySelector("#templateMemo");
        this.memosUl = document.querySelector("#memos");

        await this._loadMemos();
    }

    async _loadMemos() {
        this.memosUl.innerHTML = "";

        let memos = await this._onListMemo();
    
        for(const memo of memos) {
            this._displayMemo(memo);
        }

        // hide no memo <p> when there is one or more memos
        if (memos.length > 0) {
            document.querySelector("#noMemos").classList.add("noDisplay");
        } else if (memos.length === 0) {
            document.querySelector("#noMemos").classList.remove("noDisplay");
        }
    }

    // display one memo object to the page
    _displayMemo(memo) {
        let newMemo = this.memoTemplate.cloneNode(true);
        newMemo.id = "";
        newMemo.querySelector(".heading").textContent = memo.title;
        newMemo.querySelector(".date").textContent = memo.date;
        newMemo.querySelector(".text").textContent = memo.text;
        newMemo.querySelector(".submitButton").setAttribute("data-id", memo._id);
        newMemo.querySelector(".submitButton").addEventListener("click", this._onDeleteMemo);

        this.memosUl.append(newMemo);
    }

    /*** Event handlers ***/

    // list all memos on the page
    async _onListMemo() {
        let memos = await Memo.listMemos();
        return memos;
    }

    // delete one memo from the page
    async _onDeleteMemo(event) {
        let memoId = event.target.getAttribute("data-id");
        await Memo.deleteMemo(memoId);
        await this._loadMemos();
    }
}

let app = new App();
await app.setup();