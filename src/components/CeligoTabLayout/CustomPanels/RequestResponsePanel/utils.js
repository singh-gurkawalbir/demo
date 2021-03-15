import { isJsonString } from '../../../../utils/string';

export const getContentType = httpPayload => {
  if (!httpPayload || !httpPayload.headers?.['content-type']) {
    return;
  }
  const contentType = httpPayload.headers?.['content-type'];

  if (contentType.includes('json') || isJsonString(httpPayload.body)) {
    return 'json';
  }
  if (contentType.includes('xml')) {
    return 'xml';
  }
  if (contentType.includes('csv')) {
    return 'csv';
  }
};

export const getHttpReqResFields = (httpPayload, variant = 'basic') => {
  if (!httpPayload) {
    return {};
  }
  const { headers, body: reqResBody, url, ...otherPayloadDetails} = httpPayload;
  let formattedBody = reqResBody;

  if (isJsonString(reqResBody)) {
    formattedBody = JSON.parse(reqResBody);
  }

  const others = variant === 'previewPanel' ? otherPayloadDetails : { url, ...otherPayloadDetails};

  return { headers, body: formattedBody, others};
};
