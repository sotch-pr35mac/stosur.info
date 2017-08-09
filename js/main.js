/**
  * @file         ::  js/app.js
  * @author       ::  Preston Wang-Stosur-Bassett (http://github.com/sotch-pr35mac)
  * @date         ::  Aug 8, 2017
  * @description  ::  This file handles the Vue.js components and logic
*/

var AboutSection = require('../component/aboutSection.vue');
var ResumeSection = require('../component/resumeSection.vue');
var PortfolioSection = require('../component/portfolioSection.vue');
var ContactSection = require('../component/contactSection.vue');

var app = new Vue({
  el: "#app",
  components: {
    aboutSection: AboutSection,
    resumeSection: ResumeSection,
    portfolioSection: PortfolioSection,
    contactSection: ContactSection
  }
});
