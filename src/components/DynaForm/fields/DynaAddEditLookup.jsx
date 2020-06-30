import React, { useState } from 'react';
import clsx from 'clsx';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ManageLookupDialog from '../../Lookup/Manage/Dialog';

const useStyles = makeStyles({
  container: {
    minWidth: props => props.minWidth || 500,
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

/**
lookup consist of dynamic lookup and static lookup. To show only dynamic lookup
pass showDynamicLookupOnly = true
*/
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
    options = {},
    onClick,
  } = props;
  const handleEditorClick = () => {
    if (onClick) onClick(!showLookup);
    setShowLookup(!showLookup);
  };

  const handleSave = (id, lookup) => {
    onSave(lookup);
    handleEditorClick();
  };

  return (
    <>
      {showLookup && (
        <ManageLookupDialog
          lookup={value}
          showDynamicLookupOnly={showDynamicLookupOnly}
          id={id}
          onCancel={handleEditorClick}
          onSave={handleSave}
          options={options}
        />
      )}
      {isEdit && (
        <Typography onClick={onSelect} className={classes.label}>
          {value.name}
        </Typography>
      )}
      <Button
        data-test={id}
        variant="contained"
        className={clsx({ [classes.button]: isEdit })}
        color="secondary"
        onClick={handleEditorClick}>
        {label}
      </Button>
    </>
  );
}
