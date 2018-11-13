import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Link } from 'react-router-dom';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import { withStyles } from '@material-ui/core/styles';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';
import Editor from './Editor';

const mapStateToProps = state => ({
  processors: selectors.processors(state),
});
const drawerWidth = 320;

@hot(module)
@withStyles(theme => ({
  appFrame: {
    minHeight: 500,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },

  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    padding: theme.spacing.unit,
  },

  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
}))
class Processors extends Component {
  render() {
    const { processors, classes } = this.props;
    const NoEdit = () => (
      <Typography variant="h6">
        The left sidebar lists all available processors.
      </Typography>
    );

    return (
      <LoadResources required resources={['processors']}>
        <div className={classes.appFrame}>
          <Drawer
            variant="permanent"
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}>
            <Typography variant="h5">Available Processors</Typography>
            <List>
              {processors.map(p => (
                <ListItem
                  className={classes.listItem}
                  button
                  key={p.name}
                  component={Link}
                  to={`/pg/processors/${p.name}`}>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                  <ListItemText
                    primary={p.label || p.name}
                    secondary={p.description}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <main className={classes.content}>
            <Switch>
              <Route path="/pg/processors/:name" component={Editor} />
              <Route component={NoEdit} />
            </Switch>
          </main>
        </div>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps, null)(Processors);
