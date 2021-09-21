import { isEmpty } from 'lodash';
import { isJsonString } from '../string';

export const restToHttpPagingMethodMap = {
  nextpageurl: 'url',
  pageargument: 'page',
  relativeuri: 'relativeuri',
  linkheader: 'linkheader',
  skipargument: 'skip',
  token: 'token',
  postbody: 'body',
};

export const getContentType = httpPayload => {
  if (!httpPayload || !httpPayload.headers?.['content-type']) {
    return 'json';
  }
  const contentType = httpPayload.headers['content-type'];

  if (contentType.includes('json') || isJsonString(httpPayload.body)) {
    return 'json';
  }
  if (contentType.includes('xml')) {
    return 'xml';
  }
  if (contentType.includes('csv')) {
    return 'csv';
  }

  return 'json';
};

export const getHttpReqResFields = (httpPayload, variant = 'basic') => {
  if (!httpPayload) {
    return {};
  }
  const { headers, body, url, ...otherPayloadDetails} = httpPayload;

  const others = variant === 'previewPanel' ? otherPayloadDetails : { url, ...otherPayloadDetails};

  return { headers, body, others: isEmpty(others) ? undefined : others};
};
