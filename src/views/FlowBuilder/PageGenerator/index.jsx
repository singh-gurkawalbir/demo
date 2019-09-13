import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: 150,
    height: 150,
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    margin: theme.spacing(3),
  },
}));
const PageGenerator = ({ name }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h2">{name}</Typography>
    </div>
  );
};

export default PageGenerator;
