import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import ResourceForm from '../../components/ResourceFormFactory';
import LoadResources from '../LoadResources';
import * as selectors from '../../reducers';
import AddOrSelect from './AddOrSelect';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../constants/resource';
import ModalDialog from '../ModalDialog';

export default function ResourceModal(props) {
  const {
    resourceId,
    onSubmitComplete,
    onClose,
    addOrSelect,
    connectionType,
    resourceType = 'connections',
  } = props;
  const isAuthorized = useSelector(state =>
    selectors.isAuthorized(state, resourceId)
  );

  useEffect(() => {
    if (isAuthorized && !addOrSelect)
      onSubmitComplete(resourceId, isAuthorized);
  }, [isAuthorized, resourceId, onSubmitComplete, addOrSelect]);

  return (
    <LoadResources required resources="connections">
      <ModalDialog show minWidth="md" maxWidth="xl" onClose={onClose}>
        <div> Setup {RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}</div>
        <div>
          {addOrSelect ? (
            <AddOrSelect {...props} />
          ) : (
            <ResourceForm
              editMode={false}
              resourceType={resourceType}
              resourceId={resourceId}
              cancelButtonLabel="Cancel"
              onSubmitComplete={onSubmitComplete}
              connectionType={connectionType}
              onCancel={onClose}
            />
          )}
        </div>
      </ModalDialog>
    </LoadResources>
  );
}
