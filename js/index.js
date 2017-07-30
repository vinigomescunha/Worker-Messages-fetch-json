var reloadDate = new Date().getTime();
var host = window.location.href.replace(/[^\\\/]*$/, '');
var worker = new Worker(host + '/js/worker.js?date=' + reloadDate);
worker.addEventListener('message', function (e) {
  console.log('Worker data: ', e.data);
  switch (e.data.id) {
    case 'fetch':
      crazyTemplate('info', e.data.response.info, 'main');
      break;
    case 'users':
      document.getElementById('sidebar').innerHTML = "<b>" + e.data.response.title + "</b>"
      crazyTemplate('users', e.data.response.listUsers, 'sidebar');
      break;
    default:
      console.warn('No Valid Params!');
  }
}, false);
var tests = {
  testJson: {
    id: 'fetch',
    url: host + '/data/info.json?date=' + reloadDate,
    type: 'json' // type: json, text or blob
  },
  testVars: {
    id: 'assert', // this id call assert console 
    test: ['Fetch', 'fetchInfo', , 'existMethod', 'noexistMethod']
  },
  testJInfo: {
    id: 'users',
    url: host + '/data/users.json?date=' + reloadDate,
    type: 'json' // type: json, text or blob
  },
}

worker.postMessage(tests['testJson']);
worker.postMessage(tests['testVars']);
worker.postMessage(tests['testJInfo']);

var crazyTemplate = function (templateId, data, containerId) {
  var container = document.getElementById(containerId);
  var template = document.getElementById(templateId);
  data.forEach(function (items, index) {
    var fragment = document.createElement('div');
    var str = template.innerHTML;
    for (var i in items) {
      str = str.replace(new RegExp('%' + i + '%', 'gm'), items[i]);
      fragment.innerHTML = str;
    }
    container.appendChild(fragment);
  });
}