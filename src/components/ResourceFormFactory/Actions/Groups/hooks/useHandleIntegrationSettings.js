import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import actions from '../../../../../actions';
import { integrationSettingsToDynaFormMetadata } from '../../../../../forms/formFactory/utils';
import { selectors } from '../../../../../reducers';
import useHandleClickWhenValid from './useHandleClickWhenValid';

export default function useHandleIntegrationSettings({
  integrationId,
  childId,
  flowId,
  postProcessValuesFn,
  sectionId,
  formKey,
}) {
  const dispatch = useDispatch();
  const { settings: fields, sections } = useSelector(
    state => selectors.iaFlowSettings(state, integrationId, flowId, childId),
    shallowEqual
  );
  const flowSettingsMemo = useMemo(
    () =>
      integrationSettingsToDynaFormMetadata(
        { fields, sections },
        integrationId,
        true,
        {}
      ),
    [fields, integrationId, sections]
  );
  const formValues = useSelector(state => selectors.formValueTrimmed(state, formKey), shallowEqual);

  const onSave = useCallback(
    () => {
      // Adding flow id to the payload mimicking the save behavior of ampersand
      // TODO:Have to investigate the save behavior...tabs vs all tabs

      let values;

      if (postProcessValuesFn) {
        values = postProcessValuesFn(formValues);
      } else {
        values = formValues;
      }
      if (flowId && flowSettingsMemo?.fieldMap) {
        values = Object.values(flowSettingsMemo?.fieldMap)?.filter(f => f.type === 'xmlMapper').reduce((updatedValues, f) => {
          if (values[f.name] && Array.isArray(values[f.name])) {
            // eslint-disable-next-line no-param-reassign
            updatedValues[f.name] = {
              value: values[f.name],
              path: f.properties?.path,
            };
          }

          return updatedValues;
        }, values);
      }

      const fileField = Object.keys(values).find(key => values[key]?.file && values[key]?.type === 'file');

      if (fileField) {
        const fileContents = values[fileField];

        values['/sampleData'] = fileContents?.file;
        values['/rowDelimiter'] = fileContents?.rowDelimiter || '\n';
        values[fileField] = fileContents?.fileProps;
      }
      const allValuesWithFlowId = { ...values, '/flowId': flowId };

      dispatch(
        actions.integrationApp.settings.update(
          integrationId,
          flowId,
          childId,
          sectionId,
          allValuesWithFlowId
        )
      );
    },
    [childId, dispatch, flowId, flowSettingsMemo?.fieldMap, formValues, integrationId, postProcessValuesFn, sectionId]
  );

  return useHandleClickWhenValid(formKey, onSave);
}

