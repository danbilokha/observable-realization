let SafeObserver = require('./rxjs').SafeObserver;
let DataSource = require('./datasource').DataSource;

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
