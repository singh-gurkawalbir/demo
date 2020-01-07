import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ImportMapping from './Mappings';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';

export default function MappingWrapper(props) {
  const {
    id,
    flowId,
    extractFields,
    generateFields,
    mappings,
    sectionId,
  } = props;
  const [initTriggered, setInitTriggered] = useState(false);
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
    mappings,
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
    if (!initTriggered) {
      handleInit();
      setInitTriggered(true);
    }
  }, [dispatch, handleInit, id, initTriggered]);

  useEffect(() => {
    setInitTriggered(false);
  }, [dispatch, id, sectionId]);

  useEffect(() => {
    if (initTriggered && mappingInitialized) {
      dispatch(actions.mapping.updateGenerates(id, generateFields));
    }
  }, [dispatch, generateFields, id, initTriggered, mappingInitialized]);

  const optionalHandler = {
    // refreshGenerateFields: requestImportSampleData,
    // refreshExtractFields: requestSampleData,
  };
  const isGenerateRefreshSupported = true;

  return (
    <ImportMapping
      editorId={id}
      extractFields={extractFields}
      generateFields={generateFields}
      resource={resourceData}
      isGenerateRefreshSupported={isGenerateRefreshSupported}
      application={application}
      options={options}
      optionalHanlder={optionalHandler}
    />
  );
}
