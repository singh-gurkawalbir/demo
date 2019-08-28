import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FieldWrapper } from 'react-forms-processor/dist';
import { withStyles } from '@material-ui/core/styles';
import MaterialUiSelect from './DynaSelect';
import * as selectors from '../../../reducers/index';
import actions from '../../../actions';

const styles = () => ({
  root: {
    display: 'flex !important',
    flexWrap: 'nowrap',
  },
});

function DynaAssistantOptions(props) {
  const { options } = props;
  const { label } = props;

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

      console.log(`selectedVersion ${JSON.stringify(selectedVersion)}`);

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

      if (props.assistantFieldType === 'endpoint' && selectedResource) {
        selectedResource.endpoints.forEach(ep => {
          items.push({ label: ep.name, value: ep.id || ep.url });
        });
      }
    }

    console.log(
      `props.assistantFieldType ${
        props.assistantFieldType
      } items ${JSON.stringify(items)}`
    );
  }

  return (
    <MaterialUiSelect
      {...props}
      label={label}
      classes={props.classes}
      options={[{ items: items || [] }]}
    />
  );
}

const DynaSelect = props => (
  <FieldWrapper {...props}>
    <DynaAssistantOptions classes={props.classes} />
  </FieldWrapper>
);

export default withStyles(styles)(DynaSelect);
