import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import SqlQueryBuilderEditorDialog from '../../../components/AFE/SqlQueryBuilderEditor/Dialog';
import DynaLookupEditor from './DynaLookupEditor';

export default function DynaSQLQueryBuilder(props) {
  const {
    id,
    onFieldChange,
    options,
    disabled,
    value,
    label,
    resourceId,
  } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const parsedData =
    options && typeof options.saveIndex === 'number' && Array.isArray(value)
      ? value[options.saveIndex]
      : value;
  const lookupFieldId = options && options.lookups && options.lookups.fieldId;
  const lookups = options && options.lookups && options.lookups.data;
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      if (
        options &&
        typeof options.saveIndex === 'number' &&
        Array.isArray(value)
      ) {
        // save to array at position saveIndex
        const valueTmp = value;

        valueTmp[options.saveIndex] = template;
        onFieldChange(id, valueTmp);
      } else {
        // save to field
        onFieldChange(id, template);
      }
    }

    handleEditorClick();
  };

  let lookupField;

  if (lookupFieldId) {
    lookupField = (
      <DynaLookupEditor
        id={lookupFieldId}
        label="Manage Lookups"
        value={lookups}
        onFieldChange={onFieldChange}
      />
    );
  }

  return (
    <Fragment>
      {showEditor && (
        <SqlQueryBuilderEditorDialog
          title="SQL Query Builder"
          id={`${resourceId}-${id}`}
          rule={parsedData}
          data={JSON.stringify({}, null, 2)}
          defaultData={JSON.stringify({}, null, 2)}
          onFieldChange={onFieldChange}
          onClose={handleClose}
          action={lookupField}
          disabled={disabled}
        />
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
