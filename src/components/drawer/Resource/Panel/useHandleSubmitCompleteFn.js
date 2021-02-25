import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  generatePath,
  useHistory, useLocation,
  useRouteMatch,
} from 'react-router-dom';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { multiStepSaveResourceTypes } from '../../../../utils/resource';
import getRoutePath from '../../../../utils/routePaths';
import useDrawerEditUrl from './useDrawerEditUrl';

export default function useHandleSubmitCompleteFn(resourceType, id, onClose) {
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();
  const { operation } = match.params;
  const isNew = operation === 'add';

  const dispatch = useDispatch();

  const skipFormClose = useSelector(
    state => selectors.resourceFormState(state, resourceType, id).skipClose
  );
  const newResourceId = useSelector(state =>
    selectors.createdResourceId(state, id)
  );
  const resourceId = useSelector(state => {
    const stagedProcessor = selectors.stagedResource(state, id);
    const resourceIdPatch = stagedProcessor?.patch?.find(
      p => p.op === 'replace' && p.path === '/resourceId'
    );

    return resourceIdPatch?.value;
  }
  );
  const isMultiStepSaveResource = multiStepSaveResourceTypes.includes(resourceType);

  const editUrl = useDrawerEditUrl(resourceType, id, location.pathname);

  const handleSubmitComplete = useCallback(() => {
    if (isNew) {
      // The following block of logic is used specifically for pageProcessor
      // and pageGenerator forms. These forms allow a user to choose an
      // existing resource. In this case we dont have any more work to do,
      // we just need to match the temp 'new-xxx' id with the one the user
      // selected.

      if (resourceType === 'integrations') {
        return history.replace(
          getRoutePath(`/${resourceType}/${newResourceId}/flows`)
        );
      }

      if (isMultiStepSaveResource) {
        if (!resourceId) {
          return history.replace(editUrl);
        }
      }
      // this is NOT a case where a user selected an existing resource,
      // so move to step 2 of the form...

      dispatch(actions.resource.created(resourceId, id));
      // Incase of a resource with single step save, when skipFormClose is passed
      // redirect to the updated URL with new resourceId as we do incase of edit - check else part
      if (skipFormClose && !isMultiStepSaveResource) {
        return history.replace(
          generatePath(match.path, {
            id: newResourceId || id,
            resourceType,
            operation,
          })
        );
      }
      // In other cases , close the drawer
      onClose();
    } else {
      // Form should re render with created new Id
      // Below code just replaces url with created Id and form re initializes
      if (skipFormClose) {
        history.replace(
          generatePath(match.path, {
            id: newResourceId || id,
            resourceType,
            operation,
          })
        );

        return;
      }

      onClose();
    }
  }, [dispatch, editUrl, history, id, isMultiStepSaveResource, isNew, match.path, newResourceId, onClose, operation, resourceId, resourceType, skipFormClose]);

  return handleSubmitComplete;
}
