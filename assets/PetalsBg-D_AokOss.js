import{s as c}from"./index-B50NEKwk.js";import{d as m,o as p,U as f,V as d,f as u}from"./vue-vendor-D5EOz6_2.js";import"./antd-CCsYAw7I.js";const x=m({__name:"PetalsBg",setup(h){const a=u(null),o=["🌸","✿","❀","🌷"];return p(()=>{if(a.value)for(let e=0;e<18;e++){const t=document.createElement("div");t.textContent=o[e%o.length],t.className="petal-item absolute cursor-pointer text-sm opacity-60 transition-transform hover:scale-125";const s=8+Math.random()*12,r=Math.random()*10,l=.6+Math.random()*.8;t.style.cssText=`
      left:${Math.random()*100}%;top:-5%;
      font-size:${l}rem;
      animation: fall ${s}s linear ${r}s infinite;
    `,t.addEventListener("click",i=>{const n=i.target;n.style.transform="scale(2)",n.style.opacity="0",c("戳爆花瓣 ✿"),setTimeout(()=>{n.style.transform="",n.style.opacity="0.6"},800)}),a.value.appendChild(t)}}),(e,t)=>(f(),d("div",{ref_key:"container",ref:a,class:"pointer-events-none fixed inset-0 z-[1]"},null,512))}});export{x as default};
