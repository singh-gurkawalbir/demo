import {
  authParams,
  logoutParams,
  getHostAndProtocol,
  getCSRFParams,
} from '../../apiPaths';
import { getCSRFToken } from '../../../../utils/session';
import { isJsonString } from '../../../../utils/string';

const sessionExpired = {
  message: 'Session expired',
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
      path.includes('/accountInsights') ||
      path.includes('/signup') ||
      path.includes('/netSuiteWS') ||
      path.includes('/netsuiteDA') ||
      /^\/connections.*distributed$/.test(path) ||
      path.includes('/distributed?type=') ||
      path.includes('/mappingPreview') ||
      path.includes('/unlink/google') ||
      path.includes('/accept-invite-metadata') ||
      path.includes('/accept-invite?no_redirect=true') ||
      path.includes('/reSigninWithSSO') ||
      path.includes('/mfa/verify') ||
      path.includes('/request-reset') ||
      path.includes('/reset-password') ||
      path.includes('/set-initial-password') ||
      path.includes('/change-email?no_redirect=true')
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
  throw new APIException({
    status: response.status,
    message: response.data,
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

export function isCsrfExpired(error) {
  if (!error) return false;
  const {status, data} = error;

  if (!isJsonString(data)) {
    return false;
  }
  const parsedData = JSON.parse(data);

  return (
    status === 403 &&
    parsedData.message === 'Bad_Request_CSRF'
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
