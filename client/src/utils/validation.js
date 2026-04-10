export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());

export const getPasswordStrength = (password = "") => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-red-500", percent: 20 };
  if (score <= 2) return { label: "Fair", color: "bg-orange-500", percent: 40 };
  if (score <= 3) return { label: "Good", color: "bg-yellow-500", percent: 65 };
  if (score === 4) return { label: "Strong", color: "bg-emerald-500", percent: 85 };
  return { label: "Very Strong", color: "bg-emerald-400", percent: 100 };
};
