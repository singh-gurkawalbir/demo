import { makeStyles } from '@material-ui/styles';

const usestyles = makeStyles({
  root: {
    paddingBottom: 5,
  },
});

function CardTitle(props) {
  const classes = usestyles();
  const { children } = props;

  return <div className={classes.root}>{children}</div>;
}

export default CardTitle;
