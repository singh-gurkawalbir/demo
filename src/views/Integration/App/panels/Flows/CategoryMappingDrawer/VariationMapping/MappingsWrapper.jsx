import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import Mappings from './Mappings';
import Spinner from '../../../../../../../components/Spinner';

export default function VariationMappings(props) {
  const {
    flowId,
    sectionId,
    depth,
    integrationId,
    isVariationAttributes,
    variation,
  } = props;

  const id = `${flowId}-${sectionId}-${depth}-${isVariationAttributes ? 'variationAttributes' : variation}`;
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
      isVariationAttributes,
      variation,
      isVariationMapping: true,
    }));
  }, [variation, depth, sectionId, dispatch, integrationId, flowId, id, isVariationAttributes]);

  if (mappingStatus === 'error') {
    return (<Typography>Failed to load mapping.</Typography>);
  }
  if (mappingStatus !== 'received') {
    return (
      <Spinner centerAll />
    );
  }

  return (
    <Mappings {...props} editorId={id} />
  );
}
