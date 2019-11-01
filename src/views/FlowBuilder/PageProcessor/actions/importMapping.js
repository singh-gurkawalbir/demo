import { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Icon from '../../../../components/icons/MapDataIcon';
import StandaloneImportMapping from '../../../../components/AFE/ImportMapping/StandaloneImportMapping';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import helpTextMap from '../../../../components/Help/helpTextMap';

function ImportMappingDialog({ flowId, resource, onClose }) {
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

function ImportMapping(props) {
  const { open } = props;

  return <Fragment>{open && <ImportMappingDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'importMapping',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.imports.importMapping'],
  Component: ImportMapping,
};
