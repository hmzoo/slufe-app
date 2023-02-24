<script setup>
import { ref  } from 'vue'
import { storeToRefs } from "pinia";
import { useSlufeStore } from '@/stores/slufe'

const { site_title } = storeToRefs(useSlufeStore());
const visible = ref(false);
</script>

<template>
<i-button @click="visible = true" size="sm" color="info">
    General Conditions of Use
</i-button>

<i-modal v-model="visible" size="lg" class="_font-size:sm">
<div class="tos">
<h1>General Conditions of Use of the {{ site_title }} website</h1>
<h2>Warning</h2>
<ul>
<li>Remember that the internet is NOT private.</li>
<li>{{ site_title }} does not record any video streams.</li>
<li>You may think you're just chatting to a friend, but videos can all be copied, saved or even printed out by other people.</li>
<li>Never write or upload anything that you would not want seen by strangers, much less family and friends.</li>
</ul>
<h2>Terms of Service</h2>
<p>By using {{ site_title }}, you are agreeing to be bound by the following terms and conditions (&quot;Terms of Use&quot;).</p>
<ul>
<li>You must be 16 years or older to use this site.</li>
<li>You are responsible for any and all activity that occurs from your IP address.</li>
<li>You may not use the {{ site_title }} service for any illegal or unauthorized purpose.</li>
<li>You must not harass, abuse, impersonate, threaten, or intimidate other {{ site_title }} users.</li>
<li>You must not, in the use of {{ site_title }}, violate any laws in your jurisdiction (including but not limited to copyright laws).</li>
<li>We reserve the right to modify or terminate the {{ site_title }} service for any reason, without notice at any time.</li>
<li>We reserve the right to alter these Terms of Use at any time.</li>
<li>We reserve the right to refuse service to anyone for any reason at any time.</li>
</ul>
<h2>
Privacy Policy
</h2>
<p>Some of our advertising partners may use cookies and web beacons on our site. Our advertising partners is Google Adsense.
Other technologies ( such as cookies, JavaScript, or Web Beacons ) may also be used by the third-party ad networks to measure the effectiveness of their advertisements and/or to personalize the ads that you see. We have no access to or control over these cookies that are used by third-party advertisers.</p>

<p><em>Website hosted by OVH, 140 Quai du Sartel, 59100 Roubaix, France.</em></p>
</div>
</i-modal>
</template>

<style>
li {
line-height:90%
}

.tos {
  border: 1px solid #DDDDDD;
  min-height: 50px;
  height:500px;
  overflow-y: scroll
}
</style>