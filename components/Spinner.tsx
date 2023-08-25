import { CgSpinner } from 'react-icons/cg';

type props = {
  className?: string;
};

const Spinner = ({ className }: props) => {
  return <CgSpinner className={`spinner ${className}`} />;
};

export default Spinner;
