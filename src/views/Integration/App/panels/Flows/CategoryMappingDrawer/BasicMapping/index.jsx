import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import Spinner from '../../../../../../../components/Spinner';
import ImportMapping from './Mappings';

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

    return () => {
      // clear the mapping list when component unloads.
      dispatch(actions.integrationApp.settings.categoryMappings.clear(id));
    };
  }, [depth, dispatch, flowId, integrationId, sectionId, id]);

  if (mappingStatus === 'error') {
    return (<Typography>Failed to load mapping.</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner centerAll />
    );
  }

  return (
    <ImportMapping
      {...props}
      editorId={id}
     />
  );
}
