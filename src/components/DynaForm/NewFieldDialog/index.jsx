import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
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
import { Form } from 'react-forms-processor/dist';
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

@withStyles(theme => ({
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
}))
export default class NewFieldDialog extends Component {
  state = {
    mode: 'custom', // or 'preset'
    fieldType: 'text',
    fieldId: 'name',
    value: '',
    error: false,
    count: 0,
    meta: {},
    existingFieldIdWarning: false,
    existingFieldNameWarning: false,
  };

  remountDynaField() {
    const count = this.state.count + 1;

    this.setState({ count: count + 1 });
  }
  handleExistingFieldWarning(id, name) {
    const { formFieldsMeta } = this.props;
    const existingFieldId = getFieldById({
      meta: formFieldsMeta,
      id,
    });
    const existingFieldName = getFieldByName({
      fieldMeta: formFieldsMeta,
      name,
    });

    if (existingFieldId || existingFieldName) {
      // set some state with warning

      if (existingFieldId && existingFieldName)
        this.setState({
          existingFieldIdWarning: true,
          existingFieldNameWarning: true,
          error: true,
        });
      else if (existingFieldId)
        this.setState({
          existingFieldIdWarning: true,
          existingFieldNameWarning: false,
          error: true,
        });
      else
        this.setState({
          existingFieldIdWarning: false,
          existingFieldNameWarning: true,
          error: true,
        });
    } else
      this.setState({
        existingFieldIdWarning: false,
        existingFieldNameWarning: false,
        error: false,
      });
  }

  handleEditorChange(value) {
    const { resourceType } = this.props;

    try {
      let meta = JSON.parse(value);

      if (meta.fieldId) {
        const resourceMeta = fieldDefinitions[resourceType];

        meta = { id: meta.fieldId, ...resourceMeta[meta.fieldId], ...meta };
      }

      const { id, name } = meta;

      this.handleExistingFieldWarning(id, name);
      this.setState({ meta, value });
      this.remountDynaField();
    } catch (e) {
      this.setState({ value, error: true });
    }
  }

  handleFieldChange({ fieldType, fieldId }) {
    const { resourceType } = this.props;
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

    // console.log('meta:', meta);
    // console.log('value: ', value);

    this.setState({ meta, value, fieldId, fieldType });
    this.remountDynaField();
  }

  handleSubmit() {
    const { value } = this.state;
    const { onSubmit } = this.props;
    const meta = JSON.parse(value);

    onSubmit(meta);
  }

  handleModeChange(mode) {
    this.setState({ mode });
  }

  componentWillMount() {
    const fieldType = 'text';
    const meta = getFieldProps(fieldType);
    const value = JSON.stringify(meta, null, 2);
    const { id, name } = meta;

    this.handleExistingFieldWarning(id, name);

    this.setState({ fieldType, value, meta });
  }

  render() {
    const {
      classes,
      onSubmit,
      resourceType,
      adaptorType,
      ...rest
    } = this.props;
    const {
      fieldId,
      fieldType,
      error,
      value,
      meta,
      mode,
      count,
      existingFieldIdWarning,
      existingFieldNameWarning,
    } = this.state;
    const DynaField = fields[meta.type];
    // console.log('render:', fieldType, fieldId, meta);
    const resourceMeta = fieldDefinitions[resourceType] || {};

    return (
      <FormDialog
        submitLabel="Insert Field"
        isValid={!error}
        {...rest}
        onSubmit={() => this.handleSubmit()}>
        <div className={classes.content}>
          <RadioGroup
            aria-label="position"
            name="position"
            value={mode}
            onChange={e => this.handleModeChange(e.target.value)}
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
                onChange={e =>
                  this.handleFieldChange({ fieldType: e.target.value })
                }
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
                onChange={e =>
                  this.handleFieldChange({ fieldId: e.target.value })
                }
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
                <DynaField {...meta} />
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
              onChange={v => this.handleEditorChange(v)}
            />
          </div>
        </div>
      </FormDialog>
    );
  }
}
