import React, { useState, useCallback, useMemo } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import { Button } from '@material-ui/core';
import ArrowDownIcon from '../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
  doneButton: {
    width: '100%',
    minHeight: 42,
    margin: 0,
    padding: 0,
    border: '1px solid',
    borderColor: `${theme.palette.secondary.lightest} !important`,
    borderRadius: 0,
  },
  selectMenu: {
    diaplay: 'flex',
    flexDirection: 'column',
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

const MenuComponent = ({children, closeBtnClassName, closeSelect, ...props}) => (
  <div {...props}>
    {children}
    {closeSelect && (
    <Button
      id="select-close"
      data-test="closeSelect"
      variant="outlined"
      color="secondary"
      onClick={closeSelect}
      className={closeBtnClassName}>
      Done
    </Button>
    )}
  </div>
);

function CeligoSelect({ className, children, ...props }) {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const openSelect = useCallback(() => {
    setOpen(true);
  }, []);
  const closeSelect = useCallback(
    () => {
      setOpen(false);
    }, []
  );

  /** In case open property is overriden by parent, openSelect and closeSelect functionality will not work.
      The same is to be taken care by parent component.
      dont remove props.open unless verified.
  */
  const showCloseOption = !props.open && props.multiple;

  const MenuProps = useMemo(() => ({
    PaperProps: {
      style: {
        maxHeight: 252,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      },
      closeBtnClassName: classes.doneButton,
      closeSelect: showCloseOption && closeSelect,
      component: MenuComponent,
    },
    MenuListProps: {
      style: {
        overflowY: 'auto',
        // '& > div:firstChild': {
        //   overflow: 'hidden !important',
        // },
      },
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);

  return (
    <Select
      IconComponent={ArrowDownIcon}
      className={clsx(classes.select, className)}
      open={open}
      onOpen={openSelect}
      onClose={closeSelect}
      classes={{selectMenu: classes.selectMenu}}
      MenuProps={MenuProps}
      {...props}
      >
      {children}
    </Select>
  );
}
export default CeligoSelect;
