/*
 * JajooLab form links
 * -------------------
 * Add your Google Form URLs here.
 *
 * You only need to edit the values inside FORM_LINKS.
 * Leave a value as "#" until that form is ready.
 */
const FORM_LINKS = {
  oneQuestion: {
    signup: "https://forms.gle/5dsAhGRFthyMapPcA",
    feedback: "https://docs.google.com/forms/d/e/1FAIpQLSdID1R-Re6HAy24xDL1bZ5ErXdLW4gqKSCAq6KAMD07Rc6Ing/viewform?usp=dialog"
  },
  pauseChallenge: {
    signup: "https://docs.google.com/forms/d/e/1FAIpQLSe4kFX1KjuJcy-OvBDvL67V0ea1jE2htK5FAkOvYPXPEQstmg/viewform?usp=dialog",
    feedback: "https://docs.google.com/forms/d/e/1FAIpQLScy_cEHhVqol4yzHYtcEcmwrWNRqf6nSz0K9qVEi0qP9uGY0A/viewform?usp=dialog"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-form-link]").forEach((element) => {
    const key = element.getAttribute("data-form-link");
    const parts = key.split(".");
    let value = FORM_LINKS;

    for (const part of parts) {
      value = value?.[part];
    }

    if (value && value !== "#") {
      element.href = value;
      element.removeAttribute("aria-disabled");
      element.classList.remove("is-disabled");
    } else {
      element.href = "#";
      element.setAttribute("aria-disabled", "true");
      element.classList.add("is-disabled");
      element.addEventListener("click", (event) => event.preventDefault());
    }
  });
});
