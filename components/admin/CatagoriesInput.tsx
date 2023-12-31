import { CreateCatagory, getCatagories } from "@/services/database";
import { useQuery } from "@tanstack/react-query";
import { FC } from "react";
import makeAnimate from "react-select/animated";
import Select from "react-select/creatable";

type props = {
  catagories: { value: string; label: string }[];
  setCatagories: React.Dispatch<
    React.SetStateAction<
      {
        value: string;
        label: string;
      }[]
    >
  >;
};

const animatedComp = makeAnimate();

const CatagoriesInput: FC<props> = ({ catagories, setCatagories }) => {
  const { data, status } = useQuery({
    queryKey: ["getCatagories"],
    queryFn: getCatagories,
  });

  return (
    <>
      <label className="text-slate-500 mt-4 font-semibold">Catagories</label>

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
          onChange={setCatagories}
          onCreateOption={(item) => {
            CreateCatagory(item).then((ref) =>
              setCatagories((prev) => [
                ...prev,
                { label: item, value: ref.key ?? "" },
              ]),
            );
          }}
          value={catagories}
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

export default CatagoriesInput;
