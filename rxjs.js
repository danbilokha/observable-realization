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

class Observer {
    constructor(_subscribe) {
        this._subscribe = _subscribe;
    }

    subscribe(observer) {
        const safeObserver = new SafeObserver(observer);
        safeObserver.unsub = this._subscribe(safeObserver);
        console.log(safeObserver.unsubscribe.bind(safeObserver));
        return safeObserver.unsubscribe.bind(safeObserver);
    }
}

const map = (source, mapping) => new Observer(observer => {
    const mapObserver = {
        next: val => observer.next(mapping(val)),
        error: err => observer.error(err),
        complete: () => observer.complete()
    }

    return source.subscribe(mapObserver);
})

exports.Observer = Observer;
exports.map = map;
