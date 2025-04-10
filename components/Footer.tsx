import { Copyright } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="flex items-center flex-col bg-gray-100 shadow-xl px-9 py-6">
      <div className="flex justify-between w-full gap-4 my-6 flex-col md:flex-row">
        <div className="flex flex-col grow-[3] md:max-w-xl items-start">
          <div className="flex gap-2  justify-start">
            <p className="text-yellow-500 italic font-bold  text-4xl items-start ">
              Debol
            </p>
            <p className="text-primary font-slight-bold text-xl italic">
              Market
            </p>
          </div>
          <p className="md:max-w-md mt-4 font-light text-white-300">
            Debol is an innovative delivery platform that aims to revolutionize
            the shopping experience in Ethiopia. It collaborates with multiple
            institutions to offer a comprehensive platform for selling and
            delivering various items and equipment.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-y-4">
          <div className="flex flex-col gap-1.5 w-[10vw] min-w-[150px]">
            <h2 className="my-3 font-medium text-lg text-white-0">General</h2>
            <Link href="/contact">
              <p className="font-light text-white-300 underline decoration-black">
                Contact Us
              </p>
            </Link>
          </div>
        </div>
        <div className="flex flex-col">
          <div className="gap-4 flex mt-4 w-full justify-center sm:justify-start">
            {/* <Link href='https://instagram.com/zebo.connect?igshid=ZGUzMzM3NWJiOQ=='>
              <TiSocialInstagram className='fill-white-300 h-8 w-8 hover:fill-white-0' />
            </Link>
            <Link href='https://www.tiktok.com/@zebo.connect?_t=8cZbndHFpJe&_r=1'>
              <FaTiktok className='fill-white-300 h-8 w-8 hover:fill-white-0' />
            </Link>
            <Link href='https://t.me/Zeboconnect'>
              <FaTelegram className='fill-white-300 h-8 w-8 hover:fill-white-0' />
            </Link>
            <Link href='https://twitter.com/Zeboconnect?s=35'>
              <AiFillTwitterCircle className='fill-white-300 h-8 w-8 hover:fill-white-0' />
            </Link> */}
          </div>
        </div>
      </div>
      <span className="text-white-400/75 text-sm flex gap-2">
        <Copyright size={15} /> 2023 - Debol Trading LLC. all right reserved
      </span>
    </div>
  );
};

export default Footer;
