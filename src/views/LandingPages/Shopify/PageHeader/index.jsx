import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import ActionGroup from '../../../../components/ActionGroup';
import BackArrowIcon from '../../../../components/icons/BackArrowIcon';
import ApplicationImg from '../../../../components/icons/ApplicationImg';

const useStyles = makeStyles(theme => ({
  landingPageHeader: {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    marginBottom: theme.spacing(2),
    height: theme.spacing(9),
  },
  linkText: {
    paddingLeft: theme.spacing(-1),
  },
  link: {
    paddingTop: 5,
    cursor: 'pointer',
  },
  actionGroup: {
    '& > *': {
      marginRight: theme.spacing(1),
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
}));

export default function ShopifyLandingPageHeader() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.landingPageHeader}>
      <ActionGroup className={classes.actionGroup}>
        <div
          onClick={() => { history.goBack(); }}
          className={classes.link}
        >
          <BackArrowIcon />
        </div>
        <span className={classes.linkText}>Back to</span>
        <ApplicationImg
          type="shopify"
          alt="shopify"
          size="small"
        />
      </ActionGroup>
    </div>
  );
}
