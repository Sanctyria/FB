import { SITE_URL } from '../site';

export function brandedOgImagePath(
	title: string,
	description: string,
	eyebrow: string,
	character?: number
): string {
	const query = new URLSearchParams({
		title: title.slice(0, 120),
		description: description.slice(0, 300),
		eyebrow: eyebrow.slice(0, 60)
	});
	if (character !== undefined) query.set('character', String(character));

	return `/api/og/page?${query}`;
}

export function brandedOgImageUrl(
	title: string,
	description: string,
	eyebrow: string,
	character?: number
): string {
	return `${SITE_URL}${brandedOgImagePath(title, description, eyebrow, character)}`;
}
