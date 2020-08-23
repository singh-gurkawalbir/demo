import React, { useState, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import ArrowDownIcon from '../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  doneButton: {
    width: '100%',
    height: theme.spacing(6),
    border: 0,
  },
  select: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    padding: '0px 12px',
    height: 38,
    justifyContent: 'flex-end',
    borderRadius: theme.spacing(0.5),
    '& > .MuiInput-formControl': {
      height: 38,
      padding: '0px 15px',
      border: '1px solid',
      borderColor: theme.palette.secondary.lightest,
      '&:hover': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-disabled': {
        borderColor: theme.palette.secondary.lightest,
      },
    },
    '& >.MuiSelect-selectMenu': {
      padding: [[0, 32, 0, 12]],
      lineHeight: '38px',
      margin: [[0, -12]],
    },
    '& svg': {
      right: theme.spacing(1),
    },
    // '&:hover': {
    //   borderColor: theme.palette.primary.main,
    // },
  },
}));

function CeligoSelect({ className, children, ...props }) {
  const {multiple, onChange} = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const isSelectOverriden = !!props.open;
  const openSelect = useCallback(() => {
    setOpen(true);
  }, []);
  const closeSelect = useCallback(
    () => {
      setOpen(false);
    }, []
  );
  const handleOnChange = useCallback((evt, _item) => {
    if (_item?.props?.id === 'close-select') {
      closeSelect();

      return;
    }
    onChange(evt);
  }, [closeSelect, onChange]);

  return (
    <Select
      IconComponent={ArrowDownIcon}
      className={clsx(classes.select, className)}
      open={open}
      onOpen={openSelect}
      onClose={closeSelect}
      {...props}
      // in case open property is overriden by parent onChange handler to be directly called for parent
      onChange={isSelectOverriden ? onChange : handleOnChange}
      >
      {children}
      {multiple && (
        <Button
          id="close-select"
          data-test="closeSelect"
          variant="outlined"
          color="secondary"
          className={classes.doneButton}>
          Done
        </Button>
      )}
    </Select>
  );
}

export default CeligoSelect;
