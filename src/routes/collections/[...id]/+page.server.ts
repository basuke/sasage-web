import { redirect } from '@sveltejs/kit';
 
/** @type {import('./$types').LayoutServerLoad} */
export function load({ params }) {
    throw redirect(303, `/works/${params.id}`);
}