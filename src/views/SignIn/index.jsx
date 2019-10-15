import { makeStyles, Typography, Link } from '@material-ui/core';
import SigninForm from './SigninForm';
import CeligoLogo from '../../components/CeligoLogo';

const useStyles = makeStyles(theme => ({
  wrapper: {
    display: 'grid',
    gridTemplateColumns: '40% 60%',
    height: '100vh',
  },
  gridImgWrapper: {
    background: `right / contain no-repeat url("../../static/images/gridDots.svg"), ${theme.palette.primary.main} `,
  },
  logo: {
    width: 150,
    marginBottom: theme.spacing(10),
    '& > svg': {
      fill: theme.palette.primary.dark,
    },
  },
  link: {
    paddingLeft: 4,
    color: theme.palette.primary.dark,
  },
  signinWrapper: {
    background: theme.palette.background.paper2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  signinWrapperContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 380,
    marginTop: '23%',
  },
  title: {
    marginBottom: theme.spacing(3),
  },
  subTitle: {
    marginBottom: theme.spacing(1),
  },
}));

export default function Signin(props) {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <div className={classes.signinWrapper}>
        <div className={classes.signinWrapperContent}>
          <div className={classes.logo}>
            <CeligoLogo />
          </div>
          <Typography variant="h2" className={classes.title}>
            Sign in
          </Typography>
          <Typography variant="body2" className={classes.subTitle}>
            Don&apos;t have an account?
            <Link href="true" className={classes.link}>
              Sign up
            </Link>
          </Typography>
          <SigninForm {...props} dialogOpen={false} />
        </div>
      </div>
      <div className={classes.gridImgWrapper} />
    </div>
  );
}
