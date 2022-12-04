import Memo from "./memo.js";

/*** Event handlers ***/

class App {
    constructor() {
        this.memoForm;

        // bind all functions
        this._onAddMemo = this._onAddMemo.bind(this);
    }

    setup() {
        this.memoForm = document.querySelector("#addMemo");
        this.memoForm.addEventListener("submit", this._onAddMemo)
    }

    /*** Event handlers ***/
    async _onAddMemo(event) {
        event.preventDefault();
        
        let title = this.memoForm.querySelector(".titleInput").value;
        let date = this.memoForm.querySelector(".datePicker").value;
        let text = this.memoForm.querySelector(".memoInput").value;

        let res = await Memo.createMemo(title, date, text);

        if (res.success) {
            /* reset form */
            event.target.reset();
            alert("Memo added!");

            return;
        }
    }
}

let app = new App();
app.setup();