import { Search } from "lucide-react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
const SearchBar = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState(
    (router.query?.q as string | undefined) ?? "",
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <form
      className="overflow-hidden rounded-md border relative grow md:max-w-sm"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={keyword}
        placeholder="Search"
        onChange={(e) => setKeyword(e.target.value)}
        className="border-none p-1.5 px-3 w-full bg-grey placeholder:text-neutral-400"
      />
      <button className="absolute right-0 h-full rounded-bl-lg text-white px-3 bg-primary">
        <Search size={20} color="white" />
      </button>
    </form>
  );
};

export default SearchBar;
