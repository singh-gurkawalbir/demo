import { hot } from 'react-hot-loader';
import { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

@hot(module)
export default class ProcessorListItem extends Component {
  render() {
    const { item, onClick } = this.props;

    return (
      <ListItem button key={item.name} onClick={() => onClick(item.name)}>
        <Avatar>
          <ImageIcon />
        </Avatar>
        <ListItemText
          primary={item.label || item.name}
          secondary={item.description}
          secondaryTypographyProps={{ variant: 'caption' }}
        />
      </ListItem>
    );
  }
}
