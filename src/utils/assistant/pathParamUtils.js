import { escapeRegExp } from 'lodash';

const getRelativeURLWithPrefixAndSuffix = (
  pathInfo,
  relativeURL,
  actualPath
) => {
  let newRelativeURL = relativeURL;
  const idTokenInRelativeURL = ':_';

  pathInfo.forEach(item => {
    if (item?.config?.prefix || item?.config?.suffix) {
      if (!actualPath.includes(item?.config?.prefix)) {
        newRelativeURL = newRelativeURL.replaceAll(
          `${idTokenInRelativeURL}${item?.id}`,
          ''
        );
      }

      if (item?.config?.suffix) {
        newRelativeURL = newRelativeURL.replaceAll(
          `${idTokenInRelativeURL}${item?.id}`,
          `${item?.config?.prefix}${idTokenInRelativeURL}${item?.id}${item?.config?.suffix}`
        );
      } else {
        newRelativeURL = newRelativeURL.replaceAll(
          `${idTokenInRelativeURL}${item?.id}`,
          `${item?.config?.prefix}${idTokenInRelativeURL}${item?.id}`
        );
      }
    }
  });

  return newRelativeURL;
};

function mapParamsToValues(relativeTokens, actualTokens, pathParametersInfo) {
  const mappedParamsToValues = {};
  const extractParamValueRegex = /:_\w+/g;
  const idTokenInRelativeURL = ':_';

  for (let i = 0; i < relativeTokens?.length; i += 1) {
    const relToken = relativeTokens[i];
    const actualToken = actualTokens[i];
    let actualValue = actualToken;

    if (relToken !== actualToken) {
      const itemId = extractParamValueRegex
        .exec(relToken)?.[0]
        ?.replaceAll(idTokenInRelativeURL, '');
      const item = pathParametersInfo.find(param => param?.id === itemId);

      if (relToken?.includes(item?.config?.prefix)) {
        actualValue = actualToken.substring(actualToken.indexOf(item?.config?.prefix) + item?.config?.prefix?.length, actualToken.indexOf(item?.config?.suffix));
      } else if (relToken?.includes('.')) {
        const suffixTokens = new RegExp(`:_${itemId}(.*)`).exec(relToken);
        const suffix = suffixTokens?.[suffixTokens?.length - 1];

        const pathParamRegex = new RegExp(`(.*)${suffix}`);
        const valueTokens = pathParamRegex.exec(actualToken);

        if (valueTokens?.length) {
          actualValue = valueTokens[valueTokens?.length - 1];
        }
      }

      const id = relToken
        .match(extractParamValueRegex)?.[0]
        ?.replaceAll(idTokenInRelativeURL, '');

      mappedParamsToValues[id] = actualValue;
    }
  }

  return mappedParamsToValues;
}

const getPathTokens = (path = '') => path?.split('/').filter(param => param);
export function getPathParams({
  relativePath = '',
  actualPath = '',
  pathParametersInfo = [],
}) {
  if (!relativePath.trim() || !actualPath.trim() || !pathParametersInfo?.length) { return {}; }

  // Remove Query Params from the actual Path
  // Construct the relative URL to match actual URL with prefix and suffix
  // pathParametersInfo should have required and optional parameters with appropriate prefix and suffix
  // relativePath ex: "/applicants:_name:_city:_fromapplydate/:_bar/page/:_page/Delivery:_deliveryId";
  // relativePathWithPrefixAndSuffix ex: "/applicants/name/:_name/from_apply_date/:_fromapplydate/:_bar/page/:_page/Delivery(:_deliveryId)"
  const actualPathWithoutQueryParams = actualPath?.split('?')?.[0];
  const relativePathWithPrefixAndSuffix = getRelativeURLWithPrefixAndSuffix(
    pathParametersInfo,
    relativePath,
    actualPathWithoutQueryParams
  );

  // construct a new Regex replacing all pathParameter ids with regex placeholder which matches anything and captures it "(.*)"
  const pathParamRegex = new RegExp(pathParametersInfo.reduce((acc, cur) =>
    acc.replace(`:_${cur.id}`, '(.*)'), escapeRegExp(relativePathWithPrefixAndSuffix)));

  if (pathParamRegex.test(actualPathWithoutQueryParams)) {
    const [, ...values] = pathParamRegex.exec(actualPathWithoutQueryParams);

    return values.reduce((acc, cur, index) => {
      acc[pathParametersInfo[index].id] = cur;

      return acc;
    }, {});
  }

  // Get tokens by splitting both relative and actual path
  // ex: actualPath = "/applicants/name/John/from_apply_date/today/buu/page/20/Delivery(34)"
  // ex: relativePath = "/applicants/name/:_name/from_apply_date/:_fromapplydate/:_bar/page/:_page/Delivery(:_deliveryId)""
  const relativePathTokens = getPathTokens(relativePathWithPrefixAndSuffix);
  const actualPathTokens = getPathTokens(actualPathWithoutQueryParams);

  // Diff between actual and relative tokens, return mapped params to the values
  // ex: relativePathTokens = ['applicants', 'name', ':_name','from_apply_date'.....]
  // ex:   actualPathTokens = ['applicants', 'name', 'John', 'from_apply_date'.....]
  // return object to be {name: 'John', fromapplydate: 'today', bar: 'buu'...}
  return mapParamsToValues(
    relativePathTokens,
    actualPathTokens,
    pathParametersInfo
  );
}
