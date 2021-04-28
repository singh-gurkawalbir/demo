import React, { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import MaterialUiSelect from '../DynaSelect';
import { selectors } from '../../../../reducers/index';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';
import { selectOptions } from './util';
import useFormContext from '../../../Form/FormContext';
import { emptyObject } from '../../../../utils/constants';

export const useSetInitializeFormData = ({
  resourceType,
  resourceId,
  onFieldChange,
}) => {
  const dispatch = useDispatch();
  const [componentMounted, setComponentMounted] = useState(false);
  const formState = useSelector(state =>
    selectors.resourceFormState(state, resourceType, resourceId)
  );

  useEffect(() => {
    // resouceForm init causes the form to remount
    // when there is any initialization data do we perform at this step
    if (!componentMounted && formState.initData) {
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

  // I have to adjust value when there is no option with the matching value
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

      dispatch(
        actions.resource.patchStaged(
          resourceContext.resourceId,
          patch,
          SCOPES.VALUE
        )
      );

      const allTouchedFields = fields
        .filter(field => !!field.touched)
        .map(field => ({ id: field.id, value: field.value }));

      allTouchedFields.push({ id, value });

      if (id === 'assistantMetadata.exportType') {
        const newParams = {};

        if (value === 'all') {
          Object.keys(queryParams || emptyObject).forEach(param => {
            // When export type is changed to all, delete query params with delta attributes in them
            if (!queryParams[param]?.includes?.('lastExportDateTime')) {
              newParams[param] = queryParams[param];
            }
          });

          allTouchedFields.push({id: 'assistantMetadata.queryParams', value: newParams});
        } else if (value === 'delta') {
          let anyParamValuesSet = false;

          queryParamsMeta?.fields?.forEach(field => {
            if (!field.readOnly && Object.prototype.hasOwnProperty.call(queryParams, field.id) && queryParams[field.id] !== field.defaultValue) {
              anyParamValuesSet = true;
            }
          });
          if (!anyParamValuesSet) {
            allTouchedFields.push({id: 'assistantMetadata.queryParams', value: {...queryParams, ...queryParamsMeta?.defaultValuesForDeltaExport}});
          }
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

export default function WrappedContextConsumer(props) {
  const form = useFormContext(props.formKey);

  if (!form) return null;

  return <DynaAssistantOptions {...form} {...props} />;
}

