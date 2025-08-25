import { cn } from "@/utils";
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
      className={cn(
        `bg-orange-500 rounded font-medium disabled:opacity-75 shadow-md disabled:shadow-none text-xl px-6 py-1 flex items-center justify-center hover:brightness-110 text-white`,
        className,
      )}
    >
      {isLoading ? <Spinner className="h-11 w-11 " /> : <p>{label}</p>}
    </button>
  );
};

export default Btn;
