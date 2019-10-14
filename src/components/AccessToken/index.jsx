import { makeStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
// import { Button } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  tokenItem: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    borderRadius: '50%',
    background: theme.palette.secondary.light,
    float: 'left',
    marginRight: '2px',
  },
}));

function AccessToken({ count }) {
  const len = parseInt(count, 0);
  const classes = useStyles();
  const items = [];

  for (let i = 0; i < len; i += 1) {
    items.push(i);
  }

  const listItems = items.map(item => (
    <span key={item} className={classes.tokenItem} />
  ));

  return <div className={classes.wrapper}>{listItems}</div>;
}

export default AccessToken;
