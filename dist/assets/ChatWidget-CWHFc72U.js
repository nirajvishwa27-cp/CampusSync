import{u as Ae,r as _,j as c,X as Y,k as Ne,q as he,s as Se,t as Oe}from"./react-vendor-Bp1JrkVf.js";import{u as M,o as Te,S,B as F}from"./index-DdUd7HKb.js";import"./firebase-CZOQkXfY.js";var q;(function(e){e.STRING="string",e.NUMBER="number",e.INTEGER="integer",e.BOOLEAN="boolean",e.ARRAY="array",e.OBJECT="object"})(q||(q={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var V;(function(e){e.LANGUAGE_UNSPECIFIED="language_unspecified",e.PYTHON="python"})(V||(V={}));var W;(function(e){e.OUTCOME_UNSPECIFIED="outcome_unspecified",e.OUTCOME_OK="outcome_ok",e.OUTCOME_FAILED="outcome_failed",e.OUTCOME_DEADLINE_EXCEEDED="outcome_deadline_exceeded"})(W||(W={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const z=["user","model","function","system"];var J;(function(e){e.HARM_CATEGORY_UNSPECIFIED="HARM_CATEGORY_UNSPECIFIED",e.HARM_CATEGORY_HATE_SPEECH="HARM_CATEGORY_HATE_SPEECH",e.HARM_CATEGORY_SEXUALLY_EXPLICIT="HARM_CATEGORY_SEXUALLY_EXPLICIT",e.HARM_CATEGORY_HARASSMENT="HARM_CATEGORY_HARASSMENT",e.HARM_CATEGORY_DANGEROUS_CONTENT="HARM_CATEGORY_DANGEROUS_CONTENT",e.HARM_CATEGORY_CIVIC_INTEGRITY="HARM_CATEGORY_CIVIC_INTEGRITY"})(J||(J={}));var X;(function(e){e.HARM_BLOCK_THRESHOLD_UNSPECIFIED="HARM_BLOCK_THRESHOLD_UNSPECIFIED",e.BLOCK_LOW_AND_ABOVE="BLOCK_LOW_AND_ABOVE",e.BLOCK_MEDIUM_AND_ABOVE="BLOCK_MEDIUM_AND_ABOVE",e.BLOCK_ONLY_HIGH="BLOCK_ONLY_HIGH",e.BLOCK_NONE="BLOCK_NONE"})(X||(X={}));var Q;(function(e){e.HARM_PROBABILITY_UNSPECIFIED="HARM_PROBABILITY_UNSPECIFIED",e.NEGLIGIBLE="NEGLIGIBLE",e.LOW="LOW",e.MEDIUM="MEDIUM",e.HIGH="HIGH"})(Q||(Q={}));var Z;(function(e){e.BLOCKED_REASON_UNSPECIFIED="BLOCKED_REASON_UNSPECIFIED",e.SAFETY="SAFETY",e.OTHER="OTHER"})(Z||(Z={}));var D;(function(e){e.FINISH_REASON_UNSPECIFIED="FINISH_REASON_UNSPECIFIED",e.STOP="STOP",e.MAX_TOKENS="MAX_TOKENS",e.SAFETY="SAFETY",e.RECITATION="RECITATION",e.LANGUAGE="LANGUAGE",e.BLOCKLIST="BLOCKLIST",e.PROHIBITED_CONTENT="PROHIBITED_CONTENT",e.SPII="SPII",e.MALFORMED_FUNCTION_CALL="MALFORMED_FUNCTION_CALL",e.OTHER="OTHER"})(D||(D={}));var ee;(function(e){e.TASK_TYPE_UNSPECIFIED="TASK_TYPE_UNSPECIFIED",e.RETRIEVAL_QUERY="RETRIEVAL_QUERY",e.RETRIEVAL_DOCUMENT="RETRIEVAL_DOCUMENT",e.SEMANTIC_SIMILARITY="SEMANTIC_SIMILARITY",e.CLASSIFICATION="CLASSIFICATION",e.CLUSTERING="CLUSTERING"})(ee||(ee={}));var te;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.AUTO="AUTO",e.ANY="ANY",e.NONE="NONE"})(te||(te={}));var ne;(function(e){e.MODE_UNSPECIFIED="MODE_UNSPECIFIED",e.MODE_DYNAMIC="MODE_DYNAMIC"})(ne||(ne={}));/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class m extends Error{constructor(t){super(`[GoogleGenerativeAI Error]: ${t}`)}}class A extends m{constructor(t,n){super(t),this.response=n}}class ge extends m{constructor(t,n,s,o){super(t),this.status=n,this.statusText=s,this.errorDetails=o}}class b extends m{}class me extends m{}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Me="https://generativelanguage.googleapis.com",De="v1beta",ke="0.24.1",Le="genai-js";var x;(function(e){e.GENERATE_CONTENT="generateContent",e.STREAM_GENERATE_CONTENT="streamGenerateContent",e.COUNT_TOKENS="countTokens",e.EMBED_CONTENT="embedContent",e.BATCH_EMBED_CONTENTS="batchEmbedContents"})(x||(x={}));class Ge{constructor(t,n,s,o,i){this.model=t,this.task=n,this.apiKey=s,this.stream=o,this.requestOptions=i}toString(){var t,n;const s=((t=this.requestOptions)===null||t===void 0?void 0:t.apiVersion)||De;let i=`${((n=this.requestOptions)===null||n===void 0?void 0:n.baseUrl)||Me}/${s}/${this.model}:${this.task}`;return this.stream&&(i+="?alt=sse"),i}}function je(e){const t=[];return e!=null&&e.apiClient&&t.push(e.apiClient),t.push(`${Le}/${ke}`),t.join(" ")}async function $e(e){var t;const n=new Headers;n.append("Content-Type","application/json"),n.append("x-goog-api-client",je(e.requestOptions)),n.append("x-goog-api-key",e.apiKey);let s=(t=e.requestOptions)===null||t===void 0?void 0:t.customHeaders;if(s){if(!(s instanceof Headers))try{s=new Headers(s)}catch(o){throw new b(`unable to convert customHeaders value ${JSON.stringify(s)} to Headers: ${o.message}`)}for(const[o,i]of s.entries()){if(o==="x-goog-api-key")throw new b(`Cannot set reserved header name ${o}`);if(o==="x-goog-api-client")throw new b(`Header name ${o} can only be set using the apiClient field`);n.append(o,i)}}return n}async function Ue(e,t,n,s,o,i){const a=new Ge(e,t,n,s,i);return{url:a.toString(),fetchOptions:Object.assign(Object.assign({},Be(i)),{method:"POST",headers:await $e(a),body:o})}}async function G(e,t,n,s,o,i={},a=fetch){const{url:r,fetchOptions:l}=await Ue(e,t,n,s,o,i);return He(r,l,a)}async function He(e,t,n=fetch){let s;try{s=await n(e,t)}catch(o){Fe(o,e)}return s.ok||await Pe(s,e),s}function Fe(e,t){let n=e;throw n.name==="AbortError"?(n=new me(`Request aborted when fetching ${t.toString()}: ${e.message}`),n.stack=e.stack):e instanceof ge||e instanceof b||(n=new m(`Error fetching from ${t.toString()}: ${e.message}`),n.stack=e.stack),n}async function Pe(e,t){let n="",s;try{const o=await e.json();n=o.error.message,o.error.details&&(n+=` ${JSON.stringify(o.error.details)}`,s=o.error.details)}catch{}throw new ge(`Error fetching from ${t.toString()}: [${e.status} ${e.statusText}] ${n}`,e.status,e.statusText,s)}function Be(e){const t={};if((e==null?void 0:e.signal)!==void 0||(e==null?void 0:e.timeout)>=0){const n=new AbortController;(e==null?void 0:e.timeout)>=0&&setTimeout(()=>n.abort(),e.timeout),e!=null&&e.signal&&e.signal.addEventListener("abort",()=>{n.abort()}),t.signal=n.signal}return t}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function B(e){return e.text=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning text from the first candidate only. Access response.candidates directly to use the other candidates.`),$(e.candidates[0]))throw new A(`${w(e)}`,e);return Ke(e)}else if(e.promptFeedback)throw new A(`Text not available. ${w(e)}`,e);return""},e.functionCall=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),$(e.candidates[0]))throw new A(`${w(e)}`,e);return console.warn("response.functionCall() is deprecated. Use response.functionCalls() instead."),se(e)[0]}else if(e.promptFeedback)throw new A(`Function call not available. ${w(e)}`,e)},e.functionCalls=()=>{if(e.candidates&&e.candidates.length>0){if(e.candidates.length>1&&console.warn(`This response had ${e.candidates.length} candidates. Returning function calls from the first candidate only. Access response.candidates directly to use the other candidates.`),$(e.candidates[0]))throw new A(`${w(e)}`,e);return se(e)}else if(e.promptFeedback)throw new A(`Function call not available. ${w(e)}`,e)},e}function Ke(e){var t,n,s,o;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const a of(o=(s=e.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)a.text&&i.push(a.text),a.executableCode&&i.push("\n```"+a.executableCode.language+`
`+a.executableCode.code+"\n```\n"),a.codeExecutionResult&&i.push("\n```\n"+a.codeExecutionResult.output+"\n```\n");return i.length>0?i.join(""):""}function se(e){var t,n,s,o;const i=[];if(!((n=(t=e.candidates)===null||t===void 0?void 0:t[0].content)===null||n===void 0)&&n.parts)for(const a of(o=(s=e.candidates)===null||s===void 0?void 0:s[0].content)===null||o===void 0?void 0:o.parts)a.functionCall&&i.push(a.functionCall);if(i.length>0)return i}const Ye=[D.RECITATION,D.SAFETY,D.LANGUAGE];function $(e){return!!e.finishReason&&Ye.includes(e.finishReason)}function w(e){var t,n,s;let o="";if((!e.candidates||e.candidates.length===0)&&e.promptFeedback)o+="Response was blocked",!((t=e.promptFeedback)===null||t===void 0)&&t.blockReason&&(o+=` due to ${e.promptFeedback.blockReason}`),!((n=e.promptFeedback)===null||n===void 0)&&n.blockReasonMessage&&(o+=`: ${e.promptFeedback.blockReasonMessage}`);else if(!((s=e.candidates)===null||s===void 0)&&s[0]){const i=e.candidates[0];$(i)&&(o+=`Candidate was blocked due to ${i.finishReason}`,i.finishMessage&&(o+=`: ${i.finishMessage}`))}return o}function k(e){return this instanceof k?(this.v=e,this):new k(e)}function qe(e,t,n){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s=n.apply(e,t||[]),o,i=[];return o={},a("next"),a("throw"),a("return"),o[Symbol.asyncIterator]=function(){return this},o;function a(d){s[d]&&(o[d]=function(u){return new Promise(function(g,y){i.push([d,u,g,y])>1||r(d,u)})})}function r(d,u){try{l(s[d](u))}catch(g){E(i[0][3],g)}}function l(d){d.value instanceof k?Promise.resolve(d.value.v).then(f,p):E(i[0][2],d)}function f(d){r("next",d)}function p(d){r("throw",d)}function E(d,u){d(u),i.shift(),i.length&&r(i[0][0],i[0][1])}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oe=/^data\: (.*)(?:\n\n|\r\r|\r\n\r\n)/;function Ve(e){const t=e.body.pipeThrough(new TextDecoderStream("utf8",{fatal:!0})),n=Je(t),[s,o]=n.tee();return{stream:ze(s),response:We(o)}}async function We(e){const t=[],n=e.getReader();for(;;){const{done:s,value:o}=await n.read();if(s)return B(Xe(t));t.push(o)}}function ze(e){return qe(this,arguments,function*(){const n=e.getReader();for(;;){const{value:s,done:o}=yield k(n.read());if(o)break;yield yield k(B(s))}})}function Je(e){const t=e.getReader();return new ReadableStream({start(s){let o="";return i();function i(){return t.read().then(({value:a,done:r})=>{if(r){if(o.trim()){s.error(new m("Failed to parse stream"));return}s.close();return}o+=a;let l=o.match(oe),f;for(;l;){try{f=JSON.parse(l[1])}catch{s.error(new m(`Error parsing JSON response: "${l[1]}"`));return}s.enqueue(f),o=o.substring(l[0].length),l=o.match(oe)}return i()}).catch(a=>{let r=a;throw r.stack=a.stack,r.name==="AbortError"?r=new me("Request aborted when reading from the stream"):r=new m("Error reading from the stream"),r})}}})}function Xe(e){const t=e[e.length-1],n={promptFeedback:t==null?void 0:t.promptFeedback};for(const s of e){if(s.candidates){let o=0;for(const i of s.candidates)if(n.candidates||(n.candidates=[]),n.candidates[o]||(n.candidates[o]={index:o}),n.candidates[o].citationMetadata=i.citationMetadata,n.candidates[o].groundingMetadata=i.groundingMetadata,n.candidates[o].finishReason=i.finishReason,n.candidates[o].finishMessage=i.finishMessage,n.candidates[o].safetyRatings=i.safetyRatings,i.content&&i.content.parts){n.candidates[o].content||(n.candidates[o].content={role:i.content.role||"user",parts:[]});const a={};for(const r of i.content.parts)r.text&&(a.text=r.text),r.functionCall&&(a.functionCall=r.functionCall),r.executableCode&&(a.executableCode=r.executableCode),r.codeExecutionResult&&(a.codeExecutionResult=r.codeExecutionResult),Object.keys(a).length===0&&(a.text=""),n.candidates[o].content.parts.push(a)}o++}s.usageMetadata&&(n.usageMetadata=s.usageMetadata)}return n}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function pe(e,t,n,s){const o=await G(t,x.STREAM_GENERATE_CONTENT,e,!0,JSON.stringify(n),s);return Ve(o)}async function Ee(e,t,n,s){const i=await(await G(t,x.GENERATE_CONTENT,e,!1,JSON.stringify(n),s)).json();return{response:B(i)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ye(e){if(e!=null){if(typeof e=="string")return{role:"system",parts:[{text:e}]};if(e.text)return{role:"system",parts:[e]};if(e.parts)return e.role?e:{role:"system",parts:e.parts}}}function L(e){let t=[];if(typeof e=="string")t=[{text:e}];else for(const n of e)typeof n=="string"?t.push({text:n}):t.push(n);return Qe(t)}function Qe(e){const t={role:"user",parts:[]},n={role:"function",parts:[]};let s=!1,o=!1;for(const i of e)"functionResponse"in i?(n.parts.push(i),o=!0):(t.parts.push(i),s=!0);if(s&&o)throw new m("Within a single message, FunctionResponse cannot be mixed with other type of part in the request for sending chat message.");if(!s&&!o)throw new m("No content is provided for sending chat message.");return s?t:n}function Ze(e,t){var n;let s={model:t==null?void 0:t.model,generationConfig:t==null?void 0:t.generationConfig,safetySettings:t==null?void 0:t.safetySettings,tools:t==null?void 0:t.tools,toolConfig:t==null?void 0:t.toolConfig,systemInstruction:t==null?void 0:t.systemInstruction,cachedContent:(n=t==null?void 0:t.cachedContent)===null||n===void 0?void 0:n.name,contents:[]};const o=e.generateContentRequest!=null;if(e.contents){if(o)throw new b("CountTokensRequest must have one of contents or generateContentRequest, not both.");s.contents=e.contents}else if(o)s=Object.assign(Object.assign({},s),e.generateContentRequest);else{const i=L(e);s.contents=[i]}return{generateContentRequest:s}}function ie(e){let t;return e.contents?t=e:t={contents:[L(e)]},e.systemInstruction&&(t.systemInstruction=ye(e.systemInstruction)),t}function et(e){return typeof e=="string"||Array.isArray(e)?{content:L(e)}:e}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ae=["text","inlineData","functionCall","functionResponse","executableCode","codeExecutionResult"],tt={user:["text","inlineData"],function:["functionResponse"],model:["text","functionCall","executableCode","codeExecutionResult"],system:["text"]};function nt(e){let t=!1;for(const n of e){const{role:s,parts:o}=n;if(!t&&s!=="user")throw new m(`First content should be with role 'user', got ${s}`);if(!z.includes(s))throw new m(`Each item should include role field. Got ${s} but valid roles are: ${JSON.stringify(z)}`);if(!Array.isArray(o))throw new m("Content should have 'parts' property with an array of Parts");if(o.length===0)throw new m("Each Content should have at least one part");const i={text:0,inlineData:0,functionCall:0,functionResponse:0,fileData:0,executableCode:0,codeExecutionResult:0};for(const r of o)for(const l of ae)l in r&&(i[l]+=1);const a=tt[s];for(const r of ae)if(!a.includes(r)&&i[r]>0)throw new m(`Content with role '${s}' can't contain '${r}' part`);t=!0}}function re(e){var t;if(e.candidates===void 0||e.candidates.length===0)return!1;const n=(t=e.candidates[0])===null||t===void 0?void 0:t.content;if(n===void 0||n.parts===void 0||n.parts.length===0)return!1;for(const s of n.parts)if(s===void 0||Object.keys(s).length===0||s.text!==void 0&&s.text==="")return!1;return!0}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const le="SILENT_ERROR";class st{constructor(t,n,s,o={}){this.model=n,this.params=s,this._requestOptions=o,this._history=[],this._sendPromise=Promise.resolve(),this._apiKey=t,s!=null&&s.history&&(nt(s.history),this._history=s.history)}async getHistory(){return await this._sendPromise,this._history}async sendMessage(t,n={}){var s,o,i,a,r,l;await this._sendPromise;const f=L(t),p={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(r=this.params)===null||r===void 0?void 0:r.systemInstruction,cachedContent:(l=this.params)===null||l===void 0?void 0:l.cachedContent,contents:[...this._history,f]},E=Object.assign(Object.assign({},this._requestOptions),n);let d;return this._sendPromise=this._sendPromise.then(()=>Ee(this._apiKey,this.model,p,E)).then(u=>{var g;if(re(u.response)){this._history.push(f);const y=Object.assign({parts:[],role:"model"},(g=u.response.candidates)===null||g===void 0?void 0:g[0].content);this._history.push(y)}else{const y=w(u.response);y&&console.warn(`sendMessage() was unsuccessful. ${y}. Inspect response object for details.`)}d=u}).catch(u=>{throw this._sendPromise=Promise.resolve(),u}),await this._sendPromise,d}async sendMessageStream(t,n={}){var s,o,i,a,r,l;await this._sendPromise;const f=L(t),p={safetySettings:(s=this.params)===null||s===void 0?void 0:s.safetySettings,generationConfig:(o=this.params)===null||o===void 0?void 0:o.generationConfig,tools:(i=this.params)===null||i===void 0?void 0:i.tools,toolConfig:(a=this.params)===null||a===void 0?void 0:a.toolConfig,systemInstruction:(r=this.params)===null||r===void 0?void 0:r.systemInstruction,cachedContent:(l=this.params)===null||l===void 0?void 0:l.cachedContent,contents:[...this._history,f]},E=Object.assign(Object.assign({},this._requestOptions),n),d=pe(this._apiKey,this.model,p,E);return this._sendPromise=this._sendPromise.then(()=>d).catch(u=>{throw new Error(le)}).then(u=>u.response).then(u=>{if(re(u)){this._history.push(f);const g=Object.assign({},u.candidates[0].content);g.role||(g.role="model"),this._history.push(g)}else{const g=w(u);g&&console.warn(`sendMessageStream() was unsuccessful. ${g}. Inspect response object for details.`)}}).catch(u=>{u.message!==le&&console.error(u)}),d}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ot(e,t,n,s){return(await G(t,x.COUNT_TOKENS,e,!1,JSON.stringify(n),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function it(e,t,n,s){return(await G(t,x.EMBED_CONTENT,e,!1,JSON.stringify(n),s)).json()}async function at(e,t,n,s){const o=n.requests.map(a=>Object.assign(Object.assign({},a),{model:t}));return(await G(t,x.BATCH_EMBED_CONTENTS,e,!1,JSON.stringify({requests:o}),s)).json()}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(t,n,s={}){this.apiKey=t,this._requestOptions=s,n.model.includes("/")?this.model=n.model:this.model=`models/${n.model}`,this.generationConfig=n.generationConfig||{},this.safetySettings=n.safetySettings||[],this.tools=n.tools,this.toolConfig=n.toolConfig,this.systemInstruction=ye(n.systemInstruction),this.cachedContent=n.cachedContent}async generateContent(t,n={}){var s;const o=ie(t),i=Object.assign(Object.assign({},this._requestOptions),n);return Ee(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}async generateContentStream(t,n={}){var s;const o=ie(t),i=Object.assign(Object.assign({},this._requestOptions),n);return pe(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(s=this.cachedContent)===null||s===void 0?void 0:s.name},o),i)}startChat(t){var n;return new st(this.apiKey,this.model,Object.assign({generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:(n=this.cachedContent)===null||n===void 0?void 0:n.name},t),this._requestOptions)}async countTokens(t,n={}){const s=Ze(t,{model:this.model,generationConfig:this.generationConfig,safetySettings:this.safetySettings,tools:this.tools,toolConfig:this.toolConfig,systemInstruction:this.systemInstruction,cachedContent:this.cachedContent}),o=Object.assign(Object.assign({},this._requestOptions),n);return ot(this.apiKey,this.model,s,o)}async embedContent(t,n={}){const s=et(t),o=Object.assign(Object.assign({},this._requestOptions),n);return it(this.apiKey,this.model,s,o)}async batchEmbedContents(t,n={}){const s=Object.assign(Object.assign({},this._requestOptions),n);return at(this.apiKey,this.model,t,s)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rt{constructor(t){this.apiKey=t}getGenerativeModel(t,n){if(!t.model)throw new m("Must provide a model name. Example: genai.getGenerativeModel({ model: 'my-model-name' })");return new ce(this.apiKey,t,n)}getGenerativeModelFromCachedContent(t,n,s){if(!t.name)throw new b("Cached content must contain a `name` field.");if(!t.model)throw new b("Cached content must contain a `model` field.");const o=["model","systemInstruction"];for(const a of o)if(n!=null&&n[a]&&t[a]&&(n==null?void 0:n[a])!==t[a]){if(a==="model"){const r=n.model.startsWith("models/")?n.model.replace("models/",""):n.model,l=t.model.startsWith("models/")?t.model.replace("models/",""):t.model;if(r===l)continue}throw new b(`Different value for "${a}" specified in modelParams (${n[a]}) and cachedContent (${t[a]})`)}const i=Object.assign(Object.assign({},n),{model:t.model,tools:t.tools,toolConfig:t.toolConfig,systemInstruction:t.systemInstruction,cachedContent:t});return new ce(this.apiKey,i,s)}}const lt=()=>"AIzaSyA5WVZVaQ2FO-13DRcp-6nhCOeSPazo2Zk".trim(),ct=void 0,dt=Array.from(new Set([ct,"gemini-2.5-flash","gemini-flash-latest","gemini-2.0-flash","gemini-1.5-flash-latest","gemini-1.5-flash"].filter(Boolean))),ut=["You are CampusSync Assistant, an AI helper for campus room booking and operations.","Be concise, accurate, and practical.","When live app data is provided, prioritize that data over assumptions.","If unsure, acknowledge uncertainty and suggest where to verify in the app.","Never provide legal, medical, or financial advice."].join(" ");let O=null,P=null,de=null,ue=0;const ft=16e3,fe=2,ht=e=>e==="assistant"?"model":"user",gt=e=>{var s,o,i,a;if(!Array.isArray(e))return[];const t=e.filter(r=>r&&typeof r.content=="string"&&r.content.trim()).slice(-8).map(r=>({role:ht(r.role),parts:[{text:r.content.trim().slice(0,1500)}]}));for(;t.length&&t[0].role!=="user";)t.shift();const n=[];for(const r of t){const l=n[n.length-1];if(l&&l.role===r.role){const f=((o=(s=l.parts)==null?void 0:s[0])==null?void 0:o.text)||"",p=((a=(i=r.parts)==null?void 0:i[0])==null?void 0:a.text)||"";l.parts=[{text:`${f}
${p}`.trim().slice(0,1500)}]}else n.push(r)}return n},mt=(e={})=>{if(!e||typeof e!="object")return{};const t={};return typeof e.route=="string"&&(t.route=e.route.slice(0,120)),typeof e.role=="string"&&(t.role=e.role.slice(0,40)),typeof e.resourceType=="string"&&(t.resourceType=e.resourceType.slice(0,60)),e.liveData&&typeof e.liveData=="object"&&(t.liveData=JSON.stringify(e.liveData).slice(0,2500)),t},pt=e=>{const t=String((e==null?void 0:e.message)||"").toLowerCase();return t.includes("[404")||t.includes("is not found")},N=e=>String((e==null?void 0:e.message)||"").toLowerCase(),Et=e=>{const t=N(e);return t.includes("[403")&&(t.includes("api key was reported as leaked")||t.includes("reported as leaked"))},yt=e=>{const t=N(e);return t.includes("[401")||t.includes("unauthenticated")||t.includes("invalid api key")||t.includes("permission_denied")},Ct=e=>{const t=N(e);return t.includes("[429")||t.includes("resource_exhausted")||t.includes("quota")},Ce=e=>N(e).includes("timeout"),ve=e=>{const t=N(e);return t.includes("[500")||t.includes("[503")||t.includes("internal")||t.includes("service unavailable")},_e=e=>{const t=N(e);return t.includes("failed to fetch")||t.includes("networkerror")||t.includes("network request failed")},vt=e=>ve(e)||Ce(e)||_e(e),_t=e=>new Promise(t=>setTimeout(t,e)),wt=async(e,t=ft)=>{let n;try{const s=new Promise((o,i)=>{n=setTimeout(()=>{i(new Error(`Chat request timeout after ${t/1e3}s.`))},t)});return await Promise.race([e(),s])}finally{n&&clearTimeout(n)}},bt=e=>`${e.slice(0,4)}:${e.length}`,It=e=>Et(e)?new Error("Gemini API key has been disabled because it was reported as leaked. Create a new key in Google AI Studio, update VITE_GEMINI_API_KEY in .env.local, and restart the app."):yt(e)?new Error("Gemini API key is invalid or unauthorized. Update VITE_GEMINI_API_KEY in .env.local and restart the app."):Ct(e)?new Error("Gemini is rate limited right now. Please try again in a moment."):Ce(e)?new Error("Assistant request timed out. Please try again."):_e(e)?new Error("Network issue while contacting Gemini. Check your connection and retry."):ve(e)?new Error("Gemini service is temporarily unavailable. Please retry."):new Error((e==null?void 0:e.message)||"Assistant is currently unavailable. Please try again."),xt=e=>{const t=lt();if(!t)throw new Error("Gemini key is missing. Add VITE_GEMINI_API_KEY in .env.local and restart the app.");const n=bt(t);return O&&de!==n&&(O=null,P=null),(!O||P!==e)&&(O=new rt(t).getGenerativeModel({model:e,systemInstruction:ut}),P=e,de=n),O},Rt=async({message:e,history:t=[],context:n={}})=>{const s=typeof e=="string"?e.trim():"";if(!s)throw new Error("Please enter a valid message.");if(s.length>2e3)throw new Error("Message is too long.");const o=Date.now();if(o-ue<1200)throw new Error("You are sending messages too quickly. Please wait a moment.");ue=o;const i=mt(n),a=[];i.role&&a.push(`role=${i.role}`),i.route&&a.push(`route=${i.route}`),i.resourceType&&a.push(`resourceType=${i.resourceType}`);const r=[a.length?`Client context: ${a.join(", ")}.`:"",i.liveData?`Live app data: ${i.liveData}`:"",`User message: ${s}`].filter(Boolean).join(`
`);try{let l=0;for(;l<=fe;)try{let f=null;const p=gt(t);for(const E of dt)try{const u=xt(E).startChat({history:p});return(await wt(()=>u.sendMessage(r))).response.text().trim()||"I could not generate a response right now."}catch(d){if(!pt(d))throw d;f=d}throw f||new Error("No compatible Gemini model is currently available for this key.")}catch(f){if(vt(f)&&l<fe){l+=1,await _t(l*500);continue}throw f}throw new Error("Assistant is currently unavailable. Please try again.")}catch(l){throw It(l)}},At=["How do I book a room?","What do room statuses mean?","Who can approve bookings?","How do I use the floor plan?"],Nt=/\b(room|rooms|lab|classroom|availability|available|free|occupied|status|capacity|building|floor)\b/i,St=/\b(book|booking|bookings|request|requests|pending|approved|declined|reservation)\b/i,U=2e3,Ot=6e3,T=(e,t,n=!1)=>({id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,role:e,text:t,isError:n}),Tt=(e="")=>{const t=String(e).toLowerCase();return t.includes("api key")||t.includes("unauthorized")||t.includes("reported as leaked")?"Update the key in .env.local and restart the app.":t.includes("too quickly")||t.includes("rate limited")?"Wait a few seconds and try again.":t.includes("timed out")||t.includes("network issue")?"Check your connection and retry.":t.includes("too long")?`Keep the message under ${U} characters.`:"Please try again."},Mt=(e=[],t="")=>{if(!Array.isArray(e)||e.length===0)return{roomDataNote:"Room data is not loaded yet."};const n=String(t||"").toLowerCase(),s={totalRooms:e.length,freeRooms:e.filter(i=>i.status===S.FREE).length,occupiedRooms:e.filter(i=>i.status===S.OCCUPIED).length,reservedRooms:e.filter(i=>i.status===S.RESERVED).length,partialRooms:e.filter(i=>i.status===S.PARTIAL).length,sampleFreeRooms:e.filter(i=>i.status===S.FREE).slice(0,6).map(i=>i.name)},o=e.find(i=>n.includes(String(i.name||"").toLowerCase()));return o&&(s.focusRoom={name:o.name||"Unknown",status:o.status||"unknown",capacity:o.capacity??null,building:o.building||"",floor:o.floor||"",note:o.note||""}),s},Dt=(e=[])=>!Array.isArray(e)||e.length===0?{total:0,pending:0,approved:0,declined:0,recent:[]}:{total:e.length,pending:e.filter(t=>t.status===F.PENDING).length,approved:e.filter(t=>t.status===F.APPROVED).length,declined:e.filter(t=>t.status===F.DECLINED).length,recent:e.slice(0,5).map(t=>({resourceName:t.resourceName||"Unknown room",status:t.status||"unknown",date:t.date||"",startTime:t.startTime||"",endTime:t.endTime||""}))};function kt({message:e}){const n=M(o=>o.theme)==="dark",s=e.role==="assistant";return c.jsx("div",{className:`flex ${s?"justify-start":"justify-end"} mb-3`,children:c.jsx("div",{className:`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${s?`${e.isError?n?"bg-red-950":"bg-red-50":n?"bg-slate-800":"bg-white"} border-2 ${n?"border-slate-600":"border-slate-900"}`:`border-2 ${n?"border-slate-600":"border-slate-900"} ${n?"bg-yellow-700":"bg-yellow-400"}`}`,style:s?{color:n?"#f0e7dc":"#201a15"}:{color:"#1a1a1a"},children:c.jsxs("div",{className:"flex items-start gap-2",children:[s&&c.jsx(he,{className:"mt-0.5 h-4 w-4 flex-shrink-0",style:{color:e.isError?n?"#ef4444":"#dc2626":n?"#f59e0b":"#d97706"}}),c.jsx("p",{className:"whitespace-pre-wrap break-all leading-relaxed",children:e.text})]})})})}function Lt({text:e,onClick:t,disabled:n=!1}){const o=M(i=>i.theme)==="dark";return c.jsx("button",{onClick:()=>t(e),disabled:n,className:`rounded-full border-2 px-3 py-1.5 text-xs font-bold transition-all ${n?"cursor-not-allowed opacity-60":"hover:scale-105"} ${o?"border-slate-600 bg-slate-800 text-slate-300 hover:bg-slate-700":"border-slate-900 bg-white text-slate-700 hover:bg-yellow-400"}`,children:e})}function Ut(){const t=M(h=>h.theme)==="dark",n=M(h=>h.authUser),s=M(h=>h.rooms),o=Ae(),[i,a]=_.useState(!1),[r,l]=_.useState(""),[f,p]=_.useState(!1),[E,d]=_.useState(!1),[u,g]=_.useState(()=>[T("assistant","Hi! I'm CampusSync Assistant. Ask me anything about bookings, rooms, approvals, and navigation.")]),y=_.useRef(null),we=_.useMemo(()=>u.slice(-8).map(h=>({role:h.role,content:h.text})),[u]),be=()=>{var h;(h=y.current)==null||h.scrollIntoView({behavior:window.innerWidth<640?"auto":"smooth"})};_.useEffect(()=>{i&&be()},[u,i]),_.useEffect(()=>{if(!f){d(!1);return}const h=setTimeout(()=>{d(!0)},Ot);return()=>clearTimeout(h)},[f]);const K=async h=>{const C=String(h||"").trim();if(f||!C)return;if(C.length>U){g(v=>[...v,T("assistant",`Message too long. Maximum is ${U} characters.`,!0)]);return}const Re=T("user",C);g(v=>[...v,Re]),l(""),p(!0);try{const v=Nt.test(C),j=St.test(C),R={};if(v&&(R.rooms=Mt(s,C)),j&&(n!=null&&n.uid)&&(n==null?void 0:n.role)==="student")try{const I=await Te(n.uid);R.myBookings=Dt(I)}catch(I){R.bookingDataNote=(I==null?void 0:I.message)||"Could not fetch booking data right now."}const H=await Rt({message:C,history:we,context:{route:o.pathname,role:(n==null?void 0:n.role)||"unknown",liveData:R}});g(I=>[...I,T("assistant",H)])}catch(v){const j=(v==null?void 0:v.message)||"Assistant is currently unavailable. Please try again.",R=Tt(j);g(H=>[...H,T("assistant",`${j} ${R}`,!0)])}finally{p(!1)}},Ie=h=>{K(h)},xe=async h=>{h.preventDefault(),await K(r)};return n?c.jsxs(c.Fragment,{children:[c.jsx("button",{onClick:()=>a(!i),className:`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border-2 border-slate-900 transition-all hover:scale-110 hover:rotate-3 sm:bottom-6 sm:right-6 ${t?"bg-yellow-600":"bg-yellow-400"}`,style:{boxShadow:t?"4px 4px 0px 0px #000000":"4px 4px 0px 0px #0f172a"},children:i?c.jsx(Y,{className:"h-6 w-6 text-slate-900"}):c.jsx(Ne,{className:"h-6 w-6 text-slate-900"})}),i&&c.jsxs("div",{className:`fixed bottom-20 left-2 right-2 z-40 flex max-h-[calc(100vh-5rem)] flex-col overflow-hidden rounded-2xl border-2 sm:bottom-24 sm:left-auto sm:right-6 sm:w-[350px] sm:max-w-[calc(100vw-48px)] ${t?"border-slate-700 bg-[#1a1a1a]":"border-slate-900 bg-white"} shadow-[6px_6px_0px_0px_#0f172a]`,style:t?{boxShadow:"6px 6px 0px 0px #000000"}:{},children:[c.jsxs("div",{className:`flex items-center justify-between rounded-t-xl border-b-2 px-4 py-4 ${t?"border-slate-700":"border-slate-900"}`,children:[c.jsxs("div",{className:"flex items-center gap-2",children:[c.jsx(he,{className:"h-5 w-5",style:{color:t?"#f59e0b":"#d97706"}}),c.jsx("span",{className:"font-black",style:{color:t?"#f0e7dc":"#201a15"},children:"CampusSync Help"})]}),c.jsx("button",{onClick:()=>a(!1),className:`rounded-lg p-1 ${t?"hover:bg-slate-800":"hover:bg-slate-100"}`,children:c.jsx(Y,{className:"h-4 w-4",style:{color:t?"#a0a0a0":"#625041"}})})]}),c.jsxs("div",{className:"min-h-32 max-h-[45vh] overflow-y-auto p-4 sm:h-72 sm:max-h-none",children:[u.map(h=>c.jsx(kt,{message:h},h.id)),f&&c.jsxs("div",{className:"mb-2 flex flex-col items-start gap-1",children:[c.jsxs("div",{className:`inline-flex items-center gap-2 rounded-2xl border-2 px-3 py-2 text-xs ${t?"border-slate-600 bg-slate-800 text-slate-300":"border-slate-900 bg-white text-slate-700"}`,children:[c.jsx(Se,{className:"h-3.5 w-3.5 animate-spin"}),"Thinking..."]}),E&&c.jsx("p",{className:`px-1 text-[11px] ${t?"text-slate-400":"text-slate-500"}`,children:"Taking longer than usual. Please wait a few seconds."})]}),c.jsx("div",{ref:y})]}),c.jsx("div",{className:"flex flex-wrap gap-2 px-4 pb-2",children:At.map((h,C)=>c.jsx(Lt,{text:h,onClick:Ie,disabled:f},C))}),c.jsx("form",{onSubmit:xe,className:"px-4 pb-2",children:c.jsxs("div",{className:`flex items-center gap-2 rounded-xl border-2 p-2 ${t?"border-slate-700 bg-slate-900":"border-slate-900 bg-white"}`,children:[c.jsx("input",{value:r,onChange:h=>l(h.target.value),placeholder:"Ask about bookings, rooms, approvals...",className:`w-full bg-transparent px-2 py-1.5 text-sm outline-none ${t?"text-slate-200 placeholder:text-slate-500":"text-slate-800 placeholder:text-slate-400"}`,disabled:f,maxLength:U}),c.jsx("button",{type:"submit",disabled:f||!r.trim(),className:`rounded-lg border-2 border-slate-900 p-2 transition-all ${f||!r.trim()?t?"cursor-not-allowed bg-slate-700 text-slate-500":"cursor-not-allowed bg-slate-100 text-slate-400":t?"bg-yellow-600 text-slate-900 hover:scale-105":"bg-yellow-400 text-slate-900 hover:scale-105"}`,"aria-label":"Send message",children:c.jsx(Oe,{className:"h-4 w-4"})})]})}),c.jsx("div",{className:`flex justify-center rounded-b-xl border-t-2 p-3 ${t?"border-slate-700":"border-slate-900"}`,children:c.jsx("button",{onClick:()=>a(!1),className:`rounded-xl border-2 border-slate-900 px-6 py-2 font-bold transition-all ${t?"bg-slate-800 text-slate-300 hover:bg-slate-700":"bg-white text-slate-700 hover:bg-yellow-400"}`,children:"Close"})})]})]}):null}export{Ut as default};
