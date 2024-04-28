export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.znc2GEEW.js","app":"_app/immutable/entry/app.1ET1FzL4.js","imports":["_app/immutable/entry/start.znc2GEEW.js","_app/immutable/chunks/index-client.8J7vhpZm.js","_app/immutable/chunks/runtime.VRHDuNB0.js","_app/immutable/chunks/singletons.eUn48goy.js","_app/immutable/chunks/parse.RrI1B0B4.js","_app/immutable/entry/app.1ET1FzL4.js","_app/immutable/chunks/runtime.VRHDuNB0.js","_app/immutable/chunks/render.5gPqI7IR.js","_app/immutable/chunks/disclose-version.Aca9DWnD.js","_app/immutable/chunks/this.mzY0v9VV.js","_app/immutable/chunks/5.ZytH4xBu.js","_app/immutable/chunks/props.XRNuqaq5.js","_app/immutable/chunks/index-client.8J7vhpZm.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/account",
				pattern: /^\/account\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/logout",
				pattern: /^\/logout\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/test",
				pattern: /^\/test\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
