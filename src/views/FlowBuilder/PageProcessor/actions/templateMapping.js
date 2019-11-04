import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../../../components/icons/MapDataIcon';
import StandaloneImportMapping from '../../../../components/AFE/ImportMapping/StandaloneImportMapping';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';

function TemplateMappingDialog({ flowId, resource, onClose }) {
  const resourceId = resource._id;
  const connectionId = resource._connectionId;
  const dispatch = useDispatch();
  const extractFields = useSelector(state =>
    selectors.getSampleData(state, flowId, resourceId, 'importMappingExtract', {
      isImport: true,
    })
  );

  useEffect(() => {
    if (!extractFields) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          'imports',
          'importMappingExtract'
        )
      );
    }
  }, [dispatch, extractFields, flowId, resourceId]);

  return (
    <Fragment>
      <StandaloneImportMapping
        resourceId={resourceId}
        extractFields={extractFields}
        connectionId={connectionId}
        onClose={onClose}
      />
    </Fragment>
  );
}

function TemplateMapping(props) {
  const { open } = props;

  return <Fragment>{open && <TemplateMappingDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'templateMapping',
  position: 'middle',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: TemplateMapping,
};
