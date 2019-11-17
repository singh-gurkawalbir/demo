import { Fragment } from 'react';
import Icon from '../../../../components/icons/MapDataIcon';
import ResponseMappingDialog from '../../../../components/AFE/ResponseMapping/Dialog';

function ResponseMapping(props) {
  const { open, isViewMode } = props;

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
