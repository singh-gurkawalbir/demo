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
    height: 42,
    justifyContent: 'flex-end',
    borderRadius: 2,
    '& > Label': {
      marginTop: theme.spacing(-1),
      '&.MuiInputLabel-shrink': {
        paddingTop: theme.spacing(2),
      },
    },
    '& >.MuiSelect-selectMenu': {
      paddingLeft: theme.spacing(1),
    },
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
    '& > *': {
      background: 'none',
    },
    '& > div > div ': {
      paddingBottom: 5,
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
