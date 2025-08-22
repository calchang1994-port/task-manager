const DEFAULT = import.meta.env.VITE_API_BASE || 'http://localhost:8080';
export function getApiBase(){return localStorage.getItem('api')||DEFAULT}
export async function api(path, opts={}){const token=localStorage.getItem('token')||'';const headers={'Content-Type':'application/json',...(opts.headers||{})};if(token) headers['Authorization']='Bearer '+token;const res=await fetch(getApiBase()+path,{...opts,headers});const data=await res.json().catch(()=>({}));if(!res.ok) throw new Error(data.error||'Request failed');return data}
