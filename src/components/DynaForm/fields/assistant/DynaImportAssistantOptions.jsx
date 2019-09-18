import { useSelector, useDispatch } from 'react-redux';
import { isArray } from 'lodash';
import MaterialUiSelect from '../DynaSelect';
import * as selectors from '../../../../reducers/index';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';

export default function DynaImportAssistantOptions(props) {
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

  if (assistantData && assistantData.import) {
    if (props.assistantFieldType === 'version') {
      assistantData.import.versions.forEach(v => {
        selectOptionsItems.push({ label: v.version, value: v.version });
      });
    }

    if (assistantData.import.versions) {
      let selectedVersion = assistantData.import.versions.find(
        v => v.version === options.version
      );

      if (!selectedVersion && assistantData.import.versions.length === 1) {
        [selectedVersion] = assistantData.import.versions;
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
        selectedResource.operations.forEach(ep => {
          if (ep.id) {
            selectOptionsItems.push({ label: ep.name, value: ep.id });
          } else if (isArray(ep.url)) {
            selectOptionsItems.push({
              label: ep.name,
              value: [ep.method.join(':'), ep.url.join(':')].join(':'),
            });
          } else {
            selectOptionsItems.push({
              label: ep.name,
              value: [ep.method, ep.url].join(':'),
            });
          }
        });
      }
    }
  }

  function onFieldChange(id, value) {
    props.onFieldChange(id, value);

    if (
      ['version', 'resource', 'operation', 'lookupType'].includes(
        props.assistantFieldType
      )
    ) {
      const fieldDependencyMap = {
        version: ['resource', 'operation'],
        resource: ['operation'],
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
