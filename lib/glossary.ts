export type GlossaryTerm = {
  slug: string;
  term: string;
  definition: string[];
  relatedHref?: string;
  relatedLabel?: string;
};

export const GLOSSARY: GlossaryTerm[] = [
  {
    slug: "ahi-apnea-hypopnea-index",
    term: "AHI (Apnea-Hypopnea Index)",
    definition: [
      "The average number of breathing interruptions per hour of sleep, combining full pauses (apneas) and partial airflow reductions (hypopneas) that also drop blood oxygen or trigger a brief arousal.",
      "Severity bands: mild is 5–15 events/hour, moderate is 15–30, severe is above 30. It's the primary number reported on a sleep study and the basis for a CPAP or BiPAP prescription.",
    ],
    relatedHref: "/sleep/cpap",
    relatedLabel: "CPAP Machines",
  },
  {
    slug: "pulse-dose",
    term: "Pulse Dose",
    definition: [
      "An oxygen delivery method that senses the start of an inhalation and delivers a short burst of oxygen timed to it, rather than a constant stream — this conserves oxygen and is what makes small portable concentrators possible.",
      "Pulse-dose settings (1, 2, 3...) don't map directly to continuous-flow LPM numbers; equivalence is confirmed clinically with an oximetry check, not assumed from the setting number alone.",
    ],
    relatedHref: "/oxygen/portable",
    relatedLabel: "Portable Oxygen Concentrators",
  },
  {
    slug: "continuous-flow",
    term: "Continuous Flow",
    definition: [
      "An oxygen delivery method that provides a steady, uninterrupted stream regardless of breathing pattern — necessary for patients who breathe too shallowly or irregularly to reliably trigger a pulse-dose sensor.",
      "Continuous-flow rate is measured in LPM (liters per minute) and is the standard delivery method for most stationary home concentrators.",
    ],
    relatedHref: "/oxygen/stationary",
    relatedLabel: "Stationary Oxygen Concentrators",
  },
  {
    slug: "lpm-liters-per-minute",
    term: "LPM (Liters Per Minute)",
    definition: [
      "The unit used to measure continuous-flow oxygen output — how many liters of concentrated oxygen a device delivers per minute. A prescription might specify, for example, 2 LPM at rest and higher during exertion.",
      "Most stationary concentrators in our catalog range from 0.5–10 LPM continuous flow depending on the model.",
    ],
  },
  {
    slug: "cmh2o",
    term: "cmH₂O (Centimeters of Water Pressure)",
    definition: [
      "The pressure unit used for CPAP and BiPAP prescriptions — the amount of air pressure, measured in centimeters of water displacement, delivered to keep the airway open.",
      "Typical CPAP prescriptions range from 4–20 cmH₂O. BiPAP prescriptions specify two separate numbers: IPAP (inhale pressure) and EPAP (exhale pressure), since bi-level devices deliver different pressure for each phase of breathing.",
    ],
    relatedHref: "/sleep/bipap-apap",
    relatedLabel: "BiPAP & VPAP Machines",
  },
  {
    slug: "fev1",
    term: "FEV1 (Forced Expiratory Volume in 1 Second)",
    definition: [
      "The volume of air a person can forcefully exhale in one second, measured by spirometry and compared to a predicted normal for their age, height, and sex — the primary number used to grade COPD severity.",
    ],
  },
  {
    slug: "gold-stage-copd",
    term: "GOLD Stage (COPD Staging)",
    definition: [
      "A four-grade COPD severity classification from the Global Initiative for Chronic Obstructive Lung Disease, based primarily on FEV1: Grade 1 (mild, ≥80% predicted), Grade 2 (moderate, 50–79%), Grade 3 (severe, 30–49%), Grade 4 (very severe, <30%).",
      "GOLD grade alone doesn't dictate treatment — it's combined with symptom scores and exacerbation history to guide a management plan.",
    ],
  },
  {
    slug: "spo2-oxygen-saturation",
    term: "SpO2 (Blood Oxygen Saturation)",
    definition: [
      "An estimate of the percentage of hemoglobin in the blood carrying oxygen, measured non-invasively with a pulse oximeter. Healthy adults typically read 95–100% at sea level.",
      "A trend against your own baseline is more informative than a single reading — chronic lung disease can shift a person's normal baseline lower without indicating an acute problem.",
    ],
    relatedHref: "/respiratory-accessories",
    relatedLabel: "Pulse Oximeters & Respiratory Accessories",
  },
  {
    slug: "faa-approved-oxygen",
    term: "FAA-Approved (Portable Oxygen)",
    definition: [
      "Documentation from a device manufacturer confirming a specific portable oxygen concentrator model meets DO-160 environmental and safety testing, which airlines accept as clearance for in-flight use.",
      "Every portable oxygen concentrator we carry ships with this documentation included — see our Journal article on what the label actually certifies for the specifics airlines check at the gate.",
    ],
    relatedHref: "/journal/faa-approved-oxygen-what-it-actually-means",
    relatedLabel: "FAA-Approved Oxygen: What It Actually Means",
  },
  {
    slug: "do-160",
    term: "DO-160",
    definition: [
      "RTCA/DO-160 is the environmental qualification standard used to test aviation electronics for electromagnetic interference, altitude performance, and battery safety under cabin-pressure conditions — the specific standard behind \"FAA-approved\" portable oxygen claims.",
    ],
  },
  {
    slug: "cpap-continuous-positive-airway-pressure",
    term: "CPAP (Continuous Positive Airway Pressure)",
    definition: [
      "A device that delivers a constant, single pressure setting through a mask to keep the airway open during sleep — the standard first-line treatment for obstructive sleep apnea.",
      "\"Auto\" or \"APAP\" variants adjust pressure within a prescribed range in real time rather than holding one fixed setting all night.",
    ],
    relatedHref: "/sleep/cpap",
    relatedLabel: "CPAP Machines",
  },
  {
    slug: "bipap-vpap-bilevel",
    term: "BiPAP / VPAP (Bilevel Positive Airway Pressure)",
    definition: [
      "A device that delivers two separate pressures — a higher one for inhaling (IPAP), a lower one for exhaling (EPAP) — rather than one fixed pressure. Prescribed when standard CPAP isn't sufficient or comfortable, or for central and complex sleep apnea.",
      "\"VPAP\" is ResMed's brand name for the same bilevel category; the underlying mechanism is the same across manufacturers.",
    ],
    relatedHref: "/sleep/bipap-apap",
    relatedLabel: "BiPAP & VPAP Machines",
  },
  {
    slug: "auto-titrating-cpap-apap",
    term: "Auto-Titrating CPAP (APAP)",
    definition: [
      "A CPAP device that continuously measures airflow resistance and adjusts pressure within a prescribed range in real time, rather than holding one fixed pressure all night — useful for anyone whose apnea severity varies with position, congestion, or alcohol intake.",
    ],
    relatedHref: "/journal/cpap-pressure-what-auto-titrating-actually-adjusts",
    relatedLabel: "What Auto-Titrating CPAP Actually Adjusts",
  },
  {
    slug: "central-sleep-apnea",
    term: "Central Sleep Apnea",
    definition: [
      "A form of sleep apnea where the brain intermittently fails to signal the body to breathe, even though the airway itself is open — a different mechanism from obstructive apnea, and one standard CPAP is often less effective for.",
      "Often associated with heart failure, opioid use, or high-altitude exposure, and sometimes treated with an adaptive servo-ventilation device instead of standard CPAP.",
    ],
  },
  {
    slug: "obstructive-sleep-apnea",
    term: "Obstructive Sleep Apnea",
    definition: [
      "The most common form of sleep apnea, caused by the physical airway collapsing or narrowing during sleep despite a normal signal from the brain to breathe. CPAP treats it by using positive pressure to physically prop the airway open.",
    ],
  },
  {
    slug: "oxygen-concentrator",
    term: "Oxygen Concentrator",
    definition: [
      "A device that manufactures oxygen from room air on demand, using a pressure-swing adsorption process to filter out nitrogen and concentrate ambient air (roughly 21% oxygen) to 87–96% output — as opposed to a compressed tank, which stores a fixed, finite supply.",
    ],
    relatedHref: "/journal/portable-concentrators-vs-oxygen-tanks",
    relatedLabel: "Portable Concentrators vs. Oxygen Tanks",
  },
  {
    slug: "poc-portable-oxygen-concentrator",
    term: "POC (Portable Oxygen Concentrator)",
    definition: [
      "Shorthand for a battery-powered oxygen concentrator small enough to carry — as opposed to a stationary concentrator built for continuous home use, plugged into wall power.",
    ],
    relatedHref: "/oxygen/portable",
    relatedLabel: "Portable Oxygen Concentrators",
  },
  {
    slug: "prescription-verification",
    term: "Prescription Verification",
    definition: [
      "The process of confirming a valid, current prescription matches the device class and flow/pressure setting ordered — legally required for oxygen concentrators and CPAP/BiPAP devices under FDA regulation, regardless of payment method.",
    ],
    relatedHref: "/prescription",
    relatedLabel: "How Prescription Verification Works",
  },
  {
    slug: "cash-pay-self-pay",
    term: "Cash-Pay / Self-Pay",
    definition: [
      "A payment model where the buyer pays directly rather than the retailer billing insurance, Medicaid, or Medicare — the model CIRRUS operates under. It removes prior-authorization queues and claim-adjudication delays, in exchange for no insurance reimbursement.",
    ],
    relatedHref: "/why-cash-pay",
    relatedLabel: "Why Cash-Pay",
  },
  {
    slug: "refurbished-medical-device",
    term: "Refurbished (Medical Device)",
    definition: [
      "A previously owned device that's been inspected, serviced, and factory-tested before resale, typically at a lower price than new — usually still carrying a manufacturer or seller warranty, though warranty terms are often shorter than on a new unit.",
    ],
  },
  {
    slug: "nasal-cannula",
    term: "Nasal Cannula",
    definition: [
      "A lightweight tube with two small prongs that rest just inside the nostrils, delivering oxygen from a concentrator or tank — the standard delivery method for supplemental oxygen outside of a CPAP/BiPAP mask context.",
    ],
  },
  {
    slug: "full-face-mask-cpap",
    term: "Full Face Mask (CPAP)",
    definition: [
      "A CPAP/BiPAP mask that covers both the nose and mouth, typically prescribed for mouth breathers or anyone who can't maintain a nasal-only seal through the night.",
    ],
    relatedHref: "/sleep/accessories",
    relatedLabel: "CPAP Masks",
  },
  {
    slug: "nasal-pillow-mask",
    term: "Nasal Pillow Mask",
    definition: [
      "A minimal-contact CPAP/BiPAP mask that seals directly at the nostril opening rather than covering the outside of the nose — generally the least bulky mask style, often preferred by side sleepers and anyone bothered by a full-face mask.",
    ],
    relatedHref: "/sleep/accessories",
    relatedLabel: "CPAP Masks",
  },
  {
    slug: "humidifier-cpap",
    term: "Humidifier (CPAP)",
    definition: [
      "A heated water chamber integrated into or attached to a CPAP/BiPAP device, adding moisture to the delivered air to reduce dryness and irritation in the nose and throat — most modern machines heat to a target dew point rather than a fixed temperature.",
    ],
  },
  {
    slug: "residual-ahi",
    term: "Residual AHI",
    definition: [
      "The number of apnea/hypopnea events still occurring per hour despite CPAP or BiPAP treatment, logged by the device itself. A high residual AHI despite consistent nightly use usually points to a leak or pressure-setting issue worth adjusting.",
    ],
  },
  {
    slug: "ventilator-mechanical",
    term: "Ventilator (Mechanical)",
    definition: [
      "A device that fully or partially takes over the work of breathing for a patient, used in ICU, transport, and long-term care settings — distinct from CPAP/BiPAP, which support natural breathing rather than replace it. An institutional and clinical-buyer category, not a home consumer device.",
    ],
    relatedHref: "/ventilators",
    relatedLabel: "Ventilators",
  },
  {
    slug: "adaptive-support-ventilation-asv",
    term: "Adaptive Support Ventilation (ASV)",
    definition: [
      "A bi-level therapy mode that continuously adjusts pressure support breath-by-breath in response to a patient's own breathing pattern — commonly used for central and complex sleep apnea, where standard CPAP or fixed bi-level therapy is often insufficient.",
    ],
    relatedHref: "/sleep/bipap-apap/resmed-aircurve-10-asv",
    relatedLabel: "ResMed AirCurve 10 ASV",
  },
  {
    slug: "pulse-oximeter",
    term: "Pulse Oximeter",
    definition: [
      "A clip-on device, usually worn on a fingertip, that estimates blood oxygen saturation (SpO2) and pulse rate by shining light through the skin and measuring absorption differences between oxygenated and deoxygenated blood.",
    ],
    relatedHref: "/respiratory-accessories/nonin-onyx-vantage-9590",
    relatedLabel: "Nonin Onyx Vantage 9590 Pulse Oximeter",
  },
  {
    slug: "hypoxemia",
    term: "Hypoxemia",
    definition: [
      "Below-normal blood oxygen levels — generally a reading under 88–90% SpO2 accompanied by symptoms is the threshold most pulmonologists treat as needing prompt medical attention, and is often the trigger for a supplemental oxygen prescription.",
    ],
  },
  {
    slug: "ambulatory-oxygen",
    term: "Ambulatory Oxygen",
    definition: [
      "Oxygen therapy prescribed for use during activity and movement outside the home, as opposed to oxygen prescribed only for rest or sleep — the prescription basis for most portable concentrator purchases.",
    ],
    relatedHref: "/oxygen/portable",
    relatedLabel: "Portable Oxygen Concentrators",
  },
  {
    slug: "rx-required",
    term: "Rx (Prescription) Required",
    definition: [
      "Indicates a device is a regulated medical device under FDA rules, requiring a valid, verified prescription before it can be sold and shipped — applies to all oxygen concentrators and CPAP/BiPAP devices, regardless of insurance or payment method.",
    ],
    relatedHref: "/prescription",
    relatedLabel: "Prescription Verification",
  },
  {
    slug: "cannula-tubing-length",
    term: "Cannula / Tubing Length",
    definition: [
      "The length of tubing connecting a nasal cannula to an oxygen source — home setups commonly use 25 to 50 feet to allow movement between rooms, while portable concentrator tubing is typically much shorter for use while carrying the device.",
    ],
    relatedHref: "/oxygen/tanks",
    relatedLabel: "Oxygen Tanks & Cylinders",
  },
  {
    slug: "battery-capacity-wh",
    term: "Battery Capacity (Wh)",
    definition: [
      "Battery energy capacity measured in watt-hours — relevant for portable oxygen concentrators and CPAP because airlines cap carry-on lithium battery capacity at 160 Wh without prior airline approval, which extended batteries on some devices can exceed.",
    ],
    relatedHref: "/journal/faa-approved-oxygen-what-it-actually-means",
    relatedLabel: "FAA-Approved Oxygen: What It Actually Means",
  },
  {
    slug: "oxygen-purity-percentage",
    term: "Oxygen Purity Percentage",
    definition: [
      "The concentration of oxygen a concentrator outputs after filtering ambient air — most portable and stationary concentrators produce 87–96% purity, compared to the roughly 21% oxygen in normal room air.",
    ],
  },
  {
    slug: "titration-study",
    term: "Titration Study (Sleep Study)",
    definition: [
      "A monitored sleep study, in a lab or at home, where pressure is adjusted while a technician or algorithm watches for the setting that eliminates apneas and hypopneas — this is where the specific cmH₂O prescription number comes from.",
      "A diagnostic sleep study (measuring AHI) and a titration study are usually two separate steps; some home setups combine them into a single split-night or auto-titrating study.",
    ],
    relatedHref: "/sleep/cpap",
    relatedLabel: "CPAP Machines",
  },
  {
    slug: "ramp-setting",
    term: "Ramp Setting (CPAP)",
    definition: [
      "A comfort feature that starts therapy at a lower, easier-to-tolerate pressure and gradually increases to the full prescribed pressure over a set time (commonly 5–45 minutes) as the user falls asleep.",
    ],
    relatedHref: "/sleep/cpap",
    relatedLabel: "CPAP Machines",
  },
  {
    slug: "leak-rate",
    term: "Leak Rate (CPAP)",
    definition: [
      "The volume of air escaping around a mask seal rather than through its intended vent, reported by most modern CPAP/BiPAP machines and used to judge mask fit — a persistently high leak rate usually means a mask sizing or seal problem, not a pressure problem.",
    ],
    relatedHref: "/sleep/accessories",
    relatedLabel: "CPAP Masks & Accessories",
  },
  {
    slug: "sieve-bed",
    term: "Sieve Bed (Oxygen Concentrator)",
    definition: [
      "The zeolite-filled canister inside an oxygen concentrator that adsorbs nitrogen from compressed room air via pressure-swing adsorption, leaving concentrated oxygen behind — the component most warranties treat as a separate wear item from the concentrator itself.",
    ],
    relatedHref: "/oxygen",
    relatedLabel: "Oxygen Concentrators",
  },
  {
    slug: "non-invasive-ventilation",
    term: "Non-Invasive Ventilation (NIV)",
    definition: [
      "Mechanical ventilation delivered through a mask rather than an invasive airway (endotracheal tube or tracheostomy) — BiPAP is technically a form of NIV, though the term usually refers to higher-acuity ventilator-class devices used for respiratory failure rather than standard sleep apnea therapy.",
    ],
    relatedHref: "/ventilators",
    relatedLabel: "Ventilators",
  },
  {
    slug: "tidal-volume",
    term: "Tidal Volume",
    definition: [
      "The volume of air moved in a single normal breath, measured in milliliters — a core setting on a mechanical ventilator, prescribed per kilogram of the patient's body weight rather than as a fixed number across all patients.",
    ],
    relatedHref: "/ventilators",
    relatedLabel: "Ventilators",
  },
];

export function getGlossaryTerm(slug: string) {
  return GLOSSARY.find((g) => g.slug === slug);
}
