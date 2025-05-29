export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    const countryCode = cleaned[0];
    const areaCode = cleaned.substring(1, 4);
    const firstPart = cleaned.substring(4, 7);
    const secondPart = cleaned.substring(7, 9);
    const thirdPart = cleaned.substring(9, 11);
    
    return `+${countryCode} (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
  } else if (cleaned.length === 10) {
    const areaCode = cleaned.substring(0, 3);
    const firstPart = cleaned.substring(3, 6);
    const secondPart = cleaned.substring(6, 8);
    const thirdPart = cleaned.substring(8, 10);
    
    return `+7 (${areaCode}) ${firstPart}-${secondPart}-${thirdPart}`;
  }
  
  return phone;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};