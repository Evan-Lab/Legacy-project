<template>
  <div class="chips" role="group" :aria-label="ariaLabel">
    <button
      v-for="(chip, i) in items"
      :key="i"
      class="chip"
      type="button"
      :aria-label="chip.ariaLabel || undefined"
      @click="handleClick(chip)"
    >
      <span aria-hidden="true">{{ chip.emoji }}</span>
      {{ " " + chip.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  items: { type: Array, required: true },
  ariaLabel: { type: String, default: "" },
});

const emit = defineEmits(["chip"]);

function handleClick(chip) {
  // on remonte l’info au parent pour logger/alerter
  emit("chip", { label: chip.label, group: props.ariaLabel || "Chip" });
}
</script>
