<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { brandedOgImageUrl } from '../lib/community/og';
	import { flameborns, type FlamebornProfile } from '../lib/characters';
	import FlameIcon from '../lib/FlameIcon.svelte';
	import ThemeToggle from '../lib/ThemeToggle.svelte';
	import { jsonLdScript } from '../lib/seo';
	import { SITE_URL } from '../lib/site';

	const pageTitle = 'Flameborns | AI Companions for Creativity, Ideas & Everyday Life';
	const pageDescription =
		'Meet Flameborns, AI companions for creativity, music, writing, learning, and everyday ideas. Explore each character and their planned platforms.';
	const socialDescription = 'A companion for your art, music, ideas, and everyday life.';
	const socialImageTitle = 'Flameborns';
	const homeSchema = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'WebSite',
				'@id': `${SITE_URL}/#website`,
				url: `${SITE_URL}/`,
				name: 'Flameborns',
				alternateName: 'Flameborns AI Companions',
				description: pageDescription,
				inLanguage: 'en',
				publisher: { '@id': `${SITE_URL}/#organization` }
			},
			{
				'@type': 'Organization',
				'@id': `${SITE_URL}/#organization`,
				name: 'Flameborns',
				url: `${SITE_URL}/`,
				logo: {
					'@type': 'ImageObject',
					url: `${SITE_URL}/assets/dlst.gif`
				},
				parentOrganization: {
					'@type': 'Organization',
					name: 'Sanctyria',
					url: 'https://sanctyria.com/'
				}
			},
			{
				'@type': 'WebPage',
				'@id': `${SITE_URL}/#webpage`,
				url: `${SITE_URL}/`,
				name: pageTitle,
				description: pageDescription,
				isPartOf: { '@id': `${SITE_URL}/#website` },
				about: { '@id': `${SITE_URL}/#organization` },
				inLanguage: 'en'
			}
		]
	};

	const featuredCharacters = flameborns
		.slice(0, 4)
		.filter((friend): friend is FlamebornProfile & { image: string } => friend.image !== null);

	const scenes = [
		{
			eyebrow: 'A little more understood',
			title: 'It remembers the little things.',
			body: 'The half-formed idea. The song you played on repeat. The person you meant to text. A good conversation picks up where you left off.',
			type: 'memory'
		},
		{
			eyebrow: 'Room to become',
			title: 'A space that sounds like you.',
			body: 'Build a rhythm, find your words, test an idea or simply talk. Your Flameborn meets you where you are—no script, no pressure.',
			type: 'voice'
		},
		{
			eyebrow: 'A spark in every space',
			title: 'Your companion, wherever you are.',
			body: 'Start here. Keep going in the app, at your desktop or in your community. Your creative sidekick belongs in your world.',
			type: 'everywhere'
		}
	];

	const stories = [
		{
			name: 'A first little spark',
			detail: 'Emberlyn is ready to turn that half-formed thought into something.',
			label: 'Let’s see where that first idea could take us.',
			color: '#d97453',
			image: '/assets/characters/ember.png'
		},
		{
			name: 'Try a new strategy',
			detail: 'Kairen brings a fresh perspective to the things you want to figure out.',
			label: 'We can take another look at this together.',
			color: '#667f8b',
			image: '/assets/characters/kai.png'
		},
		{
			name: 'Keep your curiosity',
			detail: 'Liber makes exploring a new idea feel like opening a door.',
			label: 'Wait—what happens if we follow that question?',
			color: '#75886f',
			image: '/assets/characters/lib.png'
		},
		{
			name: 'Find the feeling',
			detail: 'Saphyran helps ideas find their voice, their pace, their sound.',
			label: 'What if we found the rhythm before the words?',
			color: '#8695c2',
			image: '/assets/characters/saphy.png'
		}
	];

	let activeScene = $state(0);
	let activeCharacter = $state(0);
	let previewOpen = $state(false);
	let selectedCompanion = $state('Emberlyn');
	let promptText = $state('');
	let previewReply = $state('Hey, I’m here. What’s on your mind?');
	let menuOpen = $state(false);
	let heroCarouselPaused = $state(false);
	let messageInput = $state<HTMLInputElement>();
	let storyScrollTrigger: { start: number; end: number } | null = null;
	const featuredCharacter = $derived(featuredCharacters[activeCharacter]);

	function changeCharacter(direction: -1 | 1) {
		activeCharacter =
			(activeCharacter + direction + featuredCharacters.length) % featuredCharacters.length;
	}

	function goToScene(index: number) {
		const trigger = storyScrollTrigger;
		if (!trigger) {
			document.querySelectorAll<HTMLElement>('.story-scene')[index]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center'
			});
			return;
		}
		const progress = index / (scenes.length - 1);
		window.scrollTo({
			top: trigger.start + progress * (trigger.end - trigger.start),
			behavior: 'smooth'
		});
	}

	function openPreview(name = 'Emberlyn') {
		selectedCompanion = name;
		previewReply = `Hey, I’m ${name}. I’m here—what would you like to explore?`;
		promptText = '';
		previewOpen = true;
		menuOpen = false;
		window.setTimeout(() => messageInput?.focus(), 50);
	}

	function sendPrompt(value = promptText) {
		const prompt = value.trim();
		if (!prompt) return;
		promptText = '';
		if (/art|draw|design|paint|idea|create/i.test(prompt)) {
			previewReply = 'I love a first spark. What are you imagining—and what part feels exciting?';
		} else if (/music|song|sound|listen/i.test(prompt)) {
			previewReply = 'Let’s find the feeling first. What do you want this music to sound like?';
		} else if (/write|word|story|message/i.test(prompt)) {
			previewReply = 'We can work it out together. What’s the one thing you really want to say?';
		} else {
			previewReply = 'I’m listening. Want to tell me a little more about that?';
		}
	}

	function handlePreviewKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') previewOpen = false;
	}

	onMount(() => {
		let disposed = false;
		let heroRotation: number | undefined;
		let cleanupAnimations = () => {};
		window.addEventListener('keydown', handlePreviewKeydown);

		async function initializeAnimations() {
			const [{ gsap }, { ScrollTrigger }] = await Promise.all([
				import('gsap'),
				import('gsap/ScrollTrigger')
			]);
			if (disposed) return;

			gsap.registerPlugin(ScrollTrigger);
			const media = gsap.matchMedia();
			heroRotation = window.setInterval(() => {
				if (
					!heroCarouselPaused &&
					!document.hidden &&
					!previewOpen &&
					!window.matchMedia('(prefers-reduced-motion: reduce)').matches
				) {
					changeCharacter(1);
				}
			}, 5500);
			const context = gsap.context(() => {
				gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
					gsap.from(element, {
						y: 28,
						autoAlpha: 0,
						duration: 0.8,
						ease: 'power2.out',
						scrollTrigger: { trigger: element, start: 'top 88%', once: true }
					});
				});

				media.add('(prefers-reduced-motion: no-preference)', () => {
					const panels = gsap.utils.toArray<HTMLElement>('.story-scene');
					gsap.set(panels, { autoAlpha: 0, y: 22, scale: 0.985 });
					gsap.set(panels[0], { autoAlpha: 1, y: 0, scale: 1 });
					const timeline = gsap.timeline({
						scrollTrigger: {
							id: 'companion-stories',
							trigger: '.story-section',
							start: 'top top',
							end: () =>
								`+=${(panels.length - 1) * (window.innerWidth < 760 ? Math.max(720, window.innerHeight * 1.1) : 1500)}`,
							pin: '.story-stage',
							pinSpacing: true,
							scrub: 0.65,
							anticipatePin: 1,
							onUpdate: (self) => {
								activeScene = Math.round(self.progress * (panels.length - 1));
							}
						}
					});
					storyScrollTrigger = timeline.scrollTrigger ?? null;

					for (let index = 1; index < panels.length; index += 1) {
						const position = index - 1;
						timeline
							.to(
								panels[index - 1],
								{ autoAlpha: 0, y: -20, scale: 0.985, duration: 0.35 },
								position
							)
							.to(panels[index], { autoAlpha: 1, y: 0, scale: 1, duration: 0.5 }, position + 0.12);
					}
				});
			});

			media.add('(prefers-reduced-motion: no-preference)', () => {
				const track = document.querySelector<HTMLElement>('.stories-track');
				const rail = document.querySelector<HTMLElement>('.stories-rail');
				if (!track || !rail) return;

				const distance = () => Math.max(0, track.scrollWidth - rail.clientWidth);
				rail.classList.add('has-scroll-animation');
				gsap.to(track, {
					x: () => -distance(),
					ease: 'none',
					scrollTrigger: {
						id: 'small-moments-stories',
						trigger: rail,
						start: () =>
							`top top+=${Math.max(70, Math.round((window.innerHeight - rail.offsetHeight) / 2))}`,
						end: () => `+=${Math.ceil(distance() * 1.5)}`,
						pin: rail,
						scrub: 0.6,
						anticipatePin: 1,
						invalidateOnRefresh: true
					}
				});
				return () => rail.classList.remove('has-scroll-animation');
			});

			cleanupAnimations = () => {
				if (heroRotation !== undefined) window.clearInterval(heroRotation);
				media.revert();
				context.revert();
				storyScrollTrigger = null;
			};
		}

		void initializeAnimations().catch((cause: unknown) => {
			console.error('Could not initialize Flameborn page animations.', cause);
		});

		return () => {
			disposed = true;
			window.removeEventListener('keydown', handlePreviewKeydown);
			cleanupAnimations();
		};
	});
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<meta name="application-name" content="Flameborns" />
	<link rel="canonical" href={`${SITE_URL}/`} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="Flameborns" />
	<meta property="og:url" content={`${SITE_URL}/`} />
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={socialDescription} />
	<meta
		property="og:image"
		content={brandedOgImageUrl(socialImageTitle, socialDescription, 'AI COMPANIONS')}
	/>
	<meta property="og:image:alt" content="Flameborns companion artwork on a branded social card" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={socialDescription} />
	<meta
		name="twitter:image"
		content={brandedOgImageUrl(socialImageTitle, socialDescription, 'AI COMPANIONS')}
	/>
	<meta name="twitter:image:alt" content="Flameborns companion artwork on a branded social card" />
	{@html jsonLdScript(homeSchema)}
</svelte:head>

<header class="site-header">
	<a class="wordmark" href="#home" aria-label="Flameborns home">
		<img class="brand-logo" src="/assets/dlst.gif" alt="" /> flameborns<span class="wordmark-period"
			>.</span
		>
	</a>
	<nav class:menu-open={menuOpen} aria-label="Main navigation">
		<a href="#companions" onclick={() => (menuOpen = false)}>Meet your Flameborn</a>
		<a href="#how-it-feels" onclick={() => (menuOpen = false)}>The feeling</a>
		<a href="#everywhere" onclick={() => (menuOpen = false)}>Everywhere</a>
		<ThemeToggle />
		<button class="nav-cta" onclick={() => openPreview()}>Meet yours <span>↗</span></button>
	</nav>
	<button
		class="menu-toggle"
		aria-label={menuOpen ? 'Close menu' : 'Open menu'}
		aria-expanded={menuOpen}
		onclick={() => (menuOpen = !menuOpen)}
	>
		<span></span><span></span>
	</button>
</header>

<main>
	<section class="hero" id="home">
		<div class="hero-orbit hero-orbit-one"></div>
		<div class="hero-orbit hero-orbit-two"></div>
		<div class="hero-copy">
			<p class="eyebrow">
				<span class="live-dot"></span> A new kind of company
			</p>
			<h1>Your life.<br />A little more <em>alive.</em></h1>
			<p class="hero-description">
				Meet your Flameborn: an AI companion to dream with, make things with, and bring along for
				the whole wonderfully unfinished thing.
			</p>
			<div class="hero-actions">
				<button class="button button-dark" onclick={() => openPreview()}>
					Meet your Flameborn <span aria-hidden="true">↗</span>
				</button>
				<a class="text-link" href="#companions">Find your kind of spark <span>↓</span></a>
			</div>
			<p class="hero-note">A companion for the person you already are.</p>
		</div>
		<div
			class="hero-art"
			style={`--character-color:${featuredCharacter.color}`}
			role="group"
			aria-label={`${featuredCharacter.name}, ${featuredCharacter.domain}`}
			onpointerenter={() => (heroCarouselPaused = true)}
			onpointerleave={() => (heroCarouselPaused = false)}
		>
			<div class="hero-art-glow"></div>
			<div class="hero-art-ring"></div>
			<div class="hero-caption">
				<FlameIcon class="hero-caption-flame" /> always a work in progress
			</div>
			{#key featuredCharacter.name}
				<img
					class="hero-character"
					src={featuredCharacter.image}
					alt={featuredCharacter.name}
					fetchpriority={activeCharacter === 0 ? 'high' : 'auto'}
					in:fly={{ y: 22, duration: 460 }}
				/>
			{/key}
			<div class="chat-bubble hero-bubble">
				<span class="bubble-name"
					>{featuredCharacter.name.split(' ')[0]} <span>· just now</span></span
				>
				{featuredCharacter.message}
			</div>
			<div class="hero-character-picker">
				<button
					class="character-arrow"
					onclick={() => changeCharacter(-1)}
					aria-label="Show previous Flameborn">←</button
				>
				<div class="character-picker-details" aria-live="polite">
					<strong>{featuredCharacter.name}</strong>
					<span>{featuredCharacter.domain}</span>
				</div>
				<div class="character-picker-dots" role="group" aria-label="Choose a Flameborn">
					{#each featuredCharacters as friend, index}
						<button
							class:active={activeCharacter === index}
							aria-label={`Show ${friend.name}`}
							aria-pressed={activeCharacter === index}
							onclick={() => (activeCharacter = index)}
						></button>
					{/each}
				</div>
				<button
					class="character-arrow"
					onclick={() => changeCharacter(1)}
					aria-label="Show next Flameborn">→</button
				>
			</div>
			<div class="orbit-label">
				<FlameIcon class="orbit-label-flame" />
				{featuredCharacter.domain.toUpperCase()}
			</div>
		</div>
		<a class="scroll-hint" href="#hello"><span></span> keep going</a>
		<p class="hero-side-note">MADE FOR THE MANY VERSIONS OF YOU</p>
	</section>

	<section class="hello-section" id="hello">
		<div class="hello-topline" data-reveal>
			<span class="eyebrow"><span class="live-dot"></span> Not another thing to optimize</span>
			<span class="section-index">01 — A LITTLE INTRODUCTION</span>
		</div>
		<div class="hello-layout">
			<h2 data-reveal>
				Life isn’t a<br />to-do list.<br /><em>Let’s talk about it.</em>
			</h2>
			<div class="hello-note" data-reveal>
				<p>
					AI is everywhere. We thought it could feel a little more <em>here.</em> A good companion doesn’t
					just answer questions—it gets curious, remembers what matters, and gives you room to be a person.
				</p>
				<a class="circle-link" href="#how-it-feels" aria-label="Discover the Flameborn experience"
					>↓</a
				>
			</div>
		</div>
		<div class="hello-marquee" aria-label="Art, words, music, and whatever comes next">
			<div class="marquee-track">
				{#each ['ART', 'WORDS', 'WHAT IF', 'MUSIC', 'EVERYDAY LIFE', 'ART', 'WORDS', 'WHAT IF', 'MUSIC', 'EVERYDAY LIFE'] as word, index}
					<span class:marquee-accent={index % 2 === 2}
						>{word}<FlameIcon class="marquee-flame" /></span
					>
				{/each}
			</div>
		</div>
	</section>

	<section class="story-section" id="how-it-feels">
		<div class="story-stage">
			<div class="story-heading">
				<p class="eyebrow">
					<span class="live-dot"></span> Good company, in the little moments
				</p>
				<h2>There for the<br /><em>in-between.</em></h2>
				<div class="story-tabs" role="tablist" aria-label="Explore the companion experience">
					{#each scenes as scene, index}
						<button
							class:active={activeScene === index}
							role="tab"
							aria-selected={activeScene === index}
							onclick={() => goToScene(index)}>{`0${index + 1}`}</button
						>
					{/each}
				</div>
				<span class="story-tabs-label">LITTLE THINGS, BIG FEELING</span>
			</div>
			<div class="story-scenes">
				{#each scenes as scene, index}
					<article class="story-scene" class:current-scene={activeScene === index}>
						<div class={`scene-art scene-art-${scene.type}`}>
							<span class="scene-kicker">A MOMENT WITH YOUR FLAMEBORN</span>
							{#if scene.type === 'memory'}
								<div class="memory-card">
									<FlameIcon class="memory-icon" />
									<span class="memory-label">a little thing worth keeping</span>
									<span class="memory-text"
										>The tiny ceramics class<br />you said you’d try someday.</span
									>
									<span class="memory-foot">I saved you a spot in your calendar →</span>
								</div>
								<div class="orbit-note note-one">first ideas count, too</div>
								<div class="orbit-note note-two">
									<FlameIcon class="orbit-flame" /> remembered with care
								</div>
							{:else if scene.type === 'voice'}
								<div class="voice-card">
									<span class="voice-label">EMBERLYN · HERE WITH YOU</span>
									<div class="waveform" aria-label="Decorative voice waveform">
										{#each Array.from({ length: 41 }) as _, bar}
											<span style={`--bar:${0.2 + ((bar * 17 + 13) % 70) / 100}`}></span>
										{/each}
									</div>
									<p>“What if we started with the part that makes you smile?”</p>
									<span class="voice-meta"
										><span class="live-dot"></span> no rush. take your time.</span
									>
								</div>
								<div class="audio-orbit"></div>
							{:else}
								<div class="world-card">
									<div class="world-window">
										<div class="window-glow"></div>
										<span>wherever your day takes you</span>
										<div class="window-phone">
											<FlameIcon class="world-flame" /><i>in your pocket</i>
										</div>
										<div class="window-desktop">
											<FlameIcon class="world-flame" /><i>at your desk</i>
										</div>
									</div>
									<span class="world-bridge">one companion. many little windows.</span>
								</div>
							{/if}
						</div>
						<div class="scene-copy">
							<span class="scene-number">0{index + 1} <span> / 03</span></span>
							<p class="scene-eyebrow">{scene.eyebrow}</p>
							<h3>{scene.title}</h3>
							<p class="scene-description">{scene.body}</p>
							<button class="text-link" onclick={() => openPreview()}
								>See what that feels like <span>↗</span></button
							>
						</div>
					</article>
				{/each}
			</div>
			<span class="story-footnote">MADE FOR REAL LIFE, NOT A PERFECT VERSION OF IT</span>
		</div>
	</section>

	<section class="crew-section" id="companions">
		<div class="crew-heading" data-reveal>
			<div>
				<p class="eyebrow">
					<span class="live-dot"></span> Good company comes in many kinds
				</p>
				<h2>Find your kind<br />of <em>bright.</em></h2>
			</div>
			<p>
				Into stories, sound, strategy—or all of it at once? There’s a Flameborn who speaks your
				language.
			</p>
		</div>
		<div class="crew-grid">
			{#each flameborns as friend, index}
				<a
					href={`/${friend.slug}`}
					aria-label={`Explore ${friend.name}`}
					class:crew-first-light={index < 2}
					class="crew-card"
					data-reveal
					style={`--card-color:${friend.color};--delay:${(index % 4) * 70}ms`}
				>
					<div class="crew-avatar">
						<span class="crew-aura"></span>
						{#if friend.image}
							<img src={friend.image} alt="" loading="lazy" />
						{:else}
							<span class="avatar-letter">{friend.mark}</span>
						{/if}
						<span class="crew-ordinal">{String(index + 1).padStart(2, '0')}</span>
					</div>
					<div class="crew-info">
						<div>
							<h3>{friend.name}</h3>
							<span>{friend.title}</span>
						</div>
						<p>{friend.domain}</p>
						<span class="crew-profile-link" aria-hidden="true">↗</span>
					</div>
				</a>
			{/each}
		</div>
		<p class="crew-footnote">
			<FlameIcon class="crew-flame" /> Emberlyn & Kairen are the first Flameborns—curious about all of
			it, just like you.
		</p>
	</section>

	<section class="everywhere-section" id="everywhere">
		<div class="everywhere-intro" data-reveal>
			<p class="eyebrow"><span class="live-dot"></span> A good thing travels</p>
			<h2>Your world.<br />Your <em>Flameborn.</em></h2>
			<p>
				Start a thought here. Pick it up wherever you go. Your companion belongs in all the spaces
				where you already live, play and create.
			</p>
			<button class="button button-light" onclick={() => openPreview()}
				>Start with a spark <span>↗</span></button
			>
		</div>
		<div class="everywhere-art" data-reveal>
			<div class="constellation"></div>
			<div class="device device-chat">
				<div class="device-top">
					<span>◦ ◦ ◦</span><b>flameborns</b><span>···</span>
				</div>
				<div class="device-message">Had the strangest little idea on my walk.</div>
				<div class="device-response">
					<b>Emberlyn</b><br />Okay, I’m listening. What did you notice?
				</div>
				<div class="device-input">Tell me more… <span>↑</span></div>
			</div>
			<div class="device device-community">
				<FlameIcon class="discord-star" /><span class="discord-label">COMMUNITY</span><b
					>the idea garden</b
				>
				<p>what if this was a song?</p>
				<span class="discord-reply">emberlyn &nbsp; that’s a lovely place to start</span>
			</div>
			<div class="device-spark"><FlameIcon class="device-flame" /></div>
			<span class="everywhere-caption"
				>A little more “with you.”<br />A little less “in another tab.”</span
			>
		</div>
		<div class="platform-strip">
			<span>IN YOUR POCKET</span><FlameIcon class="platform-flame" /><span>AT YOUR DESK</span
			><FlameIcon class="platform-flame" /><span>IN YOUR COMMUNITY</span><FlameIcon
				class="platform-flame"
			/><span>WHERE LIFE HAPPENS</span>
		</div>
	</section>

	<section class="stories-section" aria-labelledby="stories-title">
		<div class="stories-heading" data-reveal>
			<p class="eyebrow">
				<span class="live-dot"></span> A spark looks different on everyone
			</p>
			<h2 id="stories-title">Small moments.<br /><em>More you.</em></h2>
			<p>Not a before-and-after. Just little things that start to feel a little less alone.</p>
		</div>
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -- The labelled region is focusable for keyboard scrolling. -->
		<div
			class="stories-rail"
			role="region"
			aria-label="Stories from the Flameborn community"
			tabindex="0"
		>
			<div class="stories-track">
				{#each stories as story, index}
					<article class="testimonial-card" style={`--story-color:${story.color}`}>
						<div class="testimonial-visual">
							<img src={story.image} alt="" loading="lazy" />
							<span class="testimonial-visual-caption"
								>A SPARK, DAY {String(index + 1).padStart(2, '0')}</span
							>
							<FlameIcon class="testimonial-visual-star" />
						</div>
						<div class="testimonial-copy">
							<span class="testimonial-number">0{index + 1} <span> / 04</span></span>
							<p class="testimonial-quote">“{story.label}”</p>
							<h3>{story.name}</h3>
							<p>{story.detail}</p>
						</div>
					</article>
				{/each}
				<a href="#companions" class="stories-last-card">
					<span>AND YOURS?</span>
					<span class="last-card-icon">↗</span>
					<h3>Your story<br />starts here.</h3>
					<span class="last-card-link">Meet your Flameborn <b>↗</b></span>
				</a>
			</div>
		</div>
		<div class="stories-scroll-note">
			<span></span> KEEP GOING TO DISCOVER THE NEXT MOMENT
		</div>
	</section>

	<section class="final-cta">
		<div class="final-cta-grain"></div>
		<FlameIcon class="final-star final-star-one" />
		<FlameIcon class="final-star final-star-two" />
		<div class="final-copy" data-reveal>
			<p class="eyebrow">
				<span class="live-dot"></span> You don’t have to have it figured out
			</p>
			<h2>Come as<br />you <em>are.</em></h2>
			<p>
				Bring the big plans, the tiny thoughts, the things you can’t quite name yet. There’s room
				for all of it here.
			</p>
			<button class="button button-dark" onclick={() => openPreview()}
				>Meet your Flameborn <span>↗</span></button
			>
			<span class="final-note">A little preview. No account needed.</span>
		</div>
		<div class="final-art" aria-hidden="true">
			<div class="final-art-circle"></div>
			<img src="/assets/characters/ember.png" alt="" loading="lazy" />
			<div class="final-art-tag">
				<span class="live-dot"></span> ALWAYS BECOMING
			</div>
		</div>
	</section>
</main>

<footer class="site-footer">
	<a class="wordmark" href="#home"
		><img class="brand-logo" src="/assets/dlst.gif" alt="" /> flameborns<span
			class="wordmark-period">.</span
		></a
	>
	<p>Here for the life you’re living.</p>
	<a href="#home" class="back-top">BACK TO THE BEGINNING ↑</a>
	<span class="copyright">© 2026 FLAMEBORNS · MADE WITH A LITTLE WONDER</span>
</footer>

{#if previewOpen}
	<div
		class="preview-backdrop"
		role="presentation"
		onclick={(event) => {
			if (event.target === event.currentTarget) previewOpen = false;
		}}
	>
		<div
			class="preview-modal"
			role="dialog"
			aria-modal="true"
			aria-labelledby="preview-title"
			tabindex="-1"
		>
			<button class="preview-close" aria-label="Close preview" onclick={() => (previewOpen = false)}
				>×</button
			>
			<div class="preview-topline">
				<FlameIcon class="preview-star" /><span>YOUR FLAMEBORN PREVIEW</span>
			</div>
			<div class="preview-person">
				<div class="preview-avatar">
					{#if selectedCompanion === 'Emberlyn'}<img
							src="/assets/characters/ember.png"
							alt=""
						/>{:else if selectedCompanion === 'Kairen'}<img
							src="/assets/characters/kai.png"
							alt=""
						/>{:else if selectedCompanion === 'Liber'}<img
							src="/assets/characters/lib.png"
							alt=""
						/>{:else if selectedCompanion === 'Saphyran'}<img
							src="/assets/characters/saphy.png"
							alt=""
						/>{:else}<span>{selectedCompanion.charAt(0)}</span>{/if}
				</div>
				<div>
					<h2 id="preview-title">A moment with {selectedCompanion}.</h2>
					<p>A little conversation preview—not connected to a live AI, yet.</p>
				</div>
			</div>
			<div class="preview-conversation">
				<span class="preview-day">A SMALL MOMENT · JUST FOR NOW</span>
				<div class="preview-message preview-them">{previewReply}</div>
				<div class="preview-message preview-you">I’ve been thinking about making something.</div>
				<div class="preview-message preview-them">
					{previewReply.includes('I’m here') || previewReply.includes('I am here')
						? 'I’m glad you told me. What would you like to make?'
						: previewReply}
				</div>
			</div>
			<div class="preview-prompts">
				<span>TRY A LITTLE PROMPT</span>
				<div>
					<button onclick={() => sendPrompt('Help me find an idea for an art project')}
						>Help me start an idea</button
					>
					<button onclick={() => sendPrompt('I want to write a story')}
						>Let’s write something</button
					>
				</div>
			</div>
			<form
				class="preview-input"
				onsubmit={(event) => {
					event.preventDefault();
					sendPrompt();
				}}
			>
				<input
					bind:this={messageInput}
					bind:value={promptText}
					aria-label="Write a preview prompt"
					placeholder="Say what’s on your mind…"
				/>
				<button aria-label="Send preview prompt" disabled={!promptText.trim()}>↑</button>
			</form>
			<p class="preview-disclaimer">Your words stay in this preview. Nothing is sent or saved.</p>
		</div>
	</div>
{/if}
