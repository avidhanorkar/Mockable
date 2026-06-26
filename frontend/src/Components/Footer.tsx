const Footer = () => {
  return (
    <footer className="relative border-t border-neutral-900 bg-[#000000] px-6 py-16 text-white sm:px-12 lg:px-24">
      {/* Grid pattern background inside footer */}
      <div className="absolute inset-0 bg-dot-pattern pointer-events-none opacity-40" />

      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <span className="font-mono text-sm font-semibold tracking-tight text-neutral-200">
              mockable<span className="text-white/40">.ai</span>
            </span>
            <p className="mt-4 max-w-sm font-mono text-[11px] leading-relaxed text-neutral-500">
              AI-driven simulation tools built to calibrate interview readiness, analyze delivery signals, and prepare candidates for real hiring expectations.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-wider uppercase text-neutral-400">Navigation</h4>
            <div className="mt-4 flex flex-col gap-2.5 font-mono text-[11px]">
              <a href="/#features" className="text-neutral-500 hover:text-white transition-colors">Capabilities</a>
              <a href="/#how-it-works" className="text-neutral-500 hover:text-white transition-colors">How It Works</a>
              <a href="/#comparison" className="text-neutral-500 hover:text-white transition-colors">Comparison</a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] tracking-wider uppercase text-neutral-400">Legal & Support</h4>
            <div className="mt-4 flex flex-col gap-2.5 font-mono text-[11px]">
              <a href="/#pricing" className="text-neutral-500 hover:text-white transition-colors">Plans</a>
              <a href="/#faq" className="text-neutral-500 hover:text-white transition-colors">FAQ</a>
              <div className="flex items-center gap-1.5 text-neutral-500">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>System status active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-[10px] text-neutral-600">
            © 2026 Mockable Inc. Designed in black & white. All rights reserved.
          </p>
          <div className="flex gap-4 font-mono text-[10px] text-neutral-600">
            <a href="https://github.com" className="hover:text-neutral-400">Source</a>
            <span>•</span>
            <a href="/#privacy" className="hover:text-neutral-400">Privacy Policy</a>
            <span>•</span>
            <a href="/#terms" className="hover:text-neutral-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
