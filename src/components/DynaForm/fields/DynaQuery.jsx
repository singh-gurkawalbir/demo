import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import SqlQueryBuilderEditorDrawer from '../../AFE/SqlQueryBuilderEditor/Drawer';
import DynaText from './DynaText';

/**
 *
 *
 * DynaQuery is being used to Define Query under Database Lookup
 */
const defaultQueryValue = 'select * from locations where id={{data.id}}';

export default function DynaQuery(props) {
  const { id, onFieldChange, sampleData = {}, disabled, value, label } = props;
  const history = useHistory();
  const match = useRouteMatch();
  const handleEditorClick = useCallback(() => {
    history.push(`${match.url}/${id}`);
  }, [history, id, match.url]);

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
        title="Lookups"
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
        onClick={handleEditorClick}>
        Define {label}
      </Button>
    </>
  );
}
