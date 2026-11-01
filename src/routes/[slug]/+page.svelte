<script lang="ts">
	import { brandedOgImageUrl } from '../../lib/community/og';
	import { flameborns } from '../../lib/characters';
	import FlameIcon from '../../lib/FlameIcon.svelte';
	import { jsonLdScript } from '../../lib/seo';
	import { SITE_URL } from '../../lib/site';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let selectedPlatform = $state<'web' | 'discord' | 'mobile' | 'desktop'>('web');

	const platforms = [
		{
			id: 'web' as const,
			name: 'Website',
			label: 'Preview here',
			detail: 'Explore the Flameborn site and its local companion preview.',
			mark: '↗'
		},
		{
			id: 'discord' as const,
			name: 'Discord',
			label: 'Bot concept',
			detail: 'See the proposed bot features and example slash commands.',
			mark: '⌘'
		},
		{
			id: 'mobile' as const,
			name: 'Mobile',
			label: 'Planned',
			detail: 'A future companion experience for your phone.',
			mark: '▯'
		},
		{
			id: 'desktop' as const,
			name: 'Desktop',
			label: 'Planned',
			detail: 'A future companion for your desktop workspace.',
			mark: '▣'
		}
	];

	const title = $derived(
		`${data.character.firstName} | AI Companion for ${data.character.seoFocus} | Flameborns`
	);
	const description = $derived(data.character.seoDescription);
	const profileUrl = $derived(`${SITE_URL}/${data.character.slug}`);
	const socialImage = $derived(
		brandedOgImageUrl(
			data.character.firstName,
			data.character.domain,
			'MEET YOUR FLAMEBORN',
			data.socialPortrait
		)
	);
	const profileSchema = $derived({
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebPage',
				'@id': `${profileUrl}#webpage`,
				url: profileUrl,
				name: title,
				description,
				isPartOf: { '@id': `${SITE_URL}/#website` },
				mainEntity: { '@id': `${profileUrl}#character` },
				breadcrumb: { '@id': `${profileUrl}#breadcrumb` },
				inLanguage: 'en'
			},
			{
				'@type': 'Thing',
				'@id': `${profileUrl}#character`,
				name: data.character.name,
				description: data.character.introduction,
				url: profileUrl,
				image: data.character.image
					? `${SITE_URL}${data.character.image}`
					: `${SITE_URL}/assets/dlst.gif`
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${profileUrl}#breadcrumb`,
				itemListElement: [
					{
						'@type': 'ListItem',
						position: 1,
						name: 'Home',
						item: `${SITE_URL}/`
					},
					{
						'@type': 'ListItem',
						position: 2,
						name: 'Flameborns',
						item: `${SITE_URL}/#companions`
					},
					{
						'@type': 'ListItem',
						position: 3,
						name: data.character.name,
						item: profileUrl
					}
				]
			}
		]
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={profileUrl} />
	<meta name="application-name" content="Flameborns" />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Flameborns" />
	<meta property="og:url" content={profileUrl} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={socialImage} />
	<meta property="og:image:alt" content={`Branded Flameborn portrait for ${data.character.name}`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={socialImage} />
	<meta
		name="twitter:image:alt"
		content={`Branded Flameborn portrait for ${data.character.name}`}
	/>
	{@html jsonLdScript(profileSchema)}
</svelte:head>

<main class="profile-page" style={`--profile-color:${data.character.color}`}>
	<header class="profile-nav">
		<a class="profile-wordmark" href="/" aria-label="Flameborns home">
			<img src="/assets/dlst.gif" alt="" /> flameborns<span>.</span>
		</a>
		<a class="profile-back-link" href="/#companions">Meet all Flameborns <span>↗</span></a>
	</header>

	<section class="profile-hero" aria-labelledby="profile-title">
		<div class="profile-copy">
			<a class="profile-back" href="/#companions">← &nbsp; THE FLAMEBORN CIRCLE</a>
			<p class="profile-eyebrow"><FlameIcon /> {data.character.domain.toUpperCase()}</p>
			<h1 id="profile-title">{data.character.firstName}<span>.</span></h1>
			<p class="profile-full-name">{data.character.name} <i>·</i> {data.character.title}</p>
			<p class="profile-intro">{data.character.introduction}</p>
			<a class="profile-cta" href="/#companions">Find your kind of bright <span>↗</span></a>
		</div>

		<div class="profile-art" aria-label={`${data.character.name}, ${data.character.domain}`}>
			<div class="profile-halo"></div>
			<div class="profile-orbit profile-orbit-one"></div>
			<div class="profile-orbit profile-orbit-two"></div>
			{#if data.character.image}
				<img src={data.character.image} alt={data.character.name} fetchpriority="high" />
			{:else}
				<span class="profile-monogram" aria-hidden="true">{data.character.mark}</span>
			{/if}
			<div class="profile-quote">
				<FlameIcon />
				<p>{data.character.message}</p>
				<span>{data.character.firstName.toUpperCase()} · A LITTLE HELLO</span>
			</div>
			<span class="profile-art-caption">MADE FOR THE MANY VERSIONS OF YOU</span>
		</div>
	</section>

	<section class="profile-about" aria-labelledby="about-title">
		<div>
			<p class="profile-section-kicker">A LITTLE ABOUT THEM</p>
			<h2 id="about-title">
				A spark for<br /><em>{data.character.domain.split(' · ')[0].toLowerCase()}.</em>
			</h2>
		</div>
		<div class="profile-ways">
			<p>Good company for the things you want to explore, at your pace.</p>
			{#each data.character.waysToExplore as way, index}
				<div class="profile-way"><span>0{index + 1}</span>{way}<span>↗</span></div>
			{/each}
		</div>
	</section>

	<section class="profile-platforms" aria-labelledby="platforms-title">
		<div class="profile-platform-heading">
			<div>
				<p class="profile-section-kicker">ONE COMPANION, DIFFERENT SPACES</p>
				<h2 id="platforms-title">Where to find<br /><em>{data.character.firstName}.</em></h2>
			</div>
			<p>Choose a platform to see what’s available and what we’re imagining next.</p>
		</div>

		<div class="platform-options" role="group" aria-label="Choose a Flameborn platform">
			{#each platforms as platform}
				<button
					class:platform-selected={selectedPlatform === platform.id}
					aria-pressed={selectedPlatform === platform.id}
					onclick={() => (selectedPlatform = platform.id)}
				>
					<span class="platform-mark">{platform.mark}</span>
					<strong>{platform.name}</strong>
					<span class="platform-status">{platform.label}</span>
					<span class="platform-arrow">↗</span>
				</button>
			{/each}
		</div>

		<div class="platform-detail" aria-live="polite">
			{#if selectedPlatform === 'discord'}
				<div class="discord-preview">
					<div class="discord-preview-top">
						<span class="discord-status-dot"></span>
						<div>
							<strong>{data.character.firstName}</strong><span>BOT CONCEPT · NOT CONNECTED</span>
						</div>
						<span class="discord-preview-mark">⌘</span>
					</div>
					<div class="discord-preview-copy">
						<p class="profile-section-kicker">A COMPANION IN YOUR SERVER</p>
						<h3>A little more company.<br /><em>Still your space.</em></h3>
						<p>
							A Discord bot is planned, not live yet. Here’s a preview of the kinds of thoughtful,
							opt-in commands {data.character.firstName} could bring to a server.
						</p>
						<div class="discord-command-list">
							{#each data.character.commands as command}
								<div class="discord-command">
									<div><code>{command.name}</code><span>{command.description}</span></div>
									<small>{command.example}</small>
								</div>
							{/each}
						</div>
						<p class="discord-preview-note">
							These are concept examples, not active Discord commands. No bot is connected.
						</p>
					</div>
				</div>
			{:else}
				<div class="platform-detail-copy">
					<p class="profile-section-kicker">
						{platforms.find((item) => item.id === selectedPlatform)?.label}
					</p>
					<h3>
						{platforms.find((item) => item.id === selectedPlatform)?.name} with {data.character
							.firstName}
					</h3>
					<p>{platforms.find((item) => item.id === selectedPlatform)?.detail}</p>
					{#if selectedPlatform === 'web'}
						<a class="profile-cta" href="/#companions">Explore the website preview <span>↗</span></a
						>
					{:else}
						<span class="platform-coming-soon">This platform is not available yet.</span>
					{/if}
				</div>
			{/if}
		</div>
	</section>

	<nav class="profile-related" aria-label="Explore other Flameborns">
		<p class="profile-section-kicker">MORE GOOD COMPANY</p>
		<div>
			{#each flameborns.filter((friend) => friend.slug !== data.character.slug) as friend}
				<a href={`/${friend.slug}`}>{friend.firstName}<span>↗</span></a>
			{/each}
		</div>
	</nav>

	<footer class="profile-footer">
		<a class="profile-wordmark" href="/"
			><img src="/assets/dlst.gif" alt="" /> flameborns<span>.</span></a
		>
		<span>A companion for the person you already are.</span>
		<a href="/#companions">MEET THE CIRCLE ↑</a>
	</footer>
</main>

<style>
	.profile-page {
		--ink: #29241f;
		--muted: #81776c;
		--paper: #f8f5ef;
		--profile-color: #ef774f;
		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
	}

	.profile-nav,
	.profile-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 21px 7.1%;
	}

	.profile-related {
		padding: 45px 10%;
		border-top: 1px solid rgba(53, 44, 35, 0.1);
		background: #f0ece4;
	}

	.profile-related > div {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 17px;
	}

	.profile-related > div > a {
		display: inline-flex;
		align-items: center;
		gap: 13px;
		border: 1px solid rgba(53, 44, 35, 0.14);
		border-radius: 999px;
		padding: 10px 13px;
		color: var(--ink);
		font-size: 9px;
		text-decoration: none;
		transition:
			background 160ms ease,
			color 160ms ease;
	}

	.profile-related > div > a:hover {
		background: var(--ink);
		color: white;
	}

	.profile-related > div > a > span {
		color: var(--profile-color);
	}

	.profile-nav {
		position: relative;
		z-index: 2;
	}

	.profile-wordmark {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		color: var(--ink);
		font-size: 15px;
		font-weight: 720;
		letter-spacing: -0.07em;
		text-decoration: none;
	}

	.profile-wordmark img {
		width: 27px;
		height: 27px;
		border-radius: 50%;
		object-fit: cover;
	}

	.profile-wordmark > span {
		margin-left: -8px;
		color: #e77e56;
	}

	.profile-back-link,
	.profile-back {
		color: var(--muted);
		font-size: 10px;
		text-decoration: none;
	}

	.profile-back-link span {
		margin-left: 9px;
		color: var(--ink);
	}

	.profile-hero {
		display: grid;
		min-height: min(690px, calc(100svh - 70px));
		grid-template-columns: 0.94fr 1.06fr;
		align-items: center;
		gap: 3%;
		padding: 25px 8.5% 75px 9.1%;
	}

	.profile-copy {
		position: relative;
		z-index: 1;
		padding: 30px 0;
	}

	.profile-back,
	.profile-section-kicker {
		font-size: 8px;
		font-weight: 570;
		letter-spacing: 0.14em;
	}

	.profile-back {
		display: inline-block;
		margin-bottom: 48px;
	}

	.profile-eyebrow {
		display: flex;
		align-items: center;
		gap: 8px;
		margin: 0;
		color: var(--muted);
		font-size: 8px;
		letter-spacing: 0.12em;
	}

	.profile-eyebrow :global(svg) {
		width: 13px;
		height: 13px;
		color: var(--profile-color);
	}

	.profile-copy h1 {
		margin: 19px 0 0 -5px;
		font-size: clamp(58px, 8.6vw, 112px);
		font-weight: 530;
		letter-spacing: -0.085em;
		line-height: 0.95;
	}

	.profile-copy h1 > span {
		color: var(--profile-color);
	}

	.profile-full-name {
		margin: 17px 0 0;
		color: #766b5e;
		font-family: var(--font-display);
		font-size: 20px;
		font-style: italic;
	}

	.profile-full-name i {
		padding: 0 4px;
		color: var(--profile-color);
		font-style: normal;
	}

	.profile-intro {
		max-width: 430px;
		margin: 23px 0 0;
		color: #6f665c;
		font-size: 12px;
		line-height: 1.9;
	}

	.profile-cta {
		display: inline-flex;
		align-items: center;
		gap: 28px;
		margin-top: 27px;
		border: 1px solid rgba(42, 36, 30, 0.2);
		border-radius: 999px;
		padding: 13px 17px;
		color: var(--ink);
		font-size: 10px;
		font-weight: 570;
		text-decoration: none;
		transition:
			color 180ms ease,
			background 180ms ease;
	}

	.profile-cta:hover {
		background: var(--ink);
		color: white;
	}

	.profile-art {
		position: relative;
		display: grid;
		min-height: 510px;
		place-items: center;
		isolation: isolate;
	}

	.profile-halo {
		position: absolute;
		z-index: -2;
		width: min(88%, 480px);
		aspect-ratio: 1;
		border-radius: 50%;
		background: radial-gradient(
			circle,
			color-mix(in srgb, var(--profile-color), white 44%),
			transparent 70%
		);
	}

	.profile-orbit {
		position: absolute;
		z-index: -1;
		width: 90%;
		max-width: 510px;
		aspect-ratio: 1;
		border: 1px solid color-mix(in srgb, var(--profile-color), transparent 70%);
		border-radius: 50%;
	}

	.profile-orbit-two {
		width: 99%;
		transform: rotate(-23deg) scaleY(0.82);
	}

	.profile-art > img {
		width: min(92%, 475px);
		height: 525px;
		object-fit: contain;
		object-position: center bottom;
		filter: drop-shadow(0 20px 24px rgba(48, 36, 27, 0.14));
	}

	.profile-monogram {
		color: color-mix(in srgb, var(--profile-color), #362c24 38%);
		font-family: var(--font-display);
		font-size: clamp(190px, 29vw, 350px);
		line-height: 1;
	}

	.profile-quote {
		position: absolute;
		right: -2%;
		bottom: 14%;
		width: min(280px, 62%);
		border: 1px solid rgba(255, 255, 255, 0.75);
		border-radius: 12px;
		padding: 15px 17px;
		background: rgba(250, 248, 243, 0.86);
		box-shadow: 0 13px 37px rgba(49, 37, 27, 0.09);
		backdrop-filter: blur(12px);
		transform: rotate(2deg);
	}

	.profile-quote :global(svg) {
		width: 15px;
		height: 15px;
		color: var(--profile-color);
	}

	.profile-quote p {
		margin: 7px 0 11px;
		font-family: var(--font-display);
		font-size: 17px;
		line-height: 1.25;
	}

	.profile-quote > span,
	.profile-art-caption {
		color: #8d8174;
		font-size: 7px;
		letter-spacing: 0.12em;
	}

	.profile-art-caption {
		position: absolute;
		right: -7%;
		top: 50%;
		writing-mode: vertical-rl;
	}

	.profile-about,
	.profile-platforms {
		padding: 100px 10%;
	}

	.profile-about {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: 12%;
		background: #f0ece4;
	}

	.profile-section-kicker {
		margin: 0;
		color: #968a7d;
	}

	.profile-about h2,
	.profile-platform-heading h2 {
		margin: 25px 0 0;
		font-size: clamp(42px, 5.2vw, 66px);
		font-weight: 530;
		letter-spacing: -0.07em;
		line-height: 1.02;
	}

	.profile-about h2 em,
	.profile-platform-heading h2 em,
	.discord-preview-copy h3 em {
		color: #c97756;
		font-family: var(--font-display);
		font-weight: 400;
	}

	.profile-ways > p,
	.profile-platform-heading > p {
		max-width: 370px;
		margin: 0 0 22px;
		color: #70665b;
		font-size: 11px;
		line-height: 1.8;
	}

	.profile-way {
		display: grid;
		grid-template-columns: 38px 1fr 15px;
		gap: 12px;
		align-items: center;
		border-top: 1px solid rgba(57, 48, 39, 0.12);
		padding: 17px 0;
		font-size: 10px;
	}

	.profile-way > span:first-child {
		color: #a29382;
		font-size: 8px;
	}

	.profile-way > span:last-child {
		color: var(--profile-color);
	}

	.profile-platforms {
		background: var(--paper);
	}

	.profile-platform-heading {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 30px;
		margin-bottom: 38px;
	}

	.profile-platform-heading > p {
		max-width: 255px;
		margin-bottom: 5px;
	}

	.platform-options {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
	}

	.platform-options > button {
		position: relative;
		display: grid;
		min-height: 150px;
		align-content: start;
		gap: 11px;
		border: 1px solid rgba(53, 44, 35, 0.13);
		border-radius: 8px;
		padding: 17px;
		background: #f0ece4;
		color: var(--ink);
		text-align: left;
		cursor: pointer;
		transition:
			border-color 180ms ease,
			transform 180ms ease,
			background 180ms ease;
	}

	.platform-options > button:hover {
		transform: translateY(-3px);
	}

	.platform-options > button.platform-selected {
		border-color: color-mix(in srgb, var(--profile-color), transparent 28%);
		background: color-mix(in srgb, var(--profile-color), white 92%);
	}

	.platform-mark {
		color: var(--profile-color);
		font-size: 18px;
	}

	.platform-options strong {
		font-size: 11px;
	}

	.platform-status {
		color: #84796d;
		font-size: 8px;
	}

	.platform-arrow {
		position: absolute;
		right: 15px;
		bottom: 14px;
		color: #9c8b7b;
		font-size: 12px;
	}

	.platform-detail {
		min-height: 335px;
		margin-top: 14px;
		border: 1px solid rgba(53, 44, 35, 0.1);
		border-radius: 10px;
		background: #f0ece4;
	}

	.platform-detail-copy {
		max-width: 630px;
		padding: 50px;
	}

	.platform-detail-copy h3 {
		margin: 15px 0 9px;
		font-family: var(--font-display);
		font-size: 34px;
		font-weight: 400;
	}

	.platform-detail-copy > p:not(.profile-section-kicker) {
		color: #70665b;
		font-size: 11px;
		line-height: 1.8;
	}

	.platform-coming-soon {
		display: inline-block;
		margin-top: 18px;
		color: #81776c;
		font-size: 9px;
	}

	.discord-preview {
		display: grid;
		min-height: 335px;
		grid-template-columns: 0.7fr 1.3fr;
		overflow: hidden;
		border-radius: inherit;
	}

	.discord-preview-top {
		display: flex;
		align-items: flex-start;
		gap: 11px;
		padding: 28px 18px;
		background: #292b34;
		color: #f5f2ee;
	}

	.discord-status-dot {
		width: 9px;
		height: 9px;
		margin-top: 4px;
		border-radius: 50%;
		background: #e1a071;
	}

	.discord-preview-top > div {
		display: grid;
		gap: 5px;
	}

	.discord-preview-top strong {
		font-size: 12px;
	}

	.discord-preview-top > div > span {
		color: #c0b9ad;
		font-size: 7px;
		letter-spacing: 0.09em;
	}

	.discord-preview-mark {
		margin-left: auto;
		color: #d7a07b;
	}

	.discord-preview-copy {
		padding: 34px clamp(20px, 4vw, 48px);
	}

	.discord-preview-copy h3 {
		margin: 12px 0;
		font-size: clamp(27px, 3vw, 39px);
		font-weight: 520;
		letter-spacing: -0.06em;
		line-height: 1.06;
	}

	.discord-preview-copy > p:not(.profile-section-kicker, .discord-preview-note) {
		max-width: 500px;
		color: #71685e;
		font-size: 10px;
		line-height: 1.75;
	}

	.discord-command-list {
		display: grid;
		gap: 8px;
		margin-top: 20px;
	}

	.discord-command {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 14px;
		align-items: center;
		border: 1px solid rgba(51, 43, 35, 0.09);
		border-radius: 6px;
		padding: 10px 12px;
		background: rgba(255, 255, 255, 0.58);
	}

	.discord-command > div {
		display: grid;
		gap: 4px;
	}

	.discord-command code {
		color: #9c5d42;
		font-size: 9px;
		font-weight: 650;
	}

	.discord-command > div > span {
		color: #756b60;
		font-size: 8px;
	}

	.discord-command small {
		color: #8b8074;
		font-size: 7px;
		text-align: right;
	}

	.discord-preview-note {
		margin: 15px 0 0;
		color: #82786d;
		font-size: 8px;
		line-height: 1.6;
	}

	.profile-footer {
		border-top: 1px solid rgba(53, 44, 35, 0.1);
		color: #81776c;
		font-size: 8px;
	}

	.profile-footer > a:last-child {
		color: inherit;
		font-size: 7px;
		letter-spacing: 0.1em;
		text-decoration: none;
	}

	.profile-page :global(a:focus-visible),
	.profile-page button:focus-visible {
		outline: 2px solid var(--profile-color);
		outline-offset: 3px;
	}

	@media (max-width: 760px) {
		.profile-nav,
		.profile-footer {
			padding-right: 6%;
			padding-left: 6%;
		}

		.profile-hero {
			min-height: auto;
			grid-template-columns: 1fr;
			gap: 0;
			padding: 25px 7% 60px;
		}

		.profile-copy {
			padding: 20px 0 0;
		}

		.profile-back {
			margin-bottom: 36px;
		}

		.profile-copy h1 {
			font-size: clamp(67px, 16vw, 100px);
		}

		.profile-art {
			min-height: 390px;
			margin-top: 4px;
		}

		.profile-art > img {
			height: 405px;
		}

		.profile-quote {
			right: -2%;
			bottom: 9%;
		}

		.profile-art-caption {
			right: -4%;
			font-size: 6px;
		}

		.profile-about,
		.profile-platforms,
		.profile-related {
			padding: 70px 7%;
		}

		.profile-about {
			grid-template-columns: 1fr;
			gap: 30px;
		}

		.profile-platform-heading {
			display: grid;
			gap: 15px;
		}

		.platform-options {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.platform-options > button {
			min-height: 125px;
		}

		.discord-preview {
			grid-template-columns: 1fr;
		}

		.discord-preview-top {
			padding: 18px;
		}

		.discord-preview-copy {
			padding: 25px 18px;
		}

		.discord-command {
			grid-template-columns: 1fr;
			gap: 7px;
		}

		.discord-command small {
			text-align: left;
		}

		.profile-footer {
			flex-wrap: wrap;
			gap: 15px;
			padding-top: 22px;
			padding-bottom: 22px;
		}

		.profile-footer > span {
			order: 1;
			width: 100%;
		}
	}
</style>
