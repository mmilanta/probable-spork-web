var Nr=(_,m)=>()=>(m||_((m={exports:{}}).exports,m),m.exports);var jr=Nr((Q,S)=>{var k=(()=>{var m;var _=typeof document<"u"?(m=document.currentScript)==null?void 0:m.src:void 0;return async function(X={}){var B,n=X,F,b,Y=new Promise((r,e)=>{F=r,b=e}),H=Object.assign({},n),l="";function Z(r){return n.locateFile?n.locateFile(r,l):l+r}var W;typeof document<"u"&&document.currentScript&&(l=document.currentScript.src),_&&(l=_),l.startsWith("blob:")?l="":l=l.substr(0,l.replace(/[?#].*/,"").lastIndexOf("/")+1),W=async r=>{var e=await fetch(r,{credentials:"same-origin"});if(e.ok)return e.arrayBuffer();throw new Error(e.status+" : "+e.url)};var x=n.print||console.log.bind(console),w=n.printErr||console.error.bind(console);Object.assign(n,H),H=null,n.arguments&&n.arguments,n.thisProgram&&n.thisProgram;var h=n.wasmBinary,D,O=!1,I,g,P,rr="data:application/octet-stream;base64,",N=r=>r.startsWith(rr);function er(){var r=D.buffer;n.HEAP8=I=new Int8Array(r),n.HEAP16=new Int16Array(r),n.HEAPU8=g=new Uint8Array(r),n.HEAPU16=new Uint16Array(r),n.HEAP32=new Int32Array(r),n.HEAPU32=P=new Uint32Array(r),n.HEAPF32=new Float32Array(r),n.HEAPF64=new Float64Array(r),n.HEAP64=new BigInt64Array(r),n.HEAPU64=new BigUint64Array(r)}var j=[],z=[],$=[];function nr(){if(n.preRun)for(typeof n.preRun=="function"&&(n.preRun=[n.preRun]);n.preRun.length;)ir(n.preRun.shift());E(j)}function tr(){E(z)}function ar(){if(n.postRun)for(typeof n.postRun=="function"&&(n.postRun=[n.postRun]);n.postRun.length;)sr(n.postRun.shift());E($)}function ir(r){j.unshift(r)}function fr(r){z.unshift(r)}function sr(r){$.unshift(r)}var d=0,A=null;function or(r){var e;d++,(e=n.monitorRunDependencies)==null||e.call(n,d)}function cr(r){var t;if(d--,(t=n.monitorRunDependencies)==null||t.call(n,d),d==0&&A){var e=A;A=null,e()}}function q(r){var t;(t=n.onAbort)==null||t.call(n,r),r="Aborted("+r+")",w(r),O=!0,r+=". Build with -sASSERTIONS for more info.";var e=new WebAssembly.RuntimeError(r);throw b(e),e}var U;function ur(){var r="algo.wasm";return N(r)?r:Z(r)}function vr(r){if(r==U&&h)return new Uint8Array(h);throw"both async and sync fetching of the wasm failed"}async function lr(r){if(!h)try{var e=await W(r);return new Uint8Array(e)}catch{}return vr(r)}async function mr(r,e){try{var t=await lr(r),s=await WebAssembly.instantiate(t,e);return s}catch(o){w(`failed to asynchronously prepare wasm: ${o}`),q(o)}}async function dr(r,e,t){if(!r&&typeof WebAssembly.instantiateStreaming=="function"&&!N(e))try{var s=fetch(e,{credentials:"same-origin"}),o=await WebAssembly.instantiateStreaming(s,t);return o}catch(a){w(`wasm streaming compile failed: ${a}`),w("falling back to ArrayBuffer instantiation")}return mr(e,t)}function yr(){return{a:Hr}}async function pr(){function r(a,i){return u=a.exports,D=u.e,er(),fr(u.f),cr(),u}or();function e(a){return r(a.instance)}var t=yr();if(n.instantiateWasm)try{return n.instantiateWasm(t,r)}catch(a){w(`Module.instantiateWasm callback failed with error: ${a}`),b(a)}U??(U=ur());try{var s=await dr(h,U,t),o=e(s);return o}catch(a){return b(a),Promise.reject(a)}}var E=r=>{for(;r.length>0;)r.shift()(n)};n.noExitRuntime;var wr=r=>Wr(r),gr=()=>Or(),Ar=r=>{q("OOM")},Rr=r=>{g.length,Ar()},_r=r=>52;function br(r,e,t,s){return 70}var hr=[null,[],[]],V=typeof TextDecoder<"u"?new TextDecoder:void 0,G=(r,e=0,t=NaN)=>{for(var s=e+t,o=e;r[o]&&!(o>=s);)++o;if(o-e>16&&r.buffer&&V)return V.decode(r.subarray(e,o));for(var a="";e<o;){var i=r[e++];if(!(i&128)){a+=String.fromCharCode(i);continue}var f=r[e++]&63;if((i&224)==192){a+=String.fromCharCode((i&31)<<6|f);continue}var v=r[e++]&63;if((i&240)==224?i=(i&15)<<12|f<<6|v:i=(i&7)<<18|f<<12|v<<6|r[e++]&63,i<65536)a+=String.fromCharCode(i);else{var y=i-65536;a+=String.fromCharCode(55296|y>>10,56320|y&1023)}}return a},Pr=(r,e)=>{var t=hr[r];e===0||e===10?((r===1?x:w)(G(t)),t.length=0):t.push(e)},Sr=(r,e)=>r?G(g,r,e):"",Ur=(r,e,t,s)=>{for(var o=0,a=0;a<t;a++){var i=P[e>>2],f=P[e+4>>2];e+=8;for(var v=0;v<f;v++)Pr(r,g[i+v]);o+=f}return P[s>>2]=o,0},J=r=>{var e=n["_"+r];return e},Er=(r,e)=>{I.set(r,e)},Tr=r=>{for(var e=0,t=0;t<r.length;++t){var s=r.charCodeAt(t);s<=127?e++:s<=2047?e+=2:s>=55296&&s<=57343?(e+=4,++t):e+=3}return e},Cr=(r,e,t,s)=>{if(!(s>0))return 0;for(var o=t,a=t+s-1,i=0;i<r.length;++i){var f=r.charCodeAt(i);if(f>=55296&&f<=57343){var v=r.charCodeAt(++i);f=65536+((f&1023)<<10)|v&1023}if(f<=127){if(t>=a)break;e[t++]=f}else if(f<=2047){if(t+1>=a)break;e[t++]=192|f>>6,e[t++]=128|f&63}else if(f<=65535){if(t+2>=a)break;e[t++]=224|f>>12,e[t++]=128|f>>6&63,e[t++]=128|f&63}else{if(t+3>=a)break;e[t++]=240|f>>18,e[t++]=128|f>>12&63,e[t++]=128|f>>6&63,e[t++]=128|f&63}}return e[t]=0,t-o},kr=(r,e,t)=>Cr(r,g,e,t),K=r=>Dr(r),Br=r=>{var e=Tr(r)+1,t=K(e);return kr(r,t,e),t},L=(r,e,t,s,o)=>{var a={string:c=>{var R=0;return c!=null&&c!==0&&(R=Br(c)),R},array:c=>{var R=K(c.length);return Er(c,R),R}};function i(c){return e==="string"?Sr(c):e==="boolean"?!!c:c}var f=J(r),v=[],y=0;if(s)for(var p=0;p<s.length;p++){var M=a[t[p]];M?(y===0&&(y=gr()),v[p]=M(s[p])):v[p]=s[p]}var C=f(...v);function Ir(c){return y!==0&&wr(y),i(c)}return C=Ir(C),C},Fr=(r,e,t,s)=>{var o=!t||t.every(i=>i==="number"||i==="boolean"),a=e!=="string";return a&&o&&!s?J(r):(...i)=>L(r,e,t,i)},Hr={b:Rr,d:_r,c:br,a:Ur},u=await pr();u.f,n._malloc=u.g,n._free=u.h,n._prob=u.i,n._explen=u.j;var Wr=u.l,Dr=u.m,Or=u.n;n.ccall=L,n.cwrap=Fr;function T(){if(d>0){A=T;return}if(nr(),d>0){A=T;return}function r(){var e;n.calledRun=!0,!O&&(tr(),F(n),(e=n.onRuntimeInitialized)==null||e.call(n),ar())}n.setStatus?(n.setStatus("Running..."),setTimeout(()=>{setTimeout(()=>n.setStatus(""),1),r()},1)):r()}if(n.preInit)for(typeof n.preInit=="function"&&(n.preInit=[n.preInit]);n.preInit.length>0;)n.preInit.pop()();return T(),B=Y,B}})();typeof Q=="object"&&typeof S=="object"?(S.exports=k,S.exports.default=k):typeof define=="function"&&define.amd&&define([],()=>k)});export default jr();
