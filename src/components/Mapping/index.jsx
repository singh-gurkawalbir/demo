import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch, Redirect } from 'react-router-dom';
import {selectors} from '../../reducers';
import actions from '../../actions';
import MappingWrapper from './MappingWrapper';

export default function Mapping(props) {
  const {flowId, importId, subRecordMappingId } = props;
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const editorId = `mappings-${importId}`;

  const isMappingPreviewAvailable = useSelector(state => !!selectors.mappingPreviewType(state, importId));

  useEffect(() => {
    /** initiate a mapping init each time user opens mapping. Sample data is loaded */
    dispatch(actions.mapping.init({
      flowId,
      importId,
      subRecordMappingId,
    }));

    if (!isMappingPreviewAvailable) {
      dispatch(actions.editor.init(editorId, 'mappings', {
        flowId,
        resourceId: importId,
        resourceType: 'imports',
        subRecordMappingId,
        stage: 'importMappingExtract',
        data: {},
      }));
    }

    return () => {
      // clear the mapping list when component un-mounts.
      dispatch(actions.mapping.clear());
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    isMappingPreviewAvailable ? <MappingWrapper {...props} />
      : <Redirect to={`${match.url}/editor/${editorId}`} />
  );
}
