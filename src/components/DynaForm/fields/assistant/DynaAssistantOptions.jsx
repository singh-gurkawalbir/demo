import FormContext from 'react-forms-processor/dist/components/FormContext';
import { useEffect, useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FormLabel, FormControl } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import MaterialUiSelect from '../DynaSelect';
import * as selectors from '../../../../reducers/index';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';
import { selectOptions } from './util';
import FieldHelp from '../../FieldHelp';
import ErroredMessageComponent from '../ErroredMessageComponent';

const useStyles = makeStyles(theme => ({
  dynaFieldWrapper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

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
    fields,
    value,
    id,
    onFieldChange: onFieldChangeFn,
    flowId,
  } = props;
  const classes = useStyles();
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
          path: `/assistantMetadata/dontConvert`,
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
    <div>
      <FormControl>
        <div className={classes.fieldWrapper}>
          <FormLabel htmlFor={id}>{label}</FormLabel>
          <FieldHelp {...props} helpText="just added a dummy text into it" />
        </div>
        <MaterialUiSelect
          {...props}
          label={label}
          options={[{ items: selectOptionsItems }]}
          onFieldChange={onFieldChange}
        />
        <ErroredMessageComponent {...props} />
      </FormControl>
    </div>
  );
}

const WrappedContextConsumer = props => (
  <FormContext.Consumer>
    {form => <DynaAssistantOptions {...form} {...props} />}
  </FormContext.Consumer>
);

export default WrappedContextConsumer;
