import { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Form, FormContext } from 'react-forms-processor/dist';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import stringUtil from '../../../utils/string';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormDialog from '../../FormDialog';
import fields from '../fields';
import CodeEditor from '../../CodeEditor';
import fieldDefinitions from '../../../forms/fieldDefinitions';
import { getFieldById, getFieldByName } from '../../../forms/utils';

const fieldMeta = {
  text: { key: 'text', label: 'Text', props: {} },
  editor: { key: 'editor', label: 'Editor', props: {} },
  checkbox: { key: 'checkbox', label: 'Checkbox', props: {} },
  select: {
    key: 'select',
    label: 'Select',
    props: {
      options: [
        {
          items: ['Item 1', 'Item 2', 'Item 3'],
        },
      ],
    },
  },
  selectresource: {
    key: 'selectresource',
    label: 'Select resource',
    props: { resourceType: 'connections' },
  },
  multiselect: {
    key: 'multiselect',
    label: 'Multi Select',
    props: {
      options: [
        {
          items: ['Item 1', 'Item 2', 'Item 3'],
        },
      ],
    },
  },
  radiogroup: {
    key: 'radiogroup',
    label: 'Radio Group',
    props: {
      options: [
        {
          items: ['Item 1', 'Item 2', 'Item 3'],
        },
      ],
    },
  },
  relativeuri: { key: 'relativeuri', label: 'RelativeUri', props: {} },
  keyvalue: {
    key: 'keyvalue',
    label: 'Key Value',
    props: { defaultValue: [{ key: 1, value: 2 }] },
  },
  csvparse: {
    key: 'csvparse',
    label: 'Csv Parse',
    props: { label: 'Configure CSV parse options' },
  },
};
// TODO: Is the name required to be provided..
// ..do we translate it to a path json fast patch would understand
// it needs '/'
const getFieldProps = type => ({
  id: `newFieldId-${type}`,
  type,
  name: 'newFieldId',
  // helpText: 'Sample help text for this new field.',
  label: 'New Field Label',
  description: 'Sample new field description text',
  value: 'test field value',
  ...fieldMeta[type].props,
});
const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(1),
  },
  fieldPreview: {
    padding: theme.spacing(1),
    backgroundColor: 'rgb(0,0,0,0.05)', // darken the BG bt 5%
    border: '1px solid',
    borderColor: theme.palette.divider,
    marginBottom: theme.spacing(2),
  },

  formControl: {
    marginBottom: theme.spacing(2),
    width: '50%',
  },
  editorContainer: {
    height: 200,
    border: '1px solid',
    borderColor: theme.palette.divider,
  },
}));

export default function NewFieldDialog(props) {
  const classes = useStyles();
  const [mode, setMode] = useState('custom');
  const [fieldType, setFieldType] = useState('text');
  const [fieldId, setFieldId] = useState('name');
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [count, setCount] = useState(0);
  const [meta, setMeta] = useState({});
  const [existingFieldIdWarning, setExistingFieldIdWarning] = useState(false);
  const [existingFieldNameWarning, setExistingFieldNameWarning] = useState(
    false
  );
  const remountDynaField = () => {
    setCount(count => count + 1);
  };

  const { formFieldsMeta } = props;
  const handleExistingFieldWarning = useCallback(
    (id, name) => {
      const existingFieldId = getFieldById({
        meta: formFieldsMeta,
        id,
      });
      const existingFieldName = getFieldByName({
        fieldMeta: formFieldsMeta,
        name,
      });

      setExistingFieldNameWarning(!!existingFieldName);
      setExistingFieldIdWarning(!!existingFieldId);
      setError(existingFieldId || existingFieldName);
    },
    [formFieldsMeta]
  );
  const handleEditorChange = value => {
    const { resourceType } = props;

    try {
      let meta = JSON.parse(value);

      if (meta.fieldId) {
        const resourceMeta = fieldDefinitions[resourceType];

        meta = { id: meta.fieldId, ...resourceMeta[meta.fieldId], ...meta };
      }

      const { id, name } = meta;

      handleExistingFieldWarning(id, name);
      setMeta(meta);
      setValue(value);
      remountDynaField();
    } catch (e) {
      setError(true);
    }
  };

  const handleFieldChange = ({ fieldType, fieldId }) => {
    const { resourceType } = props;
    let meta;
    let value;

    if (fieldType) {
      meta = getFieldProps(fieldType);
      value = JSON.stringify(meta, null, 2);
    } else {
      const resourceMeta = fieldDefinitions[resourceType];

      meta = { id: fieldId, fieldId, ...resourceMeta[fieldId] };
      value = JSON.stringify({ fieldId }, null, 2);
    }

    setMeta(meta);
    setValue(value);
    setFieldId(fieldId);
    setFieldType(fieldType);
    remountDynaField();
  };

  const handleSubmit = () => {
    const { onSubmit } = props;
    const meta = JSON.parse(value);

    onSubmit(meta);
  };

  const handleModeChange = mode => {
    setMode(mode);
  };

  const [componentReloaded, setComponentReloaded] = useState(false);

  useEffect(() => {
    if (!componentReloaded) {
      setComponentReloaded(true);
      const fieldType = 'text';
      const meta = getFieldProps(fieldType);
      const value = JSON.stringify(meta, null, 2);
      const { id, name } = meta;

      handleExistingFieldWarning(id, name);
      setFieldType(fieldType);
      setValue(value);
      setMeta(meta);
    }
  }, [componentReloaded, handleExistingFieldWarning]);

  const { onSubmit, resourceType, adaptorType, ...rest } = props;
  const DynaField = fields[meta.type];
  // console.log('render:', fieldType, fieldId, meta);
  const resourceMeta = fieldDefinitions[resourceType] || {};

  return (
    <FormDialog
      submitLabel="Insert Field"
      isValid={!error}
      {...rest}
      onSubmit={() => handleSubmit()}>
      <div className={classes.content}>
        <RadioGroup
          aria-label="position"
          name="position"
          value={mode}
          onChange={e => handleModeChange(e.target.value)}
          row>
          <FormControlLabel
            value="custom"
            control={<Radio color="primary" />}
            label="Build Custom Field"
            labelPlacement="end"
          />
          <FormControlLabel
            value="preset"
            control={<Radio color="primary" />}
            label="Select Preset Field"
            labelPlacement="start"
          />
        </RadioGroup>

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="field-type">
            {mode === 'custom'
              ? 'Select a custom input type to insert'
              : 'Select a pre-built field to insert'}
          </InputLabel>
          {mode === 'custom' ? (
            <Select
              value={fieldType}
              onChange={e => handleFieldChange({ fieldType: e.target.value })}
              input={<Input name="fieldType" id="field-type" />}>
              {Object.values(fieldMeta).map(f => (
                <MenuItem key={f.key} value={f.key}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Select
              value={fieldId}
              onChange={e => handleFieldChange({ fieldId: e.target.value })}
              input={<Input name="fieldType" id="field-type" />}>
              {Object.keys(resourceMeta)
                .filter(key => key.startsWith(adaptorType))
                .map(key => (
                  <MenuItem key={key} value={key}>
                    {`${resourceMeta[key].label} (${key})`}
                  </MenuItem>
                ))}
            </Select>
          )}
        </FormControl>
        <Typography variant="caption">Field Preview</Typography>
        <div className={classes.fieldPreview}>
          {DynaField && (
            <Form key={count}>
              <FormContext>
                {form => <DynaField {...form} {...meta} />}
              </FormContext>
            </Form>
          )}
        </div>
        {existingFieldIdWarning && (
          <div>
            <FormHelperText error>
              The field Id provided is an id for an existing field, Please
              change it to a more unique id.
            </FormHelperText>
          </div>
        )}

        {existingFieldNameWarning && (
          <div>
            <FormHelperText error>
              The field name provided is used as a name for an existing field,
              Please change it to a more unique name.
            </FormHelperText>
          </div>
        )}
        <Typography variant="caption">Metadata</Typography>
        <div className={classes.editorContainer}>
          <CodeEditor
            name={(meta && meta.id) || fieldId}
            value={value}
            mode="json"
            onChange={v => handleEditorChange(v)}
          />
        </div>
      </div>
    </FormDialog>
  );
}
