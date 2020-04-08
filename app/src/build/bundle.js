var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function s(t){t.forEach(e)}function o(t){return"function"==typeof t}function r(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function i(t,e,n,s){if(t){const o=l(t,e,n,s);return t[0](o)}}function l(t,e,n,s){return t[1]&&s?function(t,e){for(const n in e)t[n]=e[n];return t}(n.ctx.slice(),t[1](s(e))):n.ctx}function c(t,e,n,s){if(t[2]&&s){const o=t[2](s(n));if(void 0===e.dirty)return o;if("object"==typeof o){const t=[],n=Math.max(e.dirty.length,o.length);for(let s=0;s<n;s+=1)t[s]=e.dirty[s]|o[s];return t}return e.dirty|o}return e.dirty}function a(t,e){t.appendChild(e)}function u(t,e,n){t.insertBefore(e,n||null)}function f(t){t.parentNode.removeChild(t)}function d(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function $(t){return document.createElement(t)}function p(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function m(t){return document.createTextNode(t)}function g(){return m(" ")}function h(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function w(t,e){e=""+e,t.data!==e&&(t.data=e)}function v(t,e,n){t.classList[n?"add":"remove"](e)}let x;function k(t){x=t}const b=[],y=[],z=[],C=[],D=Promise.resolve();let E=!1;function A(t){z.push(t)}let j=!1;const I=new Set;function S(){if(!j){j=!0;do{for(let t=0;t<b.length;t+=1){const e=b[t];k(e),L(e.$$)}for(b.length=0;y.length;)y.pop()();for(let t=0;t<z.length;t+=1){const e=z[t];I.has(e)||(I.add(e),e())}z.length=0}while(b.length);for(;C.length;)C.pop()();E=!1,j=!1,I.clear()}}function L(t){if(null!==t.fragment){t.update(),s(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(A)}}const _=new Set;let B;function P(){B={r:0,c:[],p:B}}function M(){B.r||s(B.c),B=B.p}function H(t,e){t&&t.i&&(_.delete(t),t.i(e))}function N(t,e,n,s){if(t&&t.o){if(_.has(t))return;_.add(t),B.c.push(()=>{_.delete(t),s&&(n&&t.d(1),s())}),t.o(e)}}function O(t){t&&t.c()}function q(t,n,r){const{fragment:i,on_mount:l,on_destroy:c,after_update:a}=t.$$;i&&i.m(n,r),A(()=>{const n=l.map(e).filter(o);c?c.push(...n):s(n),t.$$.on_mount=[]}),a.forEach(A)}function G(t,e){const n=t.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function T(t,e){-1===t.$$.dirty[0]&&(b.push(t),E||(E=!0,D.then(S)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function W(e,o,r,i,l,c,a=[-1]){const u=x;k(e);const d=o.props||{},$=e.$$={fragment:null,ctx:null,props:c,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(u?u.$$.context:[]),callbacks:n(),dirty:a};let p=!1;if($.ctx=r?r(e,d,(t,n,...s)=>{const o=s.length?s[0]:n;return $.ctx&&l($.ctx[t],$.ctx[t]=o)&&($.bound[t]&&$.bound[t](o),p&&T(e,t)),n}):[],$.update(),p=!0,s($.before_update),$.fragment=!!i&&i($.ctx),o.target){if(o.hydrate){const t=function(t){return Array.from(t.childNodes)}(o.target);$.fragment&&$.fragment.l(t),t.forEach(f)}else $.fragment&&$.fragment.c();o.intro&&H(e.$$.fragment),q(e,o.target,o.anchor),S()}k(u)}class F{$destroy(){G(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(){}}const R=[];function V(t,e){return{subscribe:K(t,e).subscribe}}function K(e,n=t){let s;const o=[];function i(t){if(r(e,t)&&(e=t,s)){const t=!R.length;for(let t=0;t<o.length;t+=1){const n=o[t];n[1](),R.push(n,e)}if(t){for(let t=0;t<R.length;t+=2)R[t][0](R[t+1]);R.length=0}}}return{set:i,update:function(t){i(t(e))},subscribe:function(r,l=t){const c=[r,l];return o.push(c),1===o.length&&(s=n(i)||t),r(e),()=>{const t=o.indexOf(c);-1!==t&&o.splice(t,1),0===o.length&&(s(),s=null)}}}}function U(e,n,r){const i=!Array.isArray(e),l=i?[e]:e,c=n.length<2;return V(r,e=>{let r=!1;const a=[];let u=0,f=t;const d=()=>{if(u)return;f();const s=n(i?a[0]:a,e);c?e(s):f=o(s)?s:t},$=l.map((e,n)=>function(e,...n){if(null==e)return t;const s=e.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(e,t=>{a[n]=t,u&=~(1<<n),r&&d()},()=>{u|=1<<n}));return r=!0,d(),function(){s($),f()}})}function J(){const t=window.location.href.indexOf("#/");let e=t>-1?window.location.href.substr(t+1):"/";const n=e.indexOf("?");let s="";return n>-1&&(s=e.substr(n+1),e=e.substr(0,n)),{location:e,querystring:s}}const Q=V(J(),(function(t){const e=()=>{t(J())};return window.addEventListener("hashchange",e,!1),function(){window.removeEventListener("hashchange",e,!1)}}));U(Q,t=>t.location),U(Q,t=>t.querystring);function X(e){let n,s,o;return{c(){n=p("svg"),s=p("polyline"),h(s,"points","6 9 12 15 18 9"),h(n,"xmlns","http://www.w3.org/2000/svg"),h(n,"width",e[0]),h(n,"height",e[0]),h(n,"fill","none"),h(n,"viewBox","0 0 24 24"),h(n,"stroke","currentColor"),h(n,"stroke-width","2"),h(n,"stroke-linecap","round"),h(n,"stroke-linejoin","round"),h(n,"class",o="feather feather-chevron-down "+e[1])},m(t,e){u(t,n,e),a(n,s)},p(t,[e]){1&e&&h(n,"width",t[0]),1&e&&h(n,"height",t[0]),2&e&&o!==(o="feather feather-chevron-down "+t[1])&&h(n,"class",o)},i:t,o:t,d(t){t&&f(n)}}}function Y(t,e,n){let{size:s="100%"}=e,{class:o=""}=e;return"100%"!==s&&(s="x"===s.slice(-1)?s.slice(0,s.length-1)+"em":parseInt(s)+"px"),t.$set=t=>{"size"in t&&n(0,s=t.size),"class"in t&&n(1,o=t.class)},[s,o]}class Z extends F{constructor(t){super(),W(this,t,Y,X,r,{size:0,class:1})}}function tt(e){let n,s,o,r,i;return{c(){n=p("svg"),s=p("path"),o=p("polyline"),r=p("line"),h(s,"d","M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"),h(o,"points","7 10 12 15 17 10"),h(r,"x1","12"),h(r,"y1","15"),h(r,"x2","12"),h(r,"y2","3"),h(n,"xmlns","http://www.w3.org/2000/svg"),h(n,"width",e[0]),h(n,"height",e[0]),h(n,"fill","none"),h(n,"viewBox","0 0 24 24"),h(n,"stroke","currentColor"),h(n,"stroke-width","2"),h(n,"stroke-linecap","round"),h(n,"stroke-linejoin","round"),h(n,"class",i="feather feather-download "+e[1])},m(t,e){u(t,n,e),a(n,s),a(n,o),a(n,r)},p(t,[e]){1&e&&h(n,"width",t[0]),1&e&&h(n,"height",t[0]),2&e&&i!==(i="feather feather-download "+t[1])&&h(n,"class",i)},i:t,o:t,d(t){t&&f(n)}}}function et(t,e,n){let{size:s="100%"}=e,{class:o=""}=e;return"100%"!==s&&(s="x"===s.slice(-1)?s.slice(0,s.length-1)+"em":parseInt(s)+"px"),t.$set=t=>{"size"in t&&n(0,s=t.size),"class"in t&&n(1,o=t.class)},[s,o]}class nt extends F{constructor(t){super(),W(this,t,et,tt,r,{size:0,class:1})}}function st(e){let n,s,o;return{c(){n=p("svg"),s=p("path"),h(s,"d","M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"),h(n,"xmlns","http://www.w3.org/2000/svg"),h(n,"width",e[0]),h(n,"height",e[0]),h(n,"fill","none"),h(n,"viewBox","0 0 24 24"),h(n,"stroke","currentColor"),h(n,"stroke-width","2"),h(n,"stroke-linecap","round"),h(n,"stroke-linejoin","round"),h(n,"class",o="feather feather-github "+e[1])},m(t,e){u(t,n,e),a(n,s)},p(t,[e]){1&e&&h(n,"width",t[0]),1&e&&h(n,"height",t[0]),2&e&&o!==(o="feather feather-github "+t[1])&&h(n,"class",o)},i:t,o:t,d(t){t&&f(n)}}}function ot(t,e,n){let{size:s="100%"}=e,{class:o=""}=e;return"100%"!==s&&(s="x"===s.slice(-1)?s.slice(0,s.length-1)+"em":parseInt(s)+"px"),t.$set=t=>{"size"in t&&n(0,s=t.size),"class"in t&&n(1,o=t.class)},[s,o]}class rt extends F{constructor(t){super(),W(this,t,ot,st,r,{size:0,class:1})}}function it(e){let n,s,o,r,i;return{c(){n=p("svg"),s=p("path"),o=p("rect"),r=p("circle"),h(s,"d","M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"),h(o,"x","2"),h(o,"y","9"),h(o,"width","4"),h(o,"height","12"),h(r,"cx","4"),h(r,"cy","4"),h(r,"r","2"),h(n,"xmlns","http://www.w3.org/2000/svg"),h(n,"width",e[0]),h(n,"height",e[0]),h(n,"fill","none"),h(n,"viewBox","0 0 24 24"),h(n,"stroke","currentColor"),h(n,"stroke-width","2"),h(n,"stroke-linecap","round"),h(n,"stroke-linejoin","round"),h(n,"class",i="feather feather-linkedin "+e[1])},m(t,e){u(t,n,e),a(n,s),a(n,o),a(n,r)},p(t,[e]){1&e&&h(n,"width",t[0]),1&e&&h(n,"height",t[0]),2&e&&i!==(i="feather feather-linkedin "+t[1])&&h(n,"class",i)},i:t,o:t,d(t){t&&f(n)}}}function lt(t,e,n){let{size:s="100%"}=e,{class:o=""}=e;return"100%"!==s&&(s="x"===s.slice(-1)?s.slice(0,s.length-1)+"em":parseInt(s)+"px"),t.$set=t=>{"size"in t&&n(0,s=t.size),"class"in t&&n(1,o=t.class)},[s,o]}class ct extends F{constructor(t){super(),W(this,t,lt,it,r,{size:0,class:1})}}function at(e){let n,s,o,r;return{c(){n=p("svg"),s=p("path"),o=p("polyline"),h(s,"d","M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"),h(o,"points","22,6 12,13 2,6"),h(n,"xmlns","http://www.w3.org/2000/svg"),h(n,"width",e[0]),h(n,"height",e[0]),h(n,"fill","none"),h(n,"viewBox","0 0 24 24"),h(n,"stroke","currentColor"),h(n,"stroke-width","2"),h(n,"stroke-linecap","round"),h(n,"stroke-linejoin","round"),h(n,"class",r="feather feather-mail "+e[1])},m(t,e){u(t,n,e),a(n,s),a(n,o)},p(t,[e]){1&e&&h(n,"width",t[0]),1&e&&h(n,"height",t[0]),2&e&&r!==(r="feather feather-mail "+t[1])&&h(n,"class",r)},i:t,o:t,d(t){t&&f(n)}}}function ut(t,e,n){let{size:s="100%"}=e,{class:o=""}=e;return"100%"!==s&&(s="x"===s.slice(-1)?s.slice(0,s.length-1)+"em":parseInt(s)+"px"),t.$set=t=>{"size"in t&&n(0,s=t.size),"class"in t&&n(1,o=t.class)},[s,o]}class ft extends F{constructor(t){super(),W(this,t,ut,at,r,{size:0,class:1})}}function dt(e){let n,s,o,r;return{c(){n=p("svg"),s=p("line"),o=p("polygon"),h(s,"x1","22"),h(s,"y1","2"),h(s,"x2","11"),h(s,"y2","13"),h(o,"points","22 2 15 22 11 13 2 9 22 2"),h(n,"xmlns","http://www.w3.org/2000/svg"),h(n,"width",e[0]),h(n,"height",e[0]),h(n,"fill","none"),h(n,"viewBox","0 0 24 24"),h(n,"stroke","currentColor"),h(n,"stroke-width","2"),h(n,"stroke-linecap","round"),h(n,"stroke-linejoin","round"),h(n,"class",r="feather feather-send "+e[1])},m(t,e){u(t,n,e),a(n,s),a(n,o)},p(t,[e]){1&e&&h(n,"width",t[0]),1&e&&h(n,"height",t[0]),2&e&&r!==(r="feather feather-send "+t[1])&&h(n,"class",r)},i:t,o:t,d(t){t&&f(n)}}}function $t(t,e,n){let{size:s="100%"}=e,{class:o=""}=e;return"100%"!==s&&(s="x"===s.slice(-1)?s.slice(0,s.length-1)+"em":parseInt(s)+"px"),t.$set=t=>{"size"in t&&n(0,s=t.size),"class"in t&&n(1,o=t.class)},[s,o]}class pt extends F{constructor(t){super(),W(this,t,$t,dt,r,{size:0,class:1})}}function mt(t){let e,n;const s=t[1].default,o=i(s,t,t[0],null);return{c(){e=$("button"),o&&o.c(),h(e,"class","sidebar-link svelte-1mlopda")},m(t,s){u(t,e,s),o&&o.m(e,null),n=!0},p(t,[e]){o&&o.p&&1&e&&o.p(l(s,t,t[0],null),c(s,t[0],e,null))},i(t){n||(H(o,t),n=!0)},o(t){N(o,t),n=!1},d(t){t&&f(e),o&&o.d(t)}}}function gt(t,e,n){let{$$slots:s={},$$scope:o}=e;return t.$set=t=>{"$$scope"in t&&n(0,o=t.$$scope)},[o,s]}class ht extends F{constructor(t){super(),W(this,t,gt,mt,r,{})}}function wt(t){let e,n;const s=t[2].default,o=i(s,t,t[1],null);return{c(){e=$("button"),o&&o.c(),h(e,"class","sidebar-icon svelte-1ldv2tw")},m(t,s){u(t,e,s),o&&o.m(e,null),n=!0},p(t,[e]){o&&o.p&&2&e&&o.p(l(s,t,t[1],null),c(s,t[1],e,null))},i(t){n||(H(o,t),n=!0)},o(t){N(o,t),n=!1},d(t){t&&f(e),o&&o.d(t)}}}function vt(t,e,n){let{link:s=""}=e,{$$slots:o={},$$scope:r}=e;return t.$set=t=>{"link"in t&&n(0,s=t.link),"$$scope"in t&&n(1,r=t.$$scope)},[s,r,o]}class xt extends F{constructor(t){super(),W(this,t,vt,wt,r,{link:0})}}function kt(t,e,n){const s=t.slice();return s[2]=e[n],s}function bt(t,e,n){const s=t.slice();return s[5]=e[n],s}function yt(e){let n,s,o=e[5]+"";return{c(){n=m(o),s=g()},m(t,e){u(t,n,e),u(t,s,e)},p:t,d(t){t&&f(n),t&&f(s)}}}function zt(t){let e;const n=new ht({props:{$$slots:{default:[yt]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,e){const s={};256&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function Ct(t){let e,n;var s=t[2].icon;if(s)var o=new s({props:{size:"20"}});return{c(){o&&O(o.$$.fragment),e=g()},m(t,s){o&&q(o,t,s),u(t,e,s),n=!0},p(t,n){if(s!==(s=t[2].icon)){if(o){P();const t=o;N(t.$$.fragment,1,0,()=>{G(t,1)}),M()}s?(O((o=new s({props:{size:"20"}})).$$.fragment),H(o.$$.fragment,1),q(o,e.parentNode,e)):o=null}},i(t){n||(o&&H(o.$$.fragment,t),n=!0)},o(t){o&&N(o.$$.fragment,t),n=!1},d(t){o&&G(o,t),t&&f(e)}}}function Dt(t){let e;const n=new xt({props:{link:t[2].link,$$slots:{default:[Ct]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,e){const s={};256&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function Et(t){let e,n,s,o,r,i,l,c,p=t[0],m=[];for(let e=0;e<p.length;e+=1)m[e]=zt(bt(t,p,e));const w=t=>N(m[t],1,1,()=>{m[t]=null});let v=t[1],x=[];for(let e=0;e<v.length;e+=1)x[e]=Dt(kt(t,v,e));const k=t=>N(x[t],1,1,()=>{x[t]=null});return{c(){e=$("aside"),n=$("div"),n.innerHTML='<h2 class="sidebar--brand-name svelte-v2iam6">\n\t\t\tPreston<br>\n\t\t\tWang-Stosur-Bassett\n\t\t</h2> \n\t\t<p class="sidebar--brand-subtitle svelte-v2iam6">\n\t\t\tSoftware Engineer\n\t\t</p>',s=g(),o=$("div");for(let t=0;t<m.length;t+=1)m[t].c();r=g(),i=$("div"),l=$("div");for(let t=0;t<x.length;t+=1)x[t].c();h(n,"class","sidebar--brand svelte-v2iam6"),h(o,"class","sidebar--links"),h(l,"class","sidebar--icons svelte-v2iam6"),h(i,"class","sidebar--icons--container svelte-v2iam6"),h(e,"class","sidebar svelte-v2iam6")},m(t,f){u(t,e,f),a(e,n),a(e,s),a(e,o);for(let t=0;t<m.length;t+=1)m[t].m(o,null);a(e,r),a(e,i),a(i,l);for(let t=0;t<x.length;t+=1)x[t].m(l,null);c=!0},p(t,[e]){if(1&e){let n;for(p=t[0],n=0;n<p.length;n+=1){const s=bt(t,p,n);m[n]?(m[n].p(s,e),H(m[n],1)):(m[n]=zt(s),m[n].c(),H(m[n],1),m[n].m(o,null))}for(P(),n=p.length;n<m.length;n+=1)w(n);M()}if(2&e){let n;for(v=t[1],n=0;n<v.length;n+=1){const s=kt(t,v,n);x[n]?(x[n].p(s,e),H(x[n],1)):(x[n]=Dt(s),x[n].c(),H(x[n],1),x[n].m(l,null))}for(P(),n=v.length;n<x.length;n+=1)k(n);M()}},i(t){if(!c){for(let t=0;t<p.length;t+=1)H(m[t]);for(let t=0;t<v.length;t+=1)H(x[t]);c=!0}},o(t){m=m.filter(Boolean);for(let t=0;t<m.length;t+=1)N(m[t]);x=x.filter(Boolean);for(let t=0;t<x.length;t+=1)N(x[t]);c=!1},d(t){t&&f(e),d(m,t),d(x,t)}}}function At(t){return[["Home","About","Experience","Education","Skills","Projects","Contact"],[{icon:rt,link:""},{icon:ct,link:""},{icon:ft,link:""}]]}class jt extends F{constructor(t){super(),W(this,t,At,Et,r,{})}}function It(e){let n,s,o,r,i,l;const c=new Z({props:{size:"24"}});return{c(){n=$("section"),s=$("div"),o=$("div"),o.innerHTML='<div class="landing--profile-photo svelte-7f5zml"></div>',r=g(),i=$("div"),O(c.$$.fragment),h(o,"class","landing--profile-frame svelte-7f5zml"),h(i,"class","landing--chevron svelte-7f5zml"),h(s,"class","landing--image-mask svelte-7f5zml"),h(n,"class","landing-content svelte-7f5zml")},m(t,e){u(t,n,e),a(n,s),a(s,o),a(s,r),a(s,i),q(c,i,null),l=!0},p:t,i(t){l||(H(c.$$.fragment,t),l=!0)},o(t){N(c.$$.fragment,t),l=!1},d(t){t&&f(n),G(c)}}}class St extends F{constructor(t){super(),W(this,t,null,It,r,{})}}function Lt(e){let n;return{c(){n=$("div"),h(n,"class","branding-bar svelte-11bqh8j")},m(t,e){u(t,n,e)},p:t,i:t,o:t,d(t){t&&f(n)}}}class _t extends F{constructor(t){super(),W(this,t,null,Lt,r,{})}}function Bt(t){let e,n,s;const o=t[3].default,r=i(o,t,t[2],null);return{c(){var s;e=$("section"),r&&r.c(),h(e,"class",(s=t[0](),n=(null==s?"":s)+" svelte-ua724w"))},m(t,n){u(t,e,n),r&&r.m(e,null),s=!0},p(t,[e]){r&&r.p&&4&e&&r.p(l(o,t,t[2],null),c(o,t[2],e,null))},i(t){s||(H(r,t),s=!0)},o(t){N(r,t),s=!1},d(t){t&&f(e),r&&r.d(t)}}}function Pt(t,e,n){let{color:s="light"}=e;let{$$slots:o={},$$scope:r}=e;return t.$set=t=>{"color"in t&&n(1,s=t.color),"$$scope"in t&&n(2,r=t.$$scope)},[()=>["section-content",`section-content--${s}`].join(" "),s,r,o]}class Mt extends F{constructor(t){super(),W(this,t,Pt,Bt,r,{color:1})}}function Ht(t){let e,n,s;const o=t[1].default,r=i(o,t,t[0],null);return{c(){e=$("span"),r&&r.c(),n=$("div"),h(n,"class","section-title--bar svelte-1gqdy4t"),h(e,"class","section-title svelte-1gqdy4t")},m(t,o){u(t,e,o),r&&r.m(e,null),a(e,n),s=!0},p(t,[e]){r&&r.p&&1&e&&r.p(l(o,t,t[0],null),c(o,t[0],e,null))},i(t){s||(H(r,t),s=!0)},o(t){N(r,t),s=!1},d(t){t&&f(e),r&&r.d(t)}}}function Nt(t,e,n){let{$$slots:s={},$$scope:o}=e;return t.$set=t=>{"$$scope"in t&&n(0,o=t.$$scope)},[o,s]}class Ot extends F{constructor(t){super(),W(this,t,Nt,Ht,r,{})}}function qt(t){let e,n;const s=t[1].default,o=i(s,t,t[0],null);return{c(){e=$("button"),o&&o.c(),h(e,"class","clickable-button svelte-1okj2mg")},m(t,s){u(t,e,s),o&&o.m(e,null),n=!0},p(t,[e]){o&&o.p&&1&e&&o.p(l(s,t,t[0],null),c(s,t[0],e,null))},i(t){n||(H(o,t),n=!0)},o(t){N(o,t),n=!1},d(t){t&&f(e),o&&o.d(t)}}}function Gt(t,e,n){let{$$slots:s={},$$scope:o}=e;return t.$set=t=>{"$$scope"in t&&n(0,o=t.$$scope)},[o,s]}class Tt extends F{constructor(t){super(),W(this,t,Gt,qt,r,{})}}function Wt(t){let e;return{c(){e=$("h1"),e.textContent="About"},m(t,n){u(t,e,n)},d(t){t&&f(e)}}}function Ft(e){let n,s;const o=new nt({props:{size:"16"}});return{c(){O(o.$$.fragment),n=m("\n\t\t\t\t\t \n\t\t\t\t\tDownload Resume")},m(t,e){q(o,t,e),u(t,n,e),s=!0},p:t,i(t){s||(H(o.$$.fragment,t),s=!0)},o(t){N(o.$$.fragment,t),s=!1},d(t){G(o,t),t&&f(n)}}}function Rt(e){let n,s;const o=new pt({props:{size:"16"}});return{c(){O(o.$$.fragment),n=m("\n\t\t\t\t\t \n\t\t\t\t\tHire Me!")},m(t,e){q(o,t,e),u(t,n,e),s=!0},p:t,i(t){s||(H(o.$$.fragment,t),s=!0)},o(t){N(o.$$.fragment,t),s=!1},d(t){G(o,t),t&&f(n)}}}function Vt(t){let e,n,s,o,r,i,l,c,d,p,m,w,v,x,k;const b=new Ot({props:{$$slots:{default:[Wt]},$$scope:{ctx:t}}}),y=new Tt({props:{$$slots:{default:[Ft]},$$scope:{ctx:t}}}),z=new Tt({props:{$$slots:{default:[Rt]},$$scope:{ctx:t}}});return{c(){O(b.$$.fragment),e=g(),n=$("div"),s=$("img"),r=g(),i=$("div"),l=$("h3"),l.textContent="Hi, I'm Preston.",c=g(),d=$("p"),d.textContent="I am a self-motivated full-stack senior software engineer with excellent communication skills who is passionate and dedicated to his work. I ahve an eye for design and a talent for software engineering. I am experienced in building products, delivering for clients, and managing a team.",p=g(),m=$("p"),m.textContent="I am seeking a company to grow with. I am looking to further my passion and knowledge of software engineering. Devoted to making the world a better place.",w=g(),v=$("div"),O(y.$$.fragment),x=g(),O(z.$$.fragment),s.src!==(o="img/author.jpg")&&h(s,"src","img/author.jpg"),h(s,"class","about-section--image svelte-mf6evz"),h(v,"class","about-button-group svelte-mf6evz"),h(i,"class","about-section--text svelte-mf6evz"),h(n,"class","about-section--content svelte-mf6evz")},m(t,o){q(b,t,o),u(t,e,o),u(t,n,o),a(n,s),a(n,r),a(n,i),a(i,l),a(i,c),a(i,d),a(i,p),a(i,m),a(i,w),a(i,v),q(y,v,null),a(v,x),q(z,v,null),k=!0},p(t,e){const n={};1&e&&(n.$$scope={dirty:e,ctx:t}),b.$set(n);const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),y.$set(s);const o={};1&e&&(o.$$scope={dirty:e,ctx:t}),z.$set(o)},i(t){k||(H(b.$$.fragment,t),H(y.$$.fragment,t),H(z.$$.fragment,t),k=!0)},o(t){N(b.$$.fragment,t),N(y.$$.fragment,t),N(z.$$.fragment,t),k=!1},d(t){G(b,t),t&&f(e),t&&f(n),G(y),G(z)}}}function Kt(t){let e;const n=new Mt({props:{color:"dark",$$slots:{default:[Vt]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,[e]){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}class Ut extends F{constructor(t){super(),W(this,t,null,Kt,r,{})}}function Jt(t,e,n){const s=t.slice();return s[6]=e[n],s[8]=n,s}function Qt(t){let e,n,s,o,r,i=t[6]+"";function l(...e){return t[5](t[8],...e)}return{c(){e=$("li"),n=$("span"),s=m(i),o=g(),h(n,"class","list-item-description--list-item--content svelte-1kc18dg"),v(n,"list-item-description--list-item--active",t[8]==t[2]),h(e,"class","list-item-description--list-item svelte-1kc18dg")},m(t,i,c){var f,d,$,p;u(t,e,i),a(e,n),a(n,s),a(e,o),c&&r(),d="click",$=l,(f=e).addEventListener(d,$,p),r=()=>f.removeEventListener(d,$,p)},p(e,s){t=e,4&s&&v(n,"list-item-description--list-item--active",t[8]==t[2])},d(t){t&&f(e),r()}}}function Xt(t){let e,n,s,o,r=t[0][t[2]].name+"";return{c(){e=m("@ "),n=$("a"),s=m(r),h(n,"class","list-item-description--detail--link svelte-1kc18dg"),h(n,"href",o=t[0][t[2]].link),h(n,"target","_blank")},m(t,o){u(t,e,o),u(t,n,o),a(n,s)},p(t,e){5&e&&r!==(r=t[0][t[2]].name+"")&&w(s,r),5&e&&o!==(o=t[0][t[2]].link)&&h(n,"href",o)},d(t){t&&f(e),t&&f(n)}}}function Yt(e){let n,s,o,r,i,l,c,p,v,x,k,b,y,z,C,D,E=e[0][e[2]].title+"",A=e[0][e[2]].startDate+"",j=e[0][e[2]].endDate+"",I=e[0][e[2]].description+"",S=e[3](),L=[];for(let t=0;t<S.length;t+=1)L[t]=Qt(Jt(e,S,t));let _=e[1]&&Xt(e);return{c(){n=$("div"),s=$("div"),o=$("ul");for(let t=0;t<L.length;t+=1)L[t].c();r=g(),i=$("div"),l=$("h1"),c=m(E),p=g(),_&&_.c(),v=g(),x=$("h3"),k=m(A),b=m(" - "),y=m(j),z=g(),C=$("p"),D=m(I),h(o,"class","list-item-description--list svelte-1kc18dg"),h(l,"class","list-item-description--detail--title svelte-1kc18dg"),h(x,"class","list-item-description--detail--subtitle svelte-1kc18dg"),h(C,"class","list-item-description--detail--description svelte-1kc18dg"),h(i,"class","list-item-description--detail svelte-1kc18dg"),h(s,"class","list-item-description svelte-1kc18dg"),h(n,"class","list-item-description--container svelte-1kc18dg")},m(t,e){u(t,n,e),a(n,s),a(s,o);for(let t=0;t<L.length;t+=1)L[t].m(o,null);a(s,r),a(s,i),a(i,l),a(l,c),a(l,p),_&&_.m(l,null),a(i,v),a(i,x),a(x,k),a(x,b),a(x,y),a(i,z),a(i,C),a(C,D)},p(t,[e]){if(28&e){let n;for(S=t[3](),n=0;n<S.length;n+=1){const s=Jt(t,S,n);L[n]?L[n].p(s,e):(L[n]=Qt(s),L[n].c(),L[n].m(o,null))}for(;n<L.length;n+=1)L[n].d(1);L.length=S.length}5&e&&E!==(E=t[0][t[2]].title+"")&&w(c,E),t[1]?_?_.p(t,e):(_=Xt(t),_.c(),_.m(l,null)):_&&(_.d(1),_=null),5&e&&A!==(A=t[0][t[2]].startDate+"")&&w(k,A),5&e&&j!==(j=t[0][t[2]].endDate+"")&&w(y,j),5&e&&I!==(I=t[0][t[2]].description+"")&&w(D,I)},i:t,o:t,d(t){t&&f(n),d(L,t),_&&_.d()}}}function Zt(t,e,n){let{items:s}=e,{showLink:o=!1}=e,r=0;const i=t=>{n(2,r=t)};return t.$set=t=>{"items"in t&&n(0,s=t.items),"showLink"in t&&n(1,o=t.showLink)},[s,o,r,()=>s.map(t=>t.name),i,t=>i(t)]}class te extends F{constructor(t){super(),W(this,t,Zt,Yt,r,{items:0,showLink:1})}}function ee(t){let e;return{c(){e=$("h1"),e.textContent="Experience"},m(t,n){u(t,e,n)},d(t){t&&f(e)}}}function ne(t){let e,n;const s=new Ot({props:{$$slots:{default:[ee]},$$scope:{ctx:t}}}),o=new te({props:{items:t[0],showLink:!0}});return{c(){O(s.$$.fragment),e=g(),O(o.$$.fragment)},m(t,r){q(s,t,r),u(t,e,r),q(o,t,r),n=!0},p(t,e){const n={};2&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n)},i(t){n||(H(s.$$.fragment,t),H(o.$$.fragment,t),n=!0)},o(t){N(s.$$.fragment,t),N(o.$$.fragment,t),n=!1},d(t){G(s,t),t&&f(e),G(o,t)}}}function se(t){let e;const n=new Mt({props:{color:"light",$$slots:{default:[ne]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,[e]){const s={};2&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function oe(t){return[[{id:1,display:!0,startDate:"2018",endDate:"Present",title:"Senior Software Engineer",name:"Clinc",description:"Developed features and resolved issues on the Product Engineering team building a conversational AI web platform. Architected conversational AI for clients. Frew a team from zero to six and mentored junior engineers as teh lead of the AI Experience Development team.",link:"https://clinc.com/"},{id:2,display:!0,startDate:"2016",endDate:"2016",title:"Front-End Developer",name:"MCON Beijing",description:"Developed WeChat apps for corporate clients in China using Angular and WeUI. Gained insights into developing for the Chinese market while working on a remote international team.",link:"https://www.mcon-group.com/"},{id:3,display:!0,startDate:"2015",endDate:"2016",title:"Manager",name:"CPR Cell Phone Repair",description:'Managed teh Kalamazoo franchise location of five people, repaired a variety of mobile electronics, and increased sales with a "no-pressure" sales style.',link:"https://www.cellphonerepair.com/"},{id:4,display:!0,startDate:"2010",endDate:"2013",title:"Junior Software Engineer",name:"Floydware, LLC",description:"Internationalized software for use in other languages and developed Android mobile app for cloud scheduling software company",link:"https://www.rosysalonsoftware.com/"}]]}class re extends F{constructor(t){super(),W(this,t,oe,se,r,{})}}function ie(t){let e;return{c(){e=$("h1"),e.textContent="Education"},m(t,n){u(t,e,n)},d(t){t&&f(e)}}}function le(t){let e,n;const s=new Ot({props:{$$slots:{default:[ie]},$$scope:{ctx:t}}}),o=new te({props:{items:t[0],showLink:!1}});return{c(){O(s.$$.fragment),e=g(),O(o.$$.fragment)},m(t,r){q(s,t,r),u(t,e,r),q(o,t,r),n=!0},p(t,e){const n={};2&e&&(n.$$scope={dirty:e,ctx:t}),s.$set(n)},i(t){n||(H(s.$$.fragment,t),H(o.$$.fragment,t),n=!0)},o(t){N(s.$$.fragment,t),N(o.$$.fragment,t),n=!1},d(t){G(s,t),t&&f(e),G(o,t)}}}function ce(t){let e;const n=new Mt({props:{color:"dark",$$slots:{default:[le]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,[e]){const s={};2&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function ae(t){return[[{id:1,display:!0,startDate:"2014",endDate:"2018",title:"B.S. Computer Science",name:"Kalamazoo College",description:"Studied computer science and Chinese with a 3.6 GPA. Studied abroad one year in Beijing at Capital Normal University and Harbin Institute of Technology in Harbin"},{id:2,display:!0,startDate:"2011",endDate:"2014",title:"High School",name:"Glenbard West",description:"Enrolled in all honors and AP classes. On high honor roll with a weighted 5.3 GPA. Vice President Chinese National Honors Society."}]]}class ue extends F{constructor(t){super(),W(this,t,ae,ce,r,{})}}function fe(t){let e;return{c(){e=$("h1"),e.textContent="Skills"},m(t,n){u(t,e,n)},d(t){t&&f(e)}}}function de(t){let e;const n=new Ot({props:{$$slots:{default:[fe]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,e){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function $e(t){let e;const n=new Mt({props:{color:"light",$$slots:{default:[de]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,[e]){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}class pe extends F{constructor(t){super(),W(this,t,null,$e,r,{})}}function me(t){let e;return{c(){e=$("h1"),e.textContent="Projects"},m(t,n){u(t,e,n)},d(t){t&&f(e)}}}function ge(t){let e;const n=new Ot({props:{$$slots:{default:[me]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,e){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function he(t){let e;const n=new Mt({props:{color:"dark",$$slots:{default:[ge]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,[e]){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}class we extends F{constructor(t){super(),W(this,t,null,he,r,{})}}function ve(t){let e;return{c(){e=$("h1"),e.textContent="Contact"},m(t,n){u(t,e,n)},d(t){t&&f(e)}}}function xe(t){let e;const n=new Ot({props:{$$slots:{default:[ve]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,e){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}function ke(t){let e;const n=new Mt({props:{color:"light",$$slots:{default:[xe]},$$scope:{ctx:t}}});return{c(){O(n.$$.fragment)},m(t,s){q(n,t,s),e=!0},p(t,[e]){const s={};1&e&&(s.$$scope={dirty:e,ctx:t}),n.$set(s)},i(t){e||(H(n.$$.fragment,t),e=!0)},o(t){N(n.$$.fragment,t),e=!1},d(t){G(n,t)}}}class be extends F{constructor(t){super(),W(this,t,null,ke,r,{})}}function ye(e){let n,s,o,r,i,l,c,d,p,m,w,v,x;const k=new jt({}),b=new St({}),y=new _t({}),z=new Ut({}),C=new re({}),D=new ue({}),E=new pe({}),A=new we({}),j=new be({});return{c(){n=$("div"),s=$("div"),O(k.$$.fragment),o=g(),r=$("div"),i=$("div"),O(b.$$.fragment),l=g(),O(y.$$.fragment),c=g(),O(z.$$.fragment),d=g(),O(C.$$.fragment),p=g(),O(D.$$.fragment),m=g(),O(E.$$.fragment),w=g(),O(A.$$.fragment),v=g(),O(j.$$.fragment),h(s,"class","sidebar-container svelte-1kol6sg"),h(i,"class","content svelte-1kol6sg"),h(r,"class","content-container svelte-1kol6sg"),h(n,"class","app-container svelte-1kol6sg")},m(t,e){u(t,n,e),a(n,s),q(k,s,null),a(n,o),a(n,r),a(r,i),q(b,i,null),a(i,l),q(y,i,null),a(i,c),q(z,i,null),a(i,d),q(C,i,null),a(i,p),q(D,i,null),a(i,m),q(E,i,null),a(i,w),q(A,i,null),a(i,v),q(j,i,null),x=!0},p:t,i(t){x||(H(k.$$.fragment,t),H(b.$$.fragment,t),H(y.$$.fragment,t),H(z.$$.fragment,t),H(C.$$.fragment,t),H(D.$$.fragment,t),H(E.$$.fragment,t),H(A.$$.fragment,t),H(j.$$.fragment,t),x=!0)},o(t){N(k.$$.fragment,t),N(b.$$.fragment,t),N(y.$$.fragment,t),N(z.$$.fragment,t),N(C.$$.fragment,t),N(D.$$.fragment,t),N(E.$$.fragment,t),N(A.$$.fragment,t),N(j.$$.fragment,t),x=!1},d(t){t&&f(n),G(k),G(b),G(y),G(z),G(C),G(D),G(E),G(A),G(j)}}}return new class extends F{constructor(t){super(),W(this,t,null,ye,r,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
