import{_ as n}from"./Subscription.ts_vue_type_script_src_true_lang-CMRZC0ho.js";import{_ as u,r as p,o as d,c as f,w as t,a as i,V as b,b as m,e as s,i as V,t as g,j as v,g as c,E as a,l as y,v as j}from"./index-D8apdIrF.js";import{V as k}from"./VCard-BzsTKAXT.js";import{V as C}from"./VSelect-_cOowk88.js";import"./useQuery-Ico0mqlw.js";import"./useQueryClient-CA8bKV2U.js";import"./useMutation-BcsYU11w.js";import"./get-subscribe.action-qfxfOJMv.js";import"./get-subscription-by-id.action-Dn4hsDQQ.js";import"./CustomInput-Psgnhk9x.js";import"./dateUtils-CyrnVGE1.js";import"./get-memberships.action-DNV8Kcpb.js";import"./VTextField-gAq9Whng.js";const w={key:0,class:"mensaje text-center"},B={class:"input-group"},N={class:"input-group"},S={class:"input-group"};function A(o,e,I,U,$,x){const l=p("CustomInput");return d(),f(j,{fluid:"",class:"login-container"},{default:t(()=>[i(b,null,{default:t(()=>[i(m,{cols:"12",md:"12",class:"d-flex justify-center md:justify-center"},{default:t(()=>e[4]||(e[4]=[s("h1",null,"Nueva inscripción",-1)])),_:1}),i(m,{cols:"12",md:"12",class:"d-flex justify-center md:justify-center"},{default:t(()=>[i(k,{class:"pa-6 pa-md-12 pb-8 mr-md-32",style:{"background-color":"black",opacity:"0.8","margin-top":"20px"},elevation:"8",rounded:"lg",width:"500","max-width":"800px"},{default:t(()=>[o.mensaje?(d(),V("div",w,g(o.mensaje),1)):v("",!0),e[9]||(e[9]=c()),e[10]||(e[10]=s("br",null,null,-1)),s("form",{onSubmit:e[3]||(e[3]=(...r)=>o.onSubmit&&o.onSubmit(...r))},[s("div",B,[e[5]||(e[5]=s("div",{class:"texto"},"Usuario: ",-1)),i(l,a({modelValue:o.id_usuario,"onUpdate:modelValue":e[0]||(e[0]=r=>o.id_usuario=r)},o.id_usuarioAttrs,{error:o.errors.id_usuario,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),s("div",N,[e[6]||(e[6]=s("div",{class:"texto"},"Membresia: ",-1)),i(C,a({modelValue:o.id_membresia,"onUpdate:modelValue":e[1]||(e[1]=r=>o.id_membresia=r),modelModifiers:{number:!0}},o.id_membresia,{items:o.memberships,rules:[r=>!!r||"La membresia es requerida"],label:"membresia"}),null,16,["modelValue","items","rules"])]),s("div",S,[e[7]||(e[7]=s("div",{class:"texto"},"Fecha de la inscripcion",-1)),i(l,a({modelValue:o.fecha_inicio,"onUpdate:modelValue":e[2]||(e[2]=r=>o.fecha_inicio=r)},o.fecha_inicioAttrs,{error:o.errors.fecha_inicio,type:"date",icon:"mdi-text-box"}),null,16,["modelValue","error"])]),i(y,{type:"submit",class:"mb-8",color:"black",size:"large",variant:"tonal",block:""},{default:t(()=>e[8]||(e[8]=[s("div",{class:"texto"},"Agregar actividad",-1)])),_:1})],32)]),_:1})]),_:1})]),_:1})]),_:1})}const J=u(n,[["render",A],["__scopeId","data-v-d3231686"]]);export{J as default};
