import{u as F}from"./useMutation-BcsYU11w.js";import{G as q,d as E,x as U,p as v,Q as R,S as T,T as i,_ as G,r as z,o as V,c as D,w as s,a as n,V as M,b as y,e as t,i as P,t as Q,j as H,g as J,E as m,l as K,v as L}from"./index-D8apdIrF.js";import{C as O,u as W}from"./CustomInput-Psgnhk9x.js";import{V as X}from"./VCard-BzsTKAXT.js";import{V as Y}from"./VTextField-gAq9Whng.js";import"./useQueryClient-CA8bKV2U.js";const Z=async o=>{try{const{data:e}=await q.post("entrenadores/registrar",o);return e}catch{throw new Error("error creating coach")}},x=T({nombre:i().required(),correo_electronico:i().required(),telefono:i().required(),contrasenia:i().required()}),h=E({components:{CustomInput:O},setup(){const o=U(),e=v(""),c=v(!1),{mutate:p,isSuccess:f,data:u}=F({mutationFn:Z}),{values:l,errors:r,defineField:a,resetForm:C,handleSubmit:g}=W({validationSchema:x}),[w,k]=a("nombre"),[A,S]=a("correo_electronico"),[j,I]=a("telefono"),[$,N]=a("contrasenia"),B=g(async d=>{p(d)});return R(f,d=>{var b;d&&(e.value="El Coach se ha creado correctamente",o.replace(`/admin/instructores/lista-instructores/${(b=u.value.data)==null?void 0:b.id}`),C({values:u.value}))}),{values:l,mensaje:e,visible:c,errors:r,nombre:w,nombreAttrs:k,correo_electronico:A,correo_electronicoAttrs:S,telefono:j,telefonoAttrs:I,contrasenia:$,contraseniaAttrs:N,onSubmit:B}}}),_={key:0,class:"mensaje text-center"};function ee(o,e,c,p,f,u){const l=z("CustomInput");return V(),D(L,{fluid:"",class:"login-container"},{default:s(()=>[n(M,null,{default:s(()=>[n(y,{cols:"12",md:"12",class:"d-flex justify-center md:justify-center"},{default:s(()=>e[6]||(e[6]=[t("h1",null,"Agregar nuevo instructor",-1)])),_:1}),n(y,{cols:"12",md:"12",class:"d-flex justify-center md:justify-center"},{default:s(()=>[n(X,{class:"pa-6 pa-md-12 pb-8 mr-md-32",style:{"background-color":"black",opacity:"0.8","margin-top":"20px"},elevation:"8",rounded:"lg",width:"500","max-width":"800px"},{default:s(()=>[o.mensaje?(V(),P("div",_,Q(o.mensaje),1)):H("",!0),e[15]||(e[15]=J()),e[16]||(e[16]=t("br",null,null,-1)),t("form",{onSubmit:e[5]||(e[5]=(...r)=>o.onSubmit&&o.onSubmit(...r))},[e[8]||(e[8]=t("div",{class:"texto"},"Nombre del Instructor",-1)),e[9]||(e[9]=t("br",null,null,-1)),n(l,m({modelValue:o.nombre,"onUpdate:modelValue":e[0]||(e[0]=r=>o.nombre=r)},o.nombreAttrs,{error:o.errors.nombre,icon:"mdi-account"}),null,16,["modelValue","error"]),e[10]||(e[10]=t("div",{class:"texto"},"Numero telefonico",-1)),e[11]||(e[11]=t("br",null,null,-1)),n(l,m({modelValue:o.telefono,"onUpdate:modelValue":e[1]||(e[1]=r=>o.telefono=r)},o.telefonoAttrs,{error:o.errors.telefono,icon:"mdi-phone"}),null,16,["modelValue","error"]),e[12]||(e[12]=t("div",{class:"texto"},"Correo electronico",-1)),e[13]||(e[13]=t("br",null,null,-1)),n(l,m({modelValue:o.correo_electronico,"onUpdate:modelValue":e[2]||(e[2]=r=>o.correo_electronico=r)},o.correo_electronicoAttrs,{error:o.errors.correo_electronico,icon:"mdi-email"}),null,16,["modelValue","error"]),e[14]||(e[14]=t("div",{class:"texto"},"Contraseña",-1)),n(Y,{modelValue:o.contrasenia,"onUpdate:modelValue":e[3]||(e[3]=r=>o.contrasenia=r),icon:o.visible?"mdi-eye-off":"mdi-eye",type:o.visible?"text":"password",density:"compact",placeholder:"Ingresa tu contraseña","prepend-inner-icon":"mdi-lock-outline",variant:"outlined",class:"custom-text-field","base-color":"black","bg-color":"white",autocomplete:"current-password","onClick:appendInner":e[4]||(e[4]=r=>o.visible=!o.visible)},null,8,["modelValue","icon","type"]),n(K,{type:"submit",class:"mb-8",color:"black",size:"large",variant:"tonal",block:""},{default:s(()=>e[7]||(e[7]=[t("div",{class:"texto"},"Registrar instructor",-1)])),_:1})],32)]),_:1})]),_:1})]),_:1})]),_:1})}const ae=G(h,[["render",ee],["__scopeId","data-v-e60ace0e"]]);export{ae as default};
