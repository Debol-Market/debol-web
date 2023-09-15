import Spinner from "../Spinner";

type props = {
    label: string;
    isLoading?: boolean;
    disabled?: boolean;
} & React.ComponentProps<'button'>;

const Btn = ({ label, disabled, isLoading, className, ...rest }: props) => {
    return (
        <button
            {...rest}
            disabled={disabled}
            className={`bg-amber-500 rounded-xl text-black font-semibold disabled:opacity-70 shadow-md disabled:shadow-none text-xl px-6 py-1 flex items-center justify-center ${className}`}
        >
            {isLoading ? (
                <Spinner
                    className="h-11 w-11" />
            ) : (
                <p className="my-2">{label}</p>
            )}
        </button>
    );
};

export default Btn;
