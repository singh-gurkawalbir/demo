import { makeStyles } from '@material-ui/core';
import SigninForm from './SigninForm';

const useStyles = makeStyles(() => ({
  signin: {
    marginTop: 90,
    width: 'fit-content',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));

export default function Signin(props) {
  const classes = useStyles();

  return (
    <div className={classes.signin}>
      <SigninForm {...props} dialogOpen={false} />
    </div>
  );
}
