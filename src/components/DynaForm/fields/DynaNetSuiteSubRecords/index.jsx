import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch, Link } from 'react-router-dom';
import * as selectors from '../../../../reducers';
import SubRecordDrawer from './SubRecordDrawer';

export default function DynaNetSuiteSubRecords(props) {
  const { resourceId } = props.resourceContext;
  const { merged: importDoc = {} } = useSelector(state =>
    selectors.resourceData(state, 'imports', resourceId)
  );
  const match = useRouteMatch();

  return (
    <Fragment>
      <SubRecordDrawer importId={resourceId} />
      Subrecord imports{' '}
      <Link to={`${match.url}/subrecords/xyz`}>Add subrecord</Link>
      <br />
      <br />
      DynaNetSuiteSubRecords ${JSON.stringify(props)}
      <br />
      <br />
      <br />${JSON.stringify(importDoc.netsuite_da)}
    </Fragment>
  );
}
