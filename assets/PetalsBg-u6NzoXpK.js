import{s as c}from"./index-wHRbhc2L.js";import{d as m,f as p,o as f,U as d,V as u}from"./vue-vendor-DP4rC7Ky.js";import"./antd-D0iRcJPw.js";const x=m({__name:"PetalsBg",setup(h){const a=p(null),o=["🌸","✿","❀","🌷"];return f(()=>{if(a.value)for(let e=0;e<18;e++){const t=document.createElement("div");t.textContent=o[e%o.length],t.className="petal-item absolute cursor-pointer text-sm opacity-60 transition-transform hover:scale-125";const s=8+Math.random()*12,r=Math.random()*10,l=.6+Math.random()*.8;t.style.cssText=`
      left:${Math.random()*100}%;top:-5%;
      font-size:${l}rem;
      animation: fall ${s}s linear ${r}s infinite;
    `,t.addEventListener("click",i=>{const n=i.target;n.style.transform="scale(2)",n.style.opacity="0",c("戳爆花瓣 ✿"),setTimeout(()=>{n.style.transform="",n.style.opacity="0.6"},800)}),a.value.appendChild(t)}}),(e,t)=>(d(),u("div",{ref_key:"container",ref:a,class:"pointer-events-none fixed inset-0 z-[1]"},null,512))}});export{x as default};
