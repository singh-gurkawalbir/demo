import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import { ListItem, ListItemText, ListItemAvatar } from '@material-ui/core';

@hot(module)
export default class ProcessorListItem extends Component {
  render() {
    const { item, onClick } = this.props;

    return (
      <ListItem button onClick={() => onClick(item.name)}>
        <ListItemAvatar>
          <Avatar>
            <ImageIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={item.label || item.name}
          secondary={item.description}
        />
      </ListItem>
    );
  }
}
