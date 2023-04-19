import React from 'react';
import { Button, Typography, Box, styled } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useHistory } from 'react-router-dom';
import { CeligoLogo } from '@celigo/fuse-ui';
import useQuery from '../../../../hooks/useQuery';
import ShopifyLandingPageHeader from '../PageHeader';
import NotificationToaster from '../../../../components/NotificationToaster';

const useStyles = makeStyles(theme => ({
  headerBorder: {
    background: theme.palette.background.paper,
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(2),
    height: theme.spacing(10),
  },
  message: {
    border: `1px solid ${theme.palette.error.main}`,
    borderLeftWidth: '6px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  minicard1: {
    background: theme.palette.background.paper,
    width: '100%',
    padding: theme.spacing(0, 2),
    borderRadius: '4px',
    border: `1px solid ${theme.palette.error.main}`,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    borderLeftWidth: '6px',
  },
  errorNotification: {
    border: `1px solid ${theme.palette.secondary.lightest}`,
    width: '100%',
    borderRadius: '4px',
    minWidth: '-webkit-fill-available',
    borderLeftWidth: 6,
    boxShadow: 'none',
    '& svg': {
      fill: theme.palette.error.main,
      width: 36,
      height: 24,
      alignSelf: 'center',
    },
    '&:before': {
      content: 'none',
    },
  },
  buttonRef: {
    padding: 0,
  },
}));

const StyledRoot = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.background.paper,
}));

const StyledShopifyBody = styled(Box)({
  height: 'calc(100vh - 78px)',
  position: 'relative',
});

const StyledShopifyContentWrapper = styled(Box)({
  width: '500px',
  position: 'absolute',
  top: 'calc(50% - 78px)',
  left: '50%',
  transform: 'translate(-50%, -50%)',
});

const StyledCard = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.lightest}`,
  background: '#F8FAFF',
  boxShadow: '0px 4px 4px rgb(0 0 0 / 25%)',
  borderRadius: '4px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '32px 24px',
  flexWrap: 'wrap',
}));

const StyledMiniCard = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  border: `1px solid ${theme.palette.secondary.lightest}`,
  width: '100%',
  padding: theme.spacing(0, 2),
  borderRadius: '4px',
  marginTop: theme.spacing(2),
  '& h5': {
    fontSize: theme.spacing(1.75),
    margin: '16px 0',
    fontFamily: 'inherit',
    lineHeight: 1.1,
  },
}));

export default function VerifyApp() {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();

  const paramObj = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const value of query.keys()) {
    paramObj[value] = query.get(value);
  }

  return (
    <StyledRoot>
      <ShopifyLandingPageHeader />
      <StyledShopifyBody>
        <StyledShopifyContentWrapper>
          <StyledCard>
            <Box
              sx={{
                width: 150,
                marginBottom: theme => theme.spacing(5),
                '& > svg': {
                  fill: theme => theme.palette.primary.dark,
                },
              }}>
              <CeligoLogo />
            </Box>
            <NotificationToaster
              variant="error"
              className={classes.errorNotification}
            >
              <Typography
                component="div"
                variant="h5"
                sx={{
                  fontSize: theme => theme.spacing(1.75),
                  lineHeight: 1.1,
                  margin: '8px 0',
                  fontFamily: 'inherit',
                }}
              >
                Failed to add app.
                <br />
                Error: {paramObj.errorMessage}
              </Typography>
            </NotificationToaster>
            <StyledMiniCard>
              <Typography
                component="h5"
                variant="h5"
              >
                <span>
                  <Button
                    variant="text"
                    color="primary"
                    disableElevation
                    onClick={() => history.goBack()}
                    className={classes.buttonRef}
                  >
                    Return to Shopify
                  </Button> and try again.
                </span>
              </Typography>
              <Box
                sx={{
                  borderBottom: theme => `1px solid ${theme.palette.secondary.lightest}`,
                  width: theme => theme.spacing(50),
                }} />
              <Typography
                component="h5"
                variant="h5"
              >
                If the error persists, <a className={classes.link} href="https://docs.celigo.com/hc/en-us/requests/new" rel="noreferrer" target="_blank">submit a ticket </a>to our support team.
              </Typography>
            </StyledMiniCard>
          </StyledCard>
        </StyledShopifyContentWrapper>
      </StyledShopifyBody>
    </StyledRoot>
  );
}
