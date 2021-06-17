import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { withDesign } from 'storybook-addon-designs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { jsxDecorator } from 'storybook-addon-jsx';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import HomePageCardsContainer from '../../components/HomePageCard/HomePageCardContainer/index';
import Header from '../../components/HomePageCard/Header/index';
import HeaderAction from '../../components/HomePageCard/Header/HeaderAction/index';
import Content from '../../components/HomePageCard/Content';
import CardTitle from '../../components/HomePageCard/Content/CardTitle/index';
import ApplicationImages from '../../components/HomePageCard/Content/ApplicationImages';
import ApplicationImg from '../../components/icons/ApplicationImg';
import Footer from '../../components/HomePageCard/Footer/index';
import Tag from '../../components/HomePageCard/Footer/Tag/index';
import FooterActions from '../../components/HomePageCard/Footer/FooterActions/index';
import Info from '../../components/HomePageCard/Footer/Info/index';
import Manage from '../../components/HomePageCard/Footer/Manage/index';
import CeligoTruncate from '../../components/CeligoTruncate';
import StatusButton from '../../components/Buttons/StatusButton/index';
import AddIcon from '../../components/icons/AddIcon';
import PermissionsManageIcon from '../../components/icons/PermissionsManageIcon';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
    position: 'relative',
    '& > div': {
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, minmax(100%, 1fr));',
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr));',
    },
  },
  wrapper: {
    maxWidth: 310,
  },
}));

const options = ['view errors', 'settings', 'dashboard', 'generate zip', 'add flow', 'clone', 'delete'];
export default {
  title: 'Components / HomePageCardsContainer',
  component: HomePageCardsContainer,
  decorators: [withDesign, jsxDecorator],
};

const designParameters = {
  design: {
    type: 'figma',
    allowFullscreen: true,
    url: 'https://projects.invisionapp.com/share/MTMYGGZQ4G9#/screens/378481276_Home_Cards_-_DEV',
  },
};

const Template = args => {
  const classes = useStyles();

  return (
    <>
      <HomePageCardsContainer {...args}>
        <div className={classes.wrapper}>
          <Header>
            <StatusButton variant="success" {...args}>
              error
            </StatusButton>
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
              <Tag {...args}>{args.test}</Tag>
            </FooterActions>
            <Info variant="Integration app" label="celigo" />
          </Footer>
        </div>
      </HomePageCardsContainer>
    </>
  );
};

export const defaults = Template.bind({});

defaults.args = {
  ellipsis: '...',
  placement: 'right',
  lines: 1,
  delay: 500,
  children: 'welcome',
  variant: 'success',
};

export const suiteScript = Template.bind({});

suiteScript.args = {
  lines: 2,
  variant: 'error',
  test: 'testing',
  type: 'zendesk',
  tag: {
    variant: 'just test',
  },

};

defaults.parameters = designParameters;
suiteScript.parameters = designParameters;
