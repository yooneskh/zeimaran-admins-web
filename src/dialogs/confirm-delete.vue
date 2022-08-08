<template>
  <v-card>

    <v-card-title>
      حذف {{ title }}
    </v-card-title>

    <v-card-text>
      {{ message || 'آیا از حذف این مورد اطمینان دارید؟' }}
    </v-card-text>

    <v-card-actions>
      <v-btn text @click="$emit('resolve', false)">نه، حذف نکن</v-btn>
      <v-spacer />
      <v-btn color="error" text @click="$emit('resolve', true)">بله، حذف کن</v-btn>
    </v-card-actions>

  </v-card>
</template>

<script>
export default {
  name: 'ConfirmDeleteDialog',
  props: {
    title: String,
    message: String
  }
}
</script>