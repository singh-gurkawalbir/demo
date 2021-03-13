import { isJsonString } from '../../../../utils/string';

export const getContentType = payload => {
  const applicationType = payload.headers?.['content-type'];

  if (!applicationType) {
    return;
  }

  if (applicationType.includes('json') || isJsonString(payload.body)) {
    return 'json';
  }
  if (applicationType.includes('xml')) {
    return 'xml';
  }
};

export const getHttpReqResFields = (payload, variant = 'basic') => {
  const { headers, body: reqResBody, url, ...otherPayloadDetails} = payload || {};
  let formattedBody = reqResBody;

  if (isJsonString(reqResBody)) {
    formattedBody = JSON.parse(reqResBody);
  }

  const others = variant === 'previewPanel' ? otherPayloadDetails : { url, ...otherPayloadDetails};

  return { headers, body: formattedBody, others};
};
