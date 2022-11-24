import React from 'react';
import ResourceEmptyState from './ResourceEmptyState';
import { NO_RESULT_SEARCH_MESSAGE } from '../../constants';
import NoResultTypography from '../NoResultTypography';

export default function ResourceTableWrapper({ children, resourceType, hasNoData, hasEmptySearchResults, ...rest }) {
  if (hasNoData) {
    return <ResourceEmptyState resourceType={resourceType} {...rest} />;
  }
  if (hasEmptySearchResults) {
    return <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>;
  }

  return (<> {children} </>);
}
