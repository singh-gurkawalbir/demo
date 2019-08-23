import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const styles = {
  wrapper: {
    width: '100%',
    height: 50,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
};

function Header(props) {
  const { classes, children } = props;

  return <div className={classNames(classes.wrapper)}>{children}</div>;
}

export default withStyles(styles)(Header);
