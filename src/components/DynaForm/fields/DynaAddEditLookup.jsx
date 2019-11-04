import { useState, Fragment } from 'react';
import clsx from 'clsx';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import LookupDialog from '../../AFE/ManageLookup/Lookup/Dialog';

const useStyles = makeStyles({
  container: {
    minWidth: props => props.minWidth || '500px',
  },
  helpText: {
    whiteSpace: 'pre-line',
  },
  label: {
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '75%',
    float: 'left',
  },
  rowContainer: {
    display: 'flex',
  },
  button: {
    minWidth: 40,
    width: 40,
  },
});

export default function DynaAddEditLookup(props) {
  const [showLookup, setShowLookup] = useState(false);
  const classes = useStyles();
  const {
    id,
    isEdit = false,
    onSelect,
    label,
    onSave,
    showDynamicLookupOnly = false,
    value = {},
  } = props;
  const handleEditorClick = () => {
    setShowLookup(!showLookup);
  };

  const handleSave = (id, lookup) => {
    onSave(lookup);
    handleEditorClick();
  };

  return (
    <Fragment>
      {showLookup && (
        <LookupDialog
          lookup={value}
          showDynamicLookupOnly={showDynamicLookupOnly}
          id={id}
          onCancel={handleEditorClick}
          onSave={handleSave}
        />
      )}
      {isEdit && (
        <Typography onClick={onSelect} className={classes.label}>
          {value.name}
        </Typography>
      )}
      <Button
        data-test={id}
        variant="outlined"
        className={clsx({ [classes.button]: isEdit })}
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </Fragment>
  );
}
