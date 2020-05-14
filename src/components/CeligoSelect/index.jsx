import { makeStyles } from '@material-ui/styles';
import Select from '@material-ui/core/Select';
import clsx from 'clsx';
import ArrowDownIcon from '../icons/ArrowDownIcon';

const useStyles = makeStyles(theme => ({
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
  },
}));

function CeligoSelect({ className, children, ...props }) {
  const classes = useStyles();

  return (
    <Select
      IconComponent={ArrowDownIcon}
      className={clsx(classes.select, className)}
      {...props}>
      {children}
    </Select>
  );
}

export default CeligoSelect;
