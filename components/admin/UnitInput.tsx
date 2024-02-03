import { FC } from "react";
import Select from "react-select";
import makeAnimate from "react-select/animated";

type props = {
  unit: string;
  setUnit: (unit: string) => void;
  containerClassName?: string;
  labelClassName?: string;
};

const options = [
  { value: "", label: "None" },
  { value: "pc", label: "Piece" },
  { value: "oz", label: "Quintal (cwt)" },
  { value: "kg", label: "Kilogram (kg)" },
  { value: "g", label: "Gram (g)" },
  { value: "lb", label: "Pound (lb)" },
  { value: "oz", label: "Ounce (oz)" },
  { value: "L", label: "Liter (L)" },
  { value: "mL", label: "Milliliter (mL)" },
  { value: "fl-oz", label: "Fluid Ounce (fl oz)" },
  { value: "cup", label: "Cup (cup)" },
];

const animatedComp = makeAnimate();

const UnitInput: FC<props> = ({
  setUnit,
  unit,
  containerClassName,
  labelClassName,
}) => {
  return (
    <div className={`group flex text-sm flex-col ${containerClassName || ""}`}>
      <label
        className={`text-gray-700 group-focus-within:text-emerald-900 font-medium ${
          labelClassName || ""
        }`}
      >
        Unit
      </label>
      <Select
        maxMenuHeight={200}
        options={options}
        components={animatedComp}
        onChange={setUnit}
        classNames={{
          container: () => "shadow",
          control: () =>
            "!border-gray-800 !shadow-none focus-within:!border-emerald-800",
        }}
        defaultValue={options[0]}
        styles={{
          menu: (baseStyles, _) => ({ ...baseStyles, zIndex: 10 }),
          control: (baseStyles, _) => ({
            ...baseStyles,
            borderWidth: "1px",
            borderRadius: "6px",
            paddingTop: "4px",
            paddingBottom: "4px",
            paddingLeft: "2px",
          }),
        }}
      />
    </div>
  );
};

export default UnitInput;
