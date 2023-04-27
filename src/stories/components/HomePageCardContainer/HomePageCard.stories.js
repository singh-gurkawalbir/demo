import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import makeStyles from '@mui/styles/makeStyles';
import { Typography, Tooltip, IconButton } from '@mui/material';
import HomePageCardsContainer from '../../../components/HomePageCard/HomePageCardContainer/index';
import Header from '../../../components/HomePageCard/Header/index';
import HeaderAction from '../../../components/HomePageCard/Header/HeaderAction/index';
import Content from '../../../components/HomePageCard/Content';
import CardTitle from '../../../components/HomePageCard/Content/CardTitle/index';
import ApplicationImages from '../../../components/HomePageCard/Content/ApplicationImages';
import ApplicationImg from '../../../components/icons/ApplicationImg';
import Footer from '../../../components/HomePageCard/Footer/index';
import IntegrationTag from '../../../components/tags/IntegrationTag/index';
import FooterActions from '../../../components/HomePageCard/Footer/FooterActions/index';
import Info from '../../../components/HomePageCard/Footer/Info/index';
import Manage from '../../../components/HomePageCard/Footer/Manage/index';
import CeligoTruncate from '../../../components/CeligoTruncate';
import Status from '../../../components/Buttons/Status/index';
import AddIcon from '../../../components/icons/AddIcon';
import PermissionsManageIcon from '../../../components/icons/PermissionsManageIcon';
import ConnectionDownIcon from '../../../components/icons/unLinkedIcon';
import StatusCircle from '../../../components/StatusCircle/index';
import withBoundingBox from './withBoundingBox';

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: 310,
  },
  status: {
    position: 'relative',
    '& span': {
      fontSize: '14px',
      color: theme.palette.primary.main,
    },
    '&:hover': {
      '& * > span.MuiTypography-root': {
        color: theme.palette.primary.light,
      },
    },
  },
  connectionDownRedDot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    position: 'absolute',
    right: theme.spacing(-0.5),
    top: 0,
  },
}));

const options = ['view errors', 'settings', 'dashboard', 'generate zip', 'add flow', 'clone', 'delete'];
export default {
  title: 'Components / HomePageCardsContainer',
  component: HomePageCardsContainer,
  subcomponents: {Header, CardTitle, ApplicationImg},
  decorators: [withDesign, jsxDecorator, withBoundingBox],
};

const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://projects.invisionapp.com/share/MTMYGGZQ4G9#/screens/378481276_Home_Cards_-_DEV',
  },
};

export const Defaults = args => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <HomePageCardsContainer {...args}>
        <div className={classes.wrapper}>
          <Header>
            <Status variant="success" {...args}>
              error
            </Status>
            <HeaderAction variants={options} />
          </Header>
          <Content>
            <CardTitle>
              <Typography variant="h3" >
                <CeligoTruncate lines={2} {...args}>
                  Magento & NetSuite 2018 Sales ReportMagento & NetSuite 2018 Sales Report
                </CeligoTruncate>
              </Typography>
            </CardTitle>
            <ApplicationImages>
              <ApplicationImg type="magento" {...args} />
              <span><AddIcon /></span>
              <ApplicationImg type="netsuite" {...args} />
            </ApplicationImages>
          </Content>
          <Footer>
            <FooterActions>
              <Manage>
                <PermissionsManageIcon />
              </Manage>
            </FooterActions>
            <Info variant="Integration app" label="celigo" />
          </Footer>
        </div>
      </HomePageCardsContainer>
    </div>
  );
};
export const SuiteScript = args => {
  const classes = useStyles();

  return (
    <div className={classes.wrapper}>
      <HomePageCardsContainer {...args}>
        <div className={classes.wrapper}>
          <Header>
            <Status variant="error" {...args}>
              12 error
            </Status>
            <Tooltip title="Connection down" placement="bottom" className={classes.tooltip}>
              <IconButton size="small" color="inherit" className={classes.status}>
                <span><StatusCircle size="small" className={classes.connectionDownRedDot} variant="error" /></span><ConnectionDownIcon />
              </IconButton>
            </Tooltip>
          </Header>
          <Content>
            <CardTitle>
              <Typography variant="h3" >
                <CeligoTruncate lines={2} {...args}>
                  Clone - Grouped flows for IO-20408
                </CeligoTruncate>
              </Typography>
            </CardTitle>
          </Content>
          <Footer>
            <FooterActions>
              <Manage>
                <PermissionsManageIcon />
              </Manage>
              <IntegrationTag label="clone" />
            </FooterActions>
            <Info variant="Integration app" label="celigo" />
          </Footer>
        </div>
      </HomePageCardsContainer>
    </div>
  );
};

Defaults.parameters = designParameters;
SuiteScript.parameters = designParameters;
