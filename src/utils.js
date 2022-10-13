import { PropTypes } from "prop-types";

/**
 * Capitalize the first letter of a string
 * @param {string} string - The string to capitalize
 * @returns {string} The capitalized string
 */
export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/**
 * Slugify a string
 * @param {string} text - The text to slugify
 * @returns {string} The slugified text
 */
export const slugify = (text) => {
  return text && text.toString().toLowerCase().replace(/\s+/g, "-");
};

export const formikPartialPropTypes = {
  values: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
};

export const fieldPropTypes = {
  field: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    defaultValue: PropTypes.string,
    required: PropTypes.bool,
    option: PropTypes.string,
  }).isRequired,
};