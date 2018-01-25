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

export {SafeObserver};
