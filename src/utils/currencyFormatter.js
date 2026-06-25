/**
 * Format amount in Nepali Rupees (NPR) format
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted amount in Nepali Rupees
 */
export const formatNepaliRupees = (amount, showSymbol = true) => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  // Format with Indian numbering system (1,00,000 format)
  const formatted = amount.toLocaleString('en-IN');
  
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Convert USD amount to Nepali Rupees (approximate conversion)
 * @param {number} usdAmount - Amount in USD
 * @returns {number} Amount in Nepali Rupees
 */
export const usdToNepaliRupees = (usdAmount) => {
  // Approximate conversion rate (1 USD ≈ 130 NPR)
  const conversionRate = 130;
  return usdAmount * conversionRate;
};

/**
 * Format amount with proper currency symbol based on locale
 * @param {number} amount - The amount to format
 * @param {string} currency - Currency code (default: 'NPR')
 * @returns {string} Formatted amount
 */
export const formatCurrency = (amount, currency = 'NPR') => {
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  
  if (currency === 'NPR') {
    return formatNepaliRupees(amount);
  }
  
  // For other currencies, use standard formatting
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}; 