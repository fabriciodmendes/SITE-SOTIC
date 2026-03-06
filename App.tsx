import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { 
  Menu, X, ArrowRight, Mouse, RadioTower, ShieldCheck, Zap, 
  CloudCog, Network, CheckCircle2, Star, MessageCircle, Phone, 
  MapPin, Clock, Mail, Instagram, Linkedin, Facebook, TrendingUp, ChevronDown 
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ChatWidget from './components/ChatWidget';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const scrollRevealRefs = useRef<(HTMLElement | null)[]>([]);

  useLayoutEffect(() => {
    // Hero Animation
    const ctx = gsap.context(() => {
      gsap.to(".hero-anim", {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.2
      });

      gsap.to("#hero-bg-img", {
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: true
        },
        y: 200,
        scale: 1.1,
        ease: "none"
      });

      // Scroll Reveals
      scrollRevealRefs.current.forEach((el) => {
        if (el) {
          gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      });
      
      // Batch animation for bento cards
      ScrollTrigger.batch(".bento-card", {
        onEnter: batch => gsap.fromTo(batch, 
            { opacity: 0, y: 30, scale: 0.95 }, 
            { opacity: 1, y: 0, scale: 1, stagger: 0.15, duration: 0.8, ease: "back.out(1.7)" }
        ),
        start: "top 85%"
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !scrollRevealRefs.current.includes(el)) {
      scrollRevealRefs.current.push(el);
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    const element = document.querySelector(targetId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
  
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="antialiased selection:bg-brand-blue selection:text-white bg-dark-900 text-[#e5e5e5] font-sans overflow-x-hidden">
      {/* Noise Texture */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999] opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'1\'/%3E%3C/svg%3E')]"></div>

      {/* Header */}
      <header className={`fixed w-full top-0 z-40 transition-all duration-300 border-b border-white/5 bg-dark-900/70 backdrop-blur-xl py-4`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="#" className="font-display font-bold text-2xl tracking-tighter text-white z-50">
            SOTIC<span className="text-brand-blue">.</span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#solucoes" onClick={(e) => handleScroll(e, '#solucoes')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">Soluções</a>
            <a href="#sobre" onClick={(e) => handleScroll(e, '#sobre')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">Sobre Nós</a>
            <a href="#depoimentos" onClick={(e) => handleScroll(e, '#depoimentos')} className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">Clientes</a>
          </nav>

          <a href="#contato" onClick={(e) => handleScroll(e, '#contato')} className="hidden md:inline-flex group items-center justify-center px-6 py-2 text-sm font-medium text-white transition-all duration-200 bg-white/10 border border-white/10 rounded-full hover:bg-brand-blue hover:border-brand-blue hover:shadow-lg focus:outline-none cursor-pointer">
            Fale Conosco
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </a>

          <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 bg-dark-900/95 backdrop-blur-xl z-50 transform transition-transform duration-300 flex flex-col items-center justify-center gap-8 ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <button className="absolute top-6 right-6 text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          <a href="#solucoes" onClick={(e) => handleScroll(e, '#solucoes')} className="text-2xl font-display font-medium text-white cursor-pointer">Soluções</a>
          <a href="#sobre" onClick={(e) => handleScroll(e, '#sobre')} className="text-2xl font-display font-medium text-white cursor-pointer">Sobre Nós</a>
          <a href="#depoimentos" onClick={(e) => handleScroll(e, '#depoimentos')} className="text-2xl font-display font-medium text-white cursor-pointer">Clientes</a>
          <a href="#contato" onClick={(e) => handleScroll(e, '#contato')} className="text-2xl font-display font-medium text-brand-cyan cursor-pointer">Contato</a>
        </div>
      </header>

      <div ref={heroRef}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32">
          <div className="absolute inset-0 z-0">
            <img 
              id="hero-bg-img"
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
              alt="Background" 
              className="w-full h-full object-cover opacity-60 scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-900 via-dark-900/80 to-dark-900"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-dark-900/50"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-brand-blue/30 text-brand-cyan text-xs font-semibold tracking-wide uppercase mb-8 hero-anim translate-y-10 opacity-0">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
              SOTIC: A tecnologia que conecta, a energia que move e a gestão que resolve.
            </div>

            <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight mb-6 hero-anim translate-y-10 opacity-0 text-white">
              Tecnologia que Conecta.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">Gestão que Resolve.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 hero-anim translate-y-10 opacity-0 font-light leading-relaxed">
              Unificamos Telecom, TI e Eficiência Energética em um ecossistema único. A SOTIC simplifica a complexidade para você focar no crescimento.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-anim translate-y-10 opacity-0">
              <a href="#contato" onClick={(e) => handleScroll(e, '#contato')} className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_-5px_rgba(0,102,255,0.5)] hover:shadow-[0_0_30px_-5px_rgba(0,102,255,0.7)] hover:-translate-y-1 cursor-pointer text-center block sm:inline-block">
                Otimize sua Operação
              </a>
              <a href="#solucoes" onClick={(e) => handleScroll(e, '#solucoes')} className="w-full sm:w-auto px-8 py-4 glass text-white rounded-full font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 group cursor-pointer">
                Nossas Soluções
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce opacity-50">
            <Mouse className="w-6 h-6 text-white" />
          </div>
        </section>

        {/* Partners Strip */}
        <div className="border-y border-white/5 bg-dark-800/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <p className="text-center text-sm text-gray-500 mb-6 font-medium tracking-widest uppercase">Tecnologias que impulsionam nossos projetos</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <span className="text-xl font-bold font-display text-white">CISCO</span>
                <span className="text-xl font-bold font-display text-white">MICROSOFT</span>
                <span className="text-xl font-bold font-display text-white">INTELBRAS</span>
                <span className="text-xl font-bold font-display text-white">FURUKAWA</span>
                <span className="text-xl font-bold font-display text-white">UBIQUITI</span>
            </div>
          </div>
        </div>

        {/* Solutions Grid */}
        <section id="solucoes" className="py-24 md:py-32 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 md:mb-24">
              <h2 ref={addToRefs} className="font-display font-bold text-4xl md:text-5xl mb-4">Soluções <span className="text-gradient-brand">360º</span></h2>
              <p ref={addToRefs} className="text-gray-400 text-lg max-w-xl">Centralizamos sua infraestrutura tecnológica e energética. Um único parceiro, zero dores de cabeça.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-6 h-auto md:h-[900px]">
              
              {/* Telecom */}
              <div className="bento-card col-span-1 md:col-span-2 md:row-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent z-10"></div>
                {/* Updated to use Google Drive thumbnail endpoint which is often more reliable for embeds than the view endpoint */}
                <img 
                  src="https://drive.google.com/thumbnail?id=17yTWj7XkAv34KOnSu52QJHiOn3AXxlXu&sz=w1000" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" 
                  alt="Telecom" 
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-20 h-full flex flex-col justify-end">
                  <div className="w-12 h-12 bg-brand-blue/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-4 border border-brand-blue/30 text-brand-blue">
                    <RadioTower className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Telecomunicações Avançadas</h3>
                  <p className="text-gray-300 text-sm md:text-base">Consultoria e implementação em telefonia móvel e fixa. Redução de custos e alta disponibilidade.</p>
                </div>
              </div>

              {/* IT MSP */}
              <div className="bento-card col-span-1 md:col-span-1 md:row-span-3 glass p-8 rounded-3xl relative overflow-hidden group border-t-4 border-t-brand-cyan">
                <div className="absolute inset-0 bg-gradient-to-b from-dark-900/80 via-dark-900/40 to-dark-900/90 z-10"></div>
                <img 
                  src="https://drive.google.com/thumbnail?id=14ITGcVwRR8rq-w_JmxJWBwaI4z5yaV51&sz=w1000" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" 
                  alt="IT Management" 
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-20 h-full flex flex-col">
                  <div className="w-12 h-12 bg-brand-cyan/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6 border border-brand-cyan/30 text-brand-cyan">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Gestão de TI (MSP)</h3>
                  <p className="text-gray-400 mb-6 text-sm">Suporte proativo e monitoramento 24/7. Deixamos sua TI invisível.</p>
                  <ul className="space-y-3 mt-auto">
                    <li className="flex items-center text-gray-300 text-sm gap-2"><CheckCircle2 className="w-4 h-4 text-brand-cyan" /> Prevenção de Falhas</li>
                    <li className="flex items-center text-gray-300 text-sm gap-2"><CheckCircle2 className="w-4 h-4 text-brand-cyan" /> Segurança de Dados</li>
                    <li className="flex items-center text-gray-300 text-sm gap-2"><CheckCircle2 className="w-4 h-4 text-brand-cyan" /> Suporte Remoto Ágil</li>
                  </ul>
                </div>
              </div>

              {/* Energy */}
              <div className="bento-card col-span-1 md:col-span-1 md:row-span-2 glass p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/20 to-transparent z-10"></div>
                <img 
                  src="https://drive.google.com/thumbnail?id=1KnfhTJLnak7vk2wAtomX8WCR_6j5-hZX&sz=w1000" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" 
                  alt="Energy Efficiency" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/20 blur-[60px] rounded-full z-10"></div>
                <div className="relative z-20 h-full flex flex-col justify-between">
                  <div className="w-12 h-12 bg-brand-orange/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-brand-orange/30 text-brand-orange">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Eficiência Energética</h3>
                    <p className="text-gray-300 text-sm">Assessoria para Mercado Livre de Energia. Sustentabilidade e economia real.</p>
                  </div>
                </div>
              </div>

              {/* Cloud */}
              <div className="bento-card col-span-1 md:col-span-2 md:row-span-1 glass p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900/80 via-dark-900/40 to-transparent z-10"></div>
                <img 
                  src="https://drive.google.com/thumbnail?id=1dStzZYPgCRoellr7ITAxGYYusQvw-Kq5&sz=w1000" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" 
                  alt="Cloud Communication" 
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-20 flex items-center gap-6 h-full">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10">
                    <CloudCog className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">Comunicação em Nuvem</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">Não deixe seu cliente esperando. Integramos seu PABX, WhatsApp, suas redes sociais através de IA para garantir que nenhum cliente fique sem resposta, a qualquer momento.</p>
                  </div>
                </div>
              </div>

              {/* Infra */}
              <div className="bento-card col-span-1 md:col-span-1 md:row-span-1 glass p-8 rounded-3xl relative overflow-hidden flex flex-col justify-center group">
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/40 z-10"></div>
                <img 
                  src="https://drive.google.com/thumbnail?id=1POYsC0yZeZy7nnnoseFZaazm0ysoMUc_&sz=w1000" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" 
                  alt="Infraestrutura" 
                  referrerPolicy="no-referrer"
                />
                <div className="relative z-20">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center text-white border border-white/10">
                        <Network className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Infraestrutura</h3>
                  </div>
                  <p className="text-gray-300 text-xs">Cabeamento estruturado e Wi-Fi de alta performance.</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="sobre" className="py-24 bg-dark-800 relative overflow-hidden">
          <div className="absolute left-0 bottom-0 w-1/3 h-full bg-brand-blue/5 blur-[100px]"></div>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
            <div ref={addToRefs}>
              <span className="text-brand-cyan text-sm font-bold tracking-widest uppercase mb-2 block">Por que a SOTIC?</span>
              <h2 className="font-display font-bold text-4xl md:text-5xl mb-6 leading-tight">
                Eliminamos a <br/>
                <span className="text-gray-500 line-through decoration-brand-orange decoration-4">complexidade</span> <br/>
                de múltiplos fornecedores.
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Em um mundo onde a TI depende da energia e a comunicação depende da rede, tratar esses pilares separadamente é ineficiente.
                <br/><br/>
                A <strong>SOTIC</strong> atua como sua parceira estratégica única. Não entregamos apenas serviços; entregamos inteligência operacional.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="border-l-2 border-brand-blue pl-4">
                  <h4 className="text-white font-bold text-2xl mb-1">10+</h4>
                  <p className="text-gray-500 text-sm">Anos de Experiência</p>
                </div>
                <div className="border-l-2 border-brand-orange pl-4">
                  <h4 className="text-white font-bold text-2xl mb-1">4.1k+</h4>
                  <p className="text-gray-500 text-sm">Avaliações Positivas</p>
                </div>
              </div>
            </div>

            <div className="relative" ref={addToRefs}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl">
                <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" alt="Equipe" className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-6 left-6 right-6 bg-dark-900/90 backdrop-blur-xl p-6 rounded-xl border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Redução de Custos</p>
                      <p className="text-gray-400 text-xs">Média de 25% em telecom e energia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="depoimentos" className="py-24 relative">
          <div className="max-w-7xl mx-auto px-6">
            <h2 ref={addToRefs} className="font-display font-bold text-3xl text-center mb-16 text-white">A escolha de quem busca excelência</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "Carlos Mendes", role: "Diretor Industrial", text: "A migração para o Mercado Livre de Energia com a Sotic foi transparente e a economia superou as expectativas.", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100&h=100" },
                { name: "Fernanda Souza", role: "Gerente Adm", text: "Unificar Telecom e TI simplificou nossa gestão. A equipe da Sotic é extremamente técnica e ágil.", img: "https://images.unsplash.com/photo-1573496359-70142d76c220?auto=format&fit=crop&q=80&w=100&h=100" },
                { name: "Ricardo Alves", role: "CTO, TechStart", text: "O projeto de Wi-Fi e cabeamento que fizeram na nossa nova sede ficou perfeito. Zero instabilidade.", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100&h=100" },
              ].map((item, i) => (
                <div key={i} ref={addToRefs} className="glass p-8 rounded-2xl hover:bg-white/5 transition-colors">
                  <div className="flex text-brand-orange mb-4">
                    {[...Array(5)].map((_, k) => <Star key={k} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-gray-300 mb-6 italic">"{item.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{item.name}</p>
                      <p className="text-gray-500 text-xs">{item.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contato" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-brand-blue/10"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/90 to-transparent"></div>
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            <h2 className="font-display font-bold text-5xl md:text-6xl text-white mb-6 tracking-tight">Pronto para elevar sua infraestrutura?</h2>
            <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto">Converse com nossos consultores e descubra como integrar tecnologia e energia pode transformar seu negócio.</p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-wrap">
              <a href="https://api.whatsapp.com/send?phone=5548999311189" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-[#25D366]/30 flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6" />
                Chamar no WhatsApp
              </a>
              
              <a href="mailto:fabricio@sotic.com.br" className="w-full sm:w-auto px-8 py-4 bg-brand-blue hover:bg-blue-600 text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-[0_0_30px_rgba(0,102,255,0.6)] flex items-center justify-center gap-3">
                <Mail className="w-6 h-6" />
                Enviar E-mail
              </a>

              <a href="tel:5548999311189" className="w-full sm:w-auto px-8 py-4 glass hover:bg-white/10 text-white rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3">
                <Phone className="w-6 h-6" />
                (48) 99931-1189
              </a>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-10">
              <div className="flex flex-col gap-4">
                <div>
                  <h5 className="text-white font-bold mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-blue" /> Endereço</h5>
                  <p className="text-gray-400 text-sm">R. Homero de Miranda Gomes, 1547<br/>Loja A - Jardim Janaina<br/>Biguaçu - SC, 88162-210</p>
                </div>
                <div className="w-full h-40 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                    <iframe 
                        title="Google Maps Location"
                        width="100%" 
                        height="100%" 
                        style={{border:0}}
                        loading="lazy"
                        src="https://maps.google.com/maps?q=R.+Homero+de+Miranda+Gomes,+1547+-+Jardim+Janaina,+Bigua%C3%A7u+-+SC&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        className="filter grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
                    ></iframe>
                </div>
              </div>
              <div>
                <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Clock className="w-4 h-4 text-brand-blue" /> Horário</h5>
                <p className="text-gray-400 text-sm">Segunda a Sexta<br/>08:00 - 18:00</p>
              </div>
              <div>
                <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Mail className="w-4 h-4 text-brand-blue" /> Contato</h5>
                <p className="text-gray-400 text-sm">fabricio@sotic.com.br<br/>(48) 3995-0175<br/>(48) 99931-1189</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-white/5 py-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-gray-500 text-sm">
              &copy; 2026 SOTIC Sistemas e Telecomunicações.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
        </footer>
      </div>

      {/* Floating Chatbot */}
      <ChatWidget />
    </div>
  );
}

export default App;