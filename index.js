let DataSource = require('./datasource').DataSource;
let Observer = require('./rxjs').Observer;
let SafeObserver = require('./rxjs').SafeObserver;

const myObservable = new Observer((observer) => {
    let safeObs = new SafeObserver(observer);
    let datasource = new DataSource();
    datasource.ondata = (e) => safeObs.next(e);
    datasource.onerror = (err) => safeObs.error(err); 
    datasource.oncomplete = () => safeObs.complete();

    safeObs.unsub = () => {
        datasource.destroy();
    }

    return safeObs.unsubscribe.bind(safeObs);
});

const observer = myObservable.subscribe({
    next: e => console.log(e),
    error: err => console.log(err),
    complete: () => console.log('done')
})
