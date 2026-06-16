import SectionHeading from './SectionHeading';

export default function SafeMobility() {
  return (
    <section className="bg-white py-16">
      <div className="container-x">
        <SectionHeading>Dare the Impossible with Safe Mobility</SectionHeading>

        <div className="relative mt-8 aspect-video w-full overflow-hidden bg-nissan-dark">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-60"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=1280&q=70')",
            }}
          />
          <div className="absolute inset-0 grid place-items-center">
            <button
              aria-label="Play video"
              className="grid h-20 w-20 place-items-center rounded-full border-2 border-white/80 text-2xl text-white transition hover:scale-105 hover:bg-white/10"
            >
              ▶
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
