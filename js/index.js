var reloadDate = new Date().getTime();
var host = window.location.href.replace(/[^\\\/]*$/, '');

var endpoints = {
  info: host + '/data/info.json?date=' + reloadDate,
  users: host + '/data/users.json?date=' + reloadDate,
  worker: host + '/js/worker.js?date=' + reloadDate
}
var tests = {
  testInfo: {
    id: 'fetch',
    url: endpoints['info'],
    type: 'json' // type: json, text or blob
  },
  testDebug: {
    id: 'assert',
    test: ['Fetch', 'fetchInfo', , 'existMethod', 'noexistMethod']
  },
  testUsers: {
    id: 'users',
    url: endpoints['users'],
    type: 'json' // type: json, text or blob
  },
};
var worker = new Worker(endpoints['worker']);
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