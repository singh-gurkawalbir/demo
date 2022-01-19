import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import {selectors} from '../../reducers';
import actions from '../../actions';
import MappingWrapper from './MappingWrapper';
import Spinner from '../Spinner';

export default function Mapping(props) {
  const {flowId, importId, subRecordMappingId } = props;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `mappings-${importId}`;
  const mappingStatus = useSelector(state => selectors.mapping(state).status);
  const isEditorActive = useSelector(state => selectors.editor(state, editorId).editorType);
  const isMappingPreviewAvailable = useSelector(state => !!selectors.mappingPreviewType(state, importId));

  useEffect(() => {
    /** initiate a mapping init each time user opens mapping. Sample data is loaded */
    dispatch(actions.mapping.init({
      flowId,
      importId,
      subRecordMappingId,
    }));

    return () => {
      // clear the mapping list when component un-mounts.
      dispatch(actions.mapping.clear());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // initialize editor only when mapping init is complete
    if (!isEditorActive && !isMappingPreviewAvailable && (mappingStatus && mappingStatus !== 'requested')) {
      dispatch(actions.editor.init(editorId, 'mappings', {
        flowId,
        resourceId: importId,
        resourceType: 'imports',
        subRecordMappingId,
        stage: 'importMappingExtract',
        data: {}, // adding dummy data here. Actual data gets loaded once the mapping init is complete
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMappingPreviewAvailable, mappingStatus]);

  // let the mapping init and sample data load happen so that the state is updated
  if (!mappingStatus || mappingStatus === 'requested') {
    return <Spinner centerAll />;
  }

  return (
    isMappingPreviewAvailable ? <MappingWrapper {...props} />
      : <Redirect to={`${match.url}/editor/${editorId}`} />
  );
}
