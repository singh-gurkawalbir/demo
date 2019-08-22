import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';
import ManageLookup from '../../../components/AFE/ManageLookup';

const useStyles = makeStyles(() => ({
  textField: {
    minWidth: 200,
  },
  editorButton: {
    // float: 'right',
  },
}));

export default function DynaLookupEditor(props) {
  const [showEditor, setShowEditor] = useState(false);
  const classes = useStyles();
  const { id, onFieldChange, value, label } = props;
  const handleEditorClick = () => {
    setShowEditor(!showEditor);
  };

  const handleClose = () => {
    handleEditorClick();
  };

  const onUpdate = lookups => {
    onFieldChange(id, lookups);
  };

  const onCancelClick = () => {
    setShowEditor(!showEditor);
  };

  const onAdd = lookup => {
    const newLookup = Object.assign([], value);

    newLookup.push(lookup);

    onFieldChange(id, newLookup);
  };

  return (
    <Fragment>
      {showEditor && (
        <ManageLookup
          title="Relative URI Editor"
          id={id}
          lookups={value}
          onCancelClick={onCancelClick}
          onClose={handleClose}
          onUpdate={onUpdate}
          onAdd={onAdd}
        />
      )}
      <Button
        variant="outlined"
        color="secondary"
        onClick={handleEditorClick}
        className={classes.editorButton}>
        {label}
      </Button>
    </Fragment>
  );
}
