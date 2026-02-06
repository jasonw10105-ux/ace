
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  suggestions: string[]
  score?: number
}

const DISPOSABLE_DOMAINS = [
  '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 'mailinator.com',
  'throwaway.email', 'temp-mail.org', 'getnada.com', 'maildrop.cc'
];

export function validateEmail(email: string): ValidationResult & { normalizedEmail: string } {
  const errors: string[] = []
  const suggestions: string[] = []
  const normalizedEmail = email.trim().toLowerCase()
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

  if (!normalizedEmail) {
    errors.push('Email is required')
  } else if (!emailRegex.test(normalizedEmail)) {
    errors.push('Please enter a valid email address')
    suggestions.push('Check for typos')
  } else {
    const [localPart, domain] = normalizedEmail.split('@')
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      errors.push('Disposable email addresses are not allowed')
    }
    if (normalizedEmail.includes('..')) {
      errors.push('Email cannot contain consecutive dots')
    }
  }

  return { isValid: errors.length === 0, errors, suggestions, normalizedEmail }
}

export function validatePassword(password: string): ValidationResult {
  const errors: string[] = []
  const suggestions: string[] = []
  let score = 0

  if (password.length < 8) errors.push('Password must be at least 8 characters long')
  else score += 20

  if (!/[A-Z]/.test(password)) {
    errors.push('Include at least one uppercase letter')
    suggestions.push('Add uppercase letters')
  } else score += 15

  if (!/[0-9]/.test(password)) {
    errors.push('Include at least one number')
    suggestions.push('Add numbers')
  } else score += 15

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Include a special character')
    suggestions.push('Add special characters (!@#$%^&*)')
  } else score += 15

  const uniqueChars = new Set(password).size
  if (uniqueChars >= 8) score += 20
  if (password.length >= 12) score += 15

  return { isValid: errors.length === 0, score: Math.min(score, 100), errors, suggestions }
}
