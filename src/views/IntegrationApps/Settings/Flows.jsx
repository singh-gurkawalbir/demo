import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../reducers';
import LoadResources from '../../../components/LoadResources';
import CeligoTable from '../../../components/ResourceTable';
import metadata from './metadata';

export default function Flows(props) {
  const { match } = props;
  const { integrationId, section } = match.params;
  const { flows } = useSelector(state =>
    selectors.connectorFlowBySections(state, integrationId, section)
  );

  return (
    <Fragment>
      <LoadResources required resources="flows, connections, exports, imports">
        <CeligoTable resourceType="flows" data={flows} {...metadata} />
      </LoadResources>
    </Fragment>
  );
}
