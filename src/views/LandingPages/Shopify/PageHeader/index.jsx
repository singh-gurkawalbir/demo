import React from 'react';
import { useHistory } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Box, styled } from '@mui/material';
import ActionGroup from '../../../../components/ActionGroup';
import BackArrowIcon from '../../../../components/icons/BackArrowIcon';
import ApplicationImg from '../../../../components/icons/ApplicationImg';
import { SHOPIFY_APP_URL } from '../../../../constants';

const useStyles = makeStyles(theme => ({
  actionGroup: {
    '& > *': {
      marginRight: theme.spacing(1),
      '&:last-child': {
        marginRight: 0,
      },
    },
  },
}));

const LandingPageHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
  marginBottom: theme.spacing(2),
  height: theme.spacing(9),
}));

export default function ShopifyLandingPageHeader() {
  const classes = useStyles();
  const history = useHistory();
  const handleBackClick = () => {
    if (history.length > 2) {
      history.goBack();
    } else {
      window.location.href = SHOPIFY_APP_URL;
    }
  };

  return (
    <LandingPageHeader>
      <ActionGroup className={classes.actionGroup}>
        <Box
          onClick={handleBackClick}
          sx={{
            paddingTop: '5px',
            cursor: 'pointer',
          }}
        >
          <BackArrowIcon />
        </Box>
        <Box component="span" sx={{ paddingLeft: theme => theme.spacing(-1) }}>Back to</Box>
        <ApplicationImg
          type="shopify"
          alt="shopify"
          size="small"
        />
      </ActionGroup>
    </LandingPageHeader>
  );
}
