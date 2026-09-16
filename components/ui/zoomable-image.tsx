'use client'

import { useState, useEffect, useId, useRef, type MouseEvent } from 'react'
import Image from 'next/image'
import { X, ZoomIn } from 'lucide-react'

interface ZoomableImageProps {
  src: string
  alt: string
  width: number
  height: number
  caption?: string
}

export function ZoomableImage({
  src,
  alt,
  width,
  height,
  caption,
}: ZoomableImageProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLAnchorElement>(null)
  const previousOverflow = useRef<string | null>(null)
  const id = useId()
  const imageCaption = caption ?? alt

  useEffect(
    () => () => {
      if (previousOverflow.current !== null) {
        document.body.style.overflow = previousOverflow.current
      }
    },
    [],
  )

  const openImage = (event: MouseEvent<HTMLAnchorElement>) => {
    // Keep the original image link available without JS and for new-tab clicks.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      !dialogRef.current?.showModal
    )
      return
    event.preventDefault()
    previousOverflow.current = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setIsZoomed(true)
    dialogRef.current.showModal()
  }

  const onClose = () => {
    setIsZoomed(false)
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current
      previousOverflow.current = null
    }
    triggerRef.current?.focus({ preventScroll: true })
  }

  return (
    <>
      <figure className="blog-figure not-prose my-8">
        <a
          ref={triggerRef}
          href={src}
          onClick={openImage}
          aria-haspopup="dialog"
          aria-controls={id}
          aria-label={alt ? `Enlarge image: ${alt}` : 'Enlarge image'}
          className="group relative block cursor-zoom-in overflow-hidden rounded-lg border border-white/10 bg-white/[0.02] no-underline transition-colors hover:border-white/25"
        >
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="(min-width: 768px) 704px, (min-width: 640px) calc(100vw - 4rem), calc(100vw - 3rem)"
            loading="lazy"
            decoding="async"
            className="m-0 h-auto w-full object-contain"
          />
          <span
            aria-hidden="true"
            className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-black/80 px-2.5 py-1.5 font-sans text-xs text-zinc-100 backdrop-blur-sm"
          >
            <ZoomIn className="size-3.5" /> Zoom
          </span>
        </a>
        {imageCaption && (
          <figcaption className="mt-3 text-center text-xs leading-6 text-zinc-400">
            {imageCaption}
          </figcaption>
        )}
      </figure>

      <dialog
        ref={dialogRef}
        id={id}
        aria-label={alt || 'Enlarged image'}
        aria-describedby={imageCaption ? `${id}-caption` : undefined}
        onClose={onClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close()
        }}
        className="not-prose m-auto max-h-[calc(100dvh-2rem)] max-w-[calc(100vw-2rem)] overflow-auto rounded-lg border border-white/10 bg-zinc-950 p-0 text-zinc-100 shadow-2xl backdrop:bg-black/90 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-3 pt-16 sm:p-5 sm:pt-16">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="absolute top-2 right-2 flex size-11 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-white/5 hover:text-zinc-100"
            aria-label="Close image"
          >
            <X aria-hidden="true" className="size-5" />
          </button>

          {isZoomed && (
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              unoptimized
              className="mx-auto h-auto max-h-[72dvh] w-auto max-w-full rounded object-contain"
            />
          )}

          {imageCaption && (
            <p
              id={`${id}-caption`}
              className="mx-auto mt-4 max-w-prose text-center text-xs leading-6 text-zinc-400"
            >
              {imageCaption}
            </p>
          )}
        </div>
      </dialog>
    </>
  )
}
