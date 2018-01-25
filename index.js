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

class SafeObserver {
    constructor(observer) {
        this.observer = observer;
    }

    next(value) {
        if(!this.isUnsubsribed && this.observer.next) {
            try {
                this.observer.next(value);
            } catch (err) {
                this.unsubscribe();
                throw err;
            }
        }
    }

    error(err) {
        if(!this.isUnsubsribed && this.observer.error) {
            try {
                this.observer.error();
            } catch (err) {
                this.unsubscribe();
                throw err;
            } finally {
                this.unsubscribe();
            }
        }
    }

    complete() {
        if(!this.isUnsubsribed && this.observer.complete) {
            try {
                this.observer.complete();
            } catch (err) {
                this.unsubscribe();
                throw err;
            } finally {
                this.unsubscribe();
            }
        }
    }

    unsubscribe() {
        this.isUnsubsribed = true;
        if(this.unsub) {
            this.unsub();
        }
    }
}

function myObservable(observer) {
    let safeObs = new SafeObserver(observer);
    let datasource = new DataSource();
    datasource.ondata = (e) => safeObs.next(e);
    datasource.onerror = (err) => safeObs.error(err); 
    datasource.oncomplete = () => safeObs.complete();

    safeObs.unsub = () => {
        datasource.destroy();
    }

    return safeObs.unsubscribe.bind(safeObs);
}

const obs = myObservable({
    next(data) { console.log(data); },
    error(err) { console.log("ERROR was happend", err); },
    complete() { console.log("done"); }
});

// class Observable {

//     constructor(datasource) {
//         datasource.o
//     }

//     next() {

//     }

//     complete() {

//     }

//     error() {

//     }
// }
