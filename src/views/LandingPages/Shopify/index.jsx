import React from 'react';
import { useSelector } from 'react-redux';
import { Box, styled } from '@mui/material';
import AddOrSelectForm from './Form';
import { applicationsList } from '../../../constants/applications';
import { KBDocumentation } from '../../../utils/connections';
import ShopifyLandingPageHeader from './PageHeader';
import { generateNewId } from '../../../utils/resource';
import { selectors } from '../../../reducers';
import { emptyObject } from '../../../constants';

const LandingPageContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  height: '100vh',
  position: 'absolute',
  top: 0,
  width: '100%',
}));

const LandingPageFormContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  height: 'calc(100vh - 96px)',
});

const LandingPageForm = styled(Box)(({ theme }) => ({
  background: theme.palette.background.default,
  borderRadius: theme.spacing(0.5),
  maxWidth: 552,
  minWidth: 552,
  border: '1px solid',
  borderColor: theme.palette.secondary.lightest,
  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  minHeight: 760,
  position: ' relative',
}));

export default function ShopifyLandingPage() {
  const resourceId = generateNewId();
  const applications = applicationsList();
  const app =
    applications.find(a => [a.id, a.assistant].includes('shopify')) || emptyObject;
  const selectedAccountHasSandbox = useSelector(state =>
    selectors.accountHasSandbox(state)
  );
  const helpURL = app.helpURL || KBDocumentation.shopify;

  return (
    <LandingPageContainer>
      <ShopifyLandingPageHeader />
      <LandingPageFormContainer>
        <LandingPageForm>
          <AddOrSelectForm
            resourceId={resourceId}
            selectedAccountHasSandbox={selectedAccountHasSandbox}
            helpURL={helpURL}
          />
        </LandingPageForm>
      </LandingPageFormContainer>
    </LandingPageContainer>
  );
}
