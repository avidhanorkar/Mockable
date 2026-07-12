import { useEffect } from 'react'

interface SEOProps {
  title: string
  description?: string
  /** Canonical URL – e.g. "https://mockable.ai/register" */
  canonical?: string
  /** Override OG image (absolute URL) */
  ogImage?: string
}

/**
 * useSEO – lightweight hook that sets <title>, <meta description>,
 * and the canonical <link> for any page component.
 *
 * Usage:
 *   useSEO({ title: 'Login – Mockable', description: 'Sign in to your Mockable account.' })
 */
export function useSEO({ title, description, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    // 1. Page title
    document.title = title

    // Helper: find-or-create a <meta> tag
    function setMeta(selector: string, attr: string, content: string) {
      let el = document.querySelector<HTMLMetaElement>(selector)
      if (!el) {
        el = document.createElement('meta')
        document.head.appendChild(el)
      }
      el.setAttribute(attr, content)
    }

    // Helper: find-or-create a <link> tag
    function setLink(rel: string, href: string) {
      let el = document.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
      if (!el) {
        el = document.createElement('link')
        el.rel = rel
        document.head.appendChild(el)
      }
      el.href = href
    }

    // 2. Meta description
    if (description) {
      setMeta('meta[name="description"]', 'content', description)
      setMeta('meta[property="og:description"]', 'content', description)
      setMeta('meta[name="twitter:description"]', 'content', description)
    }

    // 3. OG / Twitter title
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[name="twitter:title"]', 'content', title)

    // 4. OG URL & canonical
    if (canonical) {
      setMeta('meta[property="og:url"]', 'content', canonical)
      setLink('canonical', canonical)
    }

    // 5. Optional OG image override
    if (ogImage) {
      setMeta('meta[property="og:image"]', 'content', ogImage)
      setMeta('meta[name="twitter:image"]', 'content', ogImage)
    }

    // Restore to default on unmount (back to homepage)
    return () => {
      document.title = 'Mockable – AI Mock Interview Platform | Ace Your Next Interview'
    }
  }, [title, description, canonical, ogImage])
}
