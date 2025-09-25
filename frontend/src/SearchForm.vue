<template>
  <form
    class="search-card"
    role="search"
    aria-labelledby="search-title"
    @submit.prevent="onSubmit"
  >
    <h3 id="search-title" class="sr-only">Search individuals</h3>

    <div class="search-inputs">
      <div class="input-wrap">
        <span class="help" title="Help" aria-hidden="true"></span>

        <label class="sr-only" for="q">
          Search (individual, surname, public name, alias, key)
        </label>
        <input
          id="q"
          name="q"
          type="search"
          inputmode="search"
          placeholder="Search individual, surname, public name, alias, key"
          aria-describedby="q-hint"
          autocomplete="off"
          v-model.trim="q"
        />
        <p id="q-hint" class="hint">
          Type a name or keyword, then press Enter.
        </p>
      </div>

      <div class="fields-row">
        <div class="input-wrap">
          <label for="firstName">First name(s)</label>
          <input
            id="firstName"
            name="firstName"
            type="search"
            inputmode="search"
            placeholder="e.g. John Paul"
            list="datalist_fnames"
            autocomplete="given-name"
            aria-describedby="firstName-hint"
            v-model="firstName"
          />
          <datalist id="datalist_fnames">
            <option value="John"></option>
            <option value="Jane"></option>
          </datalist>
          <p id="firstName-hint" class="hint">
            You can enter one or more first names.
          </p>
        </div>

        <div class="input-wrap">
          <label for="surname">Surname</label>
          <input
            id="surname"
            name="surname"
            type="search"
            inputmode="search"
            placeholder="e.g. Doe"
            autocomplete="family-name"
            v-model="surname"
          />
        </div>
      </div>

      <fieldset class="options-row" aria-describedby="firstnames-opts-hint">
        <legend>First names options</legend>
        <label>
          <input
            type="checkbox"
            id="oneFirst"
            name="oneFirst"
            v-model="oneFirst"
          />
          One first name
        </label>
        <label>
          <input
            type="checkbox"
            id="sameOrder"
            name="sameOrder"
            v-model="sameOrder"
          />
          Same order
        </label>
        <label>
          <input
            type="checkbox"
            id="partial"
            name="partial"
            v-model="partial"
          />
          Partial
        </label>
        <p id="firstnames-opts-hint" class="hint">
          Choose how first names are matched.
        </p>

        <button id="searchBtn" type="submit" class="btn btn-primary">
          Search
        </button>
      </fieldset>
    </div>

    <table class="results-head" aria-hidden="true">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Fief</th>
        </tr>
      </thead>
    </table>

    <div
      id="results-status"
      class="sr-only"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ resultsText }}
    </div>

    <ul id="results-list" role="list" aria-label="Search results">
      <li v-for="(item, i) in results" :key="i">{{ item }}</li>
    </ul>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";

const emit = defineEmits(["demoAlert"]);

const q = ref("");
const firstName = ref("");
const surname = ref("");
const oneFirst = ref(false);
const sameOrder = ref(false);
const partial = ref(false);

const results = ref([]);

const resultsText = computed(() => {
  const n = results.value.length;
  return `${n} result${n !== 1 ? "s" : ""}`;
});

function onSubmit() {
  // logique identique à ton IIFE:
  results.value = q.value ? [`Result for "${q.value}"`] : [];

  // émettre l’alert “demo” comme dans index.js (au clic sur Search)
  emit("demoAlert", {
    q: q.value,
    firstName: firstName.value,
    surname: surname.value,
    oneFirst: oneFirst.value,
    sameOrder: sameOrder.value,
    partial: partial.value,
  });
}
</script>
