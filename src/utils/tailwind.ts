// Импорт конфигурации Tailwind
// @ts-ignore - импорт JS конфигурационного файла
import tailwindConfigModule from '../../tailwind.config.js'

const tailwindConfig = tailwindConfigModule?.default || tailwindConfigModule

// Программная генерация базовых стилей из конфигурации Tailwind
export function generateTailwindStyles(): string {
  const config = tailwindConfig as any
  
  // Генерация базовых стилей
  let styles = `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      background-color: ${config.theme?.extend?.colors?.dark?.[900] || '#2D282A'};
      color: ${config.theme?.extend?.colors?.dark?.[50] || 'currentColor'};
    }
    
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `
  
  // Добавляем кастомные утилиты из конфигурации
  if (config.theme?.extend?.backgroundImage) {
    Object.entries(config.theme.extend.backgroundImage).forEach(([key, value]) => {
      styles += `.bg-${key} { background-image: ${value}; }\n`
    })
  }
  
  // Генерация кастомных цветов из конфигурации
  if (config.theme?.extend?.colors) {
    const colors = config.theme.extend.colors
    
    // Генерация CSS переменных для кастомных цветов
    let cssVariables = ':root {\n'
    
    if (colors.primary) {
      Object.entries(colors.primary).forEach(([key, value]) => {
        cssVariables += `  --color-primary-${key}: ${value};\n`
      })
    }
    
    if (colors.dark) {
      Object.entries(colors.dark).forEach(([key, value]) => {
        cssVariables += `  --color-dark-${key}: ${value};\n`
      })
    }
    
    cssVariables += '}\n'
    styles = cssVariables + styles
  }
  
  return styles
}

// Инъекция стилей в документ
export function injectTailwindStyles(): void {
  const styleId = 'tailwind-injected-styles'
  
  // Удаляем старый стиль, если существует
  const existingStyle = document.getElementById(styleId)
  if (existingStyle) {
    existingStyle.remove()
  }
  
  // Создаем новый элемент стиля
  const style = document.createElement('style')
  style.id = styleId
  style.textContent = generateTailwindStyles()
  document.head.appendChild(style)
}

// Экспорт конфигурации для использования в компонентах
export { tailwindConfig }
export default tailwindConfig
