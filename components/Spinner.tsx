import { CgSpinner } from "react-icons/cg";

type props = {
  className?: string;
};

const Spinner = ({ className }: props) => {
  return <CgSpinner className={`spinner ${className}`} data-testid="spinner" />;
};

export default Spinner;
