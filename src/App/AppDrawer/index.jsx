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
@withStyles({
  link: {},
})
export default class AppDrawer extends Component {
  render() {
    const { open, onToggleDrawer } = this.props;

    return (
      <Drawer open={open} onClose={onToggleDrawer}>
        <div
          tabIndex={0}
          role="button"
          onClick={onToggleDrawer}
          onKeyDown={onToggleDrawer}>
          <List>
            <ListItem button component={Link} to="/pg/">
              <ListItemIcon>
                <HomeIconIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>

            <ListItem button component={Link} to="/pg/exports">
              <ListItemIcon>
                <CloudDownloadIcon />
              </ListItemIcon>
              <ListItemText primary="Exports" />
            </ListItem>

            <ListItem button component={Link} to="/pg/imports">
              <ListItemIcon>
                <CloudUploadIcon />
              </ListItemIcon>
              <ListItemText primary="Imports" />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button component={Link} to="/pg/pipelines">
              <ListItemIcon>
                <DataUsageIcon />
              </ListItemIcon>
              <ListItemText primary="Create Data Pipeline" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    );
  }
}
