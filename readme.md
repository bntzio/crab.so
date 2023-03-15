# crab 🦀

> Decentralized Communities in Web3

### What is crab?

Crab is a community-driven, open-source, decentralized network for thriving communities in Web3.

Read the presentation [here](https://docs.google.com/presentation/d/1apHGhAi0vjjzXP3wOY_CjpcNB6juKrjgtqNXub_vzXI/edit?usp=sharing).

### How does crab work?

Crab utilizes the [Spling Social Protocol](https://www.splinglabs.com) to interact with the Shadow Drive, a decentralized file system by [GenesysGo](https://shadow.cloud) in the [Solana](https://solana.com) blockchain.

You can try the official and most recent version of crab at [crab.so](https://crab.so) 🦀

### Development

Crab is open-source and you can contribute to the project by opening a pull request or an issue.

It is built with [Next.js](https://nextjs.org) and [Tailwind CSS](https://tailwindcss.com).

#### Requirements

- [Docker](https://www.docker.com)
- [Node.js](https://nodejs.org) (`>= v14`)
- [pnpm](https://pnpm.io) (`brew install pnpm` using [Homebrew](https://brew.sh) 🍺)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (`brew install supabase/tap/supabase` using [Homebrew](https://brew.sh) 🍺)
- [Solana Wallet](https://docs.solana.com/wallet-guide) (we recommend [Phantom](https://phantom.app) or [Backpack](https://www.backpack.app))

#### Setup

##### 1. Clone the repository

```bash
git clone git@github.com:bntzio/crab.so.git
```

##### 2. Start Docker and the Supabase container

```bash
# inside apps/web directory
supabase start
```

##### 3. Install dependencies

```bash
# inside the root directory
pnpm install
```

##### 4. Add and fill the environment variables

```bash
# create a .env.local file inside apps/web directory
HELIUS_API_KEY=
NEXT_PUBLIC_HELIUS_API_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

##### 5. Start the development server

```bash
pnpm run dev --filter web
```

##### 6. Start developing

Go to [http://localhost:3000](http://localhost:3000) with your browser to see the app up and running.

**Happy hacking!** 🦀

#### Getting the environment variables

- `HELIUS_API_KEY` and `NEXT_PUBLIC_HELIUS_API_KEY` are the API keys required to run the RPC, you can get one by creating an account in [helius labs](https://helius.xyz).

- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` can be found in your terminal right after you start the Supabase container.
