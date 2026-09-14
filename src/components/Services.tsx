"use client";

import { Fragment, useState } from "react";
import { ArrowUpRight, Plus, Minus } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { useAdminContent, getAdminServices } from "@/admin/useAdminContent";
import { AdmovMark } from "./ui/Logo";
import { serviceExplorerCopy } from "@/i18n/service-explorer";
import styles from "./services.module.css";

export function Services() {
  const { t, lang } = useLanguage();
  const { content: adminContent } = useAdminContent();
  const services = getAdminServices(adminContent, lang, t.services) as typeof t.services;
  const copy = serviceExplorerCopy[lang];
  const [selected, setSelected] = useState(0);

  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}><AdmovMark />{services.label}</p>
            <h2 id="services-title">{copy.heading}</h2>
          </div>
          <p className={styles.intro}>{copy.intro}</p>
        </header>
        <div className={styles.explorer}>
          {services.items.map((service, index) => (
            <Fragment key={index}>
              <h3 className={styles.row} style={{ gridRow: index + 1 }}>
                <button id={`service-choice-${index}`} type="button" aria-expanded={selected === index}
                  aria-controls={`service-detail-${index}`} onClick={() => setSelected(index)}>
                  <span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <span>{service.title}</span>
                  {selected === index ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                </button>
              </h3>
              <div id={`service-detail-${index}`} role="region" aria-labelledby={`service-choice-${index}`}
                className={styles.panel} hidden={selected !== index}>
                {selected === index && <>
                  <div className={styles.visual}>
                    {index === 0 ? (
                      <video className={styles.media} src="/hero-video-1280.mp4" poster="/hero-poster.jpg" controls playsInline preload="none" aria-label={copy.reel} />
                    ) : index === 1 ? (
                      <img className={styles.media} src="/work-belind.webp" alt={copy.photoAlt} width="1200" height="896" loading="lazy" />
                    ) : (
                      <div className={styles.workflow}>
                        <AdmovMark outline className={styles.watermark} />
                        <p className={styles.workflowLabel}>{copy.workflow}</p>
                        <ol>
                          {(copy.flows[index - 2] ?? []).map((step, stepIndex) => (
                            <li key={step}><span>{String(stepIndex + 1).padStart(2, "0")}</span><p>{step}</p></li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                  <div className={styles.caption}>
                    <span>{index === 0 ? copy.reel : index === 1 ? "Belind Perfumes" : copy.workflow}</span>
                    <span aria-hidden="true">ADMOV / {String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <div className={styles.details}>
                    <p>{service.desc}</p>
                    <a href="#contact">{copy.cta}<ArrowUpRight size={18} aria-hidden="true" /></a>
                  </div>
                </>}
              </div>
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
