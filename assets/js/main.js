/**
 * Share the current page/activity using the Web Share API,
 * with a WhatsApp fallback for browsers that do not support it.
 */
function shareActivity(title, text, url) {
  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;
  const shareText =
    text || `Explore this small family activity on JajooLab: "${shareTitle}"`;

  if (navigator.share) {
    navigator
      .share({
        title: shareTitle,
        text: shareText,
        url: shareUrl
      })
      .catch((err) => {
        // Closing the native share sheet is not an error.
        if (err.name !== "AbortError") {
          openWhatsAppFallback(shareText, shareUrl);
        }
      });
  } else {
    openWhatsAppFallback(shareText, shareUrl);
  }
}

function openWhatsAppFallback(text, url) {
  const fullMessage = `${text} ${url}`;
  const whatsappUrl =
    `https://api.whatsapp.com/send?text=${encodeURIComponent(fullMessage)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}


const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    menuButton.setAttribute(
      "aria-expanded",
      navLinks.classList.contains("open") ? "true" : "false"
    );
  });
}
