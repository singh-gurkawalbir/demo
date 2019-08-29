import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';

const usestyles = makeStyles({
  wrapper: {
    width: '100%',
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
});

function Header(props) {
  const classes = usestyles();
  const { children } = props;

  return <div className={classNames(classes.wrapper)}>{children}</div>;
}

export default Header;
