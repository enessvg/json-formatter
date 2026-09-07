import {
  defineSetting,
  PreferenceManager,
  type InferSchema,
} from '../PreferenceManager'

type ThemeOverride = 'system' | 'force_dark' | 'force_light'

export const DEFAULT_FONT_SIZE = 13
export const MIN_FONT_SIZE = 8
export const MAX_FONT_SIZE = 48

// Helper to define options with strong typing for objects/enums
export const UserPreferences = {
  themeOverride: defineSetting<ThemeOverride>('system', (value) => {
    switch (value) {
      case 'system':
      case 'force_dark':
      case 'force_light':
        return true
    }
    return false
  }),
  fontSize: defineSetting<number>(DEFAULT_FONT_SIZE, (value) => {
    return (
      typeof value === 'number' &&
      Number.isInteger(value) &&
      value >= MIN_FONT_SIZE &&
      value <= MAX_FONT_SIZE
    )
  }),
}

export type UserPreferences = InferSchema<typeof UserPreferences>

export const preferenceKeys = Object.keys(UserPreferences)

export const prefStore = new PreferenceManager(UserPreferences, 'user_prefs_v3')
