export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return emailRegex.test(email)
}
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z ,.'-]+$/
  const validLenght = name.length < 3 || name.length > 20

  return validLenght && nameRegex.test(name)
}

export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
  return passwordRegex.test(password)
}

export const validatePasswordComplexity = (password: string): string | null => {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.'
  }
  if (!/[a-zA-Z]/.test(password)) {
    return 'The password must contain at least one letter.'
  }
  if (!/\d/.test(password)) {
    return 'The password must contain at least one number.'
  }
  return null
}
