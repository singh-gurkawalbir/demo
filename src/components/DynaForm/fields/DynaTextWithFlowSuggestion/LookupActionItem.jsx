import React, { useState } from 'react';
import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { OutlinedButton } from '@celigo/fuse-ui';
import ManageLookupDialog from '../../../Lookup/Manage/Dialog';

const useStyles = makeStyles(theme => ({
  container: {
    minWidth: props => props.minWidth || 500,
  },
  helpText: {
    whiteSpace: 'pre-line',
  },
  label: {
    marginRight: theme.spacing(2),
  },
  rowContainer: {
    display: 'flex',
  },
  lookupActionItemContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
}));

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
  showLookupDialog,
  resourceId,
  resourceType,
  flowId,
}) {
  const [showLookup, setShowLookup] = useState(false);
  const classes = useStyles();
  const handleEditorClick = () => {
    if (showLookupDialog) showLookupDialog(!showLookup);
    setShowLookup(!showLookup);
  };

  const handleSave = (id, lookup) => {
    onSave(lookup, value);
    handleEditorClick();
  };

  const handleLookupSelect = () => {
    onSelect(value);
  };

  return (
    <>
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
      <div className={classes.lookupActionItemContainer}>
        {isEdit && (
          <Typography
            variant="body2"
            onClick={handleLookupSelect}
            className={classes.label}>
            {value.name}
          </Typography>
        )}
        <OutlinedButton
          data-test={id}
          sx={isEdit ? {
            alignSelf: 'flex-start',
            whiteSpace: 'nowrap',
          } : {}}
          onClick={handleEditorClick}>
          {label}
        </OutlinedButton>
      </div>
    </>
  );
}
