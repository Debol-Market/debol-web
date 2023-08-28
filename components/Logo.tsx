import pic from "@/assets/logo_with_name.jpg";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <img src={pic.src} className="h-10" />
    </Link>
  );
};

export default Logo;
