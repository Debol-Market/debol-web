import { useRouter } from "next/router";
import { FC, useState } from "react";
const SearchBar = () => {
  const router = useRouter();
  const [keyword, setKeyword] = useState(
    (router.query?.q as string | undefined) ?? ""
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <form
      className="overflow-hidden rounded-full border border-neutral-300 relative grow max-w-xs"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        value={keyword}
        placeholder="Search"
        onChange={(e) => setKeyword(e.target.value)}
        className="border-none p-2 px-4 w-full bg-grey placeholder:text-neutral-300"
      />
      <button className="absolute right-0 h-full rounded-bl-3xl text-white px-4 bg-primary">
        <SearchSvg color="white" />
      </button>
    </form>
  );
};

export const SearchSvg: FC<{ color: "black" | "white" }> = ({ color }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      d="M26.5 26.5L24 24M13.375 25.25C14.9344 25.25 16.4786 24.9428 17.9194 24.3461C19.3601 23.7493 20.6692 22.8746 21.7719 21.7719C22.8746 20.6692 23.7493 19.3601 24.3461 17.9194C24.9428 16.4786 25.25 14.9344 25.25 13.375C25.25 11.8156 24.9428 10.2714 24.3461 8.83063C23.7493 7.38989 22.8746 6.0808 21.7719 4.97811C20.6692 3.87541 19.3601 3.0007 17.9194 2.40393C16.4786 1.80716 14.9344 1.5 13.375 1.5C10.2256 1.5 7.2051 2.75111 4.97811 4.97811C2.75111 7.2051 1.5 10.2256 1.5 13.375C1.5 16.5244 2.75111 19.5449 4.97811 21.7719C7.2051 23.9989 10.2256 25.25 13.375 25.25Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SearchBar;
