//const KEY = 'HOPER';

const toPromise = (callback) => {
    const promise = new Promise((resolve, reject) => {
        try {
            callback(resolve, reject);
        }
        catch (err) {
            reject(err);
        }
    });
    return promise;
}


class StorageService {

    static KEY = 'HOPER_INSTANCES';

    static setKey(key) {
        if (key) {
            this.KEY = key;
        }
    }

    static getEntries = () => {
        return toPromise((resolve, reject) => {
            chrome.storage.local.get([this.KEY], (result) => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);

                const _instancesList = result[this.KEY] ?? [];
                resolve(_instancesList);
            });
        });
    }

    static saveEntry = async (_instance) => {
        // debugger;
        const _instances = await this.getEntries();
        //debugger;
        const _toCommit = [..._instances, _instance];

        return toPromise((resolve, reject) => {

            chrome.storage.local.set({ [this.KEY]: _toCommit }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(_toCommit);
            });
        });
    }


    static setEntries = async (_instances) => {
        //debugger;
        const _toCommit = [..._instances];

        return toPromise((resolve, reject) => {

            chrome.storage.local.set({ [this.KEY]: _toCommit }, () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve(_toCommit);
            });
        });
    }

    static clearEntries = () => {
        return toPromise((resolve, reject) => {
            chrome.storage.local.remove([this.KEY], () => {
                if (chrome.runtime.lastError)
                    reject(chrome.runtime.lastError);
                resolve();
            });
        });
    }
}

