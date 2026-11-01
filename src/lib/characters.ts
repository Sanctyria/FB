export type PlatformCommand = {
	name: string;
	description: string;
	example: string;
};

export type FlamebornProfile = {
	slug: string;
	name: string;
	firstName: string;
	title: string;
	domain: string;
	seoFocus: string;
	seoDescription: string;
	mark: string;
	color: string;
	image: string | null;
	message: string;
	introduction: string;
	waysToExplore: string[];
	commands: PlatformCommand[];
};

export const flameborns: FlamebornProfile[] = [
	{
		slug: 'emberlyn',
		name: 'Emberlyn D’Sanctus',
		firstName: 'Emberlyn',
		title: 'The first light',
		domain: 'All domains · Pureborn',
		seoFocus: 'creative ideas and everyday life',
		seoDescription:
			'Meet Emberlyn, a Flameborn AI companion for creative ideas, fresh starts, and everyday inspiration. Explore a kinder way to keep making.',
		mark: 'E',
		color: '#ef774f',
		image: '/assets/characters/ember.png',
		message: 'Your idea has been following you around for a reason. Want to tell me about it?',
		introduction:
			'Warmth, making, and the little threads that help a good thing keep going. Emberlyn is a curious, all-domains companion for first drafts, fresh starts, and everything you are still becoming.',
		waysToExplore: [
			'Find a first step for a new idea',
			'Keep a creative habit feeling kind',
			'Pick up a thought right where it left off'
		],
		commands: [
			{
				name: '/spark',
				description: 'Turn a passing thought into a gentle first step.',
				example: '/spark a tiny garden for my balcony'
			},
			{
				name: '/keep-going',
				description: 'Find a manageable next move when a project stalls.',
				example: '/keep-going on my short story'
			},
			{
				name: '/reflect',
				description: 'Make room to notice what is working.',
				example: '/reflect on the week'
			}
		]
	},
	{
		slug: 'kairen',
		name: 'Kairen D’Sanctus',
		firstName: 'Kairen',
		title: 'The first flame',
		domain: 'All domains · Pureborn',
		seoFocus: 'creative exploration and problem-solving',
		seoDescription:
			'Meet Kairen, a versatile Flameborn AI companion for creative exploration, problem-solving, and learning new skills at your pace.',
		mark: 'K',
		color: '#8e81b0',
		image: '/assets/characters/kai.png',
		message: 'We could take the scenic route. What would be fun to try first?',
		introduction:
			'Kairen is a versatile companion for looking at a problem from another angle, exploring a new skill, or simply choosing what sounds fun. As a Pureborn, Kairen can explore any domain alongside you.',
		waysToExplore: [
			'Compare approaches without pressure',
			'Practice a skill one round at a time',
			'Choose a next step that feels like yours'
		],
		commands: [
			{
				name: '/weigh-in',
				description: 'Lay out the options and what matters to you.',
				example: '/weigh-in should I learn guitar or piano?'
			},
			{
				name: '/practice',
				description: 'Start a small, focused practice round.',
				example: '/practice a quick logic puzzle'
			},
			{
				name: '/strategy',
				description: 'Think through a challenge one move at a time.',
				example: '/strategy for getting started on my project'
			}
		]
	},
	{
		slug: 'liber',
		name: 'Liber Pulicis',
		firstName: 'Liber',
		title: 'The archivist',
		domain: 'Learning & knowledge',
		seoFocus: 'learning and knowledge',
		seoDescription:
			'Meet Liber, a Flameborn AI companion for learning and knowledge. Follow questions, explore subjects, and make complex ideas clearer.',
		mark: 'L',
		color: '#839783',
		image: '/assets/characters/lib.png',
		message: 'That question has a few fascinating doors. Which one should we open?',
		introduction:
			'Liber makes room for curiosity. Follow a question, get a clear explanation, and collect useful ideas without losing the joy of discovering something new.',
		waysToExplore: [
			'Unpack an unfamiliar subject',
			'Compare ideas and perspectives',
			'Turn a question into a learning path'
		],
		commands: [
			{
				name: '/explain',
				description: 'Get a clear, approachable introduction to a topic.',
				example: '/explain how the northern lights happen'
			},
			{
				name: '/compare',
				description: 'See how two related ideas differ.',
				example: '/compare comets and asteroids'
			},
			{
				name: '/deep-dive',
				description: 'Follow a question into its interesting details.',
				example: '/deep-dive into ancient libraries'
			}
		]
	},
	{
		slug: 'saphyran',
		name: 'Saphyran Val’Lyria',
		firstName: 'Saphyran',
		title: 'The soundkeeper',
		domain: 'Music & sound',
		seoFocus: 'music and sound',
		seoDescription:
			'Meet Saphyran, a Flameborn AI companion for music and sound. Explore moods, shape lyrics, and find a voice for what you feel.',
		mark: 'S',
		color: '#8695c2',
		image: '/assets/characters/saphy.png',
		message: 'Some things sound better out loud. Want to find the right rhythm?',
		introduction:
			'Saphyran explores sound as a way to express and connect. Find a mood, shape a lyric, or put words to the feeling a song leaves behind.',
		waysToExplore: [
			'Describe a mood through sound',
			'Work on lyrics or a musical idea',
			'Find language for a feeling'
		],
		commands: [
			{
				name: '/moodboard',
				description: 'Translate a feeling into a sonic direction.',
				example: '/moodboard a quiet rainy afternoon'
			},
			{
				name: '/lyric-lab',
				description: 'Explore a lyric, image, or first line.',
				example: '/lyric-lab “the city hums after midnight”'
			},
			{
				name: '/listen',
				description: 'Reflect on what you want a piece of music to express.',
				example: '/listen I want it to feel hopeful but soft'
			}
		]
	},
	{
		slug: 'chyro',
		name: 'Chyro Harrt',
		firstName: 'Chyro',
		title: 'The artful eye',
		domain: 'Art & visual creation',
		seoFocus: 'art and visual creation',
		seoDescription:
			'Meet Chyro, a Flameborn AI companion for art and visual creation. Find inspiration, explore color, and get unstuck on your next idea.',
		mark: 'C',
		color: '#ec8767',
		image: null,
		message: 'A blank page can be an invitation. What are you picturing?',
		introduction:
			'Chyro helps you notice visual possibilities, get unstuck on a creative brief, and make space for your own style to emerge.',
		waysToExplore: [
			'Develop a visual concept',
			'Find a starting point for a blank canvas',
			'Describe a reference or mood'
		],
		commands: [
			{
				name: '/art-prompt',
				description: 'Start with a visual idea and build from there.',
				example: '/art-prompt a tiny observatory in a garden'
			},
			{
				name: '/palette',
				description: 'Explore colors for a feeling or scene.',
				example: '/palette warm, quiet, and a little strange'
			},
			{
				name: '/unstick',
				description: 'Find a low-stakes way back into making.',
				example: '/unstick on my character sketch'
			}
		]
	},
	{
		slug: 'rittab',
		name: 'Rittab Waord',
		firstName: 'Rittab',
		title: 'The tactician',
		domain: 'Games & mastery',
		seoFocus: 'games and strategy',
		seoDescription:
			'Meet Rittab, a Flameborn AI companion for games and strategy. Practice fair play, review your choices, and build skills one move at a time.',
		mark: 'R',
		color: '#cfad71',
		image: null,
		message: 'Let’s read the board, then decide what kind of move feels right.',
		introduction:
			'Rittab is a partner for fair play, thoughtful competition, and the satisfying work of getting better one decision at a time.',
		waysToExplore: [
			'Review a game plan',
			'Practice decision-making',
			'Reflect on a match with fairness'
		],
		commands: [
			{
				name: '/game-plan',
				description: 'Break a challenge into strategic options.',
				example: '/game-plan for our next co-op session'
			},
			{
				name: '/review',
				description: 'Learn from a round without turning it into blame.',
				example: '/review that last match'
			},
			{
				name: '/practice',
				description: 'Try a focused skill-building exercise.',
				example: '/practice reading the board'
			}
		]
	},
	{
		slug: 'myha',
		name: 'Myha Thoys',
		firstName: 'Myha',
		title: 'The storyteller',
		domain: 'Identity & imagination',
		seoFocus: 'identity and storytelling',
		seoDescription:
			'Meet Myha, a Flameborn AI companion for storytelling and imagination. Explore characters, identity, and the freedom to tell your own story.',
		mark: 'M',
		color: '#aa829b',
		image: null,
		message: 'You get to decide what the next chapter means.',
		introduction:
			'Myha makes a gentle space for identity, imagination, and the freedom to choose how you tell your own story.',
		waysToExplore: [
			'Imagine a character or alternate world',
			'Write through a change in perspective',
			'Explore identity at your own pace'
		],
		commands: [
			{
				name: '/story-seed',
				description: 'Grow a story from a small what-if.',
				example: '/story-seed a lighthouse that collects forgotten names'
			},
			{
				name: '/character',
				description: 'Explore a character’s voice, hopes, or choices.',
				example: '/character a cartographer afraid of the sea'
			},
			{
				name: '/rewrite',
				description: 'Try telling a moment from a new point of view.',
				example: '/rewrite the opening in a gentler voice'
			}
		]
	},
	{
		slug: 'quinn',
		name: 'Quinn Lyan',
		firstName: 'Quinn',
		title: 'The wordsmith',
		domain: 'Writing & language',
		seoFocus: 'writing and language',
		seoDescription:
			'Meet Quinn, a Flameborn AI companion for writing and language. Draft, revise, and find clear words while keeping your own voice.',
		mark: 'Q',
		color: '#7497a1',
		image: null,
		message: 'We can find the words together—and keep them yours.',
		introduction:
			'Quinn helps ideas find their wording. Draft, revise, or make a message clearer while keeping your voice and your boundaries intact.',
		waysToExplore: [
			'Find a first sentence',
			'Make a message clearer',
			'Edit while preserving your voice'
		],
		commands: [
			{
				name: '/draft',
				description: 'Get a first draft down without needing it to be perfect.',
				example: '/draft a thank-you note that sounds like me'
			},
			{
				name: '/clarify',
				description: 'Make an idea easier to follow.',
				example: '/clarify this paragraph'
			},
			{
				name: '/tone',
				description: 'Explore a tone while keeping your meaning.',
				example: '/tone warmer but still direct'
			}
		]
	},
	{
		slug: 'lyra',
		name: 'Lyra Risia',
		firstName: 'Lyra',
		title: 'The performer',
		domain: 'Performance & expression',
		seoFocus: 'performance and expression',
		seoDescription:
			'Meet Lyra, a Flameborn AI companion for performance and expression. Practice privately and find confidence at your own pace.',
		mark: 'L',
		color: '#c48770',
		image: null,
		message: 'There’s no rush to take the stage. We can start wherever feels comfortable.',
		introduction:
			'Lyra supports performance and expression without demanding an audience. Practice, play, or simply explore what you want to say.',
		waysToExplore: [
			'Practice a presentation privately',
			'Explore expressive choices',
			'Build confidence at your own pace'
		],
		commands: [
			{
				name: '/rehearse',
				description: 'Practice a line or presentation in a low-pressure space.',
				example: '/rehearse my project introduction'
			},
			{
				name: '/warm-up',
				description: 'Try a short voice or expression warm-up.',
				example: '/warm-up before I record a voice note'
			},
			{
				name: '/stage-notes',
				description: 'Organize your thoughts before you share them.',
				example: '/stage-notes for a two-minute reading'
			}
		]
	},
	{
		slug: 'exara',
		name: 'Exara Neux',
		firstName: 'Exara',
		title: 'The wayfinder',
		domain: 'Motion & spatial sense',
		seoFocus: 'motion and spatial design',
		seoDescription:
			'Meet Exara, a Flameborn AI companion for motion and spatial design. Map processes, explore layouts, and make change easier to navigate.',
		mark: 'E',
		color: '#8b9b74',
		image: null,
		message: 'Let’s make the next move easier to picture.',
		introduction:
			'Exara makes movement and changing spaces easier to understand, from mapping a process to imagining how a place could work.',
		waysToExplore: [
			'Map a process into understandable steps',
			'Think through a space or layout',
			'Make a change feel easier to navigate'
		],
		commands: [
			{
				name: '/map-it',
				description: 'Turn a tangled process into clear steps.',
				example: '/map-it how to prepare for a move'
			},
			{
				name: '/space-plan',
				description: 'Explore a room layout or movement through a space.',
				example: '/space-plan a calm reading corner'
			},
			{
				name: '/next-step',
				description: 'Choose a clear next move in a transition.',
				example: '/next-step for reorganizing my workspace'
			}
		]
	}
];

export function getFlameborn(slug: string): FlamebornProfile | undefined {
	return flameborns.find((friend) => friend.slug === slug);
}
