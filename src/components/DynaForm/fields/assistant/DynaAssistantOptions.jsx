import { useSelector, useDispatch } from 'react-redux';
import MaterialUiSelect from '../DynaSelect';
import * as selectors from '../../../../reducers/index';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';

export default function DynaAssistantOptions(props) {
  const { label, resourceContext, options } = props;
  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: options.adaptorType,
      assistant: options.assistant,
    })
  );
  const dispatch = useDispatch();
  const selectOptionsItems =
    options && options[0] && options[0].items ? options[0].items : [];

  if (assistantData && assistantData.export) {
    if (props.assistantFieldType === 'version') {
      assistantData.export.versions.forEach(v => {
        selectOptionsItems.push({ label: v.version, value: v.version });
      });
    }

    if (assistantData.export.versions) {
      let selectedVersion = assistantData.export.versions.find(
        v => v.version === options.version
      );

      if (!selectedVersion && assistantData.export.versions.length === 1) {
        [selectedVersion] = assistantData.export.versions;
      }

      let selectedResource;

      if (selectedVersion) {
        selectedResource = selectedVersion.resources.find(
          r => r.id === options.resource
        );
      }

      if (props.assistantFieldType === 'resource' && selectedVersion) {
        selectedVersion.resources.forEach(r => {
          selectOptionsItems.push({ label: r.name, value: r.id });
        });
      }

      if (props.assistantFieldType === 'operation' && selectedResource) {
        selectedResource.endpoints.forEach(ep => {
          selectOptionsItems.push({ label: ep.name, value: ep.id || ep.url });
        });
      }
    }
  }

  function onFieldChange(id, value) {
    props.onFieldChange(id, value);

    if (
      ['version', 'resource', 'operation', 'exportType'].includes(
        props.assistantFieldType
      )
    ) {
      const fieldDependencyMap = {
        version: ['resource', 'operation', 'exportType'],
        resource: ['operation', 'exportType'],
        operation: ['exportType'],
      };
      const patch = [];

      patch.push({
        op: 'replace',
        path: `/assistantMetadata/${props.assistantFieldType}`,
        value,
      });

      if (fieldDependencyMap[props.assistantFieldType]) {
        fieldDependencyMap[props.assistantFieldType].forEach(prop => {
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
