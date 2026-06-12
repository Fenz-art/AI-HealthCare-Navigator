export const COMMON_SYMPTOMS = [
  "Fever",
  "Headache",
  "Diarrhea",
  "Cough",
  "Nausea",
  "Sore throat",
  "Rash",
  "Dizziness",
  "Stomach pain",
  "Allergic reaction",
] as const;

export const WORKFLOW_STAGES = [
  "Understanding symptoms",
  "Assessing situation",
  "Finding local medication",
  "Finding nearby care",
  "Preparing translation support",
] as const;

export const SEVERITY_LABELS: Record<string, string> = {
  SELF_CARE: "Self care",
  PHARMACY: "Pharmacy",
  CLINIC: "Clinic",
  HOSPITAL: "Hospital",
  EMERGENCY: "Emergency",
};

export const SEVERITY_GUIDANCE: Record<string, string> = {
  SELF_CARE:
    "Rest, hydrate, and monitor your symptoms. Seek care if things worsen.",
  PHARMACY:
    "Visit a nearby pharmacy for over-the-counter options. Show the interpreter card if needed.",
  CLINIC:
    "A local clinic can evaluate your symptoms. Bring your interpreter summary.",
  HOSPITAL:
    "Head to a hospital for a more thorough evaluation as soon as you can.",
  EMERGENCY:
    "Call local emergency services immediately. Do not wait for an appointment.",
};

export const PROVIDER_TYPE_COLORS: Record<string, string> = {
  PHARMACY: "#0faf8f",
  CLINIC: "#0b4d61",
  HOSPITAL: "#e53935",
};
