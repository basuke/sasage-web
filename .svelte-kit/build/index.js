
import root from '__GENERATED__/root.svelte';
import { respond } from '/home/basuke/work/sasage-web/.svelte-kit/runtime/server/index.js';
import { set_paths, assets, base } from '/home/basuke/work/sasage-web/.svelte-kit/runtime/paths.js';
import { set_prerendering } from '/home/basuke/work/sasage-web/.svelte-kit/runtime/env.js';

const template = ({ head, body, assets, nonce }) => "<!DOCTYPE html>\n<html lang=\"en\">\n    <head>\n        <!-- Global site tag (gtag.js) - Google Analytics -->\n        <script async src=\"https://www.googletagmanager.com/gtag/js?id=UA-164370440-1\"></script>\n        <script>\n            window.dataLayer = window.dataLayer || [];\n            function gtag() {\n                dataLayer.push(arguments);\n            }\n            gtag('js', new Date());\n\n            gtag('config', 'UA-164370440-1');\n        </script>\n\n        <meta charset=\"UTF-8\" />\n        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n        <title>Mayumi Sasage's Website</title>\n\n        <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" />\n        <link\n            href=\"https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600&display=swap\"\n            rel=\"stylesheet\"\n        />\n\n        <script src=\"https://kit.fontawesome.com/2921a6c479.js\" crossorigin=\"anonymous\"></script>\n\n        <meta property=\"og:title\" content=\"Mayumi Sasage\" />\n        <meta property=\"og:url\" content=\"https://mayumi-sasage.info/\" />\n        <meta property=\"og:type\" content=\"website\" />\n        <meta\n            property=\"og:image\"\n            content=\"https://storage.googleapis.com/sasage-website-71713.appspot.com/images/books/lost-in-the-rain/page5-w1280.jpg\"\n        />\n        <meta property=\"og:image:alt\" content=\"Mayumi Sasage's Website\" />\n        <meta\n            property=\"og:description\"\n            content=\"Mayumi Sasage is an illustrator and artist focused on the creation of illustrations with a poetic narrative inspired by nature and botanicals.\"\n        />\n        <meta property=\"og:locale\" content=\"en_US\" />\n        <meta property=\"og:locale:alternate\" content=\"ja_JP\" />\n\n        <meta name=\"twitter:card\" content=\"summary\" />\n        <meta name=\"twitter:site\" content=\"@SasageMayumi\" />\n        " + head + "\n    </head>\n    <body>\n        <div>" + body + "</div>\n        <style>\n            .initializing {\n                display: flex;\n                height: 100vh;\n                flex-direction: column;\n                justify-content: center;\n                align-items: center;\n                font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;\n            }\n\n            .initializing header {\n                color: #444;\n                font-size: larger;\n            }\n\n            .initializing p {\n                color: #666;\n            }\n\n            h1,\n            h2,\n            h3,\n            h4 {\n                font-family: 'Big Shoulders Display';\n            }\n        </style>\n    </body>\n</html>\n";

let read = null;

set_paths({"base":"","assets":""});

let default_protocol = 'https';

// allow paths to be globally overridden
// in svelte-kit preview and in prerendering
export function override(settings) {
	default_protocol = settings.protocol || default_protocol;
	set_paths(settings.paths);
	set_prerendering(settings.prerendering);
	read = settings.read;
}

export class Server {
	constructor(manifest) {
		this.options = {
			csp: {"mode":"auto","directives":{"upgrade-insecure-requests":false,"block-all-mixed-content":false}},
			dev: false,
			floc: false,
			get_stack: error => String(error), // for security
			handle_error: (error, event) => {
				this.options.hooks.handleError({
					error,
					event,

					// TODO remove for 1.0
					// @ts-expect-error
					get request() {
						throw new Error('request in handleError has been replaced with event. See https://github.com/sveltejs/kit/pull/3384 for details');
					}
				});
				error.stack = this.options.get_stack(error);
			},
			hooks: null,
			hydrate: true,
			manifest,
			method_override: {"parameter":"_method","allowed":["PATCH","DELETE"]},
			paths: { base, assets },
			prefix: assets + '/_app/',
			prerender: true,
			read,
			root,
			service_worker: null,
			router: true,
			template,
			template_contains_nonce: false,
			trailing_slash: "never"
		};
	}

	async respond(request, options = {}) {
		if (!(request instanceof Request)) {
			throw new Error('The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details');
		}

		if (!this.options.hooks) {
			const module = await import("./hooks.js");
			this.options.hooks = {
				getSession: module.getSession || (() => ({})),
				handle: module.handle || (({ event, resolve }) => resolve(event)),
				handleError: module.handleError || (({ error }) => console.error(error.stack)),
				externalFetch: module.externalFetch || fetch
			};
		}

		return respond(request, this.options, options);
	}
}
