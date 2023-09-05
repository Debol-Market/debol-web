import Btn from "@/components/Btn";
import Navbar from "@/components/Navbar";
import { createContact } from "@/services/database";
import { Contacts } from "@/utils/types";
import { useEffect, useState } from "react";

const Contacts = () => {
  const [contact, setcontact] = useState<Contacts>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!contact) return;
    createContact(contact);
  }, [contact]);

  const submit = () => {
    setcontact({ name: name, email: email, message: message });
    console.log(contact);
  }

  return (<div>
    <Navbar />
    <div className="flex flex-wrap justify-start gap-x-40 p-10">
      <div className="max-w-xl">
        <div>
          <h1 className="text-4xl font-semibold my-5">Contact Us</h1>
        </div>
        <p>We are thrilled to assist you with any questions, concerns, or feedback you may have.
          Our dedicated customer support team is available to provide exceptional service and ensure your
          shopping experience is seamless. Whether you need help with product information, order inquiries,
          or assistance, we are here to help. Please feel free to reach out to us
          through our contact form. We strive to respond promptly and provide you with the assistance you need.
          Your satisfaction is our top priority,
          and we look forward to serving you!</p>
      </div>
      <div className="max-w-xl">
        <h1 className="text-3xl font-semibold">Send Message</h1>
        <form onSubmit={() => { submit }}>
          <div className="flex flex-col">
            <label className="block mb-2">Name</label>
            <input
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
          </div>
          <div className="flex flex-col ">
            <label className="block mb-2">Email</label>
            <input
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2" />
          </div>
          <div className="flex flex-col">
            <label className="block mb-2">message</label>
            <textarea
              name="message"
              value={message}
              rows={8}
              cols={50}
              onChange={e => setMessage(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <Btn
              label="Submit"
              type="submit"
              className="mt-6"
              disabled={!name || !email || !message} />
          </div>
        </form>
      </div>
    </div>

  </div>);
}

export default Contacts;