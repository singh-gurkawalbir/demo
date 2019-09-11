import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  wrapper: {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'column',
  },
});

function Content(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classes.wrapper}>{children}</div>;
}

export default Content;
