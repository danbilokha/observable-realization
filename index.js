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
