if (window.history.scrollRestoration) {
  window.history.scrollRestoration =
    import.meta.env.MODE === "development" ? "auto" : "manual";
}
