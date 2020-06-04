import {
  authParams,
  logoutParams,
  getHostAndProtocol,
  getCSRFParams,
} from './apiPaths';
import { getCSRFToken } from '../../utils/session';

const delay = delay =>
  new Promise(fulfill => {
    setTimeout(fulfill, delay);
  });
const sessionExpired = {
  message: 'Session Expired',
  status: 401,
};

export function APIException(response) {
  this.status = response.status;
  this.message = response.message || 'Error';

  if (process.env.NODE_ENV === 'development') {
    this.message = response.message;
  }
}

export function normalizeUrlAndOptions(path, opts) {
  let options;
  let url;

  if (
    path === authParams.path ||
    path === logoutParams.path ||
    path === getCSRFParams.path
  ) {
    url = path;
    options = opts;
  } else {
    if (
      path.includes('/netSuiteWS') ||
      path.includes('/netsuiteDA') ||
      /^\/connections.*distributed$/.test(path) ||
      path.includes('/mappingPreview') ||
      path.includes('/unlink/google')
    ) {
      url = path;
    } else {
      // all regular api requests go in here
      url = `/api${path}`;
    }

    options = {
      ...opts,
      credentials: 'same-origin', // this is needed to instruct fetch to send cookies

      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'x-csrf-token': getCSRFToken(),
        ...opts.headers,
      },
    };
  }

  return { url, options };
}

export function throwExceptionUsingTheResponse(response) {
  let body;

  if (
    response.headers.get('content-type') === 'application/json; charset=utf-8'
  ) {
    body = JSON.stringify(response.data);
  } else body = response.data;
  throw new APIException({
    status: response.status,
    message: body,
  });
}

export function checkToThrowSessionValidationException(response) {
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

export async function introduceNetworkLatency() {
  await delay(process.env.ADD_NETWORK_LATENCY || 0);
}

export function isCsrfExpired(error) {
  return (
    error.status === 403 &&
    error.data &&
    error.data.message === 'Bad_Request_CSRF'
  );
}

// we are skipping 401 checks for /change-email and /change-password
/*
export function isUnauthorized({ error, path }) {
  return (
    error.status === 401 &&
    !['/change-email', '/change-password'].includes(path)
  );
}
*/
