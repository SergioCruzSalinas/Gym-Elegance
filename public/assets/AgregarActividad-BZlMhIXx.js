import{_ as u}from"./activity.ts_vue_type_script_src_true_lang-D1aZdVXj.js";import{_ as m,r as p,o as a,c as f,w as l,a as t,V,b as n,e,i as v,t as b,j as g,g as c,E as d,l as y,v as A}from"./index-D8apdIrF.js";import{V as j}from"./VCard-BzsTKAXT.js";import"./useQuery-Ico0mqlw.js";import"./useQueryClient-CA8bKV2U.js";import"./useMutation-BcsYU11w.js";import"./CustomInput-Psgnhk9x.js";import"./dateUtils-CyrnVGE1.js";const k={key:0,class:"mensaje text-center"},C={class:"input-group"},U={class:"input-group"},w={class:"input-group"},B={class:"input-group"},N={class:"input-group"},I={class:"input-group"};function S(r,o,$,E,q,x){const s=p("CustomInput");return a(),f(A,{fluid:"",class:"login-container"},{default:l(()=>[t(V,null,{default:l(()=>[t(n,{cols:"12",md:"12",class:"d-flex justify-center md:justify-center"},{default:l(()=>o[7]||(o[7]=[e("h1",null,"Agregar nueva actividad",-1)])),_:1}),t(n,{cols:"12",md:"12",class:"d-flex justify-center md:justify-center"},{default:l(()=>[t(j,{class:"pa-6 pa-md-12 pb-8 mr-md-32",style:{"background-color":"black",opacity:"0.8","margin-top":"20px"},elevation:"8",rounded:"lg",width:"500","max-width":"800px"},{default:l(()=>[r.mensaje?(a(),v("div",k,b(r.mensaje),1)):g("",!0),o[15]||(o[15]=c()),o[16]||(o[16]=e("br",null,null,-1)),e("form",{onSubmit:o[6]||(o[6]=(...i)=>r.onSubmit&&r.onSubmit(...i))},[e("div",C,[o[8]||(o[8]=e("div",{class:"texto"},"Nombre o descripcion de la actividad",-1)),t(s,d({modelValue:r.descripcion,"onUpdate:modelValue":o[0]||(o[0]=i=>r.descripcion=i)},r.descripcionAttrs,{error:r.errors.descripcion,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),e("div",U,[o[9]||(o[9]=e("div",{class:"texto"},"Instructor",-1)),t(s,d({modelValue:r.id_instructor,"onUpdate:modelValue":o[1]||(o[1]=i=>r.id_instructor=i)},r.id_instructorAttrs,{error:r.errors.id_instructor,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),e("div",w,[o[10]||(o[10]=e("div",{class:"texto"},"Limite de personas",-1)),t(s,d({modelValue:r.cupo,"onUpdate:modelValue":o[2]||(o[2]=i=>r.cupo=i),modelModifiers:{number:!0}},r.cupoAttrs,{error:r.errors.cupo,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),e("div",B,[o[11]||(o[11]=e("div",{class:"texto"},"Fecha de la actividad",-1)),t(s,d({modelValue:r.fecha,"onUpdate:modelValue":o[3]||(o[3]=i=>r.fecha=i)},r.fechaAttrs,{error:r.errors.fecha,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),e("div",N,[o[12]||(o[12]=e("div",{class:"texto"},"Hora que inicia la actividad",-1)),t(s,d({modelValue:r.hora_inicio,"onUpdate:modelValue":o[4]||(o[4]=i=>r.hora_inicio=i)},r.hora_inicioAttrs,{error:r.errors.hora_inicio,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),e("div",I,[o[13]||(o[13]=e("div",{class:"texto"},"Hora que finaliza la actividad",-1)),t(s,d({modelValue:r.hora_fin,"onUpdate:modelValue":o[5]||(o[5]=i=>r.hora_fin=i)},r.hora_finAttrs,{error:r.errors.hora_fin,icon:"mdi-text-box"}),null,16,["modelValue","error"])]),t(y,{type:"submit",class:"mb-8",color:"black",size:"large",variant:"tonal",block:""},{default:l(()=>o[14]||(o[14]=[e("div",{class:"texto"},"Editar actividad",-1)])),_:1})],32)]),_:1})]),_:1})]),_:1})]),_:1})}const T=m(u,[["render",S],["__scopeId","data-v-5887c2b8"]]);export{T as default};
