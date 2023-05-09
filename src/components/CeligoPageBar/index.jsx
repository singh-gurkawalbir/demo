import React, {useCallback} from 'react';
import { useSelector } from 'react-redux';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Paper, Grid, IconButton } from '@mui/material';
import { InfoIconButton } from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import getRoutePath from '../../utils/routePaths';
import BackArrowIcon from '../icons/BackArrowIcon';

const useStyles = makeStyles(theme => ({
  pageHeader: {
    zIndex: theme.zIndex.appBar - 1,
    padding: theme.spacing(3),
    height: theme.pageBarHeight,
    width: `calc(100% - calc(${theme.spacing(2 * 3)} + 4px))`,
    position: 'fixed',
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  },
  pageHeaderShift: {
    width: `calc(100% - (${theme.drawerWidth}px - ${theme.spacing(1)}))`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  pageBarOffset: { height: theme.pageBarHeight },
  emptySpace: {
    flexGrow: 1,
    minWidth: theme.spacing(10),
  },
  title: {
    minWidth: 70,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: theme.palette.secondary.main,
  },
  headerWrapper: {
    justifyContent: 'space-between',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
}));

export default function CeligoPageBar(props) {
  const {
    parentUrl,
    children,
    title,
    infoTitleName,
    infoText,
    subtitle,
    titleTag,
    className,
    escapeUnsecuredDomains,
    contentId,
  } = props;
  const classes = useStyles();
  const history = useHistory();

  const handleOnClick = useCallback(() => {
    if (history.length > 2) {
      return history.goBack();
    }
    if (parentUrl) {
      history.replace(parentUrl);
    } else {
      history.replace(getRoutePath('/'));
    }
  }, [history, parentUrl]);
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));

  return (
    <>
      <Paper
        className={clsx(classes.pageHeader, className, {
          [classes.pageHeaderShift]: drawerOpened,
        })}
        elevation={0}
        square>

        <Grid
          item container wrap="nowrap" alignItems="center"
          className={classes.headerWrapper}>
          <div className={classes.titleWrapper}>
            {parentUrl && (
            // eslint-disable-next-line react/jsx-handler-names
            <IconButton size="small" onClick={handleOnClick}>
              <BackArrowIcon />
            </IconButton>
            )}
            <Typography className={classes.title} variant="h3">
              {title}
            </Typography>
            {titleTag && <span>{titleTag}</span>}
            {infoText && (
              <InfoIconButton
                title={infoTitleName || title}
                info={infoText}
                escapeUnsecuredDomains={escapeUnsecuredDomains}
                contentId={contentId}
              />
            )}
          </div>
          {children}
        </Grid>
        <Typography variant="caption" className={classes.history}>
          {subtitle}
        </Typography>
      </Paper>
      <div className={clsx(classes.pageBarOffset)} />
    </>
  );
}
