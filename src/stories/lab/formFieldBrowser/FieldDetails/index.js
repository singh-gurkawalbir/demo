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
  },
  fieldInfoContainer: {
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1),
    border: `solid 1px ${theme.palette.secondary.lightest}`,
    background: theme.palette.background.paper2,
    flexGrow: 1,
  },
  toggleContainer: {
    backgroundColor: fade(theme.palette.error.main, 0.3),
    width: 150,
    marginBottom: theme.spacing(1),
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
}));

// console.log(helpTextMap);

export default function FieldDetails({id, resourceType, field}) {
  const classes = useStyles();
  const helpKey = `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]}.${id}`;
  const { changeSet, clearField, setField } = useFieldPickerContext();

  // we favor the changelog setting.
  const hasChange = changeSet[helpKey] !== undefined;
  const canInstrument = hasChange
    ? changeSet[helpKey]
    : field.canInstrument || false;

  function handleClick() {
    if (hasChange && field.canInstrument !== changeSet[helpKey]) {
      clearField(helpKey);
    } else {
      setField(helpKey, !canInstrument);
    }
  }

  return (
    <div className={classes.root}>
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
        onClick={() => handleClick()}
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
