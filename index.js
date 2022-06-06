var indexedDBRef = window.indexedDB;
var people = [
    {
        _id: '111',
        name: 'aaa',
        age: 20
    }, {
        _id: '222',
        name: 'bbb',
        age: 12
    }, {
        _id: '333',
        name: 'ccc',
        age: 19
    }, {
        _id: '444',
        name: 'aaa',
        age: 30
    },
];
var DBModule = /** @class */ (function () {
    function DBModule(name) {
        var _this = this;
        this.initIndexedDB = function () {
            var request = indexedDBRef.open("".concat(_this.name, "DB"), 1);
            request.onerror = _this.handleIndexedDBOnError;
            request.onupgradeneeded = function (e) { return _this.handleIndexedDBOnUpgradeNeeded(e, request); };
        };
        this.handleIndexedDBOnError = function (e) {
            console.log("failed to open ".concat(_this.name, " database"));
            console.log(e);
        };
        this.handleIndexedDBOnUpgradeNeeded = function (e, request) {
            request.result.createObjectStore(_this.name, { keyPath: '_id' });
        };
        this.upsert = function (person) {
            var request = indexedDBRef.open("".concat(_this.name, "DB"));
            request.onerror = _this.handleIndexedDBOnError;
            request.onsuccess = function () {
                var transaction = request.result.transaction(_this.name, 'readwrite');
                var store = transaction.objectStore(_this.name);
                store.add(person);
            };
        };
        this.upsertAll = function (people) {
            var request = indexedDBRef.open("".concat(_this.name, "DB"));
            request.onerror = _this.handleIndexedDBOnError;
            request.onsuccess = function () {
                var transaction = request.result.transaction(_this.name, 'readwrite');
                var store = transaction.objectStore(_this.name);
                people.forEach(function (person) {
                    console.log('inserting', person._id);
                    store.add(person);
                    console.log('done', person._id);
                });
            };
        };
        this.name = name;
        this.initIndexedDB();
    }
    return DBModule;
}());
var module = new DBModule('people');
module.upsert(people[0]);
// module.upsertAll(people);
