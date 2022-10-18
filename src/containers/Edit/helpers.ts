/**
 * Check string validity and add / remove error classes
 * @param {Event} e - The string to check
 */
export const isTextValid = (e) => {
  if (
    !e.target.value ||
    e.target.value === "" ||
    e.target.value.replace(/\s/g, "") === ""
  ) {
    e.target.classList.add("is-invalid");
  } else if (e.target.classList.contains("is-invalid")) {
    e.target.classList.remove("is-invalid");
  }
};
