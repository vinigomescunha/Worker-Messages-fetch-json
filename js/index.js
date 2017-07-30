var reloadDate = new Date().getTime();
var host = window.location.href.replace(/[^\\\/]*$/, '');

var endpoints = {
  info: host + 'data/info.json?date=' + reloadDate,
  users: host + 'data/users.json?date=' + reloadDate,
  worker: host + 'js/worker.js?date=' + reloadDate
};

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
    document.getElementById('main').innerHTML = '';
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

for (var test in tests) {
  worker.postMessage(tests[test]);
}

var crazyTemplate = function (templateId, data, containerId) {
  var filterTags = function (templateHTML) {
    var specialTags = ['src'];
    specialTags.forEach(
      function (tag) {
        templateHTML = templateHTML.replace(new RegExp('%' + tag + '%', 'gm'), tag);
      }
    );
    return templateHTML;
  }
  var templateHTML = document.getElementById(templateId).innerHTML;
  var container = document.getElementById(containerId);
  data.forEach(function (items, index) {
    var fragment = document.createElement('div');
    var str = templateHTML;
    for (var i in items) {
      str = str.replace(new RegExp('%' + i + '%', 'gm'), items[i]);
      fragment.innerHTML = str;
    }
    fragment.innerHTML = filterTags(fragment.innerHTML);
    container.appendChild(fragment);
  });
};