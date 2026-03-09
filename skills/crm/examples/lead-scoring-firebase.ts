// @ts-nocheck
// lead-scoring-firebase.ts
// CRM Lead Scoring — Firebase Firestore
// Para B2C / mobile-first / alta concurrencia de escritura

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  increment,
  Timestamp,
  writeBatch,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// --- Scoring Matrix ---
const SCORE_MATRIX: Record<string, number> = {
  // Alta intención
  demo_request: 75,
  pricing_visit: 50,
  whitepaper_download: 25,
  contact_sales: 60,
  // Media intención
  email_open: 10,
  blog_visit: 15,
  webinar_attended: 30,
  // Negativo
  unsubscribe: -20,
  spam_report: -50,
  bad_fit_company: -30,
};

// Stage thresholds
const STAGE_THRESHOLDS = { mql: 50, sal: 100, sql: 150 };

function resolveStage(score: number): string {
  if (score >= STAGE_THRESHOLDS.sql) return "sql";
  if (score >= STAGE_THRESHOLDS.sal) return "sal";
  if (score >= STAGE_THRESHOLDS.mql) return "mql";
  return "prospect";
}

// --- Registrar evento y actualizar score ---
export async function recordLeadEvent(
  db: ReturnType<typeof getFirestore>,
  leadId: string,
  eventType: string,
  meta: Record<string, unknown> = {}
) {
  const delta = SCORE_MATRIX[eventType] ?? 0;

  const batch = writeBatch(db);

  // 1. Registrar evento
  const eventRef = doc(collection(db, "lead_events"));
  batch.set(eventRef, {
    lead_id: leadId,
    event_type: eventType,
    scored_pts: delta,
    meta,
    created_at: serverTimestamp(),
  });

  // 2. Actualizar score en lead (increment atómico de Firestore)
  const leadRef = doc(db, "leads", leadId);
  batch.update(leadRef, {
    score: increment(delta),
    last_activity_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  await batch.commit();

  // 3. Recalcular stage (leer score actual después del write)
  const leadSnap = await getDocs(
    query(collection(db, "leads"), where("__name__", "==", leadId))
  );
  if (!leadSnap.empty) {
    const currentScore = Math.max(0, leadSnap.docs[0].data().score ?? 0);
    await updateDoc(leadRef, { stage: resolveStage(currentScore) });
  }
}

// --- Decay Model (ejecutar con Cloud Scheduler cada 24h) ---
export async function applyScoreDecay(db: ReturnType<typeof getFirestore>) {
  const thirtyDaysAgo = Timestamp.fromDate(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const staleLeads = await getDocs(
    query(
      collection(db, "leads"),
      where("last_activity_at", "<", thirtyDaysAgo),
      where("stage", "not-in", ["customer", "lost"])
    )
  );

  const batch = writeBatch(db);
  staleLeads.forEach((docSnap: any) => {
    const data = docSnap.data();
    const daysSinceActivity =
      (Date.now() - data.last_activity_at.toMillis()) / (1000 * 60 * 60 * 24);
    const decayAmount = Math.floor(daysSinceActivity / 30) * 10;
    const newScore = Math.max(0, (data.score ?? 0) - decayAmount);

    batch.update(docSnap.ref, {
      score: newScore,
      stage: resolveStage(newScore),
      updated_at: serverTimestamp(),
    });
  });

  await batch.commit();
  console.log(`Decay applied to ${staleLeads.size} leads.`);
}
