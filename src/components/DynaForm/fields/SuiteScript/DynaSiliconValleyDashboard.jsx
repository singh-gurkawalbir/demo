import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as selectors from '../../../../reducers';

const URL = '/app/site/hosting/scriptlet.nl?script=customscript_celigo_svb_dashboard&deploy=customdeploy_celigo_svb_dashboard';
export default function DynaSiliconValleyDashboard(props) {
  const {ssLinkedConnectionId} = props;
  const connection = useSelector(state => selectors.resource(state, 'connections', ssLinkedConnectionId)
  );

  const systemDomainUrl = connection?.netsuite?.dataCenterURLs?.systemDomain;

  if (!systemDomainUrl) { return null; }

  return (
    <Link href={systemDomainUrl + URL} target="_blank">
      Go to Silicon Valley Bank Dashboard
    </Link>
  );
}
