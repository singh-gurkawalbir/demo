```js
const Grid = require('@material-ui/core/Grid').default;
const Typography = require('@material-ui/core/Typography').default;
const Header = require('../Header').default;
const HeaderAction = require('../Header/HeaderAction').default;
const Content = require('../Content').default;
const CardTitle = require('../Content/CardTitle').default;
const ApplicationImages = require('../Content/ApplicationImages').default;
const ApplicationImg = require('../../icons/ApplicationImg').default;
const AddIcon = require('../../icons/AddIcon').default;
const options =['view errors', 'settings', 'dashboard', 'generate zip', 'add flow', 'clone', 'delete'];
const Info = require('../Footer/Info').default;
const Tag = require('../Footer/Tag').default;
const FooterActions = require('../Footer/FooterActions').default;
const Manage = require('../Footer/Manage').default;
const PermissionsManageIcon = require('../../icons/PermissionsManageIcon').default;
const TrialExpireNotification = require('../TrialExpireNotification').default;
const ArrowPopper = require('../../Arrowpopper').default;
const TooltipContent = require('../../TooltipContent').default;
const Status = require('../../Status').default;
const StatusCircle = require('../../StatusCircle').default;


const handleOver = (event, placement) => setState({ 
    anchorEl: event.currentTarget,
    placement: placement
});

const handleOut = () => setState({ anchorEl: null });

<Grid container spacing={1}>
  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
    <HomePageCardContainer>
      <Header>
      <Status label=" 5234 Errors">
        <StatusCircle variant="error" size="small"></StatusCircle>
      </Status>
        <HeaderAction variants={options} />
      </Header>
      <Content>
        <CardTitle>
          <Typography variant="h3" >
              Magento & NetSuite 2018 Sales Report
          </Typography>
        </CardTitle>
         <ApplicationImages>
            <ApplicationImg type="magento" />
            <span><AddIcon /></span>
            <ApplicationImg type="netsuite" />
        </ApplicationImages>
      </Content>
      <Footer>
        <FooterActions>
            <Manage  onMouseOut={handleOut} onMouseOver={e => handleOver(e, 'bottom')}>
                <PermissionsManageIcon />
            </Manage>
             <Tag  variant="pro"/>
        </FooterActions> 
        <Info variant="Integration app" label="celigo" />
      </Footer>
      
        <ArrowPopper open={!!state.anchorEl} anchorEl={state.anchorEl} placement={state.placement} >
            <TooltipContent>Manage.</TooltipContent>
    </ArrowPopper>
    </HomePageCardContainer>
  </Grid>
  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
    <HomePageCardContainer>
      <Header>
       <Status label="success">
        <StatusCircle variant="success"></StatusCircle>
      </Status>
        <HeaderAction variants={options} />
      </Header>
        <Content>
        <CardTitle>
          <Typography variant="h3" >
              Ftp & Salesforce 2018 Sales Report
          </Typography>
        </CardTitle>
         <ApplicationImages>
            <ApplicationImg type="ftp" />
            <span><AddIcon /></span>
            <ApplicationImg type="salesforce" />
        </ApplicationImages>
      </Content>
      <Footer>
        <FooterActions>
            <Manage><PermissionsManageIcon /></Manage>
            <Tag  variant="Professional Marketing Manager from America"/>
        </FooterActions> 
        <Info variant="Integration app" label="celigo" />
      </Footer>
    </HomePageCardContainer>
  </Grid>
  <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
    <HomePageCardContainer>
      <Header>
      <Status label="continue setup">
        <StatusCircle variant="warning"></StatusCircle>
      </Status>
        <HeaderAction variants={options} />
      </Header>
        <Content>
        <CardTitle>
          <Typography variant="h3" >
              Http & postgres sql 2018 Sales Report
          </Typography>
        </CardTitle>
         <ApplicationImages>
            <ApplicationImg type="http" />
            <span><AddIcon /></span>
            <ApplicationImg type="postgresql" />
        </ApplicationImages>
      </Content>
      <Footer>
        <FooterActions>
            <Manage><PermissionsManageIcon /></Manage>
            <Tag  variant="production"/>
        </FooterActions> 
        <Info variant="Integration app" label="celigo" />
      </Footer>
      <TrialExpireNotification content="your free trial expires in 15 days of notification, please contact the sales person or you can uninstall" />
    </HomePageCardContainer>
  </Grid>
</Grid>
```