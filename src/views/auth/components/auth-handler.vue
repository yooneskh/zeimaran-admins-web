<template>
  <div class="auth-handler">

    <v-card-text>

      <template v-if="mode === 'login'">

        برای ورود، ایمیل خود را وارد کنید.

        <y-form
          class="pt-4"
          :target="info"
          :fields="[
            {
              key: 'phoneNumber', type: 'text', title: 'شماره تلفن',
              dir: 'ltr'
            }
          ]"
          @keyup.enter.native="doLogin"
        />

        <div v-html="captcha.svg" class="mt-3 mx-auto text-center" />

        <v-text-field
          filled hide-details
          label="کد بالا را وارد کنید"
          v-model="captchaText"
          dir="ltr">
          <template #append>
            <v-icon class="ms-3" @click="$asyncComputed.captcha.update(); captchaText = '';">
              mdi-refresh
            </v-icon>
          </template>
        </v-text-field>

      </template>

      <template v-if="mode === 'verify'">

        کد تایید برای شما ارسال شده. لطفا آن را در زیر وارد کنید.

        <y-form
          class="pt-4"
          :target="info"
          :fields="[
            {
              key: 'verificationCode', type: 'text', title: 'کد تایید',
              mask: '######', dir: 'ltr', inputNumeric: true,
              autocomplete: 'one-time-password'
            }
          ]"
          @keyup.enter.native="doVerify"
        />

      </template>

    </v-card-text>

    <v-card-actions>

      <v-btn
        v-if="mode === 'login'"
        large block depressed color="primary"
        :disabled="!info.phoneNumber || !isPhoneNumberValid || !captchaText"
        :loading="loading"
        @click="doLogin">
        ورود
      </v-btn>

      <v-btn
        v-if="mode === 'verify'"
        large block depressed color="primary"
        :disabled="!info.verificationCode"
        :loading="loading"
        @click="doVerify">
        تایید کد
      </v-btn>

    </v-card-actions>

  </div>
</template>

<script>

import { Config } from '../../../global/config';
import { AuthService } from '../../../api/AuthApi';
import { makeIt } from '../../../util/encryption';

export default {
  name: 'AuthHandler',
  data: () => ({
    loading: false,
    mode: 'login',
    info: {
      phoneNumber: '',
      name: '',
      verificationCode: '',
    },
    captchaText: '',
    verificationToken: ''
  }),
  computed: {
    isPhoneNumberValid() {
      return /09[0-9]{9}/.test(this.info.phoneNumber);
    },
  },
  asyncComputed: {
    captcha: {
      default: {},
      async get() {

        const { status, data } = await AuthService.getCaptcha();
        if (this.$generalHandle(status, data)) return {};

        return data;

      }
    }
  },
  watch: {
    mode() {
      this.$emit('update:mode', this.mode);
    },
    loading() {
      this.$emit('update:loading', this.loading);
    }
  },
  methods: {
    async doLogin() {

      this.loading = true;
      const { status, data } = await AuthService.login('+98' + this.info.phoneNumber.slice(1), this.captcha.captchaId, this.captchaText);
      this.loading = false;

      if (this.$generalHandle(status, data)) {
        this.captchaText = '';
        return this.$asyncComputed.captcha.update();
      }
      else {
        this.verificationToken = data.verificationToken;
        this.mode = 'verify';
      }

    },
    async doVerify() {

      this.loading = true;
      const { status, data } = await AuthService.verify(this.verificationToken, this.info.verificationCode);
      this.loading = false;
      if (this.$generalHandle(status, data)) return;

      const token = data;

      this.loading = true;
      const { status: identityStatus, data: identityData } = await AuthService.getIdentity(token);
      this.loading = false;
      if (this.$generalHandle(identityStatus, identityData)) return;

      localStorage.setItem('--token--', makeIt(token));
      this.$root.user = identityData;

      if (!Config.auth.refreshIdentityOnLoad) {
        localStorage.setItem('--user--', identityData);
      }

      this.$root.resetCredentials();
      this.$emit('done');

    }
  }
};

</script>
