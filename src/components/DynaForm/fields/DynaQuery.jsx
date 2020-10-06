import React, { useCallback } from 'react';
import Button from '@material-ui/core/Button';
import SqlQueryBuilderEditorDrawer from '../../AFE/SqlQueryBuilderEditor/Drawer';
import DynaText from './DynaText';
import usePushRightDrawer from '../../../hooks/usePushRightDrawer';

/**
 * DynaQuery is being used to Define Query under Database Lookup
 */
const defaultQueryValue = 'select * from locations where id={{data.id}}';

export default function DynaQuery(props) {
  const { id, onFieldChange, sampleData = {}, disabled, value, label } = props;
  const handleOpenDrawer = usePushRightDrawer(id);

  const handleSave = useCallback((shouldCommit, editorValues) => {
    if (shouldCommit) {
      const { template } = editorValues;

      onFieldChange(id, template);
    }
  }, [id, onFieldChange]);

  return (
    <>
      <DynaText {...props} disabled multiline />
      <SqlQueryBuilderEditorDrawer
        title={`Define ${label}`}
        dataTest="lookupQuery"
        id={`lookupQueryBuilder-${id}`}
        rule={value || defaultQueryValue}
        sampleData={sampleData}
        onSave={handleSave}
        disabled={disabled}
        showDefaultData={false}
        path={id}
        />
      <Button
        data-test={id}
        variant="outlined"
        color="secondary"
        onClick={handleOpenDrawer}>
        Define {label}
      </Button>
    </>
  );
}
