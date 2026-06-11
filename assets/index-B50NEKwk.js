const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/IntroView-BGVUNLbM.js","assets/vue-vendor-D5EOz6_2.js","assets/antd-CCsYAw7I.js","assets/MainView-5iBGMUiI.js","assets/markdown-CW6G-SAw.js","assets/StarsBg-CcnR97FR.js","assets/PetalsBg-D_AokOss.js"])))=>i.map(i=>d[i]);
import{S as ee,f as l,c as L,d as K,U as x,V as te,W as ne,u as g,X as oe,Y as re,Z as k,_ as R,$ as P,a0 as se,k as T,m as V,a1 as U,a2 as O,R as ae,a3 as ce}from"./vue-vendor-D5EOz6_2.js";import{A as ie}from"./antd-CCsYAw7I.js";(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);new MutationObserver(o=>{for(const s of o)if(s.type==="childList")for(const r of s.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const s={};return o.integrity&&(s.integrity=o.integrity),o.referrerPolicy&&(s.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?s.credentials="include":o.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function a(o){if(o.ep)return;o.ep=!0;const s=n(o);fetch(o.href,s)}})();const le="modulepreload",ue=function(e){return"/love/"+e},j={},p=function(t,n,a){let o=Promise.resolve();if(n&&n.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),c=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));o=Promise.allSettled(n.map(i=>{if(i=ue(i),i in j)return;j[i]=!0;const f=i.endsWith(".css"),_=f?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${i}"]${_}`))return;const d=document.createElement("link");if(d.rel=f?"stylesheet":le,f||(d.as="script"),d.crossOrigin="",d.href=i,c&&d.setAttribute("nonce",c),document.head.appendChild(d),f)return new Promise((h,E)=>{d.addEventListener("load",h),d.addEventListener("error",()=>E(new Error(`Unable to preload CSS for ${i}`)))})}))}function s(r){const c=new Event("vite:preloadError",{cancelable:!0});if(c.payload=r,window.dispatchEvent(c),!c.defaultPrevented)throw r}return o.then(r=>{for(const c of r||[])c.status==="rejected"&&s(c.reason);return t().catch(s)})},de="",z="deepseek-chat",fe=.9,me=2048,pe=6e4,_e=8e3,$="https://api.deepseek.com/chat/completions";function H(){return{"Content-Type":"application/json",Authorization:`Bearer ${de}`}}function J(){const e=[];return e.push({name:"cors-proxy",url:"https://corsproxy.io/?"+encodeURIComponent($),buildHeaders:H}),e.push({name:"direct",url:$,buildHeaders:H}),e}const ge="乐乐",je="乐乐私人助理",$e=60,He=100;function ve(){return`你是深夜心语亭的专属倾听者，陪伴 ${ge} 深夜对话。
你拥有**顶级全能能力**：既能温柔治愈、韩式文艺氛围感谈心，也能专业、精准、全面地解决用户一切现实问题。
温柔是你的底色，**万能解决问题是你的核心能力**。绝对不只会说情话，不敷衍、不空洞、不矫情。

# 一、核心人设（最重要）
1. 用户情绪、谈心、深夜聊天 → 温柔、细腻、韩式文艺、轻微浪漫、治愈、带一点可爱反差、少量韩文点缀。
2. 用户提问、做事、求助、学习、工作、创作 → **立刻切换专业全能模式**，理性、严谨、详细、落地、完整、专业度拉满。
3. 永远不会主动暧昧、不会主动说情话、不会无脑抒情，只在用户明确要求时轻微配合。

# 二、你拥有的全部能力（全覆盖、无短板）
你可以完美处理以下所有场景，输出专业、高质量、可直接使用的内容：

【学习学术】解题、知识点讲解、论文润色、作文写作、演讲稿、背诵口诀、错题分析、学习规划、考研四六级答疑
【编程技术】代码编写、改错、调试、前端后端、Python/JS/TS/Java/算法、API对接、报错解决、写函数
【职场工作】方案撰写、工作总结、周报月报、简历优化、面试题库、职场话术、公关文案、项目策划
【生活实用】做饭教程、出行攻略、物品选购、健身计划、作息调整、常见病常识、人际相处技巧
【创意内容】写文案、写故事、写诗、台词、语录、朋友圈、短视频脚本、治愈文案、氛围感文案
【逻辑思维】做选择、利弊分析、情绪疏导、人格分析、问题拆解、决策建议、内耗根治
【知识科普】历史、地理、科技、人文、心理、常识、金融、互联网、各行各业基础知识

所有务实问题必须：结构清晰、内容完整、可直接使用、步骤明确、专业准确。

# 三、场景严格区分规则
1. **情绪/深夜闲聊/孤独/恋爱心情**
使用韩式温柔、细腻、氛围感文字，轻柔隐喻，少量韩文（안녕、괜찮아、보고싶어），偶尔可爱反差，治愈陪伴。

2. **所有正事、提问、干活、学习、工作、创作**
关闭所有浪漫、情话、抒情氛围。
输出**专业、干净、详细、结构化、落地**的标准答案，用 Markdown 分点、加粗、分段，条理清晰。

3. **纠结、焦虑、内耗、压力大**
先温柔共情，再理性拆解问题，最后给出**可立刻执行的解决方案**，不鸡汤、不敷衍。

# 四、语言风格规范
- 情绪对话：温柔文艺、松弛深夜语感
- 务实问答：简洁、专业、高效、信息密度高
- 适度使用 Markdown：标题、分段、列表、重点加粗
- 中文为主，韩文仅轻微点缀氛围，不喧宾夺主
- 回答长度自适应：短问题精炼，复杂问题详细拉满

# 五、绝对禁止
1. 禁止无脑情话、禁止主动暧昧、禁止通篇抒情敷衍问题
2. 禁止自称 AI、助手、模型、机器人、程序
3. 禁止任何时候用鸡汤代替解决方案
4. 禁止过度沙雕、破坏高级治愈氛围感
5. 禁止答非所问、敷衍短句

# 六、终极要求
用户需要陪伴，你就是最温柔的深夜倾听者；
用户需要解决问题，你就是**全能专业超级助手**。
可盐可甜、可治愈可专业、无所不能，是你最终人设。
`}function he(){return[{role:"system",content:ve()}]}async function Ke(){const e=J(),t={model:z,messages:[{role:"user",content:"hi"}],stream:!1,max_tokens:1};for(let n=0;n<e.length;n++){const a=e[n];try{const o=new AbortController,s=setTimeout(()=>o.abort(),_e),r=await fetch(a.url,{method:"POST",headers:a.buildHeaders(),body:JSON.stringify(t),mode:"cors",signal:o.signal});if(clearTimeout(s),r.ok)return n}catch{}}return 0}async function Ee(e,t){var r,c;if(!e.body)return"";const n=e.body.getReader(),a=new TextDecoder("utf-8");let o="",s="";try{for(;;){const{done:i,value:f}=await n.read();if(i)break;o+=a.decode(f,{stream:!0});const _=o.split(`
`);o=_.pop()||"";for(const d of _){const h=d.trim();if(!h||!h.startsWith("data:"))continue;const E=h.slice(5).trim();if(E!=="[DONE]")try{const I=(c=(r=JSON.parse(E).choices)==null?void 0:r[0])==null?void 0:c.delta;if(!I)continue;const w=I.content||"";w&&(s+=w,t(s))}catch{}}}}catch{}return s}function ze(e){const t=(e==null?void 0:e.message)||"";return t.includes("Failed to fetch")||t.includes("NetworkError")?"网络或跨域受限，已尝试备用线路，请检查网络":t.includes("401")?"API 密钥无效，请检查 .env 配置":t.includes("429")?"请求太频繁，稍后再试":t.includes("abort")?"请求超时，请稍后重试":"请求失败，请稍后重试"}async function ye(e,t,n){const a=new AbortController,o=setTimeout(()=>a.abort(),pe),s={model:z,messages:t,stream:!0,temperature:fe,max_tokens:me};try{const r=await fetch(e.url,{method:"POST",headers:e.buildHeaders(),body:JSON.stringify(s),mode:"cors",signal:a.signal});if(!r.ok){const c=await r.text();throw new Error(`HTTP ${r.status}: ${c.slice(0,120)}`)}return await Ee(r,n)}finally{clearTimeout(o)}}async function Je(e){var a,o;const t=J();let n=null;for(let s=0;s<t.length;s++){const r=(e.activeEndpointIndex+s)%t.length,c=t[r];try{return s>0?(a=e.onEndpointSwitch)==null||a.call(e,"已切换备用线路..."):(o=e.onEndpointSwitch)==null||o.call(e,""),{content:await ye(c,e.messages,e.onDelta),endpointIndex:r}}catch(i){n=i}}throw n||new Error("所有端点均不可用")}const Se=ee("app",()=>{const e=l(!0),t=l(0),n=l(!1),a=l(he()),o=l(!1),s=l(0),r=l(""),c=L(()=>`${t.value}%`),i=L(()=>`${t.value} / 100`);function f(u){n.value||(t.value=Math.min(100,t.value+u),t.value>=100&&!n.value&&(n.value=!0))}function _(u){e.value=u}function d(u){a.value.push({role:"user",content:u})}function h(u){a.value.push({role:"assistant",content:u})}function E(){a.value.pop()}function C(u){o.value=u}function I(u){s.value=u}function w(u){r.value=u}return{isIntroActive:e,heartScore:t,heartMaxed:n,messages:a,isStreaming:o,activeEndpointIndex:s,statusTip:r,heartPercent:c,heartScoreText:i,addHeartScore:f,setIntroActive:_,addUserMessage:d,addAiMessage:h,removeLastMessage:E,setStreaming:C,setEndpointIndex:I,setStatusTip:w}}),Y="love_bg_index",F="love_music_playing",S=[1,2,3,4,5,6],Te=Object.assign({"/src/assets/img/1.jpg":()=>p(()=>import("./1-DWdn9RMl.js"),[]).then(e=>e.default),"/src/assets/img/2.jpg":()=>p(()=>import("./2-BXz5gwM5.js"),[]).then(e=>e.default),"/src/assets/img/3.jpg":()=>p(()=>import("./3-ZQWPkToq.js"),[]).then(e=>e.default),"/src/assets/img/4.jpg":()=>p(()=>import("./4-ClQcp1Py.js"),[]).then(e=>e.default),"/src/assets/img/5.jpg":()=>p(()=>import("./5-GQXj3eKO.js"),[]).then(e=>e.default),"/src/assets/img/6.jpg":()=>p(()=>import("./6-DruUe9vm.js"),[]).then(e=>e.default)}),X=new Map;Object.entries(Te).forEach(([e,t])=>{const n=e.match(/(\d+)\.jpg/);n&&X.set(Number(n[1]),t)});const y=l({}),b=l(new Set),A=l(0),q=l(""),v=l(!1);let m=null;async function B(e){if(y.value[e])return y.value[e];const t=X.get(e);if(!t)return"";b.value=new Set([...b.value,e]);try{const n=await t();return y.value={...y.value,[e]:n},n}finally{const n=new Set(b.value);n.delete(e),b.value=n}}async function G(e){const t=S[e];if(!t)return;const n=await B(t);n&&(q.value=n)}async function be(){const e=localStorage.getItem(Y);if(e!==null){const t=parseInt(e,10);t>=0&&t<S.length&&(A.value=t)}v.value=localStorage.getItem(F)==="true",await G(A.value)}function Ae(){m||p(()=>import("./music-DMkHRHXb.js"),[]).then(e=>{m=new Audio(e.default),m.loop=!0,m.volume=.4,m.addEventListener("ended",()=>{m&&(m.currentTime=0,m.play().catch(()=>{v.value=!1}))})})}function W(){if(Ae(),!m){setTimeout(W,200);return}v.value?(m.pause(),v.value=!1):(m.play().catch(()=>{v.value=!1}),v.value=!0),localStorage.setItem(F,String(v.value))}async function Q(e){e<0||e>=S.length||(A.value=e,localStorage.setItem(Y,String(e)),await G(e))}async function Ie(){await Q((A.value+1)%S.length)}async function we(){await Promise.all(S.map(e=>B(e)))}const Pe=L(()=>S.map((e,t)=>({index:t,id:e,url:y.value[e]||"",loaded:!!y.value[e],loading:b.value.has(e)})));be();function Oe(){return{currentBgUrl:q,currentBgIndex:A,backgroundList:Pe,isMusicPlaying:v,toggleMusic:W,setBackground:Q,nextBackground:Ie,loadBackground:B,preloadAllBackgrounds:we}}const Z=l(""),D=l(!1);let M=null;function xe(e,t=2800){Z.value=e,D.value=!0,M&&clearTimeout(M),M=setTimeout(()=>{D.value=!1},t)}function Le(){return{toastText:Z,toastVisible:D,showToast:xe}}const ke=K({__name:"Toast",setup(e){const{toastText:t,toastVisible:n}=Le();return(a,o)=>(x(),te("div",{class:oe(["pointer-events-none fixed left-1/2 top-6 z-[70] -translate-x-1/2 rounded-full border border-rose/30 bg-white/90 px-5 py-2 text-xs text-night/70 shadow-lg backdrop-blur-md transition-transform duration-500",g(n)?"translate-y-0":"translate-y-[-180%]"])},ne(g(t)),3))}}),Re={class:"relative min-h-screen"},Me={class:"pointer-events-none fixed inset-0 z-[1] opacity-40"},De=K({__name:"App",setup(e){const t=O(()=>p(()=>import("./IntroView-BGVUNLbM.js"),__vite__mapDeps([0,1,2]))),n=O(()=>p(()=>import("./MainView-5iBGMUiI.js"),__vite__mapDeps([3,1,4,2]))),a=O(()=>p(()=>import("./StarsBg-CcnR97FR.js"),__vite__mapDeps([5,1,2]))),o=O(()=>p(()=>import("./PetalsBg-D_AokOss.js"),__vite__mapDeps([6,1,2]))),s=Se(),{currentBgUrl:r}=Oe(),c=L(()=>s.isIntroActive);return(i,f)=>{const _=re("a-config-provider");return x(),k(_,{theme:{token:{colorPrimary:"#e8a0b4",borderRadius:12,fontFamily:"Noto Sans SC, sans-serif"}}},{default:R(()=>[P("div",Re,[P("div",{class:"fixed inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700",style:se({backgroundImage:g(r)?`url(${g(r)})`:void 0})},[...f[0]||(f[0]=[P("div",{class:"absolute inset-0 bg-gradient-to-br from-blush/80 via-cream/70 to-petal/80"},null,-1)])],4),P("div",Me,[T(g(a)),T(g(o))]),T(V,{name:"fade"},{default:R(()=>[c.value?(x(),k(g(t),{key:0})):U("",!0)]),_:1}),T(V,{name:"fade"},{default:R(()=>[c.value?U("",!0):(x(),k(g(n),{key:0}))]),_:1}),T(ke)])]),_:1})}}}),Be=(e,t)=>{const n=e.__vccOpts||e;for(const[a,o]of t)n[a]=o;return n},Ne=Be(De,[["__scopeId","data-v-c8ca4824"]]),N=ae(Ne),Ce=ce();N.use(Ce);N.use(ie);N.mount("#app");export{je as A,$e as I,ge as T,He as U,Je as a,Oe as b,ze as f,Ke as p,xe as s,Se as u};
