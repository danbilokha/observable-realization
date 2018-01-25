class DataSource {

    constructor(count = 10) {
        let i = 0;
        this._count = count;
        this._emit = setInterval(() => this.emit(i += 1), 500);
    }

    emit(data) {
        if(this.ondata) {
            this.ondata(data);
        }

        if(data === this._count) {
            if(this.oncomplete) {
                this.oncomplete();
            }

            this.destroy();
        }
    }

    destroy() {
        clearInterval(this._emit);
    }
}

export {DataSource};