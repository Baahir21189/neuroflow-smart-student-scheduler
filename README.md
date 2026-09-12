# NeuroFlow: Smart Student Scheduler

Build an award winning React website called "NeuroFlow" — a smart weekly

scheduler for university students that helps them manage both their academic life and personal life based on neuroscience backed information

Install these libraries: lucide-react, sonner, html2canvas, aos, date-fns

Make sure to use framer-motion for ui-ux and animations

Design direction:

- Dark theme, near-black background

- Single accent color: soft electric violet

- Clean, minimal — lots of breathing room

- Font: DM Sans from Google Fonts (400, 500, 700 weights only)

- Cards have subtle borders, slight surface lift from background

 

Create a fixed navigation bar at the top with three links:

- Home → /

- Problem & Solution → /problem-solution

- Scheduler → /scheduler

 

"Problem & Solution" must be the exact text (required by competition).

 

Set up React Router with three routes:

/ → HomePage (placeholder for now)

/problem-solution → ProblemPage (placeholder for now)

/scheduler → SchedulerPage (the main app — built in later prompts)

 

The /scheduler page has four tabs:

1. Personality Assessment

2. My Weekly Routine

3. New Tasks & Events

4. My Profile

 

Tab locking: tabs 2, 3, 4 are greyed out and unclickable

until assessment is completed. Store completion status in

localStorage as "neuroflow_assessment_complete".

Each tab shows a placeholder for now.

I'll build each tab in the next prompts.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6079d2dd-424e-4f04-84e1-5883ece8b990).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
