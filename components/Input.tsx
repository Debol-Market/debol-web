import { forwardRef } from "react";

type Props = {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
} & React.ComponentProps<"input">;

const Input = forwardRef<HTMLInputElement, Props>(function Input(
  { label, error, className, labelClassName, containerClassName, ...rest },
  ref,
) {
  return (
    <div className={`group flex flex-col text-sm ${containerClassName || ""}`}>
      <label
        className={`text-gray-700 group-focus-within:text-emerald-900 font-medium ${
          labelClassName || ""
        }`}
      >
        {label}
      </label>
      <input
        {...rest}
        ref={ref}
        className={`py-2 px-3 focus:outline-none border shadow border-gray-800 group-focus-within:border-emerald-800 rounded-md ${
          error ? "border-red-600" : ""
        } w-auto min-w-0 ${className || ""}`}
      />
      {error ? <p className="text-xs text-red-600 ">{error}</p> : null}
    </div>
  );
});

export default Input;
