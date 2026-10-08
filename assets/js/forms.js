/*
 * JajooLab Forms & Google Spreadsheet Integration
 * -----------------------------------------------
 * 1. FORM_LINKS: Google Form URLs for long-form registration & feedback
 * 2. GOOGLE_SHEET_ENDPOINT: Direct Google Apps Script Web App URL to append
 *    daily quick reflections directly into your Google Spreadsheet!
 */

const FORM_LINKS = {
  oneQuestion: {
    signup: "https://forms.gle/5dsAhGRFthyMapPcA",
    feedback: "https://docs.google.com/forms/d/e/1FAIpQLSdID1R-Re6HAy24xDL1bZ5ErXdLW4gqKSCAq6KAMD07Rc6Ing/viewform?usp=dialog"
  },
  pauseChallenge: {
    signup: "https://docs.google.com/forms/d/e/1FAIpQLSe4kFX1KjuJcy-OvBDvL67V0ea1jE2htK5FAkOvYPXPEQstmg/viewform?usp=dialog",
    feedback: "https://docs.google.com/forms/d/e/1FAIpQLScy_cEHhVqol4yzHYtcEcmwrWNRqf6nSz0K9qVEi0qP9uGY0A/viewform?usp=dialog"
  },
  bodyWeatherCheck: {
    signup: "https://docs.google.com/forms/d/e/1FAIpQLSe2fGCh-ofOKwge0K1Szxo10J-Piv9-P-BCbdXBvyA_x7I4lw/viewform?usp=publish-editor",
    feedback: "https://docs.google.com/forms/d/e/1FAIpQLSeft1ASWQaKNLC2XP8VV9CRqtFpGd5buGnrRWVhF5kt8ues_w/viewform?usp=publish-editor"
  },
  friendshipWithSound: {
    signup: "https://docs.google.com/forms/d/e/1FAIpQLSdQzl82B_3AiAmFn3Ev-XlC7tM_GqfTWc_QN5XwOf663AQabA/viewform?usp=dialog",
    feedback: "https://docs.google.com/forms/d/e/1FAIpQLSdV3tNclpnZRWT4WAxZlfUEdNVQBAK9acEP8pEJ_lDJUOTFOQ/viewform?usp=dialog"
  }
};

/*
 * Google Spreadsheet Endpoint
 * ----------------------------
 * Set your deployed Google Apps Script Web App URL here.
 * (Leave as "#" while testing; submissions will still save locally on device).
 */
const GOOGLE_SHEET_ENDPOINT = "#";

function initExternalFormLinks() {
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
}

function initDailyFeedbackForms() {
  document.querySelectorAll(".daily-feedback-form").forEach((form) => {
    const activityName = form.getAttribute("data-activity") || document.title;
    const activityKey = form.getAttribute("data-activity-id") || "general";
    const dateInput = form.querySelector('input[type="date"]');
    const statusBox = form.querySelector(".feedback-status");
    const submitBtn = form.querySelector(".submit-btn");
    const btnText = form.querySelector(".btn-text");
    const btnSpinner = form.querySelector(".btn-spinner");
    const prevLogsContainer = form.querySelector(".previous-logs");
    const prevLogsList = form.querySelector(".previous-logs-list");

    // Pre-fill today's local date
    if (dateInput && !dateInput.value) {
      const today = new Date().toISOString().split("T")[0];
      dateInput.value = today;
    }

    // Render recent logs saved on this device
    function renderLocalLogs() {
      if (!prevLogsContainer || !prevLogsList) return;
      const stored = localStorage.getItem(`jajoolab_logs_${activityKey}`);
      if (!stored) {
        prevLogsContainer.style.display = "none";
        return;
      }
      try {
        const logs = JSON.parse(stored);
        if (!Array.isArray(logs) || logs.length === 0) {
          prevLogsContainer.style.display = "none";
          return;
        }
        prevLogsContainer.style.display = "block";
        prevLogsList.innerHTML = logs
          .slice(-3)
          .reverse()
          .map(
            (log) => `
            <li class="previous-log-entry">
              <div class="previous-log-meta">${escapeHtml(log.date)} ${log.parentName && log.parentName !== "Anonymous" ? "· " + escapeHtml(log.parentName) : ""}</div>
              <div>${escapeHtml(log.observation)}</div>
            </li>`
          )
          .join("");
      } catch (e) {
        console.warn("Could not read local logs:", e);
      }
    }

    renderLocalLogs();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const textarea = form.querySelector("textarea[name='observation']");
      const nameInput = form.querySelector("input[name='parentName']");
      const observation = textarea?.value?.trim();
      const parentName = nameInput?.value?.trim() || "Anonymous";
      const date = dateInput?.value || new Date().toISOString().split("T")[0];

      if (!observation) return;

      // Show saving state
      if (btnText) btnText.style.display = "none";
      if (btnSpinner) btnSpinner.style.display = "inline";
      submitBtn.setAttribute("disabled", "true");
      if (statusBox) statusBox.style.display = "none";

      const payload = {
        timestamp: new Date().toISOString(),
        date: date,
        activity: activityName,
        activityId: activityKey,
        observation: observation,
        parentName: parentName
      };

      let syncedToCloud = false;

      // 1. Submit to Google Spreadsheet Web App if configured
      if (GOOGLE_SHEET_ENDPOINT && GOOGLE_SHEET_ENDPOINT !== "#") {
        try {
          await fetch(GOOGLE_SHEET_ENDPOINT, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          syncedToCloud = true;
        } catch (err) {
          console.warn("Google Sheet sync error:", err);
        }
      }

      // 2. Also forward to local development endpoint
      try {
        const resp = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (resp.ok) syncedToCloud = true;
      } catch (_) {}

      // 3. Always store locally in browser localStorage
      try {
        const stored = localStorage.getItem(`jajoolab_logs_${activityKey}`);
        const list = stored ? JSON.parse(stored) : [];
        list.push({ date, observation, parentName });
        localStorage.setItem(`jajoolab_logs_${activityKey}`, JSON.stringify(list));
      } catch (err) {
        console.warn("LocalStorage save error:", err);
      }

      // Reset form controls
      if (btnText) btnText.style.display = "inline";
      if (btnSpinner) btnSpinner.style.display = "none";
      submitBtn.removeAttribute("disabled");
      textarea.value = "";

      // Show confirmation message
      if (statusBox) {
        statusBox.className = "feedback-status is-success";
        statusBox.style.display = "flex";
        statusBox.innerHTML = `
          <span style="font-size: 1.2rem;">✓</span>
          <div>
            <strong>Thank you! Your observation has been recorded.</strong><br>
            <span style="font-size: 0.88rem; opacity: 0.9;">
              ${syncedToCloud ? "Saved directly to our Google Spreadsheet." : "Saved to your device for this week."}
            </span>
          </div>
        `;
      }

      renderLocalLogs();
    });
  });
}

function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", () => {
  initExternalFormLinks();
  initDailyFeedbackForms();
});
