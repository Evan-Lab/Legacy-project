const clickToLog = (selector, name) => {
  document.querySelectorAll(selector).forEach((el) => {
    el.addEventListener("click", () => {
      console.log(`[ACTION] ${name}:`, el.textContent.trim());
      alert(`${name} → "${el.textContent.trim()}" (demo)`);
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("searchBtn");
  btn?.addEventListener("click", () => {
    const q = document.getElementById("q")?.value || "";
    const fn = document.getElementById("firstName")?.value || "";
    const sn = document.getElementById("surname")?.value || "";
    const one = document.getElementById("oneFirst")?.checked ? "one" : "any";
    const same = document.getElementById("sameOrder")?.checked
      ? "same-order"
      : "any-order";
    const part = document.getElementById("partial")?.checked
      ? "partial"
      : "exact";
    alert(`Search (demo):
query="${q}"
first="${fn}" | surname="${sn}"
opts: ${one}, ${same}, ${part}`);
  });

  clickToLog(".chip", "Tool/Book");
});
