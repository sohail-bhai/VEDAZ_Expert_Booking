const ErrorMessage = ({ message = "Something went wrong. Please try again." }) => (
  <div className="error-wrapper">
    <div className="error-icon">⚠</div>
    <p className="error-message">{message}</p>
  </div>
);

export default ErrorMessage;
