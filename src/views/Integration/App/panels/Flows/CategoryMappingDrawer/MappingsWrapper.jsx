import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImportMapping from './Mappings';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';

export default function MappingWrapper(props) {
  const {
    id,
    flowId,
    generateFields,
    sectionId,
    integrationId,
    amazonAttributes,
    fieldMappingsFilter,
  } = props;
  const [initTriggered, setInitTriggered] = useState(false);
  const [resetMappings, setResetMappings] = useState(false);
  const resourceId = useSelector(state => {
    const flowDetails = selectors.resource(state, 'flows', flowId);

    if (flowDetails) {
      const firstPP = flowDetails.pageProcessors.find(
        pp => pp.type === 'import'
      );

      return firstPP ? firstPP._importId : null;
    }

    return null;
  });
  const { fieldMappings } =
    useSelector(state =>
      selectors.mappingsForCategory(state, integrationId, flowId, {
        sectionId,
        amazonAttributes,
        fieldMappingsFilter,
      })
    ) || {};
  const resourceData = useSelector(state =>
    selectors.resource(state, 'imports', resourceId)
  );
  const { _connectionId: connectionId, name: resourceName } = resourceData;
  const dispatch = useDispatch();
  const mappingInitialized = useSelector(
    state => !Array.isArray(selectors.mapping(state, id))
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
    mappings: { fields: fieldMappings },
  };
  const handleInit = useCallback(() => {
    dispatch(
      actions.mapping.init({
        id,
        options: mappingOptions,
      })
    );
  }, [dispatch, id, mappingOptions]);

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
  }, [sectionId, amazonAttributes, fieldMappingsFilter, initTriggered]);

  useEffect(() => {
    if (initTriggered && mappingInitialized) {
      dispatch(actions.mapping.updateGenerates(id, generateFields));
    }
  }, [dispatch, generateFields, id, initTriggered, mappingInitialized]);

  const isGenerateRefreshSupported = true;

  return (
    <ImportMapping
      editorId={id}
      generateFields={generateFields}
      resource={resourceData}
      integrationId={integrationId}
      flowId={flowId}
      isGenerateRefreshSupported={isGenerateRefreshSupported}
      application={application}
      options={options}
    />
  );
}
