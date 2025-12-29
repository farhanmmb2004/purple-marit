import './Spinner.css';

const Spinner = ({ size = 'medium', fullPage = false }) => {
  const spinnerElement = (
    <div className={`spinner-container ${fullPage ? 'fullpage' : ''}`}>
      <div className={`spinner-circle spinner-${size}`}></div>
    </div>
  );

  return spinnerElement;
};

export default Spinner;
