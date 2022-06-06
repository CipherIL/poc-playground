const indexedDBRef: IDBFactory = window.indexedDB;

type Person = {
	_id: string;
	name: string;
	age: number;
}

const people: Person[] = [
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

class DBModule {
	private readonly name: string;

	constructor(name) {
		this.name = name;
		this.initIndexedDB();
	}

	private initIndexedDB = () => {
		const request = indexedDBRef.open(`${this.name}DB`, 1);
		request.onerror = this.handleIndexedDBOnError;
		request.onupgradeneeded = (e) => this.handleIndexedDBOnUpgradeNeeded(e, request);
	}

	private handleIndexedDBOnError = (e: Event) => {
		console.log(`failed to open ${this.name} database`);
		console.log(e);
	};

	private handleIndexedDBOnUpgradeNeeded = (e: Event, request: IDBOpenDBRequest) => {
			request.result.createObjectStore(this.name,{keyPath:'_id'});
	};

	upsert = (person: Person) => {
		const request = indexedDBRef.open(`${this.name}DB`);
		request.onerror = this.handleIndexedDBOnError;
		request.onsuccess = () => {
			const transaction = request.result.transaction(this.name,'readwrite');
			const store = transaction.objectStore(this.name);
			store.add(person)
		}
	}

	upsertAll = (people: Person[]) => {
		const request = indexedDBRef.open(`${this.name}DB`);
		request.onerror = this.handleIndexedDBOnError;
		request.onsuccess = () => {
			const transaction = request.result.transaction(this.name,'readwrite');
			const store = transaction.objectStore(this.name);
			people.forEach(person=>{
				console.log('inserting',person._id);
				store.add(person);
				console.log('done', person._id)
			})
		}
	}
}

const module = new DBModule('people');

module.upsert(people[0]);

// module.upsertAll(people);







