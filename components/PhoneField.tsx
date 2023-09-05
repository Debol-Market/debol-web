import { CountryIso2, PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

type props = {
  label: string;
  value?: string;
  country?: string;
  onChange?: (phone: string, country: CountryIso2) => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

const PhoneField = ({ value, onChange, country, label, ...rest }: props) => {
  return (
    <PhoneInput
      className="phone-input"
      defaultCountry={country ?? "et"}
      inputProps={rest}
      {...{ value, onChange, placeholder: label }}
    />
  );
};

export default PhoneField;
