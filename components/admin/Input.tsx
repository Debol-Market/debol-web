type props = {
    label: string;
    error?: string;
} & React.ComponentProps<'input'>;

const Input = ({ label, error, className, ...rest }: props) => {
    return (
        <>
            <label
                className="text-slate-500 mt-4 font-semibold"
                htmlFor="email"
            >
                {label}
            </label>
            <input
                {...rest}
                className={`py-3 px-4 focus:outline-none border-2 border-slate-400 focus:border-emerald-600 rounded-lg ${
                    error ? 'border-red-600' : ''
                } w-auto min-w-0 ${className ? className : ''}`}
            />
            {error ? <p className="text-xs text-red-600 ">{error}</p> : null}
        </>
    );
};

export default Input;
