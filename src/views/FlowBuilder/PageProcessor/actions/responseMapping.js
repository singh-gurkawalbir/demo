import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import Icon from '../../../../components/icons/MapDataIcon';
import ResponseMappingDialog from '../../../../components/AFE/ResponseMapping/Dialog';
import { isConnector } from '../../../../utils/flows';
import { resourceData } from '../../../../reducers';

function ResponseMapping(props) {
  const { open, isViewMode, flowId } = props;
  const flow = useSelector(
    state => resourceData(state, 'flows', flowId).merged
  );
  const isConnectorFlow = isConnector(flow);
  // Incase of connectors , responseMapping should be enabled for the users
  // In all other cases it is disabled based on isViewMode prop sent by Flow Builder
  const disabled = isConnectorFlow ? false : isViewMode;

  return (
    <Fragment>
      {open && <ResponseMappingDialog disabled={disabled} {...props} />}
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
