import { getVendors } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import makeAnimate from "react-select/animated";
import Select from "react-select/creatable";

const animatedComp = makeAnimate();

const VendorInput: FC<{
  vendor: string;
  setVendor: React.Dispatch<React.SetStateAction<string>>;
}> = ({ vendor, setVendor }) => {
  const { data, status } = useQuery({
    queryKey: ["getVendors"],
    queryFn: getVendors,
  });

  return (
    <>
      <label className="text-slate-500 mt-4 font-semibold">Vendor</label>

      {status != "success" ? (
        <></>
      ) : (
        <Select
          isMulti
          maxMenuHeight={200}
          options={data.map((item) => {
            return { label: item.name, value: item.id };
          })}
          components={animatedComp}
          onChange={({ value }) => setVendor(value)}
          classNames={{
            control: () =>
              "focus-within:border-emerald-600 hover:border-emerald-600",
          }}
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
      )}
    </>
  );
};

export default VendorInput;
