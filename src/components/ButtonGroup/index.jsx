import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  wrapper: {
    margin: '0px',
    padding: '0px',
    display: 'inline-flex',
    '& Button': {
      marginRight: '10px',
    },
    '& Button:last-child': {
      marginRight: '0px',
    },
  },
});

function ButtonGroup(props) {
  const { className } = props;
  const classes = useStyles();

  return (
    <div className={clsx(classes.wrapper, className)}>{props.children}</div>
  );
}

export default ButtonGroup;
