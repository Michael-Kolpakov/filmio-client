export const ERROR_MESSAGES = {
  LOGIN: {
    USERNAME: {
      REQUIRED: "Please enter your username",
      INVALID_FORMAT: "Username must be a valid email",
    },
    PASSWORD: {
      REQUIRED: "Please enter your password",
      INVALID_FORMAT: "Password can only contain numbers and latin letters",
    },
    INVALID_LOGIN_ATTEMPT: "Ensure all fields are filled correctly and try again",
  },

  FILM: {
    TITLE: {
      REQUIRED: "Please enter a title",
    },
    GENRE: {
      REQUIRED: "Please enter a genre",
      INVALID_FORMAT: "Can only contain latin letters, spaces and the '|' character",
    },
    DIRECTOR: {
      REQUIRED: "Please enter a director",
      INVALID_FORMAT: "Can only contain latin letters and apostrophes",
    },
    RELEASE_DATE: {
      REQUIRED: "Please enter a release date",
      INVALID_FORMAT: "Release date cannot be in the future",
    },
    RATING: {
      INVALID_FORMAT: "Rating must be an integer between 1 and 5",
    },
    WRONG_FORM_VALIDATION: "Please fill in all the required fields and check validation correctness!",
    SAVING_ERROR: "An error occurred during adding/editing the film! Please try again later",
  },

  CONFIRMATION: {
    OPERATION_FAILED: "An error occurred while performing the operation",
  },
};
