document.addEventListener("DOMContentLoaded", function () {
  const statusWidget = document.getElementById("bakery-status-widget");

  // Only run this if the status widget is on the page
  if (!statusWidget) return;

  const statusDot = document.getElementById("status-dot");
  const statusHeadline = document.getElementById("status-headline");
  const statusSubtext = document.getElementById("status-subtext");

  // Bakery operating hours configuration:
  // Sunday (0), Monday (1), Tuesday (2), Wednesday (3), Thursday (4), Friday (5), Saturday (6)
  // Hours represented in fractional 24-hr time (e.g. 6.5 = 6:30 AM, 15 = 3:00 PM)
  const schedule = {
    0: { open: 7.0, close: 14.0, name: "Sunday", bakeStart: 4.5 },
    1: { open: null, close: null, name: "Monday", bakeStart: null }, // Closed Mondays
    2: { open: 6.5, close: 15.0, name: "Tuesday", bakeStart: 4.0 },
    3: { open: 6.5, close: 15.0, name: "Wednesday", bakeStart: 4.0 },
    4: { open: 6.5, close: 15.0, name: "Thursday", bakeStart: 4.0 },
    5: { open: 6.5, close: 15.0, name: "Friday", bakeStart: 4.0 },
    6: { open: 7.0, close: 14.0, name: "Saturday", bakeStart: 4.5 }
  };

  function updateBakeryStatus() {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + (minutes / 60);

    const todayConfig = schedule[day];

    
    statusDot.className = "status-indicator";

    // Scenario A: Closed all day (Monday)
    if (todayConfig.open === null) {
      statusDot.classList.add("dot-closed");
      statusHeadline.textContent = "Closed Today (Hearth Maintenance)";
      statusSubtext.textContent = "Our ovens rest on Mondays to feed the starters. We reopen Tuesday at 6:30 AM.";
      return;
    }

    // Scenario B: Doors are currently Open
    if (currentTime >= todayConfig.open && currentTime < todayConfig.close) {
      statusDot.classList.add("dot-open");
      statusHeadline.textContent = "Storefront Open Now";
      
      const closingHour = Math.floor(todayConfig.close);
      const formattedClose = closingHour > 12 ? `${closingHour - 12}:00 PM` : `${closingHour}:00 AM`;
      statusSubtext.textContent = `Fresh bread and pastries are on the shelves until ${formattedClose} today.`;
    } 
    // Scenario C: Early morning pre-bake window (kitchen working, doors not yet open)
    else if (currentTime >= todayConfig.bakeStart && currentTime < todayConfig.open) {
      statusDot.classList.add("dot-baking");
      statusHeadline.textContent = "Baking in Progress";
      
      const openHour = Math.floor(todayConfig.open);
      const openMin = (todayConfig.open % 1) * 60;
      const formattedOpen = `${openHour}:${openMin === 0 ? "00" : openMin} AM`;
      statusSubtext.textContent = `The hearth is hot and the first loaves are proofing! Doors open at ${formattedOpen}.`;
    } 
    // Scenario D: Closed for the day
    else {
      statusDot.classList.add("dot-closed");
      statusHeadline.textContent = "Currently Closed";
      
      if (currentTime >= todayConfig.close) {
        statusSubtext.textContent = "We are sold out for today. Stop by tomorrow morning for fresh loaves!";
      } else {
        statusSubtext.textContent = "Our bakers arrive before dawn. Check back early for fresh bakes.";
      }
    }
  }

  // Initial status check
  updateBakeryStatus();

  // Refresh status every 60 seconds so the badge updates live without reloading
  setInterval(updateBakeryStatus, 60000);
});
