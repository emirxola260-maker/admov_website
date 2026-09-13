"use client";

import * as React from "react";
import { ArrowDown, ArrowRight, Check, MessageCircle, RotateCcw, Send, Zap } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { productShowcase } from "@/i18n/product-showcase";
import type { Product } from "@/lib/products/types";
import { sanitizeHttpUrl } from "@/lib/security";
import styles from "./products.module.css";

export function ProductMedia({ product, featured = false }: { product: Product; featured?: boolean }) {
  const { lang } = useLanguage();
  const copy = productShowcase[lang];
  const image = sanitizeHttpUrl(product.image_url);
  const video = sanitizeHttpUrl(product.video_url);
  const logo = sanitizeHttpUrl(product.logo_url);
  const [failed, setFailed] = React.useState(false);
  // Uploaded videos take priority over the optional illustrated walkthrough.
  if (featured && product.slug === "i8chat" && !video) return <I8chatWalkthrough />;
  let hostname = product.name;
  try { hostname = new URL(sanitizeHttpUrl(product.url)).hostname.replace(/^www\./, ""); } catch { /* no public URL */ }
  return (
    <figure className={styles.media}>
      <div className={styles.mediaMat}>
        <div className={styles.browserFrame}>
          <div className={styles.browserBar} aria-hidden><span className={styles.windowDots}><i /><i /><i /></span><span dir="ltr">{hostname}</span><span className={styles.browserPlus}>+</span></div>
          {video && !failed ? <video src={video} poster={image || undefined} controls playsInline preload="none" aria-label={`${product.name} — ${copy.video}`} onError={() => setFailed(true)} /> : image && !failed ? <img src={image} alt={`${product.name} — ${copy.screen}`} loading={featured ? "eager" : "lazy"} decoding="async" onError={() => setFailed(true)} /> : <div className={styles.mediaFallback}>{logo ? <img src={logo} alt="" /> : <span className={styles.brandMark} aria-hidden />}<strong dir="auto">{product.name}</strong><span>{failed ? copy.unavailable : copy.noImage}</span></div>}
        </div>
      </div>
      <figcaption><span>{video && !failed ? copy.video : copy.screen}</span><span aria-hidden>↗</span></figcaption>
    </figure>
  );
}

function I8chatWalkthrough() {
  const { lang } = useLanguage();
  const copy = productShowcase[lang];
  const [step, setStep] = React.useState(0);
  return (
    <div className={styles.walkthrough}>
      <div className={styles.walkthroughHeader}><span>{copy.walkthrough}</span><span>{copy.example}</span></div>
      <div className={styles.stage} id="i8chat-walkthrough-stage" role="region" aria-label={`${copy.walkthrough}: ${copy.steps[step]}`}>
        <span className={styles.stageWatermark} aria-hidden>i8</span>
        <div className={styles.scene} key={step}>
          {step === 0 && <>
            <div className={styles.postCard}><div className={styles.sampleHeader}><span className={styles.sampleAvatar}><span className={styles.brandMark} aria-hidden /></span><span>{copy.post}</span><MessageCircle size={17} aria-hidden /></div><p>{copy.postText}</p><span className={styles.postRule} aria-hidden /></div>
            <div className={styles.commentCard}><span className={styles.customerAvatar} aria-hidden>↗</span><div><span>{copy.customer}</span><p>{copy.comment}</p></div><span className={styles.commentHeart} aria-hidden>♡</span></div>
          </>}
          {step === 1 && <div className={styles.automationScene}>
            <div className={styles.triggerCard}><span><MessageCircle size={17} aria-hidden />{copy.trigger}</span><strong>{copy.keyword}</strong></div>
            <span className={styles.flowLine} aria-hidden /><span className={styles.flowIcon}><Zap size={21} aria-hidden /></span><span className={styles.flowLine} aria-hidden />
            <div className={styles.actionCard}><Send size={20} aria-hidden /><div><strong>{copy.action}</strong><span>{copy.rule}</span></div><Check size={17} aria-hidden /></div>
          </div>}
          {step === 2 && <div className={styles.dmCard}>
            <div className={styles.sampleHeader}><span className={styles.sampleAvatar}><Send size={18} aria-hidden /></span><span>{copy.dm}</span><span className={styles.messageDot} aria-hidden /></div>
            <div className={styles.messageBubble}><p>{copy.message}</p><span>{copy.productLink}<ArrowRight size={16} aria-hidden /></span></div>
            <div className={styles.replyBubble}>{copy.comment}<Check size={13} aria-hidden /></div>
          </div>}
        </div>
      </div>
      <div className={styles.walkthroughControls}>
        <div className={styles.steps} role="group" aria-label={copy.walkthrough}>
          {copy.steps.map((label, index) => <button type="button" key={label} aria-pressed={step === index} aria-controls="i8chat-walkthrough-stage" onClick={() => setStep(index)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>)}
        </div>
        <div className={styles.stepDescription}><p aria-live="polite">{copy.captions[step]}</p><button type="button" aria-label={step === 2 ? copy.replay : copy.next} onClick={() => setStep((step + 1) % 3)}>{step === 2 ? <RotateCcw size={18} aria-hidden /> : <ArrowDown size={18} className={styles.nextArrow} aria-hidden />}</button></div>
      </div>
    </div>
  );
}
