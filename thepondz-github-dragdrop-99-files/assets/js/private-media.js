(() => {
  "use strict";

  const source = document.documentElement.dataset.privateMediaStore;
  if (!source) return;

  let assets = null;
  try {
    if (source === "memory") {
      assets = window.__POND_PRIVATE_MEDIA__ || null;
    } else {
      const serialized = sessionStorage.getItem(source);
      if (serialized) assets = JSON.parse(serialized);
      sessionStorage.removeItem(source);
    }
  } catch (error) {
    assets = null;
  }
  delete document.documentElement.dataset.privateMediaStore;
  try { delete window.__POND_PRIVATE_MEDIA__; } catch (error) {}
  if (!assets) return;

  const objectUrls = new Map();
  const fromBase64 = (value) => {
    const binary = atob(value);
    return Uint8Array.from(binary, character => character.charCodeAt(0));
  };
  const getObjectUrl = (id) => {
    if (objectUrls.has(id)) return objectUrls.get(id);
    const asset = assets[id];
    if (!asset || !asset.mime || !asset.data) return "";
    const url = URL.createObjectURL(new Blob([fromBase64(asset.data)], { type: asset.mime }));
    objectUrls.set(id, url);
    return url;
  };
  const hydrate = (element) => {
    const id = element.dataset.privateMedia;
    const fullId = element.dataset.privateMediaFull;
    if (id) {
      const url = getObjectUrl(id);
      if (url) element.src = url;
      delete element.dataset.privateMedia;
    }
    if (fullId) {
      const fullUrl = getObjectUrl(fullId);
      if (fullUrl) element.dataset.full = fullUrl;
      delete element.dataset.privateMediaFull;
    }
  };

  const mediaElements = Array.from(document.querySelectorAll("[data-private-media], [data-private-media-full]"));
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        hydrate(entry.target);
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "600px 0px" });
    mediaElements.forEach(element => observer.observe(element));
  } else {
    mediaElements.forEach(hydrate);
  }

  document.addEventListener("click", event => {
    const element = event.target.closest && event.target.closest("[data-private-media], [data-private-media-full]");
    if (element) hydrate(element);
  }, true);

  addEventListener("pagehide", () => objectUrls.forEach(url => URL.revokeObjectURL(url)), { once: true });
})();
