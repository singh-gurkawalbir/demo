import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DynaRefreshableSelect from './DynaRefreshableSelect';
import * as selectors from '../../../reducers';

export default function DynaNSWSSavedSearch(props) {
  const [savedSearchUrl, setSavedSearchUrl] = useState();
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

  useEffect(() => {
    if (value && netSuiteSystemDomain) {
      setSavedSearchUrl(
        `${netSuiteSystemDomain}/app/common/search/search.nl?id=${value}`
      );
    } else {
      setSavedSearchUrl();
    }
  }, [value, netSuiteSystemDomain]);

  return <DynaRefreshableSelect {...props} urlToOpen={savedSearchUrl} />;
}
