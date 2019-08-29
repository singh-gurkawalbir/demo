import { makeStyles } from '@material-ui/core/styles';

const usestyles = makeStyles({
  wrapper: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
});

function Content(props) {
  const classes = usestyles();
  const { children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default Content;
