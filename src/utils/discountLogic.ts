export const discountCodes = [
  { code: 'xinh10', type: 'percent', value: 10 },
  { code: 'freeship30', type: 'fixed', value: 30000 },
  { code: 'giam5', type: 'percent', value: 5 },
];

export const validateDiscountCode = (code: string) => {
  return discountCodes.find((d) => d.code === code.toLowerCase());
};

export const applyDiscount = (total: number, code: string): number => {
  const discount = validateDiscountCode(code);
  if (!discount) return total;

  if (discount.type === 'percent') {
    return total - (total * discount.value) / 100;
  }

  if (discount.type === 'fixed') {
    return Math.max(0, total - discount.value);
  }

  return total;
};