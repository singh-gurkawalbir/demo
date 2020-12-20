```js
const styles = {
    border: '1px solid',
    cursor: 'pointer',
    padding: 22,
    overflow: 'hidden',
    maxWidth: 319,
    minWidth: 319,
    boxSizing: 'border-box',
    minHeight: 319,
    transition: 'all .4s ease',
    borderColor: '#D6E4ED',
    borderRadius: 4,
    position: 'relative',
   
};
const wrapper = {
    display: 'flex',
    justifyContent: 'space-between',

};
<div style={wrapper}>
    <div style={styles}>
    <TileNotification content="Your free trial expired on Jan 10th, 2020 (60 days). Contact sales to upgrade your app. " single  />
    </div>
    <div style={styles}>
    <TileNotification content="Your free trial expired on Jan 10th, 2020 (60 days). Contact sales to upgrade your app. " />
    </div>
</div>

```