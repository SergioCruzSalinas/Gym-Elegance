var ct=i=>{throw TypeError(i)};var X=(i,t,s)=>t.has(i)||ct("Cannot "+s);var e=(i,t,s)=>(X(i,t,"read from private field"),s?s.call(i):t.get(i)),p=(i,t,s)=>t.has(i)?ct("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(i):t.set(i,s),c=(i,t,s,r)=>(X(i,t,"write to private field"),r?r.call(i,s):t.set(i,s),s),f=(i,t,s)=>(X(i,t,"access private method"),s);import{by as yt,bz as ut,bA as C,bB as Y,bC as G,bD as Ot,bE as lt,bF as dt,bG as Ct,bH as St,bI as wt,bJ as ft,bK as It,q as Qt,bL as Et,bM as Ft,Q as V,aH as Ut,aF as Dt,bN as pt,bO as bt}from"./index-D8apdIrF.js";import{u as Tt}from"./useQueryClient-CA8bKV2U.js";var m,a,W,v,F,_,I,O,N,k,z,U,D,Q,B,h,H,Z,$,q,tt,et,st,it,gt,Rt,Lt=(Rt=class extends yt{constructor(t,s){super();p(this,h);p(this,m);p(this,a);p(this,W);p(this,v);p(this,F);p(this,_);p(this,I);p(this,O);p(this,N);p(this,k);p(this,z);p(this,U);p(this,D);p(this,Q);p(this,B,new Set);this.options=s,c(this,m,t),c(this,O,null),c(this,I,ut()),this.options.experimental_prefetchInRender||e(this,I).reject(new Error("experimental_prefetchInRender feature flag is not enabled")),this.bindMethods(),this.setOptions(s)}bindMethods(){this.refetch=this.refetch.bind(this)}onSubscribe(){this.listeners.size===1&&(e(this,a).addObserver(this),vt(e(this,a),this.options)?f(this,h,H).call(this):this.updateResult(),f(this,h,tt).call(this))}onUnsubscribe(){this.hasListeners()||this.destroy()}shouldFetchOnReconnect(){return rt(e(this,a),this.options,this.options.refetchOnReconnect)}shouldFetchOnWindowFocus(){return rt(e(this,a),this.options,this.options.refetchOnWindowFocus)}destroy(){this.listeners=new Set,f(this,h,et).call(this),f(this,h,st).call(this),e(this,a).removeObserver(this)}setOptions(t,s){const r=this.options,u=e(this,a);if(this.options=e(this,m).defaultQueryOptions(t),this.options.enabled!==void 0&&typeof this.options.enabled!="boolean"&&typeof this.options.enabled!="function"&&typeof C(this.options.enabled,e(this,a))!="boolean")throw new Error("Expected enabled to be a boolean or a callback that returns a boolean");f(this,h,it).call(this),e(this,a).setOptions(this.options),r._defaulted&&!Y(this.options,r)&&e(this,m).getQueryCache().notify({type:"observerOptionsUpdated",query:e(this,a),observer:this});const o=this.hasListeners();o&&mt(e(this,a),u,this.options,r)&&f(this,h,H).call(this),this.updateResult(s),o&&(e(this,a)!==u||C(this.options.enabled,e(this,a))!==C(r.enabled,e(this,a))||G(this.options.staleTime,e(this,a))!==G(r.staleTime,e(this,a)))&&f(this,h,Z).call(this);const l=f(this,h,$).call(this);o&&(e(this,a)!==u||C(this.options.enabled,e(this,a))!==C(r.enabled,e(this,a))||l!==e(this,Q))&&f(this,h,q).call(this,l)}getOptimisticResult(t){const s=e(this,m).getQueryCache().build(e(this,m),t),r=this.createResult(s,t);return xt(this,r)&&(c(this,v,r),c(this,_,this.options),c(this,F,e(this,a).state)),r}getCurrentResult(){return e(this,v)}trackResult(t,s){const r={};return Object.keys(t).forEach(u=>{Object.defineProperty(r,u,{configurable:!1,enumerable:!0,get:()=>(this.trackProp(u),s==null||s(u),t[u])})}),r}trackProp(t){e(this,B).add(t)}getCurrentQuery(){return e(this,a)}refetch({...t}={}){return this.fetch({...t})}fetchOptimistic(t){const s=e(this,m).defaultQueryOptions(t),r=e(this,m).getQueryCache().build(e(this,m),s);return r.fetch().then(()=>this.createResult(r,s))}fetch(t){return f(this,h,H).call(this,{...t,cancelRefetch:t.cancelRefetch??!0}).then(()=>(this.updateResult(),e(this,v)))}createResult(t,s){var ot;const r=e(this,a),u=this.options,o=e(this,v),l=e(this,F),R=e(this,_),L=t!==r?t.state:e(this,W),{state:w}=t;let d={...w},E=!1,n;if(s._optimisticResults){const b=this.hasListeners(),j=!b&&vt(t,s),A=b&&mt(t,r,s,u);(j||A)&&(d={...d,...wt(w.data,t.options)}),s._optimisticResults==="isRestoring"&&(d.fetchStatus="idle")}let{error:S,errorUpdatedAt:M,status:g}=d;if(s.select&&d.data!==void 0)if(o&&d.data===(l==null?void 0:l.data)&&s.select===e(this,N))n=e(this,k);else try{c(this,N,s.select),n=s.select(d.data),n=ft(o==null?void 0:o.data,n,s),c(this,k,n),c(this,O,null)}catch(b){c(this,O,b)}else n=d.data;if(s.placeholderData!==void 0&&n===void 0&&g==="pending"){let b;if(o!=null&&o.isPlaceholderData&&s.placeholderData===(R==null?void 0:R.placeholderData))b=o.data;else if(b=typeof s.placeholderData=="function"?s.placeholderData((ot=e(this,z))==null?void 0:ot.state.data,e(this,z)):s.placeholderData,s.select&&b!==void 0)try{b=s.select(b),c(this,O,null)}catch(j){c(this,O,j)}b!==void 0&&(g="success",n=ft(o==null?void 0:o.data,b,s),E=!0)}e(this,O)&&(S=e(this,O),n=e(this,k),M=Date.now(),g="error");const x=d.fetchStatus==="fetching",P=g==="pending",J=g==="error",nt=P&&x,ht=n!==void 0,y={status:g,fetchStatus:d.fetchStatus,isPending:P,isSuccess:g==="success",isError:J,isInitialLoading:nt,isLoading:nt,data:n,dataUpdatedAt:d.dataUpdatedAt,error:S,errorUpdatedAt:M,failureCount:d.fetchFailureCount,failureReason:d.fetchFailureReason,errorUpdateCount:d.errorUpdateCount,isFetched:d.dataUpdateCount>0||d.errorUpdateCount>0,isFetchedAfterMount:d.dataUpdateCount>L.dataUpdateCount||d.errorUpdateCount>L.errorUpdateCount,isFetching:x,isRefetching:x&&!P,isLoadingError:J&&!ht,isPaused:d.fetchStatus==="paused",isPlaceholderData:E,isRefetchError:J&&ht,isStale:at(t,s),refetch:this.refetch,promise:e(this,I)};if(this.options.experimental_prefetchInRender){const b=K=>{y.status==="error"?K.reject(y.error):y.data!==void 0&&K.resolve(y.data)},j=()=>{const K=c(this,I,y.promise=ut());b(K)},A=e(this,I);switch(A.status){case"pending":t.queryHash===r.queryHash&&b(A);break;case"fulfilled":(y.status==="error"||y.data!==A.value)&&j();break;case"rejected":(y.status!=="error"||y.error!==A.reason)&&j();break}}return y}updateResult(t){const s=e(this,v),r=this.createResult(e(this,a),this.options);if(c(this,F,e(this,a).state),c(this,_,this.options),e(this,F).data!==void 0&&c(this,z,e(this,a)),Y(r,s))return;c(this,v,r);const u={},o=()=>{if(!s)return!0;const{notifyOnChangeProps:l}=this.options,R=typeof l=="function"?l():l;if(R==="all"||!R&&!e(this,B).size)return!0;const T=new Set(R??e(this,B));return this.options.throwOnError&&T.add("error"),Object.keys(e(this,v)).some(L=>{const w=L;return e(this,v)[w]!==s[w]&&T.has(w)})};(t==null?void 0:t.listeners)!==!1&&o()&&(u.listeners=!0),f(this,h,gt).call(this,{...u,...t})}onQueryUpdate(){this.updateResult(),this.hasListeners()&&f(this,h,tt).call(this)}},m=new WeakMap,a=new WeakMap,W=new WeakMap,v=new WeakMap,F=new WeakMap,_=new WeakMap,I=new WeakMap,O=new WeakMap,N=new WeakMap,k=new WeakMap,z=new WeakMap,U=new WeakMap,D=new WeakMap,Q=new WeakMap,B=new WeakMap,h=new WeakSet,H=function(t){f(this,h,it).call(this);let s=e(this,a).fetch(this.options,t);return t!=null&&t.throwOnError||(s=s.catch(Ot)),s},Z=function(){f(this,h,et).call(this);const t=G(this.options.staleTime,e(this,a));if(lt||e(this,v).isStale||!dt(t))return;const r=Ct(e(this,v).dataUpdatedAt,t)+1;c(this,U,setTimeout(()=>{e(this,v).isStale||this.updateResult()},r))},$=function(){return(typeof this.options.refetchInterval=="function"?this.options.refetchInterval(e(this,a)):this.options.refetchInterval)??!1},q=function(t){f(this,h,st).call(this),c(this,Q,t),!(lt||C(this.options.enabled,e(this,a))===!1||!dt(e(this,Q))||e(this,Q)===0)&&c(this,D,setInterval(()=>{(this.options.refetchIntervalInBackground||St.isFocused())&&f(this,h,H).call(this)},e(this,Q)))},tt=function(){f(this,h,Z).call(this),f(this,h,q).call(this,f(this,h,$).call(this))},et=function(){e(this,U)&&(clearTimeout(e(this,U)),c(this,U,void 0))},st=function(){e(this,D)&&(clearInterval(e(this,D)),c(this,D,void 0))},it=function(){const t=e(this,m).getQueryCache().build(e(this,m),this.options);if(t===e(this,a))return;const s=e(this,a);c(this,a,t),c(this,W,t.state),this.hasListeners()&&(s==null||s.removeObserver(this),t.addObserver(this))},gt=function(t){It.batch(()=>{t.listeners&&this.listeners.forEach(s=>{s(e(this,v))}),e(this,m).getQueryCache().notify({query:e(this,a),type:"observerResultsUpdated"})})},Rt);function Mt(i,t){return C(t.enabled,i)!==!1&&i.state.data===void 0&&!(i.state.status==="error"&&t.retryOnMount===!1)}function vt(i,t){return Mt(i,t)||i.state.data!==void 0&&rt(i,t,t.refetchOnMount)}function rt(i,t,s){if(C(t.enabled,i)!==!1){const r=typeof s=="function"?s(i):s;return r==="always"||r!==!1&&at(i,t)}return!1}function mt(i,t,s,r){return(i!==t||C(r.enabled,i)===!1)&&(!s.suspense||i.state.status!=="error")&&at(i,s)}function at(i,t){return C(t.enabled,i)!==!1&&i.isStaleByTime(G(t.staleTime,i))}function xt(i,t){return!Y(i.getCurrentResult(),t)}function Pt(i,t,s){const r=Tt(),u=Qt(()=>{const n=Et(t);typeof n.enabled=="function"&&(n.enabled=n.enabled());const S=r.defaultQueryOptions(n);return S._optimisticResults=r.isRestoring.value?"isRestoring":"optimistic",S}),o=new i(r,u.value),l=Ft(o.getCurrentResult());let R=()=>{};V(r.isRestoring,n=>{n||(R(),R=o.subscribe(S=>{pt(l,S)}))},{immediate:!0});const T=()=>{o.setOptions(u.value),pt(l,o.getCurrentResult())};V(u,T),Ut(()=>{R()});const L=(...n)=>(T(),l.refetch(...n)),w=()=>new Promise((n,S)=>{let M=()=>{};const g=()=>{if(u.value.enabled!==!1){o.setOptions(u.value);const x=o.getOptimisticResult(u.value);x.isStale?(M(),o.fetchOptimistic(u.value).then(n,P=>{bt(u.value.throwOnError,[P,o.getCurrentQuery()])?S(P):n(o.getCurrentResult())})):(M(),n(x))}};g(),M=V(u,g)});V(()=>l.error,n=>{if(l.isError&&!l.isFetching&&bt(u.value.throwOnError,[n,o.getCurrentQuery()]))throw n});const E=Dt(l);for(const n in l)typeof l[n]=="function"&&(E[n]=l[n]);return E.suspense=w,E.refetch=L,E}function zt(i,t){return Pt(Lt,i)}export{zt as u};
