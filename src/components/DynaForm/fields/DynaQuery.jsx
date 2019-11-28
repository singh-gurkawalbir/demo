import { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import SqlQueryBuilderEditorDialog from '../../../components/AFE/SqlQueryBuilderEditor/Dialog';
import DynaText from './DynaText';

/**
 *
 *
 * DynaQuery is being used to Define Query under Database Lookup
 */
export default function DynaQuery(props) {
  const { id, onFieldChange, sampleData = {}, disabled, value, label } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }

    handleEditorClick();
  };

  return (
    <Fragment>
      <DynaText label={label} value={value} disabled multiline />
      {showEditor && (
        <SqlQueryBuilderEditorDialog
          title="Lookups"
          id={`lookupQueryBuilder-${id}`}
          rule={value}
          sampleData={sampleData}
          onClose={handleClose}
          disabled={disabled}
          showDefaultData={false}
        />
      )}
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}>
        Define {label}
      </Button>
    </Fragment>
  );
}
