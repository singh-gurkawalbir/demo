export const FILTER_KEY = 'listenerLogs';

export const DEFAULT_ROWS_PER_PAGE = 2;

export const LISTENER_LOGS_RANGE_FILTERS = [
  {id: 'last15minutes', label: 'Last 15 minutes'},
  {id: 'last24hours', label: 'Last 24 hours'},
  {id: 'last30minutes', label: 'Last 30 minutes'},
  {id: 'today', label: 'Today'},
  {id: 'last1hour', label: 'Last hour'},
  {id: 'yesterday', label: 'Yesterday'},
  {id: 'last4hours', label: 'Last 4 hours'},
  {id: 'custom', label: 'Custom'},
];

export const LISTENER_LOGS_STATUS_CODES = [
  { _id: 'all', name: 'All codes'},
  { _id: '200', name: '200 OK'},
  { _id: '201', name: '201 Created'},
  { _id: '204', name: '204 No Content'},
  { _id: '304', name: '304 Not Modified'},
  { _id: '400', name: '400 Bad Request'},
  { _id: '401', name: '401 Unauthorized'},
  { _id: '403', name: '403 Forbidden'},
  { _id: '404', name: '404 Not Found'},
  { _id: '409', name: '409 Conflict'},
  { _id: '500', name: '500 Internal Server Error'},
  { _id: '1xx', name: '1xx'},
  { _id: '2xx', name: '2xx'},
  { _id: '3xx', name: '3xx'},
  { _id: '4xx', name: '4xx'},
  { _id: '5xx', name: '5xx'},
];

export const getStaticCodesList = codes => {
  if (!codes) return;

  return codes.flatMap(c => {
    switch (c) {
      case '1xx':
        return ['100', '101', '102'];
      case '2xx':
        return ['202', '203', '205', '206', '207', '208', '226'];
      case '3xx':
        return ['300', '301', '302', '303', '305', '306', '307', '308'];
      case '4xx':
        return ['402', '405', '406', '407', '408', '410', '411', '412', '413', '414', '415',
          '416', '417', '418', '420', '422', '423', '424', '425', '426', '428', '429', '431', '444', '449', '450', '451', '499'];
      case '5xx':
        return ['501', '502', '503', '504', '505', '506', '507', '508', '509', '510', '511', '598', '599'];
      default:
        return c;
    }
  });
};

export const getMockRequests = () => [{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-401-POST',
  time: 1615807924879,
  method: 'POST',
  statusCode: '401',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-200-GET',
  time: 1615807924879,
  method: 'GET',
  statusCode: '200',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-201-GET',
  time: 1615807924879,
  method: 'GET',
  statusCode: '201',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-201-PUT',
  time: 1615807924879,
  method: 'PUT',
  statusCode: '201',
},
{
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-200-POST',
  time: 1615807924879,
  method: 'POST',
  statusCode: '200',
},
];

export const getMockLogDetails = logKey => ({
  time: 1615807924879,
  request: {
    headers: {
      host: 'api.localhost.io:5000',
      'user-agent': 'insomnia/2021.1.1',
      'content-type': 'application/json',
      authorization: 'Bearer 5309c90cfdfd44699c0632a97e40867e',
      accept: '*/*',
      'content-length': '8',
    },
    body: logKey,
    httpVersion: '1.1',
    method: 'POST',
    url: '/v1/shopify/exports/60486a72e285921bc32283d4/data',
    clientAddress: '::ffff:127.0.0.1',
    size: 16,
  },
  response: {
    statusCode: 401,
    status: 'there',
    body: 'Unauthorized',
  },
  key: '5642310475121-a27751bdc2e143cb94988b39ea8aede9-401-POST',
  id: 'a27751bdc2e143cb94988b39ea8aede9',
});

export const getMockDeleteResponse = keys => ({
  deleted: keys,
  // errors: [{key: '123', error: 'NoSuchKey'}],
});
