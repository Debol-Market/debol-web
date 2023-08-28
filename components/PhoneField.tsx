import { CountryIso2, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type props = {
  value?: string;
  label: string;
  onChange?: (phone: string, country: CountryIso2) => void;
};

const PhoneField = ({ value, onChange, label }: props) => {
  return (
    <PhoneInput
      className="phone-input"
      defaultCountry="us"
      {...{ value, onChange, placeholder: label }}
    />
  );
};

export default PhoneField;
