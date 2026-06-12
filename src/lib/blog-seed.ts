import type { BlogPost } from "./blog-types";

/**
 * Default, code-shipped blog posts. These always render even when the
 * database is empty or unreachable, and are merged with any posts created
 * through the admin panel (DB posts override a seed post with the same slug).
 *
 * Content uses a small subset of Markdown rendered by the blog detail page:
 *   ## / ###  headings, paragraphs, **bold**, `- ` bullet lists,
 *   `1. ` numbered lists, and `> ` blockquotes.
 */
export const seedBlogPosts: BlogPost[] = [
  {
    id: "seed-first-hackathon-guide",
    slug: "first-hackathon-survival-guide",
    title: "Your First Hackathon: A Survival Guide",
    excerpt:
      "Walking into your first hackathon is intimidating. Here is everything we wish someone had told us before our first all-nighter.",
    date: "2025-01-12",
    author: "The HackSL Team",
    content: `Walking into your first hackathon can feel like showing up to a party where everyone already knows each other and speaks a language you barely understand. We have been there. After organising and competing in dozens of events across Sri Lanka, here is the honest guide we wish we had.

## You do not need to be an expert

The single biggest myth is that hackathons are only for elite programmers. They are not. Hackathons reward curiosity, hustle, and the willingness to learn in public. Some of the strongest teams we have seen included a designer, a business student, and one developer.

> A hackathon is not an exam. It is a sandbox. Nobody is grading your syntax.

## What to bring

- A laptop and charger (and a spare charger if you can)
- A reusable water bottle and some snacks
- Headphones for focus and a hoodie for the cold venues
- An open mind and a notebook for ideas

## How to spend the first hour

Most beginners waste the opening hours arguing about ideas. Instead:

1. Pick a problem you genuinely care about.
2. Scope it down until it feels almost too small.
3. Decide the single demo you want to show the judges.
4. Split the work and start building immediately.

## Sleep is a feature, not a bug

The all-nighter is a hackathon cliche, but exhausted minds ship broken demos. Take shifts, rest, and protect the last two hours for testing and your pitch. A working small project always beats an ambitious broken one.

Welcome to the community. Your first hackathon is the hardest. After that, you are hooked.`,
  },
  {
    id: "seed-find-perfect-team",
    slug: "how-to-find-the-perfect-hackathon-team",
    title: "How to Find the Perfect Hackathon Team",
    excerpt:
      "A great idea dies without the right people behind it. Here is how to build a balanced team that actually ships.",
    date: "2025-01-28",
    author: "The HackSL Team",
    content: `The difference between a frustrating weekend and an unforgettable one usually comes down to one thing: your team. A brilliant idea with the wrong people will stall, while an average idea with the right people will fly.

## The ideal team shape

For a typical 24 to 48 hour hackathon, three to four people is the sweet spot. Any more and coordination eats your time. A balanced team usually covers:

- **A builder** who can wire up the core functionality fast
- **A designer** who makes the demo feel real and polished
- **A storyteller** who shapes the problem and delivers the pitch
- **A generalist** who fills whatever gap appears at 2am

## Where to find teammates

If you are arriving solo, do not panic. Most hackathons run a team formation session at the start. Use it.

1. Stand up and pitch your idea in one sentence.
2. Listen for ideas that excite you, not just ones you can build.
3. Look for people who disagree well, not people who only agree.

## Red flags to avoid

> The most dangerous teammate is the one who promises everything and disappears at hour ten.

Watch for people who refuse to scope down, who will not commit to a clear role, or who treat the event as a networking-only exercise. Enthusiasm is great, but follow-through wins.

## Make it last beyond the weekend

The best hackathon teams often become startups, study groups, or lifelong friends. Treat team formation as the start of a relationship, not a transaction.`,
  },
  {
    id: "seed-winning-pitch",
    slug: "anatomy-of-a-winning-hackathon-pitch",
    title: "The Anatomy of a Winning Hackathon Pitch",
    excerpt:
      "Judges decide in the first 60 seconds. Learn how to structure a three-minute pitch that sticks.",
    date: "2025-02-14",
    author: "The HackSL Team",
    content: `You spent the whole weekend building. Now you have three minutes and a nervous heartbeat to convince the judges it mattered. The pitch is where good projects win and great projects lose.

## Judges decide fast

In most events, judges have seen twenty demos before yours and have ten more to go. They form an impression in the first sixty seconds. Your job is to make those seconds count.

## A pitch structure that works

1. **The hook (15s):** Open with the problem as a human story, not a statistic.
2. **The stakes (30s):** Show why this problem matters and who suffers from it.
3. **The demo (90s):** Show the product working. Do not narrate menus, show the magic moment.
4. **The how (30s):** Briefly explain what you built and the tech behind it.
5. **The close (15s):** End with the vision and a clear ask.

## Show, do not tell

> If you find yourself saying "imagine if", stop. Build the smallest version and actually show it.

A live demo beats slides every time. If a live demo is risky, record a clean screen capture as a backup so a flaky network never sinks you.

## Handle the questions

Judges will probe. Answer honestly, admit what is unfinished, and frame gaps as a roadmap rather than a failure. Confidence with humility beats overselling.

Practice the pitch at least three times before you step up. The team that rehearses always looks calmer than the team that wings it.`,
  },
  {
    id: "seed-organizing-hackathon",
    slug: "organizing-your-first-hackathon-in-sri-lanka",
    title: "Organizing Your First Hackathon in Sri Lanka",
    excerpt:
      "From venue to sponsors to judging, a practical playbook for running a hackathon that participants will remember.",
    date: "2025-03-02",
    author: "The HackSL Team",
    content: `Running a hackathon is one of the most rewarding ways to grow a tech community, and Sri Lanka has a hungry, talented base of students and builders waiting for these opportunities. Here is a practical playbook from the HackSL community.

## Start with the why

Before logistics, get clear on your purpose. Are you upskilling beginners, sourcing startup ideas, or building community? Every later decision flows from this answer.

## The logistics checklist

- **Venue:** Reliable power, strong wifi, and space to sleep or rest
- **Dates:** Avoid exam seasons and major public holidays
- **Food:** Plan for late-night meals, not just lunch
- **Wifi:** Then double your bandwidth estimate, because you underestimated it

## Finding sponsors

Sponsors fund prizes, food, and venues, and they want talent and visibility in return. Approach them with a clear offer:

1. Explain who attends and why it matters to them.
2. Offer tiered packages with concrete deliverables.
3. Follow up with photos and impact numbers afterward.

> Sponsors remember organisers who report back. A good recap email is the best pitch for next year.

## Judging that feels fair

Publish your criteria before the event. Brief your judges so they score consistently, and give every team a fair, equal slot. Nothing damages a community faster than a hackathon that feels rigged.

## The day after matters most

The magic of a hackathon is what happens next. Connect winners with mentors, share project repos, and keep the community talking. One great event can spark a whole ecosystem.`,
  },
  {
    id: "seed-build-vs-learn",
    slug: "should-you-build-or-learn-at-a-hackathon",
    title: "Should You Build or Learn at a Hackathon?",
    excerpt:
      "Not every hackathon is about winning. Sometimes the smartest move is to treat the weekend as a crash course.",
    date: "2025-03-20",
    author: "The HackSL Team",
    content: `There is a quiet debate in every hackathon community: are these events for shipping polished products, or for learning new skills fast? The honest answer is that it depends entirely on your goals.

## The case for building to win

If you are chasing prizes, internships, or investor attention, then a tight, polished demo is everything. Play to your strengths, use tools you already know, and avoid experimenting with unfamiliar tech on the clock.

## The case for learning

But some of the most valuable hackathon weekends end with no prize at all. If you use the event to finally learn that framework, ship your first API, or experience a real team workflow, you walk away richer than half the winners.

> Skills compound. A trophy gathers dust, but the thing you learned shows up in every project after.

## How to decide

Ask yourself three questions before the event:

1. What do I want to be true about me on Monday morning?
2. Am I optimising for a line on my resume or a skill in my hands?
3. Who am I building with, and what do they want?

## You can do both

The best approach is often a hybrid. Build the core with tools you trust, then stretch into one new skill in a low-risk corner of the project. You ship something real and grow at the same time.

Whatever you choose, decide it on purpose. The worst outcome is drifting through the weekend without knowing what you were there for.`,
  },
  {
    id: "seed-avoid-burnout",
    slug: "avoiding-burnout-during-a-48-hour-hackathon",
    title: "Avoiding Burnout During a 48-Hour Hackathon",
    excerpt:
      "Endurance beats intensity. Practical habits to keep your energy and your code quality high across a long event.",
    date: "2025-04-08",
    author: "The HackSL Team",
    content: `The hackathon mythology celebrates the heroic all-nighter, fueled by energy drinks and sheer will. The reality is that burnout produces buggy code and bad decisions. The teams that last are the teams that pace themselves.

## Energy is your real resource

Time is fixed, but your energy is not. A focused, rested hour is worth three exhausted ones. Treat your energy as the scarce resource you are managing all weekend.

## Habits that keep you sharp

- **Work in sprints:** 50 minutes on, 10 minutes away from the screen
- **Eat real food:** Sugar spikes crash hard at the worst moments
- **Hydrate:** Headaches are usually dehydration, not difficulty
- **Step outside:** Daylight and fresh air reset a foggy brain

## Take shifts, not all-nighters

> Two people awake and sharp beat four people half-asleep and irritable.

If your team is large enough, rotate sleep so someone is always at full capacity. Protect at least a few hours of rest, especially before the final push and pitch.

## Watch for the warning signs

When you start fixing the same bug for the third time, snapping at teammates, or staring blankly at the screen, that is your body asking for a break. Step away for fifteen minutes. You will solve it faster afterward.

## Finish strong

Reserve the final stretch for testing, polish, and rehearsing your pitch, not frantic new features. A calm, rested team always demos better than a frazzled one.`,
  },
  {
    id: "seed-tech-stack",
    slug: "choosing-the-right-tech-stack-for-a-hackathon",
    title: "Choosing the Right Tech Stack for a Hackathon",
    excerpt:
      "The best stack is not the trendiest one. It is the one your team can ship with at 3am. Here is how to choose.",
    date: "2025-04-26",
    author: "The HackSL Team",
    content: `Few decisions affect your weekend more than your tech stack. Pick the wrong tools and you will spend the hackathon fighting your setup instead of building your idea. Here is how to choose wisely under pressure.

## Familiarity beats novelty

The number one rule: use what you know. A hackathon is not the time to learn a new language or framework from scratch. The trendy tool you read about last week will betray you at midnight.

> The best stack is the one your team can debug while exhausted.

## Optimise for speed, not scale

You are building a demo for a weekend, not infrastructure for a million users. Favour tools that get you to a working product fast:

- Managed databases over self-hosted ones
- Component libraries over custom design systems
- Hosted deployment over manual server setup
- Boring, proven tools over bleeding-edge experiments

## Reduce moving parts

Every service you add is another thing that can break. A simpler architecture with fewer integrations is easier to demo and easier to fix. When in doubt, cut a dependency.

## Plan your deployment early

1. Deploy a hello-world version in the first few hours.
2. Confirm the demo works on the venue network, not just your laptop.
3. Keep a recorded backup demo in case the live one fails.

## Let the problem pick the tools

Choose your stack to fit the project, not the other way around. If you are building a quick data dashboard, a mobile prototype, or an AI demo, each points to different tools. Match the tool to the job and you will spend the weekend building, not configuring.`,
  },
  {
    id: "seed-ai-hackathons",
    slug: "winning-ai-hackathons-without-a-phd",
    title: "Winning AI Hackathons Without a PhD",
    excerpt:
      "AI hackathons are booming. You do not need to train a model from scratch to win. You need a sharp problem and a slick demo.",
    date: "2025-05-15",
    author: "The HackSL Team",
    content: `AI hackathons have exploded in popularity, and many talented builders avoid them thinking they need deep machine learning expertise. The truth is that the winners are rarely the ones with the fanciest models. They are the ones who solve a real problem in a way that feels like magic.

## You are building products, not papers

In a research lab, the model is the point. In a hackathon, the model is a means to an end. Judges reward a working product that delights, not a clever architecture nobody can see.

> Nobody claps for your loss curve. They clap when your demo does something they did not think was possible.

## Stand on the shoulders of giants

Modern AI APIs let you build remarkable things without training anything. Lean on them:

- Use hosted language and vision models through their APIs
- Combine existing models rather than building your own
- Focus your effort on the experience around the model

## Find a sharp problem

The best AI hackathon projects start with a painfully specific problem. "AI for healthcare" is a category. "Summarise a doctor's handwritten notes for rural clinics" is a winning project.

## Make the magic visible

1. Show the input a real person would give.
2. Show the AI doing something genuinely useful with it.
3. Show the output in a form people can act on.

## Mind the rough edges

AI demos can fail in funny ways. Test your prompts, handle the cases where the model gets it wrong, and have a clean example ready for the judges. A graceful failure beats a confident hallucination on stage.`,
  },
  {
    id: "seed-after-hackathon",
    slug: "what-to-do-after-the-hackathon-ends",
    title: "What to Do After the Hackathon Ends",
    excerpt:
      "The weekend is over, but the opportunity is not. How to turn a 48-hour project into something that lasts.",
    date: "2025-05-30",
    author: "The HackSL Team",
    content: `The lights come up, the prizes are handed out, and everyone goes home exhausted. For most teams, the project dies in a forgotten repository. But the hackathon is really just the beginning if you choose to treat it that way.

## Capture the moment while it is fresh

Within a few days, before the memory fades:

- Write down what worked and what broke
- Save the demo video and screenshots
- Thank your teammates and the organisers
- Note the feedback the judges gave you

## Decide what this project is

Be honest about which bucket your project falls into. Not everything should live on, and that is fine.

1. **A learning exercise:** Archive it proudly and move on.
2. **A portfolio piece:** Polish the README and pin it on your profile.
3. **A real idea:** Validate it with users before you write more code.

> The graveyard of hackathon projects is full of great demos that nobody ever tried to use again.

## Turning a demo into a product

If the idea has legs, resist the urge to keep coding immediately. Instead, talk to ten people who have the problem. Their reactions will tell you whether to rebuild, pivot, or let it go.

## Stay in the community

The relationships you built over the weekend are the most durable prize. Keep in touch with your team, mentor the next batch of beginners, and come back to organise or judge. That is how a single weekend turns into a thriving ecosystem.`,
  },
  {
    id: "seed-hacksl-community",
    slug: "the-rise-of-the-sri-lankan-hackathon-scene",
    title: "The Rise of the Sri Lankan Hackathon Scene",
    excerpt:
      "From university labs to national stages, Sri Lanka's hackathon culture is thriving. Here is what makes it special.",
    date: "2025-06-06",
    author: "The HackSL Team",
    content: `Something exciting is happening across Sri Lanka. In university computer labs, co-working spaces, and online communities, a vibrant hackathon culture is taking root, and it is producing a new generation of builders.

## A community on the rise

A few years ago, hackathons here were rare and mostly confined to a handful of universities. Today they are everywhere, spanning students, professionals, and self-taught coders from every corner of the island.

> Talent has never been the bottleneck in Sri Lanka. Opportunity was. Hackathons are closing that gap.

## What makes the local scene special

- **Resourcefulness:** Teams build remarkable things with limited resources
- **Community spirit:** Experienced builders genuinely mentor newcomers
- **Real problems:** Many projects tackle local challenges others overlook
- **Global ambition:** Local winners increasingly compete on world stages

## Challenges that remain

The scene is growing, but it is not without hurdles. Access to reliable infrastructure, sustained sponsorship, and pathways from prototype to product are still uneven. Bridging the gap between a winning demo and a funded venture is the next frontier.

## How you can be part of it

Whether you are a student, a developer, a designer, or simply curious, there is a place for you:

1. Attend your first hackathon, even if you feel unready.
2. Volunteer or mentor once you have some experience.
3. Organise an event in your own town or campus.

This is why HackSL exists: to connect Sri Lanka's tech innovators and grow this movement, one hackathon at a time. The best chapters of this story are still being written, and you can help write them.`,
  },
];
