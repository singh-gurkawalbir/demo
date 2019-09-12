import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '15vw',
    height: '15vh',
    border: 'solid 1px lightblue',
    padding: theme.spacing(1),
    margin: theme.spacing(1),
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
