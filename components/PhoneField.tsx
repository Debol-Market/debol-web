import { CountryIso2, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type props = {
  value?: string;
  label: string;
  onChange?: (phone: string, country: CountryIso2) => void;
};

const PhoneField = ({ value, onChange, label }: props) => {
  return (
    <div>
      <PhoneInput
        style={{ padding: 10, width: "100%" }}
        defaultCountry="us"
        {...{ value, onChange, placeholder: label }}
      />
    </div>
  );
};

export default PhoneField;
