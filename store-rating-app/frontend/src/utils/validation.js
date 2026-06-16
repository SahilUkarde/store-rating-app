export const validateName = (v) => {
  if (!v) return 'Name is required';
  if (v.length < 20) return 'Name must be at least 20 characters';
  if (v.length > 60) return 'Name must be at most 60 characters';
  return '';
};

export const validateEmail = (v) => {
  if (!v) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Invalid email address';
  return '';
};

export const validateAddress = (v) => {
  if (!v) return 'Address is required';
  if (v.length > 400) return 'Address must be at most 400 characters';
  return '';
};

export const validatePassword = (v) => {
  if (!v) return 'Password is required';
  if (v.length < 8 || v.length > 16) return 'Password must be 8-16 characters';
  if (!/[A-Z]/.test(v)) return 'Password must contain at least one uppercase letter';
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(v)) return 'Password must contain at least one special character';
  return '';
};
