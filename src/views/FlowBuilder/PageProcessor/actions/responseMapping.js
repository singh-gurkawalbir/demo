import { Fragment } from 'react';
import Icon from '../../../../components/icons/MapDataIcon';
import ResponseMappingDialog from '../../../../components/AFE/ResponseMapping/Dialog';
import { isIntegrationApp } from '../../../../utils/flows';
import * as selectors from '../../../../reducers';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

function ResponseMapping(props) {
  const { open, isViewMode, flowId } = props;
  const flow = useSelectorMemo(
    selectors.makeResourceDataSelector,
    'flows',
    flowId
  ).merged;
  const isIAFlow = isIntegrationApp(flow);
  // Incase of connectors , responseMapping should be enabled for the users
  // In all other cases it is disabled based on isViewMode prop sent by Flow Builder
  const disabled = isIAFlow ? false : isViewMode;

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
