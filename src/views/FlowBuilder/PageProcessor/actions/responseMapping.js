import { Fragment } from 'react';
import Icon from '../../../../components/icons/MapDataIcon';
import ResponseMappingDialog from '../../../../components/AFE/ResponseMapping/Dialog';

function ResponseMapping(props) {
  const { open } = props;

  return <Fragment>{open && <ResponseMappingDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'responseMapping',
  position: 'right',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: ResponseMapping,
};
