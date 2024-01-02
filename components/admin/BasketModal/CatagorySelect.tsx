import { CreateCatagory } from "@/services/database";
import { rtdb } from "@/services/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { get, ref } from "firebase/database";
import React from "react";
import Select from "react-select/creatable";

type Props = {
  catagory: string;
  setCatagory: (v: string) => any;
};

const CatagorySelect = ({ setCatagory, catagory }: Props) => {
  const client = useQueryClient();
  const { data, status } = useQuery({
    queryKey: ["catagories"],
    queryFn: async () => {
      const catRef = await get(ref(rtdb, "catagories"));
      if (!catRef.val()) return [];
      return Object.values(catRef.val()).map((i: any) => i.name) as string[];
    },
  });

  if (status != "success") return <>Loading</>;

  return (
    <Select
      placeholder={"Select Catagory"}
      classNames={{ control: () => "h-12 mt-3" }}
      options={data.map((i) => ({ value: i, label: i }))}
      isClearable
      value={{ value: catagory, label: catagory }}
      onChange={(v) => v?.value && setCatagory(v?.value)}
      onCreateOption={(input) =>
        CreateCatagory(input).then(() => {
          client.invalidateQueries({ queryKey: ["catagories"] });
          setCatagory(input);
        })
      }
    />
  );
};

export default CatagorySelect;
