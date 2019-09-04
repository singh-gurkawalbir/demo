import { useSelector, useDispatch } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import MaterialUiSelect from './DynaSelect';
import * as selectors from '../../../reducers/index';
import actions from '../../../actions';
import { SCOPES } from '../../../sagas/resourceForm';

const styles = () => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

function DynaAssistantOptions(props) {
  const { label, __resourceId, options } = props;

  console.log(`DynaAssistantOptions props ${JSON.stringify(props)}`);
  const assistantData = useSelector(state =>
    selectors.assistantData(state, {
      adaptorType: 'rest',
      assistant: options.assistant,
    })
  );
  const dispatch = useDispatch();
  const items = [];

  if (assistantData && assistantData.export) {
    if (props.assistantFieldType === 'version') {
      assistantData.export.versions.forEach(v => {
        items.push({ label: v.version, value: v.version });
      });
    }

    if (assistantData.export.versions) {
      let selectedVersion = assistantData.export.versions.find(
        v => v.version === options.version
      );

      if (!selectedVersion && assistantData.export.versions.length === 1) {
        [selectedVersion] = assistantData.export.versions;
      }

      // console.log(`selectedVersion ${JSON.stringify(selectedVersion)}`);

      let selectedResource;

      if (selectedVersion) {
        selectedResource = selectedVersion.resources.find(
          r => r.id === options.resource
        );
      }

      if (props.assistantFieldType === 'resource' && selectedVersion) {
        selectedVersion.resources.forEach(r => {
          items.push({ label: r.name, value: r.id });
        });
      }

      if (props.assistantFieldType === 'operation' && selectedResource) {
        selectedResource.endpoints.forEach(ep => {
          items.push({ label: ep.name, value: ep.id || ep.url });
        });
      }
    }
  }

  function onFieldChange(id, value) {
    console.log(`in onFieldChange ${id} ${value} ${__resourceId}`);
    props.onFieldChange(id, value);

    if (
      [
        'assistantMetadata.version',
        'assistantMetadata.resource',
        'assistantMetadata.operation',
      ].includes(id)
    ) {
      const patch = [];

      if (id === 'assistantMetadata.version') {
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/version',
          value,
        });
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/resource',
          value: '',
        });
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/operation',
          value: '',
        });
      } else if (id === 'assistantMetadata.resource') {
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/resource',
          value,
        });
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/operation',
          value: '',
        });
      } else if (id === 'assistantMetadata.operation') {
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/operation',
          value,
        });
      }

      dispatch(actions.resource.patchStaged(__resourceId, patch, SCOPES.VALUE));
    }
  }

  return (
    <MaterialUiSelect
      {...props}
      label={label}
      classes={props.classes}
      options={[{ items: items || [] }]}
      onFieldChange={onFieldChange}
    />
  );
}

const DynaSelect = props => (
  <FieldWrapper {...props}>
    <DynaAssistantOptions classes={props.classes} />
  </FieldWrapper>
);

export default withStyles(styles)(DynaSelect);
