import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    height: 50,
    display: 'flex',
    marginBottom: 20,
    justifyContent: 'space-between',
    '& > div': {
      flex: '0, 0, 85%',
    },
  },
});

function Header(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classNames(classes.wrapper)}>{children}</div>;
}

export default Header;
