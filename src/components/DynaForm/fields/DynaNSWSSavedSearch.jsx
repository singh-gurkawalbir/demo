import React from 'react';
import { useSelector } from 'react-redux';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import { selectors } from '../../../reducers';

export default function DynaNSWSSavedSearch(props) {
  const { value, connectionId } = props;
  const netSuiteSystemDomain = useSelector(state => {
    const connection = selectors.resource(state, 'connections', connectionId);

    return (
      connection &&
      connection.netsuite &&
      connection.netsuite.dataCenterURLs &&
      connection.netsuite.dataCenterURLs.systemDomain
    );
  });

  const savedSearchUrl = value && netSuiteSystemDomain ? `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value}` : null;

  return <DynaRefreshableSelect {...props} urlToOpen={savedSearchUrl} />;
}
