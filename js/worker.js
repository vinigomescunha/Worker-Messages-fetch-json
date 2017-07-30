class Fetch {
  constructor() {
    this.opts = {
      method: 'GET',
      headers: new Headers(),
      mode: 'cors',
      cache: 'default'
    };
  }
  get(url) {
    return fetch(url, this.opts);
  }
};

var fetchInfo = function (event) {
  var ev = event;
  var f = new Fetch();
  u = ev.data.url;
  console.log('event', event.target.origin)
  f.get(u)
    .then(function (response) {
      if (response.ok) {
        response[ev.data.type]().then(function (dataResponse) {
          // send message back
          ev.target.postMessage({
            id: ev.data.id, // an id created
            response: dataResponse
          });
          Promise.resolve(true);
        });
      } else {
        Promise.reject('NETWORK ERROR!');
      }
    })
    .catch(function (error) {
      Promise.reject(error);
    });
};

var debugAssert = function (data) {
  console.time('Execution time:');
  var assertList = [];
  var test = eval(data.test);
  for (var j in test) {
    var t = null;
    try {
      // to know if is object or function, variable...
      t = (self[test[j]]) ? self[test[j]] : eval(test[j]);
    } catch (e) {
      // dont need
    }
    assertList.push({
      method: test[j],
      isNull: (t === null)
    });
    console.assert(t !== null, 'Error: ' + test[j] + ' is null!');
  }
  console.table(assertList);
  console.timeEnd('Execution time:');
};

var existMethod = function () {
  /** only to test assert */
};

self.addEventListener('message', function (event) {
  console.info("Client params: ", event.data);
  switch (event.data.id) {
    case 'fetch':
      fetchInfo(event);
      break;
    case 'users':
      fetchInfo(event);
      break;
    case 'assert':
      debugAssert(event.data);
      break;
    default:
      console.error('No Valid Params!');
  }
});