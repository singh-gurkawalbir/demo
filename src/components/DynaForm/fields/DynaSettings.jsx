import produce from 'immer';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../../reducers';
import DynaForm from '../../DynaForm';
import EditorField from './DynaEditor';

const useStyles = makeStyles({
  editor: {
    height: 50,
  },
});
const defaultSettingsMeta = {
  fieldMap: {
    storeName: {
      id: 'storeName',
      name: 'storeName',
      type: 'text',
      helpText: 'Enter your store name, which is also your host subdomain.',
      label: 'Store Name',
      required: true,
    },
    currency: {
      id: 'currency',
      name: 'currency',
      type: 'radiogroup',
      label: 'Currency',
      helpKey: 'What is the default currency of your store?',
      options: [
        {
          items: [{ label: 'US', value: 'us' }, { label: 'CDN', value: 'cdn' }],
        },
      ],
      required: true,
    },
  },
  layout: {
    fields: ['storeName', 'currency'],
  },
};

function getFieldMetaWithDefaults(fieldMeta, values) {
  return produce(fieldMeta, draft => {
    Object.keys(draft.fieldMap).forEach(key => {
      const field = draft.fieldMap[key];

      field.defaultValue = values[field.name] || '';
    });
  });
}

export default function DynaSettings({
  id,
  value,
  resourceContext,
  onFieldChange,
  ...rest
}) {
  const classes = useStyles();
  const [finalMeta, setFinalMeta] = useState();
  const { resourceType, resourceId } = rest;
  const fieldMeta = useSelector(state => {
    const { merged } = selectors.resourceData(state, resourceType, resourceId);

    // settingsForm = { form: {[metadata]}, init: {function, _scriptId}}
    // we are going to ignore the init hook for now as there is good chance
    // devs using custom setting forms don't need this feature.
    if (!merged.settingsForm) {
      return defaultSettingsMeta;
    }

    return merged.settingsForm.form;
  });

  // we only need to do this once as an "init"...
  useEffect(() => {
    console.log('DynaSettings value, meta:', value, fieldMeta);
    setFinalMeta(getFieldMetaWithDefaults(fieldMeta, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSettingFormChange(values, isValid) {
    console.log(isValid ? 'valid: ' : 'invalid: ', values);
    onFieldChange(id, values);
  }

  if (!finalMeta) {
    return (
      <EditorField
        label="Settings"
        {...rest}
        editorClassName={classes.editor}
        mode="json"
      />
    );
  }

  return (
    <DynaForm
      onChange={handleSettingFormChange}
      disabled={rest.disabled}
      fieldMeta={finalMeta}
    />
  );
}
