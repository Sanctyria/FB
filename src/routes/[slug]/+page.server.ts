import { error } from '@sveltejs/kit';
import { flameborns } from '../../lib/characters';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	const character = flameborns.find((friend) => friend.slug === params.slug);
	if (!character) error(404, 'Flameborn not found');

	return {
		character,
		socialPortrait: flameborns.indexOf(character) % 4
	};
};
