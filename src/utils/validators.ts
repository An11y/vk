export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  
  return cleaned.length >= 10 && cleaned.length <= 11;
};

export const hasMinLength = (text: string, minLength: number): boolean => {
  return text.length >= minLength;
};

export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

export const hasItems = <T>(array: T[]): boolean => {
  return Array.isArray(array) && array.length > 0;
};