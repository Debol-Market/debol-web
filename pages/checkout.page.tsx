import Btn from "@/components/Btn";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PhoneField from "@/components/PhoneField";
import useApp from "@/services/appContext";
import convertCurrency from "@/utils/convertCurrency";
import { isPhoneValid } from "@/utils/phone";
import Image from "next/image";
import { useRouter } from "next/router";
import { ChangeEvent, FormEventHandler, useRef, useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function Component() {
  const [tab, setTab] = useState<"intl" | "cbe" | "dashen" | "abysinnia">(
    "intl",
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-white dark:bg-gray-900 py-3">
        <div className="container mx-auto px-4">
          <div className="mb-3">
            <h1 className="text-3xl font-semibold mb-4">Checkout</h1>

            <div className="justify-center flex">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Btn
                  label="International"
                  onClick={() => setTab("intl")}
                  className={`flex-1 max-w-[160px] ${
                    tab == "intl"
                      ? "bg-primary"
                      : "bg-transparent border border-primary text-primary"
                  } text-lg`}
                />
                <Btn
                  label="CBE"
                  onClick={() => setTab("cbe")}
                  className={`flex-1 max-w-[160px] ${
                    tab == "cbe"
                      ? "bg-primary"
                      : "bg-transparent border border-primary text-primary"
                  } text-lg`}
                />
                <Btn
                  label="Abysinnia"
                  onClick={() => setTab("abysinnia")}
                  className={`flex-1 max-w-[160px] ${
                    tab == "abysinnia"
                      ? "bg-primary"
                      : "bg-transparent border border-primary text-primary"
                  } text-lg`}
                />
                <Btn
                  label="Dashen"
                  onClick={() => setTab("dashen")}
                  className={`flex-1 max-w-[160px] ${
                    tab == "dashen"
                      ? "bg-primary"
                      : "bg-transparent border border-primary text-primary"
                  } text-lg`}
                />
              </div>
            </div>
            <div className="relative flex justify-center">
              {tab == "intl" ? <IntlTab /> : <LocalTab tab={tab} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

const LocalTab = ({ tab }: { tab: "cbe" | "dashen" | "abysinnia" }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const isValid1 = isPhoneValid(phone1);
  const isValid2 = isPhoneValid(phone2);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const imageInput = useRef<HTMLInputElement>(null);

  const accounts = {
    cbe: 1000112951257,
    dashen: 5138243350011,
    abysinnia: "(799) 359-72",
  };

  const { user, basketCart, basketCartItems, currencyMultiplier, currency } =
    useApp();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!user || !image) return;
    setIsLoading(true);
    const token = await user.getIdToken(true);
    try {
      const formData = new FormData();
      formData.set(
        "obj",
        JSON.stringify({
          basketCart,
          name,
          phone1,
          phone2,
          bank: tab,
        }),
      );
      formData.set("image", image);
      const res = await fetch("/api/local-checkout", {
        method: "POST",
        headers: {
          authorization: `bearer ${token}`,
        },
        body: formData,
      });
      const { orderId } = await res.json();
      router.push("/order/" + orderId);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (!selectedFile) return;
    setImage(selectedFile);
    setImageUrl(URL.createObjectURL(selectedFile));
  };

  const total = Math.round(
    basketCartItems.reduce((s, c) => s + c.sizes[0].price, 0) * 1.2,
  );

  return (
    <form
      action=""
      onSubmit={onSubmit}
      className="py-3 flex flex-col max-w-lg w-full"
    >
      <label
        htmlFor="name"
        className="text-xs font-bold text-neutral-600 mt-3 mb-0.5"
      >
        Name of Receiver
      </label>
      <input
        placeholder="John Doe"
        value={name}
        name="name"
        className="border border-neutral-300 rounded-md p-2 px-4 w-full focus:border-blue-500 shadow-sm placeholder:text-neutral-400"
        onChange={(e) => setName(e.target.value)}
      />
      <label className="text-xs font-bold text-neutral-600 mt-2 mb-0.5">
        Phone Number
      </label>
      <PhoneField
        label="Phone Number"
        onFocus={() => setIsFocused1(true)}
        onBlur={() => setIsFocused1(false)}
        onChange={(value) => setPhone1(value)}
      />
      {!isValid1 && !isFocused1! && phone1 != "+251 " ? (
        <p className="text-red-600 text-sm mb-2 mt-1">
          Phone Number is not valid.
        </p>
      ) : null}
      <label className="text-xs font-bold text-neutral-600 mt-2 mb-0.5">
        Phone Number 2(Optional)
      </label>
      <PhoneField
        label="Phone Number 2"
        onFocus={() => setIsFocused2(true)}
        onBlur={() => setIsFocused2(false)}
        onChange={(value) => setPhone2(value)}
      />

      <div className="flex justify-between w-full text-xl mt-3">
        <div className="font-medium">Account Number</div>
        <div>{accounts[tab]}</div>
      </div>

      <div className="flex justify-between w-full text-lg my-1">
        <div className="font-medium text-xl">Total:</div>
        <div>{convertCurrency(total, currencyMultiplier, currency)}</div>
      </div>

      <input
        type="file"
        name="image"
        id="image"
        onChange={handleFileChange}
        accept="image/png, image/jpeg"
        className="hidden"
        ref={imageInput}
      />

      <div
        className={`${
          image ? "bg-primary" : "bg-neutral-200"
        } rounded-lg p-2 shadow-lg aspect-square w-64 mx-auto mt-3`}
        role="button"
        onClick={() => imageInput.current?.click()}
      >
        <div className="bg-white h-full w-full flex items-center justify-center flex-col rounded-lg overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              loading="lazy"
              alt=""
              width={250}
              height={250}
              className="object-contain w-full h-full"
            />
          ) : (
            <>
              <IoCloudUploadOutline size={52} className="text-neutral-500" />
              <p className="font-medium text-neutral-700 mx-4 text-center mt-3">
                {"Upload a screenshot after you've done your payment."}
              </p>
            </>
          )}
        </div>
      </div>
      <Btn
        label="Next"
        type="submit"
        className="mt-6"
        isLoading={isLoading}
        disabled={!isValid1 || !name || !image}
      />
    </form>
  );
};

const IntlTab = () => {
  const { user } = useApp();
  const [name, setName] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [isFocused1, setIsFocused1] = useState(false);
  const [isFocused2, setIsFocused2] = useState(false);
  const isValid1 = isPhoneValid(phone1);
  const isValid2 = isPhoneValid(phone2);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymenMethod] = useState<"chapa" | "stripe">(
    "stripe",
  );

  // TODO: add loading to btn
  const { basketCart } = useApp();

  const onSubmit: FormEventHandler = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);
    const token = await user.getIdToken(true);
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          basketCart,
          name,
          phone1,
          phone2,
          paymentMethod,
        }),
      });
      const { url } = await res.json();
      setIsLoading(false);
      if (res.ok) window.location = url;
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <form
      action=""
      onSubmit={onSubmit}
      className="py-3 flex flex-col max-w-lg w-full"
    >
      <label
        htmlFor="name"
        className="text-xs font-bold text-neutral-600 mt-4 mb-0.5"
      >
        Name of Receiver
      </label>
      <input
        placeholder="John Doe"
        value={name}
        name="name"
        className="border border-neutral-300 rounded-md p-2 px-4 w-full focus:border-blue-500 shadow-sm placeholder:text-neutral-400"
        onChange={(e) => setName(e.target.value)}
      />
      <label className="text-xs font-bold text-neutral-600 mt-4 mb-0.5">
        Phone Number
      </label>
      <PhoneField
        label="Phone Number"
        onFocus={() => setIsFocused1(true)}
        onBlur={() => setIsFocused1(false)}
        onChange={(value) => setPhone1(value)}
      />
      <p className="text-red-600 text-sm mb-2 mt-1">
        {!isValid1 && !isFocused1! && phone1 != "+251 "
          ? "Phone Number is not valid."
          : null}
      </p>
      <label className="text-xs font-bold text-neutral-600 mt-4 mb-0.5">
        Phone Number 2(Optional)
      </label>
      <PhoneField
        label="Phone Number 2"
        onFocus={() => setIsFocused2(true)}
        onBlur={() => setIsFocused2(false)}
        onChange={(value) => setPhone2(value)}
      />
      {/* <div className="flex gap-3 justify-evenly mt-4 "> */}
      {/*   <button */}
      {/*     type="button" */}
      {/*     className={`flex flex-col items-center flex-1 gap-2 p-3 text-gray-800 ${ */}
      {/*       paymentMethod === "stripe" */}
      {/*         ? "border-gray-900 shadow-lg bg-emerald-50" */}
      {/*         : "border-gray-300 shadow" */}
      {/*     } rounded border`} */}
      {/*     onClick={() => setPaymenMethod("stripe")} */}
      {/*   > */}
      {/*     <CiDollar size={32} /> */}
      {/*     <p className="text-sm font-medium">International</p> */}
      {/*   </button> */}
      {/*   <button */}
      {/*     type="button" */}
      {/*     className={`flex flex-col items-center flex-1 gap-2 p-3 text-gray-800 ${ */}
      {/*       paymentMethod === "chapa" */}
      {/*         ? "border-gray-900 shadow-lg bg-emerald-50" */}
      {/*         : "border-gray-300 shadow" */}
      {/*     } rounded border`} */}
      {/*     onClick={() => setPaymenMethod("chapa")} */}
      {/*   > */}
      {/*     <IoStorefrontOutline size={32} /> */}
      {/*     <p className="text-sm font-medium">Local</p> */}
      {/*   </button> */}
      {/* </div> */}
      <Btn
        label="Next"
        type="submit"
        className="mt-6"
        isLoading={isLoading}
        disabled={!isValid1 || !name}
      />
    </form>
  );
};
