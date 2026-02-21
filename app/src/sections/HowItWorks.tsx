import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Settings, Link2, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    id: 1,
    title: 'Set It',
    description: 'Set up your series: horror stories, product promotions, Reddit stories — anything you can imagine. Customize your series in just a few clicks.',
    icon: Settings,
    color: '#c0f748',
  },
  {
    id: 2,
    title: 'Forget It',
    description: 'Link your social media account and let our AI handle the rest. From writing to editing to posting, Faceless.video will run your account for you.',
    icon: Link2,
    color: '#60a5fa',
  },
  {
    id: 3,
    title: 'Watch It Grow',
    description: 'Sit back and enjoy as your views and followers soar. Check out the results above to see the kind of success you can achieve.',
    icon: TrendingUp,
    color: '#f472b6',
  },
];

const HowItWorks = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stepElements = stepsRef.current?.querySelectorAll('.step-card');
      
      if (stepElements) {
        stepElements.forEach((step, index) => {
          gsap.fromTo(
            step,
            { opacity: 0, x: index % 2 === 0 ? -50 : 50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.8,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: step,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-24 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#c0f748]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Run Your Channels on{' '}
            <span className="text-[#c0f748]">Autopilot</span> with AI
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Your own personal content creation team—creating, posting, and growing your channels effortlessly 24/7.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={stepsRef} className="space-y-16 md:space-y-24">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isEven = index % 2 === 0;

            return (
              <div
                key={step.id}
                className={`step-card flex flex-col ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                } items-center gap-8 md:gap-16`}
              >
                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <div
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                    style={{ backgroundColor: `${step.color}20` }}
                  >
                    <Icon size={32} style={{ color: step.color }} />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">
                    <span style={{ color: step.color }}>{step.title}</span>
                  </h3>
                  <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                    {step.description}
                  </p>
                </div>

                {/* Visual */}
                <div className="flex-1 relative">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-[#181818] to-[#0d0d0d] border border-white/5 p-8"
                  >
                    {/* Mock UI */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full max-w-sm">
                        {/* Step-specific mock content */}
                        {step.id === 1 && (
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-[#c0f748]/20 flex items-center justify-center">
                                <Settings size={20} className="text-[#c0f748]" />
                              </div>
                              <div className="flex-1">
                                <div className="h-3 bg-white/10 rounded w-3/4" />
                                <div className="h-2 bg-white/5 rounded w-1/2 mt-2" />
                              </div>
                            </div>
                            <div className="space-y-2">
                              {['Horror Stories', 'Product Reviews', 'Reddit Tales'].map((item) => (
                                <div
                                  key={item}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                                >
                                  <div className="w-2 h-2 rounded-full bg-[#c0f748]" />
                                  <span className="text-sm text-gray-300">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {step.id === 2 && (
                          <div className="space-y-4">
                            <div className="flex justify-center gap-4">
                              {['TikTok', 'YouTube', 'Instagram'].map((platform) => (
                                <div
                                  key={platform}
                                  className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center"
                                >
                                  <span className="text-xs font-bold">{platform[0]}</span>
                                </div>
                              ))}
                            </div>
                            <div className="text-center">
                              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 text-blue-400 text-sm">
                                <Link2 size={14} />
                                Connected
                              </div>
                            </div>
                          </div>
                        )}
                        {step.id === 3 && (
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <TrendingUp size={48} className="text-[#f472b6]" />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                              {[
                                { label: 'Views', value: '1M+' },
                                { label: 'Likes', value: '50K' },
                                { label: 'Followers', value: '10K' },
                              ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                  <div className="text-2xl font-bold text-[#f472b6]">{stat.value}</div>
                                  <div className="text-xs text-gray-500">{stat.label}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${step.color}40, transparent 70%)`,
                      }}
                    />
                  </motion.div>

                  {/* Decorative Arrow */}
                  {index < steps.length - 1 && (
                    <div
                      className={`hidden md:block absolute ${
                        isEven ? '-right-8' : '-left-8'
                      } top-1/2 -translate-y-1/2`}
                    >
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 40 40"
                        fill="none"
                        className={`${isEven ? '' : 'rotate-180'}`}
                      >
                        <path
                          d="M10 20H30M30 20L22 12M30 20L22 28"
                          stroke="#c0f748"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-pulse"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
