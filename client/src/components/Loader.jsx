const Loader = ({ message = "Loading..." }) => (
  <div className="loader-wrapper">
    <div className="spinner" />
    <span>{message}</span>
  </div>
);

export default Loader;
