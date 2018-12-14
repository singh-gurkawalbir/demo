import { authParams, logoutParams, getHostAndProtocol } from './apiPaths';

const delay = delay =>
  new Promise(fulfill => {
    setTimeout(fulfill, delay);
  });
const errorMessageTimeOut = {
  message: 'Resource not available ',
  status: 1001,
};
const sessionExpired = {
  message: 'Session Expired',
  status: 401,
};

export function APIException(response) {
  this.status = response.status;
  this.message = 'Error';

  if (process.env.NODE_ENV === `development`) {
    this.message = response.message;
  }
}

function createAppropriatePathAndOptions(path, opts) {
  let options;
  let req;

  if (path === authParams.path || path === logoutParams.path) {
    req = path;
    options = opts;
  } else {
    // all regular api requests go in here
    req = `/api${path}`;
    options = {
      ...opts,
      credentials: 'same-origin', // this is needed to instruct fetch to send cookies

      headers: {
        ...(opts.headers || {
          'Content-Type': 'application/json; charset=utf-8',
        }),
      },
    };
  }

  return { req, options };
}

export async function throwExceptionUsingTheResponse(response) {
  let body;

  if (
    response.headers.get('content-type') === 'application/json; charset=utf-8'
  ) {
    body = await response.json();
  } else body = await response.text();

  throw new APIException({
    status: response.status,
    message: { ...body },
  });
}

function checkToThrowSessionValidationException(response) {
  // when session is invalidated then we
  // expect to get a 200 response with the response url being the sign in page

  if (response.status === 200) {
    const { host, protocol } = getHostAndProtocol();

    if (response.url === `${protocol}//${host}/signin`) {
      throw new APIException({
        ...sessionExpired,
      });
    }
  }
}

async function introduceNetworkLatency() {
  await delay(process.env.ADD_NETWORK_LATENCY || 0);
}

export const api = async (path, opts = {}) => {
  const { options, req } = createAppropriatePathAndOptions(path, opts);

  // all request bodies we stringify
  if (options.body) {
    options.body = JSON.stringify(options.body);
  }

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...
  await introduceNetworkLatency();

  try {
    const response = await fetch(req, options);

    if (response.status >= 400 && response.status < 600) {
      await throwExceptionUsingTheResponse(response);
    }

    checkToThrowSessionValidationException(response);

    // For 204 content-length header does not show up
    // So using response status to prevent performing .json()
    if (response.status === 204) return null;
    const body = await response.json();

    return body;
  } catch (e) {
    if (e instanceof APIException) throw e;
    else throw new APIException({ ...errorMessageTimeOut });
  }
};
