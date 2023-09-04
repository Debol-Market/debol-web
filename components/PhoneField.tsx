import { CountryIso2, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type props = {
  value?: string;
  label: string;
  onChange?: (phone: string, country: CountryIso2) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const PhoneField = ({ value, onChange, label, ...rest }: props) => {
  return (
    <PhoneInput
      className="phone-input"
      defaultCountry="et"
      inputProps={rest}
      {...{ value, onChange, placeholder: label }}
    />
  );
};

export default PhoneField;
