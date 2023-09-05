import Btn from "@/components/Btn";
import Navbar from "@/components/Navbar";
import { createContact } from "@/services/database";
import { useEffect, useState } from "react";
import { FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

const Page = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();

    createContact({
      name,
      email,
      message,
    }).then(() => router.push("/"));
  };

  return (
    <>
      <Head>
        <title>{"Contact Us - Debolmarket"}</title>
      </Head>
      <Navbar />
      <div className="flex justify-center">
        <div className="flex md:flex-row flex-col justify-between items-start gap-14 px-5 sm:px-10 py-5 sm:pt-8">
          <div className="max-w-lg w-full">
            <h1 className="text-4xl font-semibold mb-5">Contact Us</h1>
            <p>
              We are thrilled to assist you with any questions, concerns, or
              feedback you may have. Our dedicated customer support team is
              available to provide exceptional service and ensure your shopping
              experience is seamless. Whether you need help with product
              information, order inquiries, or assistance, we are here to help.
              Please feel free to reach out to us through our contact form. We
              strive to respond promptly and provide you with the assistance you
              need. Your satisfaction is our top priority, and we look forward
              to serving you!
            </p>
          </div>
          <div className="max-w-xl min-w-[320px]">
            <h1 className="text-3xl font-semibold mb-4">Send Message</h1>
            <form onSubmit={submit}>
              <div className="flex flex-col">
                <label className="block mb-1">Name</label>
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 mb-2"
                />
              </div>
              <div className="flex flex-col ">
                <label className="block mb-1">Email</label>
                <input
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 mb-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="block mb-2">message</label>
                <textarea
                  name="message"
                  value={message}
                  rows={8}
                  cols={50}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                ></textarea>
              </div>
              <div className="flex justify-end">
                <Btn
                  label="Submit"
                  type="submit"
                  className="mt-6"
                  disabled={!name || !email || !message}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
