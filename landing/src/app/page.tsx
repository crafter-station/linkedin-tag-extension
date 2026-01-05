import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Layers, MousePointer, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeSwitcherButton } from "@/components/elements/theme-switcher-button";
import { GitHubBadge } from "@/components/github-badge";
import {
  CrafterStationLogo,
  GithubLogo,
  KeboLogo,
  MoralejaDesignLogo,
} from "@/components/logos";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-dotted-grid relative">
      {/* Vertical delimiter lines */}
      <div className="hidden sm:block fixed inset-y-0 left-1/2 -translate-x-[336px] w-px bg-border z-40" />
      <div className="hidden sm:block fixed inset-y-0 left-1/2 translate-x-[336px] w-px bg-border z-40" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        {/* Header vertical delimiter lines */}
        <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 -translate-x-[336px] w-px bg-border" />
        <div className="hidden sm:block absolute top-0 bottom-0 left-1/2 translate-x-[336px] w-px bg-border" />
        <div className="mx-auto max-w-2xl px-4">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-sm font-medium tracking-tight">
                Let&apos;s Tag Fast
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="#features">Features</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="text-xs">
                <Link href="#privacy">Privacy</Link>
              </Button>
              <div className="w-px h-4 bg-border mx-2" />
              <ThemeSwitcherButton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-8">
            <div className="space-y-4 opacity-0 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 border border-border px-3 py-1 text-xs text-muted-foreground">
                <Image
                  src="/chrome-icon.png"
                  alt="Chrome"
                  width={14}
                  height={14}
                  className="h-3.5 w-3.5"
                />
                Chrome Extension
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
                Tag multiple{" "}
                <span className="inline-flex items-baseline gap-2">
                  <Image
                    src="/LI-In-Bug.png"
                    alt="LinkedIn"
                    width={40}
                    height={34}
                    className="inline-block h-7 w-auto sm:h-9 rounded translate-y-0.5"
                  />
                  LinkedIn
                </span>
                <br />
                users in seconds
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                Collect profiles while browsing, organize them into lists, and
                insert all tags with a single click.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 opacity-0 animate-fade-in-up animation-delay-100">
              <Button asChild size="lg" className="gap-2">
                <a href="https://chromewebstore.google.com/detail/gfcgmmcnnnopinjhbkglfdelocdofdad?utm_source=item-share-cb" target="_blank">
                  Add to Chrome — Free
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              <GitHubBadge repo="crafter-station/linkedin-tag-extension" />
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-2xl px-4">
          <div className="opacity-0 animate-fade-in-up animation-delay-200">
            <div className="aspect-video overflow-hidden rounded-lg shadow-2xl shadow-primary/10">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/5a_s_mp0pvo"
                title="Let's Tag Fast Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 border-t border-border">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-12">
            <div className="space-y-2 opacity-0 animate-fade-in-up animation-delay-300">
              <h2 className="font-display text-2xl font-bold tracking-tight">Features</h2>
              <p className="text-muted-foreground">
                Everything you need to streamline your LinkedIn tagging.
              </p>
            </div>

            <div className="grid gap-px bg-border opacity-0 animate-fade-in-up animation-delay-400">
              <FeatureCard
                icon={<MousePointer className="h-4 w-4" />}
                title="One-Click Collection"
                description="Add users and organizations to your list with a single click while browsing LinkedIn profiles."
              />
              <FeatureCard
                icon={<Layers className="h-4 w-4" />}
                title="Organized Lists"
                description="Create multiple lists to organize your contacts by project, team, or any category you need."
              />
              <FeatureCard
                icon={<Zap className="h-4 w-4" />}
                title="Bulk Insert"
                description="Insert all collected tags into your LinkedIn post with one click. No more manual copying."
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                How it works
              </h2>
              <p className="text-muted-foreground">
                Three simple steps to streamline your workflow.
              </p>
            </div>

            <div className="space-y-0">
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
                description="Open the post editor, click 'Insert Tags', and all your mentions are added instantly."
                isLast
              />
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacy" className="py-16 border-t border-border">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-12">
            <div className="space-y-2">
              <h2 className="font-display text-2xl font-bold tracking-tight">
                Privacy & Permissions
              </h2>
              <p className="text-muted-foreground">
                We take your privacy seriously. Here&apos;s exactly what the
                extension does.
              </p>
            </div>

            <div className="grid gap-px bg-border">
              <PrivacyCard
                title="Local Storage Only"
                description="All your tag lists are stored locally using Chrome's storage API. We have no servers, no accounts, and no way to access your data."
              />
              <PrivacyCard
                title="No Remote Code"
                description="The extension runs entirely locally. There are no external API calls, no analytics, and no data transmission."
              />
              <PrivacyCard
                title="Minimal Permissions"
                description="Only requests permissions necessary to interact with LinkedIn pages and store your lists locally."
              />
            </div>

            <div className="border border-border p-6 bg-muted/30">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">
                  Open Source.
                </span>{" "}
                The extension is fully open source. You can review the code and
                verify our privacy claims yourself on GitHub.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 border-t border-border">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-6 text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              Ready to save time?
            </h2>
            <p className="text-muted-foreground">
              Join professionals who use Let&apos;s Tag Fast to streamline their
              LinkedIn workflow.
            </p>
            <Button asChild size="lg" className="gap-2">
              <a href="https://chromewebstore.google.com/detail/gfcgmmcnnnopinjhbkglfdelocdofdad?utm_source=item-share-cb" target="_blank">
                Add to Chrome — Free
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="mx-auto max-w-2xl px-4">
          <div className="space-y-8">
            {/* Links */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Let&apos;s Tag Fast</span>
              <div className="flex items-center gap-6">
                <Link
                  href="#privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
                <a
                  href="https://github.com/crafter-station/linkedin-tag-extension"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  target="_blank"
                >
                  GitHub
                </a>
              </div>
            </div>

            {/* Separator */}
            <div className="h-px bg-border" />

            {/* Logos */}
            <div className="flex items-center justify-center gap-8">
              <a
                href="https://www.linkedin.com/in/cuevaio/"
                target="_blank"
                className="opacity-40 hover:opacity-100 transition-opacity"
                title="Built for LinkedIn"
              >
                <Image
                  src="/LI-In-Bug.png"
                  alt="LinkedIn"
                  width={24}
                  height={21}
                  className="h-5 w-auto rounded-sm"
                />
              </a>
              <a
                href="https://www.crafterstation.com/"
                target="_blank"
                className="opacity-40 hover:opacity-100 transition-opacity"
                title="Crafter Station"
              >
                <CrafterStationLogo className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/crafter-station/linkedin-tag-extension"
                target="_blank"
                className="opacity-40 hover:opacity-100 transition-opacity text-foreground"
                title="GitHub"
              >
                <GithubLogo className="h-5 w-5" />
              </a>
              <a
                href="https://kebo.app/"
                target="_blank"
                className="opacity-40 hover:opacity-100 transition-opacity text-foreground"
                title="Kebo"
              >
                <KeboLogo className="h-6 w-6" />
              </a>
              <a
                href="https://www.moraleja.co/"
                target="_blank"
                className="opacity-40 hover:opacity-100 transition-opacity text-foreground"
                title="Moraleja Design"
              >
                <MoralejaDesignLogo className="h-6 w-6" />
              </a>
            </div>

            {/* Copyright */}
            <p className="text-center text-xs text-muted-foreground">
              Built with TypeScript and Bun. Open source and free forever.
            </p>
          </div>
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
    <div className="bg-background p-6 space-y-3">
      <div className="flex items-center gap-3">
        <div className="text-muted-foreground">{icon}</div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed pl-7">
        {description}
      </p>
    </div>
  );
}

function StepCard({
  step,
  title,
  description,
  isLast = false,
}: {
  step: number;
  title: string;
  description: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative pl-8 pb-8">
      {/* Line */}
      {!isLast && (
        <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
      )}
      {/* Number */}
      <div className="absolute left-0 top-0 w-6 h-6 border border-border bg-background flex items-center justify-center text-xs font-medium">
        {step}
      </div>
      {/* Content */}
      <div className="space-y-1 pt-0.5">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
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
    <div className="bg-background p-6 space-y-2">
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
