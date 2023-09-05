import pic from "@/assets/logo_with_name.jpg";
import Link from "next/link";
import Image from "next/image";
import { FC } from "react";

type props = {
  size?: number;
}

const Logo:FC<props> = ({size}) => {
  return (
    <Link href="/">
      <Image src={pic.src} style={{height: size ?? 40}} className="object-contain aspect-[16/6]" alt="Logo" height={size ?? 40} width={size ? size * (16/6) :107} />
    </Link>
  );
};

export default Logo;
