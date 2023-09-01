import pic from "@/assets/logo_with_name.jpg";
import Link from "next/link";
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/">
      <Image src={pic.src} className="h-10" alt="Logo" height={40} width={107} />
    </Link>
  );
};

export default Logo;
