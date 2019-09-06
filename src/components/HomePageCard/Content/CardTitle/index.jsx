import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
  root: {
    paddingBottom: 5,
  },
});

function CardTitle(props) {
  const classes = useStyles();
  const { children } = props;

  return <div className={classes.root}>{children}</div>;
}

export default CardTitle;
