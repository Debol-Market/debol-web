import Spinner from "./Spinner";

type props = {
  label: string;
  isLoading?: boolean;
  disabled?: boolean;
} & React.ComponentProps<"button">;

const Btn = ({ label, disabled, isLoading, className, ...rest }: props) => {
  return (
    <button
      {...rest}
      disabled={disabled}
      className={`bg-gradient rounded-xl text-black font-semibold disabled:opacity-75 shadow-md disabled:shadow-none text-xl px-6 py-1 flex items-center justify-center ${className} hover:brightness-110`}
    >
      {isLoading ? (
        <Spinner className="h-11 w-11 text-white" />
      ) : (
        <p className="my-2 text-white">{label}</p>
      )}
    </button>
  );
};

export default Btn;
