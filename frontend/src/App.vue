<template>
  <a class="skip-link" href="#main">Skip to content</a>

  <header class="hero" role="banner">
    <HeroHeader />
  </header>

  <main id="main" class="container" role="main">
    <SearchForm @demoAlert="onDemoAlert" />

    <section class="panel" aria-labelledby="tools-title">
      <h3 id="tools-title">Tools</h3>
      <ChipsPanel :items="tools" aria-label="Tools" @chip="onChip" />
    </section>

    <section class="panel" aria-labelledby="books-title">
      <h3 id="books-title">Books</h3>
      <ChipsPanel :items="books" aria-label="Books" @chip="onChip" />
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import HeroHeader from "./HeroHeader.vue";
import ChipsPanel from "./ChipsPanel.vue";
import SearchForm from "./SearchForm.vue";

const tools = ref([
  { emoji: "📝", label: "Add notes" },
  { emoji: "📊", label: "Statistics" },
  { emoji: "🎉", label: "Anniversaries" },
  { emoji: "🌐", label: "Places/surname" },
  { emoji: "🔎", label: "Advanced request" },
  { emoji: "📅", label: "Calendars" },
  { emoji: "⚙️", label: "Configuration", ariaLabel: "Configuration" },
  { emoji: "➕", label: "Add note" },
  { emoji: "👪", label: "Add family" },
]);

const books = ref([
  { emoji: "🧒", label: "First names" },
  { emoji: "📛", label: "Surnames" },
  { emoji: "🏷️", label: "Public names" },
  { emoji: "🏅", label: "Qualifiers" },
  { emoji: "🎭", label: "Aliases" },
  { emoji: "💼", label: "Occupations" },
  { emoji: "🗺️", label: "Places" },
  { emoji: "📜", label: "Sources" },
  { emoji: "🎖️", label: "Titles" },
  { emoji: "🏰", label: "Domains" },
]);

function onChip(payload) {
  // Equivalent de clickToLog(".chip", "Tool/Book")
  const text = `${payload.group} → "${payload.label}" (demo)`;
  // Console + alert, comme dans ton code
  // eslint-disable-next-line no-console
  console.log("[ACTION] Tool/Book:", payload.label);
  alert(text);
}

function onDemoAlert(payload) {
  // Equivalent de l’alert custom au click sur "Search"
  const { q, firstName, surname, oneFirst, sameOrder, partial } = payload;
  const one = oneFirst ? "one" : "any";
  const same = sameOrder ? "same-order" : "any-order";
  const part = partial ? "partial" : "exact";
  alert(`Search (demo):
query="${q}"
first="${firstName}" | surname="${surname}"
opts: ${one}, ${same}, ${part}`);
}
</script>
