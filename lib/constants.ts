
export const CANONICAL_CLASSES = [
    "CAT",
    "Anger Management",
    "DBT 1",
    "DBT 2",
    "DBT 3",
    "CBI 1",
    "CBI 2",
    "CBI 3",
    "CODA",
    "Relapse Prevention",
    "MRT",
    "Budget",
    "Seeking Safety",
    "Grief",
    "Prime Solutions",
    "AOD (Alcohol and Other Drugs)",
    "Grad Group"
] as const;

export type CanonicalClass = typeof CANONICAL_CLASSES[number];
