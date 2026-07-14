import { useEffect, useState } from "react"

// Shared by the showcase hub (TemplateLanding) and the per-channel notice
// (ChannelNotice) -- both need the same released-version list, fetched from
// a fixed absolute URL rather than a path relative to wherever this happens
// to be deployed (see src/components/template-landing.tsx for why).
export const VERSIONS_URL =
  "https://arthurblanchon.github.io/grist-widget-sdk/template/versions.json"
export const DEV_URL = "https://arthurblanchon.github.io/grist-widget-sdk/template/dev/"
export const HUB_URL = "https://arthurblanchon.github.io/grist-widget-sdk/template/"

export type ReleasedVersion = {
  version: string
  publishedAt: string
}

export function versionUrl(version: string): string {
  return `https://arthurblanchon.github.io/grist-widget-sdk/template/v${version}/`
}

export function useVersions() {
  const [versions, setVersions] = useState<ReleasedVersion[] | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(VERSIONS_URL, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: ReleasedVersion[]) => {
        if (!cancelled) setVersions(data)
      })
      .catch(() => {
        if (!cancelled) setError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return { versions, error }
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}
