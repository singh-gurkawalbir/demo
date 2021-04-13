import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';

export default function FileDataChange({editorId, fileType}) {
  const dispatch = useDispatch();
  const {resourceType, resourceId} = useSelector(state => {
    const {resourceType, resourceId} = selectors.editor(state, editorId);

    return {resourceType, resourceId};
  }, shallowEqual);

  const fileData = useSelector(state => selectors.fileSampleData(state, {
    resourceId, resourceType, fileType,
  }));

  useEffect(() => {
    // patch only if filedata is changed and editor state is active
    if (fileData && resourceId) {
      dispatch(actions.editor.patchData(editorId, fileData));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileData]);

  return null;
}
