<template>
  <v-container fluid class="page">

    <v-row class="ma-0 mt-n3">

      <v-col cols="12" md="6">
        <v-card>

          <v-card-title>
            <v-icon class="me-3">
              mdi-email-plus
            </v-icon>
            Send Email
          </v-card-title>

          <v-card-text>
            <y-form
              :target="form"
              :fields="[
                {
                  key: 'emailTemplate', type: 'resource', title: 'Email Template',
                  resource: 'EmailTemplate'
                },
                {
                  key: 'templateLocale', type: 'select', title: 'Template Locale',
                  items: emailTemplate && emailTemplate.templates ? emailTemplate.templates.map(it => it.locale) : ['en']
                },
                {
                  key: 'sendEmail', type: 'select', title: 'Sender Email',
                  items: sendEmails
                },
                {
                  key: 'subject', type: 'text', title: 'Subject'
                },
                {
                  key: 'receivers', type: 'series', title: 'Receivers',
                  base: {},
                  itemFields: [
                    {
                      key: 'name', type: 'text', title: 'Name', width: 6
                    },
                    {
                      key: 'email', type: 'text', title: 'Email', width: 6
                    }
                  ]
                }
              ]"
            />
          </v-card-text>

          <v-divider />

          <v-card-text v-if="emailTemplate && emailTemplate.variables && emailTemplate.variables.length > 0">
            <y-form
              :target="variableValues"
              :fields="emailTemplate.variables.map(it => (
                {
                  key: it.key, type: it.longText ? 'textarea' : 'text', title: it.key,
                  setter: (target, value) => $set(variableValues, it.key, value)
                }
              ))"
            />
          </v-card-text>

          <v-card-actions>
            <v-btn block color="primary" large depressed :loading="loading" @click="sendEmail()">

              <v-icon left>
                mdi-mail
              </v-icon>

              Send Email

            </v-btn>
          </v-card-actions>

        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <iframe :src="'data:text/html;charset=utf-8,' + renderedTemplate" frameborder="0"></iframe>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script>

import { loadMetasFor } from '../../components/y-resource-manager/y-resource-util';
import { YNetwork } from 'ynetwork';


export default {
  name: 'SendEmailPage',
  data: () => ({
    loading: false,
    metas: [],
    sendEmails: [],
    emailTemplate: {},
    variableValues: {},
    form: {
      emailTemplate: '',
      templateLocale: 'en'
    }
  }),
  watch: {
    'form.emailTemplate'() {
      if (this.form.emailTemplate) {
        this.loadEmailTemplate();
      }
    }
  },
  computed: {
    renderedTemplate() {

      let template = this.emailTemplate?.templates?.find(it => it.locale === this.form.templateLocale)?.template || '<p class="pa-4 text-center">None</p>';

      for (const key of Object.keys(this.variableValues)) {
        template = template.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), this.variableValues[key]);
      }

      return template;

    }
  },
  created() {
    this.loadMetas();
  },
  methods: {
    async loadMetas() {

      this.metas = await loadMetasFor(this.$apiBase, 'EmailEntry');

      this.sendEmails = this.metas.find(it => it.key === 'sendEmail').enum;

    },
    async loadEmailTemplate() {

      this.variableValues = {};

      this.loading = true;
      const { status, data } = await YNetwork.get(`${this.$apiBase}/email-templates/${this.form.emailTemplate}`);
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.emailTemplate = data;

    },
    async sendEmail() {

      this.loading = true;
      const { status, data } = await YNetwork.post(`${this.$apiBase}/email-entries/`, {
        user: this.$user._id,
        emailTemplate: this.emailTemplate._id,
        locale: this.form.templateLocale,
        sendEmail: this.form.sendEmail,
        subject: this.form.subject,
        receivers: this.form.receivers,
        informations: Object.keys(this.variableValues).map(it => ({ key: it, value: this.variableValues[it] }))
      });
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      this.$toast.success('Emails were sent.');

      this.form = {};
      this.emailTemplate = {};
      this.variableValues = {};

    }
  }
}
</script>