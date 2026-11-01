import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const width = 1200;
const height = 630;
const assetsPath = resolve(process.cwd(), 'static', 'assets');
const characters = ['ember.png', 'kai.png', 'lib.png', 'saphy.png'];
const fonts = [
	resolve(assetsPath, 'fonts', 'NotoSans-Variable.ttf'),
	resolve(assetsPath, 'fonts', 'NotoSerif-Variable.ttf')
];
const imageCache = new Map<string, { image: Buffer; expiresAt: number }>();

export interface BrandedOgImageOptions {
	title: string;
	description: string;
	eyebrow: string;
	character?: number;
}

function escapeXml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function wrapText(value: string, maxLength: number, maxLines: number): string[] {
	const words = value.trim().split(/\s+/).filter(Boolean);
	const lines: string[] = [];
	let line = '';

	for (const word of words) {
		const next = line ? `${line} ${word}` : word;
		if (next.length > maxLength && line) {
			lines.push(line);
			line = word;
			if (lines.length === maxLines - 1) break;
		} else {
			line = next;
		}
	}

	if (line && lines.length < maxLines) lines.push(line);
	if (lines.join(' ').length < value.trim().length && lines.length) {
		lines[lines.length - 1] = `${lines.at(-1)?.replace(/[.…]+$/, '')}…`;
	}

	return lines;
}

function createTemplate(options: BrandedOgImageOptions): string {
	const titleLines = wrapText(options.title, 24, 2);
	const descriptionLines = wrapText(options.description, 58, 2);
	const title = titleLines
		.map(
			(line, index) =>
				`<text x="76" y="${445 + index * 48}" font-family="Noto Serif" font-size="42px" font-weight="600" fill="#fffaf5">${escapeXml(line)}</text>`
		)
		.join('');
	const descriptionStart = 510 + Math.max(0, titleLines.length - 1) * 48;
	const description = descriptionLines
		.map(
			(line, index) =>
				`<text x="80" y="${descriptionStart + index * 25}" font-family="Noto Sans" font-size="18px" fill="#e3d6cb">${escapeXml(line)}</text>`
		)
		.join('');

	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
		<defs>
			<linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0" stop-color="#100e0e"/>
				<stop offset=".54" stop-color="#241713"/>
				<stop offset="1" stop-color="#0d1114"/>
			</linearGradient>
			<radialGradient id="glow"><stop stop-color="#c65b24" stop-opacity=".38"/><stop offset="1" stop-color="#c65b24" stop-opacity="0"/></radialGradient>
			<linearGradient id="shade" x1="0" y1="1" x2="0" y2="0">
				<stop stop-color="#09090b" stop-opacity=".76"/><stop offset=".55" stop-color="#09090b" stop-opacity=".08"/>
			</linearGradient>
		</defs>
		<rect width="1200" height="630" fill="url(#background)"/>
		<ellipse cx="970" cy="290" rx="360" ry="310" fill="url(#glow)"/>
		<path d="M0 500C260 380 450 600 730 460S1030 420 1200 470V630H0Z" fill="#09090b" opacity=".3"/>
		<rect width="1200" height="630" fill="url(#shade)"/>
		<path d="M60 155H1140" stroke="#f4cba8" stroke-opacity=".13"/>
		<rect x="28" y="28" width="1144" height="574" rx="16" fill="none" stroke="#fff4e8" stroke-opacity=".12"/>
		<text x="80" y="135" font-family="Noto Sans" font-size="13px" font-weight="600" letter-spacing="4" fill="#efb886">${escapeXml(options.eyebrow)}</text>
		${title}
		${description}
		<text x="80" y="594" font-family="Noto Sans" font-size="13px" font-weight="600" letter-spacing="4" fill="#efb886" opacity=".65">A COMPANION FOR EVERY VERSION OF YOU</text>
	</svg>`;
}

function characterIndexFor(title: string): number {
	return (
		Array.from(title).reduce(
			(hash, character) => (hash * 31 + (character.codePointAt(0) ?? 0)) >>> 0,
			0
		) % characters.length
	);
}

async function createBrandedOgImage(options: BrandedOgImageOptions): Promise<Buffer> {
	const background = new Resvg(createTemplate(options), {
		font: {
			fontFiles: fonts,
			loadSystemFonts: false,
			defaultFontFamily: 'Noto Sans',
			sansSerifFamily: 'Noto Sans',
			serifFamily: 'Noto Serif'
		}
	})
		.render()
		.asPng();
	const logo = await sharp(await readFile(resolve(assetsPath, 'dlst.gif')), { page: 0, pages: 1 })
		.resize(86, 86, { fit: 'contain' })
		.png()
		.toBuffer();
	const characterIndex = options.character ?? characterIndexFor(options.title);
	const character = characters[characterIndex] ?? characters[0];
	if (!character)
		throw new Error('No Flameborn character artwork is configured for social previews.');
	const portrait = await sharp(resolve(assetsPath, 'characters', character))
		.resize(430, 600, {
			fit: 'contain',
			position: 'centre',
			background: { r: 0, g: 0, b: 0, alpha: 0 }
		})
		.png()
		.toBuffer();

	return sharp(background)
		.composite([
			{ input: logo, left: 68, top: 39 },
			{ input: portrait, left: 748, top: 15 }
		])
		.png()
		.toBuffer();
}

export async function renderBrandedOgImage(options: BrandedOgImageOptions): Promise<Buffer> {
	const key = JSON.stringify(options);
	const cached = imageCache.get(key);
	if (cached && cached.expiresAt > Date.now()) return cached.image;

	const image = await createBrandedOgImage(options);
	if (imageCache.size >= 128) {
		const oldestKey = imageCache.keys().next().value;
		if (oldestKey) imageCache.delete(oldestKey);
	}
	imageCache.set(key, { image, expiresAt: Date.now() + 60 * 60 * 1000 });
	return image;
}
