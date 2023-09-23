import { FC } from "react";
import Select from "react-select";
import makeAnimate from "react-select/animated";

type props = {
  unit: string;
  setUnit: (string) => void;
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

const UnitInput: FC<props> = ({ setUnit, unit }) => {
  return (
    <>
      <label className="text-slate-500 mt-4 font-semibold">Unit</label>
      <Select
        maxMenuHeight={200}
        options={options}
        components={animatedComp}
        onChange={setUnit}
        classNames={{
          control: () =>
            "focus-within:border-emerald-600 hover:border-emerald-600",
        }}
        defaultValue={options[0]}
        styles={{
          menu: (baseStyles, _) => ({ ...baseStyles, zIndex: 10 }),
          control: (baseStyles, _) => ({
            ...baseStyles,
            borderColor: "#94a3b8",
            borderWidth: "2px",
            borderRadius: "8px",
            paddingTop: "6px",
            paddingBottom: "6px",
            paddingLeft: "2px",
          }),
        }}
      />
    </>
  );
};

export default UnitInput;
