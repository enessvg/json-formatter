import {
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  prefStore,
} from '../lib/preferences/preferences'

const radioButtons = [
  ...document.querySelectorAll('input[name="theme"]'),
] as HTMLInputElement[]

const getRadioButton = (value: string): HTMLInputElement => {
  const el = radioButtons.find((input) => input.value === value)
  if (!el) throw new Error(`Could not find radio button with value "${value}".`)
  return el
}

const fontSizeInput = document.querySelector<HTMLInputElement>('#fontSize')
const fontSizeValue =
  document.querySelector<HTMLOutputElement>('#fontSizeValue')

if (!fontSizeInput || !fontSizeValue)
  throw new Error('Could not find font size controls.')

fontSizeInput.min = String(MIN_FONT_SIZE)
fontSizeInput.max = String(MAX_FONT_SIZE)
fontSizeInput.step = '1'

const updateFontSizeUi = (fontSize: number) => {
  fontSizeInput.value = String(fontSize)
  fontSizeValue.value = `${fontSize} px`
}

prefStore.get().then((prefs) => {
  getRadioButton((prefs.themeOverride as string) || 'system').checked = true
  updateFontSizeUi(prefs.fontSize)
})

// update storage when UI changes
{
  radioButtons.forEach((input) => {
    input.addEventListener('change', () => {
      // console.log('updating from input', input, input.value)
      const { value } = input
      switch (value) {
        case 'system':
        case 'force_light':
        case 'force_dark':
          prefStore.set({ themeOverride: value })
          break

        default:
          throw new Error(`Unexpected value "${input.value}"`)
      }
    })
  })

  fontSizeInput.addEventListener('input', () => {
    fontSizeValue.value = `${fontSizeInput.value} px`
  })

  fontSizeInput.addEventListener('change', () => {
    prefStore.set({ fontSize: Number(fontSizeInput.value) })
  })
}

// update UI when storage changes
prefStore.onChange(({ newValue }) => {
  if (newValue?.themeOverride) {
    const radioButton = getRadioButton(newValue.themeOverride)
    radioButton.checked = true
  }
  if (newValue?.fontSize) updateFontSizeUi(newValue.fontSize)
})
