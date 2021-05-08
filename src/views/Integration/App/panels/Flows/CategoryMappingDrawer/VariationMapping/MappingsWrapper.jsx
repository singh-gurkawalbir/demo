import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import Mappings from './Mappings';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';

const emptySet = [];
const useStyles = makeStyles(() => ({
  fullWidth: {
    width: '100%',
  },
}));

export default function VariationMappings(props) {
  const classes = useStyles();
  const {
    flowId,
    sectionId,
    integrationId,
    variation,
    categoryId,
    depth,
    isVariationAttributes,
  } = props;
  const id = `${flowId}-${sectionId}-${
    isVariationAttributes ? 'variationAttributes' : variation
  }`;
  const [initTriggered, setInitTriggered] = useState(false);
  const [resetMappings, setResetMappings] = useState(false);
  const { fields: generateFields } =
    useSelector(state => {
      const generatesMetadata = selectors.categoryMappingGenerateFields(
        state,
        integrationId,
        flowId,
        {
          sectionId,
          depth,
        }
      );

      if (isVariationAttributes) {
        const { variation_attributes: variationAttributes } = generatesMetadata;

        return { fields: variationAttributes };
      }

      return generatesMetadata;
    }) || {};
  const resourceId = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    if (flow) {
      const firstPP = flow.pageProcessors.find(
        pp => pp.type === 'import'
      );

      return firstPP ? firstPP._importId : null;
    }

    return null;
  });
  const memoizedOptions = useMemo(() => ({
    sectionId,
    variation,
    isVariationAttributes,
    depth,
  }), [sectionId, variation, isVariationAttributes, depth]);
  const { fieldMappings } = useSelectorMemo(selectors.mkMappingsForVariation, integrationId, flowId, memoizedOptions) || {};
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const { _connectionId: connectionId, name: resourceName } = resourceData;
  const dispatch = useDispatch();
  const mappingInitialized = useSelector(
    state =>
      !Array.isArray(
        selectors.categoryMappingsForSection(state, integrationId, flowId, id)
      )
  );
  const application = 'netsuite';
  const options = {
    flowId,
    connectionId,
    resourceId,
    resourceName,
  };
  const mappingOptions = {
    resourceData,
    adaptorType: 'netsuite',
    application,
    isVariationMapping: true,
    categoryId,
    childCategoryId: sectionId,
    variation,
    isVariationAttributes,
    mappings: { fields: fieldMappings },
  };
  const handleInit = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.init(
        integrationId,
        flowId,
        id,
        mappingOptions
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id, mappingOptions]);

  useEffect(() => {
    if (!initTriggered || resetMappings) {
      handleInit();
      setInitTriggered(true);
      setResetMappings(false);
    }
  }, [dispatch, handleInit, initTriggered, resetMappings]);

  useEffect(() => {
    setInitTriggered(false);
  }, [dispatch]);

  useEffect(() => {
    if (initTriggered) setResetMappings(true);
  }, [sectionId, variation, initTriggered]);

  useEffect(() => {
    if (initTriggered && mappingInitialized) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.updateGenerates(
          integrationId,
          flowId,
          id,
          generateFields
        )
      );
    }
  }, [
    dispatch,
    flowId,
    generateFields,
    id,
    initTriggered,
    integrationId,
    mappingInitialized,
  ]);

  return (
    <div className={classes.fullWidth}>
      <Mappings
        editorId={id}
        generateFields={generateFields || emptySet}
        resource={resourceData}
        integrationId={integrationId}
        flowId={flowId}
        isGenerateRefreshSupported
        depth={depth}
        application={application}
        options={options}
      />
    </div>
  );
}
