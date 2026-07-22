interface DoctrinePoint {
  number: string;
  headline: string;
  description: string;
}

interface VorlyxDoctrineProps {
  doctrine: DoctrinePoint[];
}

/* ─── Module-level constants ────────────────────────────────────────────── */

const NUMBER_STYLE: React.CSSProperties = { fontSize: "35px", lineHeight: "1" };
const NUMBER_WRAPPER_STYLE: React.CSSProperties = { marginTop: "3px" };
const HEADLINE_STYLE: React.CSSProperties = { fontSize: "42px", lineHeight: "1" };
const DESCRIPTION_STYLE: React.CSSProperties = { fontSize: "25px" };

/**
 * Vorlyx Doctrine Section component (Server Component)
 * Displays 5 numbered doctrine points on a black background
 * Black background with white text and thin dividers
 */
export default function VorlyxDoctrine({ doctrine }: VorlyxDoctrineProps) {
  return (
    <section className="w-full bg-black py-12 md:py-16 lg:py-24">
      <div className="w-full max-w-[1920px] mx-auto px-8 md:px-16 lg:px-24">

        {/* 
          MACRO LAYOUT: 
          Changed md:flex-row to xl:flex-row. 
          This ensures all tablets (Mini, Air, Pro) use the stacked (flex-col) layout, 
          while standard laptops/desktops (1280px+) switch to side-by-side. 
        */}
        <div className="flex flex-col xl:flex-row ipadpro:flex-col gap-8 md:gap-12 lg:gap-16 items-start">

          {/* Section Title - Light gray, top-left */}
          <div className="flex-shrink-0">
            <h2 className="font-lato text-3xl md:text-4xl lg:text-5xl font-bold text-[#919191] uppercase text-left">
              VORLYX DOCTRINE
            </h2>
          </div>

          {/* Doctrine Points - Right side */}
          {/* 
            MARGIN FIX: 
            Removed md:ml-32 and lg:ml-48. When stacked on iPads, we want this flush left.
            We only apply the left margin (xl:ml-20) when it goes side-by-side on desktop.
          */}
          <div className="flex-1 space-y-0 xl:ml-20 ipadpro:ml-0">
            {doctrine.map((point, index) => {
              const isFirst = index === 0;
              const isLast = index === doctrine.length - 1;
              const descriptionParts = point.description.split("|");

              return (
                <div key={index}>
                  {/* Doctrine Point */}
                  <div
                    className={
                      isFirst
                        ? "pt-0 pb-8 md:pb-10 lg:pb-12"
                        : "py-8 md:py-10 lg:py-12"
                    }
                    style={{
                      borderBottom: isLast
                        ? "none"
                        : "1px solid rgba(255, 255, 255, 0.5)",
                    }}
                  >
                    {/* 
                      INNER LAYOUT: 
                      Also shifted to xl:flex-row to ensure the "01" stays on top of the text 
                      on all iPads, matching the iPad Mini/Air screenshot.
                    */}
                    <div className="flex flex-col xl:flex-row ipadpro:flex-col gap-4 md:gap-6 lg:gap-9">
                      {/* Number */}
                      <div className="flex-shrink-0" style={NUMBER_WRAPPER_STYLE}>
                        <span
                          className="font-lato font-normal text-[#919191]"
                          style={NUMBER_STYLE}
                        >
                          {point.number}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3
                          className="font-lato font-normal text-[#D9D9D9] mb-2 md:mb-3 [text-wrap:pretty]"
                          style={HEADLINE_STYLE}
                        >
                          {point.headline}
                        </h3>
                        <p
                          className="font-lato font-normal text-[#919191] leading-relaxed [text-wrap:pretty]"
                          style={DESCRIPTION_STYLE}
                        >
                          {descriptionParts.map((part, partIndex) => (
                            <span key={partIndex}>
                              {partIndex > 0 && <br />}
                              {part}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}