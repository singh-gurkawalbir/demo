export default function ErrorPanel(props) {
  const {
    resourceSampleData,
    sampleDataWrapperClass,
    sampleDataContainerClass,
  } = props;

  return (
    <div className={sampleDataWrapperClass}>
      <div className={sampleDataContainerClass}>
        <pre>{JSON.stringify(resourceSampleData.error, null, 2)}</pre>
      </div>
    </div>
  );
}
