import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import Icon from '../../../../components/icons/MapDataIcon';
import ResponseMappingDialog from '../../../../components/AFE/ResponseMapping/Dialog';

function ResponseMapping(props) {
  const { open, integrationId } = props;
  const isViewMode = useSelector(state =>
    selectors.isFormAMonitorLevelAccess(state, integrationId)
  );

  return (
    <Fragment>
      {open && <ResponseMappingDialog disabled={isViewMode} {...props} />}
    </Fragment>
  );
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseMapping',
  position: 'right',
  Icon,
  Component: ResponseMapping,
};
