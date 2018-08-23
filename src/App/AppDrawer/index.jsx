import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import HomeIconIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import { Link } from 'react-router-dom';

@hot(module)
@withStyles(theme => ({
  link: {
    // color: theme.palette.text.primary,
    color: theme.palette.action.active,
  },
}))
export default class AppDrawer extends Component {
  render() {
    const { classes, open, onToggleDrawer } = this.props;

    return (
      <Drawer open={open}>
        <div
          tabIndex={0}
          role="button"
          onClick={onToggleDrawer}
          onKeyDown={onToggleDrawer}>
          <List>
            <ListItem button>
              <ListItemIcon>
                <HomeIconIcon />
              </ListItemIcon>
              <ListItemText>
                <Link className={classes.link} to="/pg/">
                  Dashboard
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CloudDownloadIcon />
              </ListItemIcon>
              <ListItemText>
                <Link className={classes.link} to="/pg/exports">
                  Exports
                </Link>
              </ListItemText>
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <CloudUploadIcon />
              </ListItemIcon>
              <ListItemText>
                <Link className={classes.link} to="/pg/imports">
                  Imports
                </Link>
              </ListItemText>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button>
              <ListItemIcon>
                <DataUsageIcon />
              </ListItemIcon>
              <ListItemText>
                <Link className={classes.link} to="/pg/pipelines">
                  Create a Data Pipe
                </Link>
              </ListItemText>
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}
