import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import FormDialog from '../../FormDialog';
import fields from '../fields';
import CodeEditor from '../../CodeEditor';
// import stringUtil from '../../../utils/string';

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
    padding: theme.spacing.unit,
  },
  fieldPreview: {
    padding: theme.spacing.unit,
    backgroundColor: 'rgb(0,0,0,0.05)', // darken the BG bt 5%
    border: '1px solid',
    borderColor: theme.palette.divider,
    marginBottom: theme.spacing.double,
  },

  formControl: {
    marginBottom: theme.spacing.double,
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
    fieldType: 'text',
    value: '',
    error: false,
    meta: {},
  };

  handleEditorChange(value) {
    try {
      const meta = JSON.parse(value);

      this.setState({ meta, value, error: false });
    } catch (e) {
      this.setState({ value, error: true });
    }
  }

  handleFieldTypeChange(fieldType) {
    const value = JSON.stringify(getFieldProps(fieldType), null, 2);

    this.setState({ value, fieldType });
  }

  componentDidMount() {
    const fieldType = 'text';
    const meta = getFieldProps(fieldType);
    const value = JSON.stringify(meta, null, 2);

    this.setState({ fieldType, error: false, value, meta });
  }

  render() {
    const { classes, onSubmit, ...rest } = this.props;
    const { fieldType, error, value, meta } = this.state;
    const DynaField = fields[fieldType];

    return (
      <FormDialog
        submitLabel="Insert Field"
        isValid={!error}
        {...rest}
        onSubmit={() => onSubmit(this.state.meta)}>
        <div className={classes.content}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-helper">
              Select what type of field to insert
            </InputLabel>
            <Select
              value={fieldType}
              onChange={e => this.handleFieldTypeChange(e.target.value)}
              input={<Input name="fieldType" id="field-type" />}>
              {Object.values(fieldMeta).map(f => (
                <MenuItem key={f.key} value={f.key}>
                  {f.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography variant="caption">Field Preview</Typography>
          <div className={classes.fieldPreview}>
            <DynaField {...meta} />
          </div>
          <Typography variant="caption">Metadata</Typography>
          <div className={classes.editorContainer}>
            <CodeEditor
              name={meta.id}
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
