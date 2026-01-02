export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a66c2]/5 to-transparent" />
        <div className="mx-auto max-w-5xl px-6 py-24 sm:py-32">
          <div className="text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#0a66c2]/10 px-4 py-2 text-sm font-medium text-[#0a66c2]">
              <svg
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              Chrome Extension
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
              Let&apos;s Tag Fast
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
              Quickly tag multiple LinkedIn users and organizations in your
              posts. Collect profiles while browsing, organize them into lists,
              and insert all tags with a single click.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <a
                href="https://chrome.google.com/webstore"
                className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-[#004182]"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-1.5 17.25l-4.5-4.5 1.06-1.06 3.44 3.44 7.44-7.44 1.06 1.06-8.5 8.5z" />
                </svg>
                Add to Chrome - It&apos;s Free
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-300 px-6 py-3 text-base font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to streamline your LinkedIn tagging workflow.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              }
              title="One-Click Collection"
              description="Add users and organizations to your list with a single click while browsing LinkedIn profiles."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"
                  />
                </svg>
              }
              title="Organized Lists"
              description="Create multiple lists to organize your contacts by project, team, or any category you need."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>
              }
              title="Bulk Insert"
              description="Insert all collected tags into your LinkedIn post with one click. No more manual copying."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
                  />
                </svg>
              }
              title="Organizations Too"
              description="Tag both individual users and company pages. Perfect for mentioning partners and collaborators."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
              }
              title="Name Settings"
              description="Customize how names appear with word limits. Show first names only or full names as you prefer."
            />
            <FeatureCard
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
              }
              title="Persistent Storage"
              description="Your lists are saved locally and persist across browser sessions. Never lose your collected tags."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Three simple steps to streamline your LinkedIn tagging.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            <StepCard
              step={1}
              title="Browse & Collect"
              description="Visit LinkedIn profiles and click the 'Add to Tag List' button to collect users and organizations."
            />
            <StepCard
              step={2}
              title="Organize Lists"
              description="Create separate lists for different purposes. Drag and drop to reorder your tags."
            />
            <StepCard
              step={3}
              title="Insert Tags"
              description="Open the post editor, click 'Insert Tags', and all your collected mentions are added instantly."
            />
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Privacy & Permissions
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              We take your privacy seriously. Here&apos;s exactly what the extension
              does and why.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            <PrivacyCard
              title="activeTab Permission"
              description="Required to interact with the current LinkedIn page. This allows the extension to read profile information and insert tags into the post editor only when you click the extension button."
            />
            <PrivacyCard
              title="Host Permissions (linkedin.com)"
              description="The extension only runs on LinkedIn pages. It needs host permission to inject the 'Add to Tag List' button on profiles and to insert mentions into the post composer."
            />
            <PrivacyCard
              title="Storage Permission"
              description="Used to save your tag lists locally on your device. Your data never leaves your browser - we don't have servers and don't collect any information."
            />
            <PrivacyCard
              title="No Remote Code"
              description="The extension runs entirely locally. There are no external API calls, no analytics, and no data transmission. Everything happens on your device."
            />
          </div>
          <div className="mt-12 rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                <svg
                  className="h-5 w-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                  Your Data Stays With You
                </h3>
                <p className="mt-2 text-green-800 dark:text-green-200">
                  Let&apos;s Tag Fast is completely offline. All your tag lists
                  are stored locally using Chrome&apos;s storage API. We have no
                  servers, no accounts, and no way to access your data. The
                  extension is open source and you can verify this yourself.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Single Purpose Section */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Single Purpose
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              This extension does one thing and does it well.
            </p>
          </div>
          <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-8 dark:border-zinc-700 dark:bg-zinc-800">
            <p className="text-center text-lg text-zinc-700 dark:text-zinc-300">
              <strong>Let&apos;s Tag Fast</strong> helps users quickly tag
              multiple LinkedIn users and organizations in posts. Users can
              collect profiles while browsing, organize them into lists, and
              insert all tags into a post with a single click. This saves time
              when creating posts that mention multiple people or companies.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Ready to save time on LinkedIn?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Join thousands of professionals who use Let&apos;s Tag Fast to
              streamline their workflow.
            </p>
            <div className="mt-10">
              <a
                href="https://chrome.google.com/webstore"
                className="inline-flex items-center gap-2 rounded-full bg-[#0a66c2] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-[#004182]"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm-1.5 17.25l-4.5-4.5 1.06-1.06 3.44 3.44 7.44-7.44 1.06 1.06-8.5 8.5z" />
                </svg>
                Add to Chrome - It&apos;s Free
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
              <svg
                className="h-5 w-5 text-[#0a66c2]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="font-medium">Let&apos;s Tag Fast</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500 dark:text-zinc-500">
              <a href="#privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">
                Privacy Policy
              </a>
              <a
                href="https://github.com/crafter-station/linkedin-tag-extension"
                className="hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                GitHub
              </a>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
            Built with TypeScript and Bun. Open source and free forever.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0a66c2]/10 text-[#0a66c2]">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#0a66c2] text-xl font-bold text-white">
        {step}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}

function PrivacyCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
        {title}
      </h3>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>
    </div>
  );
}
