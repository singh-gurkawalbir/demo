import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import SqlQueryBuilderEditorDialog from '../../AFE/SqlQueryBuilderEditor/Dialog';
import DynaText from './DynaText';

/**
 *
 *
 * DynaQuery is being used to Define Query under Database Lookup
 */
const defaultQueryValue = 'select * from locations where id={{data.id}}';

export default function DynaQuery(props) {
  const { id, onFieldChange, sampleData = {}, disabled, value, label } = props;
  const [showEditor, setShowEditor] = useState(false);
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleSave = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }
  };

  return (
    <>
      <DynaText {...props} disabled multiline />
      {showEditor && (
        <SqlQueryBuilderEditorDialog
          title="Lookups"
          dataTest="lookupQuery"
          id={`lookupQueryBuilder-${id}`}
          rule={value || defaultQueryValue}
          sampleData={sampleData}
          onSave={handleSave}
          onClose={handleEditorClick}
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
    </>
  );
}
