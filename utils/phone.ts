import parsePhoneNumberFromString, { PhoneNumber } from "libphonenumber-js";

export const isPhoneValid = (phone: string): Boolean => {
  try {
    const parsedNumber = parsePhoneNumberFromString(phone);
    return parsedNumber?.isValid() ?? false;
  } catch (error) {
    return false;
  }
};
