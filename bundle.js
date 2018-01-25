(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class DataSource {

    constructor(countValueToEmit = 10) {
        let i = 0;
        this._count = countValueToEmit;
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

exports.DataSource = DataSource;

},{}],2:[function(require,module,exports){
let DataSource = require('./datasource').DataSource;
let Observer = require('./rxjs').Observer;
let map = require('./rxjs').map;

const myObservable = new Observer(observer => {
    let datasource = new DataSource();

    datasource.ondata = (e) => observer.next(e);
    datasource.onerror = (err) => observer.error(err); 
    datasource.oncomplete = () => observer.complete();

    return () => datasource.destroy();
});

const observer = map(myObservable, x => x + x)
    .subscribe({
            next: e => console.log(e),
            error: err => console.log(err),
            complete: () => console.log('done')
        })

},{"./datasource":1,"./rxjs":3}],3:[function(require,module,exports){
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
        safeObserver.unsub = this._subscribe(safeObserver); // Magic in the line
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

},{}]},{},[2]);
