import { ListItem, ListItemText } from '@material-ui/core';

export default function ProcessorListItem({ item, onClick }) {
  return (
    <ListItem data-test={item.name} button onClick={() => onClick(item.name)}>
      <ListItemText
        primary={item.label || item.name}
        secondary={item.description}
      />
    </ListItem>
  );
}
