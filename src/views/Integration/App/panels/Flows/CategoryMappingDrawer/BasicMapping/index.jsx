import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@mui/material';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ImportMapping from './Mappings';
import { message } from '../../../../../../../utils/messageStore';

export default function MappingWrapper(props) {
  const {
    flowId,
    sectionId,
    id,
    depth,
    integrationId,
  } = props;

  const dispatch = useDispatch();
  const mappingStatus = useSelector(state => selectors.categoryMappingById(state, integrationId, flowId, id)?.status);

  useEffect(() => {
    /** initiate a mapping init each time user opens mapping. Sample data is loaded */
    dispatch(actions.integrationApp.settings.categoryMappings.init({
      integrationId,
      flowId,
      sectionId,
      id,
      depth,
    }));
  }, [depth, dispatch, flowId, id, integrationId, sectionId]);

  if (mappingStatus === 'error') {
    return (<Typography>{message.MAPPER2.FAILED_TO_LOAD_MAPPING}</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <ImportMapping
      {...props}
      editorId={id}
     />
  );
}
