"use client";

import Link from "next/link";
import { useState } from "react";

type ArticleShareButtonsProps = {
  storyUrl: string;
  storyTitle: string;
};

export default function ArticleShareButtons({
  storyUrl,
  storyTitle,
}: ArticleShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `${storyTitle} — Nile Metrica`;
  const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

  const xShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(storyUrl)}`;

  const facebookShareUrl = appId
    ? `https://www.facebook.com/dialog/feed?app_id=${encodeURIComponent(
        appId
      )}&link=${encodeURIComponent(storyUrl)}&redirect_uri=${encodeURIComponent(
        storyUrl
      )}`
    : `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        storyUrl
      )}`;

  const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    storyUrl
  )}`;

  const mailShareUrl = `mailto:?subject=${encodeURIComponent(
    storyTitle
  )}&body=${encodeURIComponent(`${shareText}\n\n${storyUrl}`)}`;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(storyUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const buttonClass =
    "inline-flex items-center border border-[#d8d8d8] px-4 py-2 text-sm font-medium text-[#1f1f1f] transition hover:bg-[#f7f7f7]";

  return (
    <div className="mt-14 border-t border-[#e5e5e5] pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f5a5a]">
        Share this article
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={xShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          Share on X
        </Link>

        <Link
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          Share on Facebook
        </Link>

        <Link
          href={linkedinShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          Share on LinkedIn
        </Link>

        <Link href={mailShareUrl} className={buttonClass}>
          Share by Email
        </Link>

        <button type="button" onClick={handleCopyLink} className={buttonClass}>
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}