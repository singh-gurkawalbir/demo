import { useSelector, useDispatch } from 'react-redux';
import MaterialUiSelect from '../DynaSelect';
import * as selectors from '../../../../reducers/index';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';
import { selectOptions } from './util';

export default function DynaAssistantOptions(props) {
  const { label, resourceContext, options, assistantFieldType } = props;
  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: options.adaptorType,
      assistant: options.assistant,
    })
  );
  const dispatch = useDispatch();
  let selectOptionsItems =
    options && options[0] && options[0].items ? options[0].items : [];

  if (['version', 'resource', 'operation'].includes(assistantFieldType)) {
    selectOptionsItems = selectOptions({
      assistantFieldType,
      assistantData,
      options,
      resourceType: resourceContext.resourceType,
    });
  }

  function onFieldChange(id, value) {
    props.onFieldChange(id, value);

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
      }

      dispatch(
        actions.resource.patchStaged(
          resourceContext.resourceId,
          patch,
          SCOPES.VALUE
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
