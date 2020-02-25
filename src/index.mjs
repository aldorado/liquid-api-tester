import fetch from 'node-fetch';

class APITester {

  constructor(apis = [], options = { throwErrors: true }) {
    this._apis = apis;
    this._options = options;
  }

  addAPI(api) {
    this._apis.push(api);
    return this;
  }
  
  removeAPI(api) {
    this._apis = this._apis.filter(item => item != api);
    return this;
  }

  async test(pattern) {
    const regexPattern = new RegExp(pattern);
    const apiArray = this._apis.filter(item => item.match(regexPattern));
    const result = [];
    for (let url of apiArray) {
      const testResult = await this.testUrl(url);
      result.push(testResult);
    }
    return result;
  }

  async testUrl(url) {
    let testResult = { url, ok: false };
    try {
      const res = await fetch(url);
      testResult = { url, ok: res.ok };
      if (this._options.throwErrors && !res.ok) {
        throw new Error(`Url:${url} Status: ${res.status}`);
      }
    } catch (err) {
      if (this._options.throwErrors) {
        throw new Error(err);
      }
    }
    return testResult;
  }

}

export default APITester;
