import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/AeAqaKLmGsS-FPBN/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-16">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,128,0,0.25)]">
          AHC Front Desk Assistant
        </h1>
        <p className="mt-4 text-lg md:text-xl text-orange-200/90">
          Friendly AI receptionist that books demos, answers FAQs, routes support, and qualifies leads for your SaaS.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <a href="#book" className="px-5 py-2.5 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition">Book a Demo</a>
          <a href="#faq" className="px-5 py-2.5 rounded-md bg-white/10 text-white hover:bg-white/20 transition border border-white/20">See FAQs</a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
    </section>
  )
}
