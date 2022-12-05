import React from 'react';
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

  return (
    <div className={classes.landingPageHeader}>
      <ActionGroup className={classes.actionGroup}>
        <a
          href="https://apps.shopify.com"
          rel="noreferrer"
          alt="shopifyAppStore"
          data-test="shopifyAppStore"
          className={classes.link}
        >
          <BackArrowIcon />
        </a>
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
