# JajooLab

Static website for the JajooLab initiative.

The site is intentionally kept as a lightweight static HTML/CSS/JS website. Activity information is presented on JajooLab pages, while signup and feedback can continue to use Google Forms.

## Run locally

From this directory:

    python3 -m http.server 8000

Then open:

    http://localhost:8000

## Deploy

The site can be deployed as a static site through Cloudflare Pages / Workers & Pages using this repository.

No server-side application is required for the website itself.

---



# Sharing

The home page, activities page, and individual activity pages include a reusable
share button.

The sharing logic is in:

    assets/js/main.js

When the browser supports the Web Share API, the button opens the device's
native sharing sheet. On browsers without Web Share API support, it opens a
WhatsApp share link containing the page URL and the configured message.

No configuration is required. Activity pages use their current URL automatically,
so the same function can be reused for future activities:

    shareActivity("Activity title", "Message to share")

# Google Form links

The website now has a small reusable form-link configuration.

**You only need to edit one file:**

    assets/js/forms.js

At the top of that file you will find:

    const FORM_LINKS = {
      oneQuestion: {
        signup: "...",
        feedback: "#"
      },
      pauseChallenge: {
        signup: "#",
        feedback: "#"
      },
      bodyWeatherCheck: {
        signup: "#",
        feedback: "#"
      }
    };

This is the exact place where you add or update Google Form links for every activity.

Replace each `#` with the corresponding Google Form URL.

Example:

    bodyWeatherCheck: {
      signup: "https://forms.gle/your-signup-form",
      feedback: "https://forms.gle/your-feedback-form"
    }

You do not need to edit the activity HTML pages when changing the URLs, because the activity pages already refer to the matching key name like `data-form-link="bodyWeatherCheck.signup"`.

### Current One Question signup

The existing One Question signup form is already configured:

    https://forms.gle/5dsAhGRFthyMapPcA

When the One Question feedback form is ready, replace:

    oneQuestion.feedback: "#"

with its Google Forms link.

### Pause Challenge

Add the signup and feedback Google Form links when they are ready:

    pauseChallenge: {
      signup: "YOUR_PAUSE_SIGNUP_FORM_URL",
      feedback: "YOUR_PAUSE_FEEDBACK_FORM_URL"
    }

### Body Weather Check

Add the form links in the same place:

    bodyWeatherCheck: {
      signup: "YOUR_BODY_WEATHER_SIGNUP_FORM_URL",
      feedback: "YOUR_BODY_WEATHER_FEEDBACK_FORM_URL"
    }

You do not need to edit the activity HTML pages when adding or changing these links.

---

# Google Form confirmation messages

The website cannot change the Google Forms confirmation screen after a submission.

For each Google Form, set its own confirmation message in Google Forms.

Recommended approach:

### One Question — Signup confirmation

Use the Google Form's confirmation message to tell the parent:

- they are registered for One Question;
- invite the child to ask one non-academic question each day, whenever it naturally fits;
- answer honestly and openly;
- there is no need to force the conversation;
- feedback will be requested after they have tried it.

This keeps the actual activity instructions immediately available after signup.

### One Question — Feedback confirmation

A simple confirmation is sufficient, for example:

    Thank you! 😊

    Your observations are valuable.
    Thank you for taking the time to share what happened.

    Let's learn from each other.

### Pause Challenge — Signup confirmation

Use the confirmation screen to provide the actual activity instruction:

    Homework → Pause → One Breath → Begin.

    Before starting homework, take a brief pause,
    take one deep breath, and begin homework as usual.

### Pause Challenge — Feedback confirmation

Keep this short and observation-focused, for example:

    Thank you for sharing your experience. 😊

    Your observations help us understand what happens
    when a small practice is tried in everyday family life.

    Let's learn from each other.

These messages should remain factual and should not promise a psychological, academic, behavioural, or relationship benefit that has not been demonstrated.

---

# How the website flow works

The current design keeps the existing JajooLab visual style while making the activity participation journey clearer:

    JajooLab
       ↓
    Activity page
       ↓
    Register
       ↓
    Google Form
       ↓
    Google Form confirmation
       ↓
    Try the activity
       ↓
    Feedback form
       ↓
    Feedback confirmation

The activity pages explain the activity before registration, so parents can understand what they are being invited to try.

The Google Forms are used for collecting responses rather than for presenting the main activity experience.

---

# Feedback forms

The feedback forms may contain more questions than the signup forms.

For example, the current One Question feedback draft contains eight questions covering:

- whether the activity was tried;
- what the parent noticed;
- how the interaction felt;
- what kinds of questions the child asked;
- anything unexpected from the child;
- anything surprising about the parent's own response;
- what could be changed about the activity;
- anything else the parent wants to share.

The website therefore presents feedback as a separate step rather than putting a large form directly on the activity page.

If the feedback form becomes substantially longer in the future, it can still remain a Google Form without requiring changes to the website design.

---

# Important: Google Form URLs vs custom website forms

The current implementation deliberately uses Google Forms for data collection.

This means:

- no database is required;
- no Google Apps Script is required;
- no backend server is required;
- responses can continue to be stored in Google Sheets;
- the website remains simple to deploy on Cloudflare Pages.

If a future version needs a fully custom multi-step form, the same activity pages can later be connected to a custom frontend and Google Apps Script. That is not required for the current version.

---

# Adding another activity

For a new activity:

1. Create its activity page under `activities/`.
2. Add the activity card to `activities/index.html` and, if appropriate, the home page.
3. Add a new entry to `FORM_LINKS` in `assets/js/forms.js`.
4. Add signup and feedback buttons using the existing `data-form-link` pattern.
5. Configure the confirmation messages inside the corresponding Google Forms.

Example:

    newActivity: {
      signup: "YOUR_SIGNUP_FORM_URL",
      feedback: "YOUR_FEEDBACK_FORM_URL"
    }

The same visual form/participation panel can then be reused.

---

# Privacy

If collecting parent or child information through Google Forms, configure the form description and privacy wording according to the information you actually collect and how you intend to use it.

Do not collect unnecessary personal information.

For the current experiments, keep the questions focused on participation and experience rather than collecting information that is not needed for the learning question.

---

# Project principles reflected in the website

The website intentionally avoids presenting unvalidated benefits as facts.

The initiative focuses on:

- observing what actually happens;
- separating participation from registration;
- keeping activities lightweight;
- capturing parent experience as well as child behaviour;
- learning from neutral, negative, incomplete, and unexpected experiences;
- using naturally occurring family situations where possible;
- learning together rather than promising a particular outcome.

