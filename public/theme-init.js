(function () {
  try {
    var theme = localStorage.getItem("keystone-theme");
    if (theme === "light" || theme === "dark" || theme === "system") {
      document.documentElement.setAttribute("data-theme", theme);
      return;
    }
  } catch (error) {
    // Ignore storage failures.
  }

  document.documentElement.setAttribute("data-theme", "system");
})();
