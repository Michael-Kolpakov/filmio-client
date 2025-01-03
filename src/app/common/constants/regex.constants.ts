export const REGEX_CONSTANTS = {
  COMMON: {
    PASSWORD: /^[a-zA-Z0-9]*$/,
  },

  REGISTRATION: {
    FULL_NAME: /^[a-zA-Z\s']*$/,
  },

  FILM: {
    GENRE: /^[a-zA-Z| ]*$/,
    DIRECTOR: /^[a-zA-Z' ]*$/,
    RATING: /^[1-5]$/,
  },
};
