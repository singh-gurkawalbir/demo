import { useState, Fragment } from 'react';
import clsx from 'clsx';
import { Button, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ManageLookupDialog from '../../../Lookup/Manage/Dialog';

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
export default function LookupActionItem({
  id,
  isEdit = false,
  onSelect,
  label,
  onSave,
  showDynamicLookupOnly = false,
  value = {},
  options = {},
  onClick,
  resourceId,
  resourceType,
  flowId,
}) {
  const [showLookup, setShowLookup] = useState(false);
  const classes = useStyles();
  const handleEditorClick = () => {
    if (onClick) onClick(!showLookup);
    setShowLookup(!showLookup);
  };

  const handleSave = (id, lookup) => {
    onSave(lookup);
    handleEditorClick();
  };

  const handleLookupSelect = () => {
    onSelect(value);
  };

  return (
    <Fragment>
      {showLookup && (
        <ManageLookupDialog
          value={value}
          showDynamicLookupOnly={showDynamicLookupOnly}
          id={id}
          onCancel={handleEditorClick}
          onSave={handleSave}
          options={options}
          resourceId={resourceId}
          resourceType={resourceType}
          flowId={flowId}
        />
      )}
      {isEdit && (
        <Typography onClick={handleLookupSelect} className={classes.label}>
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
