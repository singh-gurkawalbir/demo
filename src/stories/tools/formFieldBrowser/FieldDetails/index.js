import clsx from 'clsx';
import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Help from '../../../../components/Help';
import helpTextMap from '../../../../components/Help/helpTextMap';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';
import { useFieldPickerContext } from '../FieldPickerContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'stretch',
    cursor: 'pointer',
    marginBottom: theme.spacing(1),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  fieldInfoContainer: {
    padding: theme.spacing(1),
    background: theme.palette.background.paper2,
    flexGrow: 1,
  },
  toggleContainer: {
    backgroundColor: fade(theme.palette.error.main, 0.3),
    width: 175,
    padding: theme.spacing(1),
  },

  titleContainer: {
    display: 'flex',
  },
  helpTextButton: {
    padding: 0,
  },
  canInstrument: {
    backgroundColor: fade(theme.palette.success.main, 0.3),
  },
  hasChange: {
    border: `solid 1px ${theme.palette.info.light}`,
  },
}));

// console.log(helpTextMap);

export default function FieldDetails({id, resourceType, field}) {
  const classes = useStyles();
  const helpKey = `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}.${id}`;
  const { changeSet, clearField, setField } = useFieldPickerContext();
  const changedValue = changeSet[resourceType]?.[id];
  const hasChange = changedValue !== undefined;
  // we favor the changelog setting.
  const canInstrument = hasChange
    ? changedValue
    : field.canInstrument || false;

  function handleClick() {
    if (hasChange && field.canInstrument !== changedValue) {
      clearField(resourceType, id);
    } else {
      setField(resourceType, id, !canInstrument);
    }
  }

  return (
    <div className={clsx(classes.root, {[classes.hasChange]: hasChange})} onClick={() => handleClick()}>
      <div className={classes.fieldInfoContainer}>
        <div className={classes.titleContainer}>
          <Typography><b>{field.label}</b></Typography>
          <Help className={classes.helpTextButton} title={field.label} helpText={helpTextMap[helpKey]} />
        </div>

        {field.description && (
        <Typography variant="caption">{field.description}</Typography>
        )}

        <Typography variant="subtitle2">ID: {helpKey}</Typography>
        <Typography variant="body2">UI Component: {field.type}</Typography>
      </div>
      <div
        className={clsx(classes.toggleContainer, {
          [classes.canInstrument]: canInstrument,
        })}>
        <Typography>
          {canInstrument ? 'Safe to instrument' : 'PII'}
        </Typography>
      </div>
    </div>
  );
}
