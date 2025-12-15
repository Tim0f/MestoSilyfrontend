export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const formatTime = (date: string | Date): string => {
  return new Date(date).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const isBirthday = (dateOfBirth: string | Date): boolean => {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  return (
    dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate()
  )
}

export const getWeekDay = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('ru-RU', {
    weekday: 'long',
  })
}

