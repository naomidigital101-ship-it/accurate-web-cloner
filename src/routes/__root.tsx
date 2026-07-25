import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "קשר של תפילין - עמותת אור חדש מחברת בין יהודים שרוצים להניח תפילין" },
      { name: "description", content: "ערבות הדדית וזיכוי הרבים, מטרתינו לחבר בין יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר לה' יתברך, לבין יהודי שיש לו תפילין לא בשימוש" },
      { name: "robots", content: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
      { property: "og:locale", content: "he_IL" },
      { property: "og:site_name", content: "קשר של תפילין" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "קשר של תפילין - עמותת אור חדש מחברת בין יהודים שרוצים להניח תפילין" },
      { property: "og:description", content: "ערבות הדדית וזיכוי הרבים, מטרתינו לחבר בין יהודי שרוצה להתחיל להניח תפילין ולהיות יותר מחובר לה' יתברך, לבין יהודי שיש לו תפילין לא בשימוש" },
      { property: "og:image", content: "https://accurate-web-cloner.lovable.app/wp/uploads/2024/01/תמונת-עמוד-קשר-של-תפילין-min.webp" },
      { property: "og:image:width", content: "1400" },
      { property: "og:image:height", content: "1400" },
      { property: "og:image:type", content: "image/webp" },
      { property: "og:locale:alternate", content: "en_US" },
      { property: "article:publisher", content: "https://www.facebook.com/keshersheltfilin" },
      { name: "msapplication-TileImage", content: "https://accurate-web-cloner.lovable.app/wp/img/כוכבית-כחולה-16.svg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://accurate-web-cloner.lovable.app/wp/uploads/2024/01/תמונת-עמוד-קשר-של-תפילין-min.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/wp/img/כוכבית-כחולה-16.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;700;800;900&family=Frank+Ruhl+Libre:wght@400;500;700;800;900&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              name: "עמותת אור חדש",
              alternateName: "קשר של תפילין",
              url: "https://accurate-web-cloner.lovable.app/",
              logo: "https://accurate-web-cloner.lovable.app/wp/img/אור-חדש-לוגו-01.svg",
            },
            {
              "@type": "WebSite",
              name: "קשר של תפילין",
              url: "https://accurate-web-cloner.lovable.app/",
              inLanguage: "he",
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});


function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
