import{u as i,s as l}from"./index-wHRbhc2L.js";import{d as c,f as m,o as d,U as p,V as u}from"./vue-vendor-DP4rC7Ky.js";import"./antd-D0iRcJPw.js";const x=c({__name:"StarsBg",setup(f){const n=i(),a=m(null);return d(()=>{if(a.value)for(let s=0;s<60;s++){const t=document.createElement("div"),o=Math.random()*2+1;t.className="star-item absolute cursor-pointer rounded-full bg-white animate-twinkle transition-transform",t.style.cssText=`
      width:${o}px;height:${o}px;
      left:${Math.random()*100}%;top:${Math.random()*100}%;
      animation-delay:${Math.random()*3}s;
      animation-duration:${2+Math.random()*2}s;
    `,t.addEventListener("click",r=>{const e=r.target;e.style.transform="scale(3)",e.style.opacity="1",l("你摘了一颗星星 ⭐"),n.addHeartScore(2),setTimeout(()=>{e.style.transform="",e.style.opacity=""},600)}),a.value.appendChild(t)}}),(s,t)=>(p(),u("div",{ref_key:"starsContainer",ref:a,class:"fixed inset-0 z-0"},null,512))}});export{x as default};
