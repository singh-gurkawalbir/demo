import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import MaterialUiSelect from '../DynaSelect';
import { selectors } from '../../../../reducers/index';
import actions from '../../../../actions';
import { selectOptions } from './util';
import useFormContext from '../../../Form/FormContext';
import { emptyObject } from '../../../../constants';

export const useSetInitializeFormData = ({
  resourceType,
  resourceId,
  onFieldChange,
  isHTTPFramework,
}) => {
  const dispatch = useDispatch();
  const [componentMounted, setComponentMounted] = useState(false);
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  useEffect(() => {
    // resourceForm init causes the form to remount
    // when there is any initialization data do we perform at this step
    if (!isHTTPFramework && !componentMounted && formState.initData) {
      formState.initData.length &&
        formState.initData.forEach(field => {
          const { id, value } = field;

          onFieldChange(id, value);
        });
      dispatch(actions.resourceForm.clearInitData(resourceType, resourceId));
    }

    setComponentMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    componentMounted,
    dispatch,
    formState.initData,
    resourceId,
    resourceType,
  ]);
};

function setDefaultValuesForDelta(paramName, paramsMeta, params, result) {
  const anyParamValuesSet = paramsMeta?.fields?.some(field => !field.readOnly && Object.prototype.hasOwnProperty.call(params, field.id) && params[field.id] !== field.defaultValue);

  if (!anyParamValuesSet) {
    result.push({id: `assistantMetadata.${paramName}`, value: {...params, ...paramsMeta?.defaultValuesForDeltaExport}});
  }
}

function deleteDeltaValues(paramName, params, result) {
  const newParams = {};

  Object.keys(params || emptyObject).forEach(param => {
    // When export type is changed to all, delete body params with delta attributes in them
    if (!params[param]?.includes?.('lastExportDateTime')) {
      newParams[param] = params[param];
    }
  });

  result.push({id: `assistantMetadata.${paramName}`, value: newParams});
}

function DynaAssistantOptions(props) {
  const {
    label,
    resourceContext,
    options,
    resourceType,
    resourceId,
    assistantFieldType,
    fields: fieldsById,
    value,
    id,
    onFieldChange: onFieldChangeFn,
    flowId,
  } = props;
  const fields = Object.values(fieldsById);
  const formContext = useMemo(
    () =>
      [
        'assistant',
        'adaptorType',
        'version',
        'resource',
        'operation',
        'exportType',
      ].reduce(
        (values, fId) => ({
          ...values,
          [fId]: (
            fields.find(field => field.id === `assistantMetadata.${fId}`) || {}
          ).value,
        }),
        {}
      ),
    [fields]
  );
  const {
    value: queryParams,
    paramMeta: queryParamsMeta,
  } = useSelector(state => selectors.fieldState(state, props.formKey, 'assistantMetadata.queryParams'), shallowEqual) || emptyObject;
  const {
    value: bodyParams,
    paramMeta: bodyParamsMeta,
  } = useSelector(state => selectors.fieldState(state, props.formKey, 'assistantMetadata.bodyParams'), shallowEqual) || emptyObject;

  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: formContext.adaptorType,
      assistant: formContext.assistant,
    })
  );
  const dispatch = useDispatch();
  const selectOptionsItems = useMemo(() => {
    if (['version', 'resource', 'operation'].includes(assistantFieldType)) {
      return selectOptions({
        assistantFieldType,
        assistantData,
        formContext,
        resourceType: resourceContext.resourceType,
      });
    }

    return options && options[0] && options[0].items ? options[0].items : [];
  }, [
    assistantData,
    assistantFieldType,
    formContext,
    options,
    resourceContext.resourceType,
  ]);

  useSetInitializeFormData(props);

  useEffect(() => {
    if (
      selectOptionsItems &&
      !selectOptionsItems.find(option => option.value === value)
    ) {
      onFieldChangeFn(id, '', true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, value]);
  function onFieldChange(id, value) {
    onFieldChangeFn(id, value);

    if (
      ['version', 'resource', 'operation', 'exportType'].includes(
        assistantFieldType
      )
    ) {
      const fieldDependencyMap = {
        exports: {
          version: ['resource', 'operation', 'exportType'],
          resource: ['operation', 'exportType'],
          operation: ['exportType'],
        },
        imports: {
          version: ['resource', 'operation'],
          resource: ['operation'],
        },
      };
      const patch = [];

      patch.push({
        op: 'replace',
        path: `/assistantMetadata/${assistantFieldType}`,
        value,
      });

      if (
        fieldDependencyMap[resourceContext.resourceType][assistantFieldType]
      ) {
        fieldDependencyMap[resourceContext.resourceType][
          assistantFieldType
        ].forEach(prop => {
          patch.push({
            op: 'replace',
            path: `/assistantMetadata/${prop}`,
            value: '',
          });
        });
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/dontConvert',
          value: true,
        });
      }

      if (assistantFieldType === 'operation') {
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/operationChanged',
          value: true,
        });
      }

      dispatch(
        actions.resource.patchStaged(
          resourceContext.resourceId,
          patch,
        )
      );

      // this is the to maintain not only the touched state of the form but also transient field state values
      // for example if you change the name of a export we want the value to be carried forward after reinitializing
      // but we certainly don't want to persist it
      const allTouchedFields = fields
        .filter(field => !!field.touched)
        .filter(field => {
          // non assistant metadata touched values allow them
          if (!field.id.includes('assistantMetadata.')) {
            return true;
          }

          // only include the assistantoptions fields in the init data they are the ones which trigger form initialization
          // these are the fields that need to be indicated as touched and the remaining metadata field values are set by the patch stage operation
          return field.type === 'assistantoptions';
        })
        .map(field => ({ id: field.id, value: field.value }));

      allTouchedFields.push({ id, value });

      if (id === 'assistantMetadata.exportType') {
        if (value === 'delta') {
          setDefaultValuesForDelta('queryParams', queryParamsMeta, queryParams, allTouchedFields);
          setDefaultValuesForDelta('bodyParams', bodyParamsMeta, bodyParams, allTouchedFields);
        } else {
          deleteDeltaValues('queryParams', queryParams, allTouchedFields);
          deleteDeltaValues('bodyParams', bodyParams, allTouchedFields);
        }
      }
      dispatch(
        actions.resourceForm.init(
          resourceType,
          resourceId,
          false,
          false,
          flowId,
          allTouchedFields
        )
      );
    }
  }

  return (
    <MaterialUiSelect
      {...props}
      label={label}
      options={[{ items: selectOptionsItems }]}
      onFieldChange={onFieldChange}
    />
  );
}
// no user info mostly metadata releated values...can be loggable
export default function WrappedContextConsumer(props) {
  const form = useFormContext(props.formKey);

  if (!form) return null;

  return <DynaAssistantOptions {...form} {...props} />;
}

