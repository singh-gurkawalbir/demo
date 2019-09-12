import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import MaterialUiSelect from '../DynaSelect';
import * as selectors from '../../../../reducers/index';
import actions from '../../../../actions';
import { SCOPES } from '../../../../sagas/resourceForm';

const useStyles = makeStyles({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

export default function DynaAssistantOptions(props) {
  const { label, resourceContext, options } = props;
  const classes = useStyles();
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
      const patch = [];

      if (props.assistantFieldType === 'version') {
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
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/exportType',
          value: '',
        });
      } else if (props.assistantFieldType === 'resource') {
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
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/exportType',
          value: '',
        });
      } else if (props.assistantFieldType === 'operation') {
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/operation',
          value,
        });
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/exportType',
          value: '',
        });
      } else if (props.assistantFieldType === 'exportType') {
        patch.push({
          op: 'replace',
          path: '/assistantMetadata/exportType',
          value,
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
      classes={classes}
      options={[{ items: selectOptionsItems }]}
      onFieldChange={onFieldChange}
    />
  );
}
