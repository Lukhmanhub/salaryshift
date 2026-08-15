// A minimal, normal-sized support button — intentionally not a pixel
// replica of the official Buy Me a Coffee widget (which renders at 60px
// tall via document.write() and doesn't play well with React hydration,
// see prior implementation). Just the brand color and coffee icon at a
// size consistent with the rest of the app's buttons.
export function BuyMeACoffee() {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <a
        href="https://buymeacoffee.com/lukhman4u"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 items-center gap-2 rounded-full bg-[#FFDD00] px-4 text-sm font-semibold text-[#0C1A32] no-underline shadow-md transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0C1A32]"
      >
        <span aria-hidden>☕</span>
        Buy me a coffee
      </a>
    </div>
  );
}
