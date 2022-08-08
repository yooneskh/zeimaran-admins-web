<template>
  <v-card>

    <v-card-title>
      {{ title || 'Enter Information' }}
    </v-card-title>

    <v-card-text class="pb-1">
      {{ description || 'Please enter information below.' }}
    </v-card-text>

    <v-card-text class="pb-1">
      <y-form
        :valid.sync="valid"
        ref="refForm"
        :target="form"
        :fields="fields"
      />
    </v-card-text>

    <v-card-actions>
      <v-btn text :disabled="valid === false" color="primary" @click="$emit('resolve', form)">{{ actionTitle || 'Submit' }}</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'FormMakerDialog',
  props: {
    title: String,
    description: String,
    actionTitle: String,
    fields: Array,
    values: Object
  },
  data: () => ({
    valid: undefined,
    form: {}
  }),
  created() {
    if (this.values) {
      try {
        this.form = JSON.parse(JSON.stringify(this.values));
      }
      catch { } // eslint-disable-line no-empty
    }
  },
  mounted() {
    if (this.fields.some(it => it.rules)) {
      this.$refs.refForm.checkValidations();
    }
  }
}
</script>