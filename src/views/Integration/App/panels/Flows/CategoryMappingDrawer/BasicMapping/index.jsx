import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ImportMapping from './Mappings';

export default function MappingWrapper(props) {
  const { id, flowId, generateFields, sectionId, integrationId } = props;
  const [initTriggered, setInitTriggered] = useState(false);
  const [resetMappings, setResetMappings] = useState(false);
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
  const { fieldMappings, lookups, deleted = false } =
    useSelector(state =>
      selectors.mappingsForCategory(state, integrationId, flowId, {
        sectionId,
      })
    ) || {};
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
    isCategoryMapping: true,
    lookups,
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
  }, [dispatch, flowId, id, integrationId, mappingOptions]);

  useEffect(() => {
    if (!initTriggered || resetMappings) {
      handleInit();
      setInitTriggered(true);
      setResetMappings(false);
    }
  }, [dispatch, handleInit, id, initTriggered, resetMappings]);

  useEffect(() => {
    setInitTriggered(false);
  }, [dispatch, id]);

  useEffect(() => {
    if (initTriggered) setResetMappings(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

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

  const isGenerateRefreshSupported = true;

  return (
    <ImportMapping
      editorId={id}
      generateFields={generateFields}
      resource={resourceData}
      disabled={deleted}
      integrationId={integrationId}
      flowId={flowId}
      isGenerateRefreshSupported={isGenerateRefreshSupported}
      application={application}
      sectionId={sectionId}
      options={options}
    />
  );
}
