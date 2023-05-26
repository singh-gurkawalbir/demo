import React, { useState, useCallback } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import clsx from 'clsx';
import { OutlinedButton } from '@celigo/fuse-ui';
import ArrowDownIcon from '../icons/ArrowDownIcon';
import isLoggableAttr from '../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  select: {
    display: 'flex !important',
    flexWrap: 'nowrap',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    transitionProperty: 'border',
    transitionDuration: theme.transitions.duration.short,
    transitionTimingFunction: theme.transitions.easing.easeInOut,
    overflow: 'hidden',
    padding: '0px 12px',
    height: 38,
    justifyContent: 'flex-end',
    borderRadius: 2,
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
        '&:hover': {
          borderColor: theme.palette.secondary.lightest,
        },
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
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
  },
}));

export const DoneButton = ({onClose}) => (
  <OutlinedButton
    id="select-close"
    color="secondary"
    data-test="closeSelect"
    onClick={onClose}
    sx={{
      width: '100%',
      minHeight: 42,
      margin: 0,
      padding: 0,
      borderRadius: 0,
      '&:hover': {
        borderColor: 'primary.main',
      },
    }}>
    Done
  </OutlinedButton>
);
const MenuComponent = React.forwardRef((props, ref) => {
  const {children, closeSelect, ...others} = props;

  return (
    <div ref={ref} {...others}>
      {children}
      {closeSelect && (
      <DoneButton onClose={closeSelect} />

      )}
    </div>
  );
});

export default function CeligoSelect({ className, maxHeightOfSelect, children, isLoggable, ...props }) {
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

  return (
    <Select
      variant="standard"
      {...isLoggableAttr(isLoggable)}
      IconComponent={ArrowDownIcon}
      className={clsx(classes.select, className)}
      open={open}
      onOpen={openSelect}
      onClose={closeSelect}
      classes={{selectMenu: classes.selectMenu}}
      inputProps={{
        MenuProps: {
          MenuListProps: {
            style: {
              overflowY: 'auto',
            },
          },
          className: classes.selectWrapper,
          PaperProps: {
            style: {
              maxHeight: maxHeightOfSelect,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            },
            closeSelect: showCloseOption && closeSelect,
            component: MenuComponent,
          },
        },
      }}
      {...props}>
      {children}
    </Select>
  );
}
