/**
 * CareCompass seed — fast bulk version
 * Uses raw SQL INSERT … ON CONFLICT DO NOTHING so the whole
 * dataset lands in 3 queries instead of 700+ individual upserts.
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
// ── 1. Countries ─────────────────────────────────────────────────
const COUNTRIES = [
    { name: 'United States', code: 'US' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'United Kingdom', code: 'GB' },
    { name: 'Germany', code: 'DE' },
    { name: 'France', code: 'FR' },
    { name: 'Brazil', code: 'BR' },
    { name: 'Italy', code: 'IT' },
    { name: 'Spain', code: 'ES' },
    { name: 'Mexico', code: 'MX' },
    { name: 'Australia', code: 'AU' },
    { name: 'Thailand', code: 'TH' },
    { name: 'Vietnam', code: 'VN' },
    { name: 'South Korea', code: 'KR' },
    { name: 'Sweden', code: 'SE' },
    { name: 'UAE', code: 'AE' },
    { name: 'South Africa', code: 'ZA' },
    { name: 'Nigeria', code: 'NG' },
    { name: 'Turkey', code: 'TR' },
    { name: 'Egypt', code: 'EG' },
];
// ── 2. Active ingredients ─────────────────────────────────────────
const INGREDIENTS = [
    'Paracetamol', 'Ibuprofen', 'Loperamide', 'Cetirizine', 'Omeprazole',
    'Bismuth Subsalicylate', 'Oral Rehydration Salts', 'Dimenhydrinate',
    'Diphenhydramine', 'Loratadine', 'Diclofenac', 'Naproxen', 'Simethicone',
    'Hydrocortisone', 'Clotrimazole', 'Guaifenesin', 'Dextromethorphan',
    'Pseudoephedrine', 'Phenylephrine', 'Meclizine', 'Famotidine',
    'Ketoconazole', 'Mupirocin', 'Fluticasone',
];
const MAPPINGS = [
    // Paracetamol
    { i: 'Paracetamol', c: 'US', b: 'Tylenol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'IN', b: 'Crocin', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'JP', b: 'Bufferin Luna', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'GB', b: 'Panadol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'DE', b: 'Ben-u-ron', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'FR', b: 'Doliprane', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'BR', b: 'Tylenol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'IT', b: 'Tachipirina', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'ES', b: 'Gelocatil', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'MX', b: 'Tempra', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'AU', b: 'Panadol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'TH', b: 'Sara', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'VN', b: 'Efferalgan', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'KR', b: 'Tylenol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'SE', b: 'Alvedon', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'AE', b: 'Panadol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'ZA', b: 'Panado', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'NG', b: 'Panadol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'TR', b: 'Parol', s: 'FULL_OTC' },
    { i: 'Paracetamol', c: 'EG', b: 'Panadol', s: 'FULL_OTC' },
    // Ibuprofen
    { i: 'Ibuprofen', c: 'US', b: 'Advil', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'IN', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'JP', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'GB', b: 'Nurofen', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'DE', b: 'Dolormin', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'FR', b: 'Advil', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'BR', b: 'Advil', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'IT', b: 'Moment', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'ES', b: 'Neobrufen', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'MX', b: 'Advil', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'AU', b: 'Nurofen', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'TH', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'VN', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'KR', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'SE', b: 'Ipren', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'AE', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'ZA', b: 'Myprodol', s: 'FULL_OTC' },
    { i: 'Ibuprofen', c: 'TR', b: 'Brufen', s: 'PHARMACY_ONLY' },
    { i: 'Ibuprofen', c: 'EG', b: 'Brufen', s: 'PHARMACY_ONLY' },
    // Loperamide
    { i: 'Loperamide', c: 'US', b: 'Imodium A-D', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'IN', b: 'Eldoper', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'JP', b: 'Imodium', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'GB', b: 'Imodium', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'DE', b: 'Imodium', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'FR', b: 'Imodium', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'BR', b: 'Imosec', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'IT', b: 'Imodium', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'ES', b: 'Fortasec', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'MX', b: 'Diarstop', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'AU', b: 'Gastro-Stop', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'TH', b: 'Imodium', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'VN', b: 'Imodium', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'KR', b: 'Imodium', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'SE', b: 'Imodium', s: 'FULL_OTC' },
    { i: 'Loperamide', c: 'AE', b: 'Imodium', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'TR', b: 'Imodium', s: 'PHARMACY_ONLY' },
    { i: 'Loperamide', c: 'EG', b: 'Imodium', s: 'PHARMACY_ONLY' },
    // Cetirizine
    { i: 'Cetirizine', c: 'US', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'IN', b: 'Cetzine', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'JP', b: 'Zyrtec', s: 'PHARMACY_ONLY' },
    { i: 'Cetirizine', c: 'GB', b: 'Piriteze', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'DE', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'FR', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'BR', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'IT', b: 'Zirtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'ES', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'MX', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'AU', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'TH', b: 'Zyrtec', s: 'PHARMACY_ONLY' },
    { i: 'Cetirizine', c: 'VN', b: 'Zyrtec', s: 'PHARMACY_ONLY' },
    { i: 'Cetirizine', c: 'KR', b: 'Zyrtec', s: 'PHARMACY_ONLY' },
    { i: 'Cetirizine', c: 'SE', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'AE', b: 'Zyrtec', s: 'FULL_OTC' },
    { i: 'Cetirizine', c: 'TR', b: 'Zyrtec', s: 'FULL_OTC' },
    // Omeprazole
    { i: 'Omeprazole', c: 'US', b: 'Prilosec', s: 'FULL_OTC' },
    { i: 'Omeprazole', c: 'IN', b: 'Omez', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'JP', b: 'Omepral', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'GB', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'DE', b: 'Antra', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'FR', b: 'Mopral', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'BR', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'IT', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'ES', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'MX', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'AU', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'TH', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'KR', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'SE', b: 'Losec', s: 'PHARMACY_ONLY' },
    { i: 'Omeprazole', c: 'AE', b: 'Losec', s: 'PHARMACY_ONLY' },
    // Bismuth Subsalicylate
    { i: 'Bismuth Subsalicylate', c: 'US', b: 'Pepto-Bismol', s: 'FULL_OTC' },
    { i: 'Bismuth Subsalicylate', c: 'GB', b: 'Pepto-Bismol', s: 'FULL_OTC' },
    { i: 'Bismuth Subsalicylate', c: 'AU', b: 'Pepto-Bismol', s: 'FULL_OTC' },
    { i: 'Bismuth Subsalicylate', c: 'MX', b: 'Pepto-Bismol', s: 'FULL_OTC' },
    // Oral Rehydration Salts
    { i: 'Oral Rehydration Salts', c: 'US', b: 'Pedialyte', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'IN', b: 'Electral', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'GB', b: 'Dioralyte', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'JP', b: 'OS-1', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'TH', b: 'ORS', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'VN', b: 'Oresol', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'MX', b: 'Pedialyte', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'BR', b: 'Rehidrat', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'EG', b: 'Rehydra', s: 'FULL_OTC' },
    { i: 'Oral Rehydration Salts', c: 'NG', b: 'ORS', s: 'FULL_OTC' },
    // Dimenhydrinate
    { i: 'Dimenhydrinate', c: 'US', b: 'Dramamine', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'IN', b: 'Avomine', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'GB', b: 'Travel Calm', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'JP', b: 'Aneron', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'DE', b: 'Vomex A', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'FR', b: 'Nausicalm', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'AU', b: 'Travacalm', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'TH', b: 'Dimen', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'MX', b: 'Dramamine', s: 'FULL_OTC' },
    { i: 'Dimenhydrinate', c: 'BR', b: 'Dramin', s: 'FULL_OTC' },
    // Diphenhydramine
    { i: 'Diphenhydramine', c: 'US', b: 'Benadryl', s: 'FULL_OTC' },
    { i: 'Diphenhydramine', c: 'IN', b: 'Benadryl', s: 'FULL_OTC' },
    { i: 'Diphenhydramine', c: 'GB', b: 'Benadryl', s: 'FULL_OTC' },
    { i: 'Diphenhydramine', c: 'JP', b: 'Restamin', s: 'PHARMACY_ONLY' },
    { i: 'Diphenhydramine', c: 'AU', b: 'Benadryl', s: 'FULL_OTC' },
    { i: 'Diphenhydramine', c: 'MX', b: 'Benadryl', s: 'FULL_OTC' },
    { i: 'Diphenhydramine', c: 'BR', b: 'Benadryl', s: 'FULL_OTC' },
    { i: 'Diphenhydramine', c: 'FR', b: 'Nautamine', s: 'FULL_OTC' },
    // Loratadine
    { i: 'Loratadine', c: 'US', b: 'Claritin', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'IN', b: 'Lorfast', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'GB', b: 'Clarityn', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'JP', b: 'Claritin', s: 'PHARMACY_ONLY' },
    { i: 'Loratadine', c: 'DE', b: 'Claritin', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'FR', b: 'Clarityne', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'AU', b: 'Claratyne', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'MX', b: 'Claritin', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'BR', b: 'Claritin', s: 'FULL_OTC' },
    { i: 'Loratadine', c: 'TH', b: 'Claritin', s: 'PHARMACY_ONLY' },
    // Diclofenac
    { i: 'Diclofenac', c: 'IN', b: 'Voveran', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'JP', b: 'Voltaren', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'DE', b: 'Voltaren', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'GB', b: 'Voltarol', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'US', b: 'Voltaren', s: 'FULL_OTC' },
    { i: 'Diclofenac', c: 'BR', b: 'Voltaren', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'MX', b: 'Voltaren', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'TH', b: 'Voltaren', s: 'PHARMACY_ONLY' },
    { i: 'Diclofenac', c: 'TR', b: 'Voltaren', s: 'PHARMACY_ONLY' },
    // Naproxen
    { i: 'Naproxen', c: 'US', b: 'Aleve', s: 'FULL_OTC' },
    { i: 'Naproxen', c: 'GB', b: 'Feminax', s: 'FULL_OTC' },
    { i: 'Naproxen', c: 'DE', b: 'Dolormin Extra', s: 'FULL_OTC' },
    { i: 'Naproxen', c: 'IN', b: 'Naprosyn', s: 'PHARMACY_ONLY' },
    { i: 'Naproxen', c: 'AU', b: 'Naprogesic', s: 'FULL_OTC' },
    { i: 'Naproxen', c: 'MX', b: 'Flanax', s: 'FULL_OTC' },
    { i: 'Naproxen', c: 'BR', b: 'Flanax', s: 'FULL_OTC' },
    { i: 'Naproxen', c: 'SE', b: 'Pronaxen', s: 'FULL_OTC' },
    // Simethicone
    { i: 'Simethicone', c: 'US', b: 'Gas-X', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'IN', b: 'Digene', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'GB', b: 'WindSetlers', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'JP', b: 'Gaason', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'DE', b: 'Lefax', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'FR', b: 'Meteosim', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'AU', b: 'De-Gas', s: 'FULL_OTC' },
    { i: 'Simethicone', c: 'MX', b: 'Aero-OM', s: 'FULL_OTC' },
    // Hydrocortisone
    { i: 'Hydrocortisone', c: 'US', b: 'Cortizone-10', s: 'FULL_OTC' },
    { i: 'Hydrocortisone', c: 'GB', b: 'HC45', s: 'FULL_OTC' },
    { i: 'Hydrocortisone', c: 'IN', b: 'Caladryl', s: 'FULL_OTC' },
    { i: 'Hydrocortisone', c: 'AU', b: 'Dermaid', s: 'FULL_OTC' },
    { i: 'Hydrocortisone', c: 'DE', b: 'Hydrocutan', s: 'FULL_OTC' },
    { i: 'Hydrocortisone', c: 'FR', b: 'Cortisedermyl', s: 'FULL_OTC' },
    { i: 'Hydrocortisone', c: 'JP', b: 'Locoid', s: 'PHARMACY_ONLY' },
    // Clotrimazole
    { i: 'Clotrimazole', c: 'US', b: 'Lotrimin', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'GB', b: 'Canesten', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'IN', b: 'Candid', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'AU', b: 'Canesten', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'DE', b: 'Canesten', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'FR', b: 'Canesten', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'MX', b: 'Canesten', s: 'FULL_OTC' },
    { i: 'Clotrimazole', c: 'BR', b: 'Canesten', s: 'FULL_OTC' },
    // Guaifenesin
    { i: 'Guaifenesin', c: 'US', b: 'Mucinex', s: 'FULL_OTC' },
    { i: 'Guaifenesin', c: 'GB', b: 'Benylin', s: 'FULL_OTC' },
    { i: 'Guaifenesin', c: 'IN', b: 'Alex', s: 'FULL_OTC' },
    { i: 'Guaifenesin', c: 'AU', b: 'Robitussin', s: 'FULL_OTC' },
    { i: 'Guaifenesin', c: 'MX', b: 'Tukol', s: 'FULL_OTC' },
    { i: 'Guaifenesin', c: 'BR', b: 'Mucosolvan', s: 'FULL_OTC' },
    // Dextromethorphan
    { i: 'Dextromethorphan', c: 'US', b: 'Robitussin DM', s: 'FULL_OTC' },
    { i: 'Dextromethorphan', c: 'GB', b: 'Benylin DM', s: 'FULL_OTC' },
    { i: 'Dextromethorphan', c: 'IN', b: 'Benadryl DR', s: 'FULL_OTC' },
    { i: 'Dextromethorphan', c: 'AU', b: 'Bisolvon', s: 'FULL_OTC' },
    { i: 'Dextromethorphan', c: 'MX', b: 'Tukol DM', s: 'FULL_OTC' },
    { i: 'Dextromethorphan', c: 'BR', b: 'Vick 44E', s: 'FULL_OTC' },
    // Pseudoephedrine
    { i: 'Pseudoephedrine', c: 'US', b: 'Sudafed', s: 'PHARMACY_ONLY' },
    { i: 'Pseudoephedrine', c: 'GB', b: 'Sudafed', s: 'PHARMACY_ONLY' },
    { i: 'Pseudoephedrine', c: 'AU', b: 'Sudafed', s: 'PHARMACY_ONLY' },
    { i: 'Pseudoephedrine', c: 'IN', b: 'Sinarest', s: 'PHARMACY_ONLY' },
    { i: 'Pseudoephedrine', c: 'MX', b: 'Sudafed', s: 'PHARMACY_ONLY' },
    // Phenylephrine
    { i: 'Phenylephrine', c: 'US', b: 'Sudafed PE', s: 'FULL_OTC' },
    { i: 'Phenylephrine', c: 'GB', b: 'Sudafed PE', s: 'FULL_OTC' },
    { i: 'Phenylephrine', c: 'IN', b: 'Otrivin', s: 'FULL_OTC' },
    { i: 'Phenylephrine', c: 'AU', b: 'Demazin', s: 'FULL_OTC' },
    { i: 'Phenylephrine', c: 'MX', b: 'Sudafed PE', s: 'FULL_OTC' },
    // Meclizine
    { i: 'Meclizine', c: 'US', b: 'Bonine', s: 'FULL_OTC' },
    { i: 'Meclizine', c: 'IN', b: 'Vertin', s: 'PHARMACY_ONLY' },
    { i: 'Meclizine', c: 'GB', b: 'Stugeron', s: 'PHARMACY_ONLY' },
    { i: 'Meclizine', c: 'AU', b: 'Travacalm', s: 'FULL_OTC' },
    // Famotidine
    { i: 'Famotidine', c: 'US', b: 'Pepcid', s: 'FULL_OTC' },
    { i: 'Famotidine', c: 'IN', b: 'Famocid', s: 'PHARMACY_ONLY' },
    { i: 'Famotidine', c: 'JP', b: 'Gaster', s: 'PHARMACY_ONLY' },
    { i: 'Famotidine', c: 'GB', b: 'Pepcid', s: 'FULL_OTC' },
    { i: 'Famotidine', c: 'AU', b: 'Pepcidine', s: 'FULL_OTC' },
    { i: 'Famotidine', c: 'MX', b: 'Pepcid', s: 'FULL_OTC' },
    // Ketoconazole
    { i: 'Ketoconazole', c: 'US', b: 'Nizoral', s: 'FULL_OTC' },
    { i: 'Ketoconazole', c: 'IN', b: 'Nizral', s: 'PHARMACY_ONLY' },
    { i: 'Ketoconazole', c: 'GB', b: 'Nizoral', s: 'PHARMACY_ONLY' },
    { i: 'Ketoconazole', c: 'AU', b: 'Nizoral', s: 'PHARMACY_ONLY' },
    { i: 'Ketoconazole', c: 'BR', b: 'Nizoral', s: 'PHARMACY_ONLY' },
    // Mupirocin
    { i: 'Mupirocin', c: 'US', b: 'Bactroban', s: 'PRESCRIPTION_ONLY' },
    { i: 'Mupirocin', c: 'IN', b: 'T-Bact', s: 'PRESCRIPTION_ONLY' },
    { i: 'Mupirocin', c: 'GB', b: 'Bactroban', s: 'PRESCRIPTION_ONLY' },
    { i: 'Mupirocin', c: 'AU', b: 'Bactroban', s: 'PRESCRIPTION_ONLY' },
    // Fluticasone
    { i: 'Fluticasone', c: 'US', b: 'Flonase', s: 'FULL_OTC' },
    { i: 'Fluticasone', c: 'GB', b: 'Flixonase', s: 'FULL_OTC' },
    { i: 'Fluticasone', c: 'IN', b: 'Flomist', s: 'PHARMACY_ONLY' },
    { i: 'Fluticasone', c: 'AU', b: 'Flixonase', s: 'FULL_OTC' },
    { i: 'Fluticasone', c: 'DE', b: 'Avamys', s: 'PHARMACY_ONLY' },
    { i: 'Fluticasone', c: 'MX', b: 'Flonase', s: 'FULL_OTC' },
];
// ── helpers ──────────────────────────────────────────────────────
function cuid() {
    return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}
async function main() {
    console.log('Seeding CareCompass database…');
    // --- Step 1: countries (single bulk INSERT, ~5 ms) --------
    const countryValues = COUNTRIES.map(c => `('${cuid()}','${c.name.replace(/'/g, "''")}','${c.code}')`).join(',');
    await prisma.$executeRawUnsafe(`
    INSERT INTO "Country" (id, name, code)
    VALUES ${countryValues}
    ON CONFLICT (code) DO NOTHING
  `);
    console.log(`✓ Countries (${COUNTRIES.length})`);
    // --- Step 2: active ingredients (single bulk INSERT, ~5 ms) -
    const ingValues = INGREDIENTS.map(name => `('${cuid()}','${name.replace(/'/g, "''")}')`)
        .join(',');
    await prisma.$executeRawUnsafe(`
    INSERT INTO "ActiveIngredient" (id, name)
    VALUES ${ingValues}
    ON CONFLICT (name) DO NOTHING
  `);
    console.log(`✓ ActiveIngredients (${INGREDIENTS.length})`);
    // --- Step 3: fetch IDs back (2 queries) --------------------
    const countries = await prisma.country.findMany();
    const ingredients = await prisma.activeIngredient.findMany();
    const countryByCode = new Map(countries.map(c => [c.code, c]));
    const ingByName = new Map(ingredients.map(i => [i.name, i]));
    // --- Step 4: brands + edges (2 bulk INSERTs) ---------------
    const brandRows = [];
    const edgeRows = [];
    for (const m of MAPPINGS) {
        const country = countryByCode.get(m.c);
        const ingredient = ingByName.get(m.i);
        if (!country || !ingredient) {
            console.warn(`  skip: ${m.i} / ${m.c}`);
            continue;
        }
        const brandId = cuid();
        brandRows.push(`('${brandId}','${m.b.replace(/'/g, "''")}','${country.id}','${ingredient.id}','${m.s}','${m.d ?? 'STANDARD_OTC'}')`);
        edgeRows.push(`('${cuid()}','${ingredient.id}','${country.id}','${brandId}')`);
    }
    // brands
    await prisma.$executeRawUnsafe(`
    INSERT INTO "Brand" (id, name, "countryId", "activeIngredientId", "otcStatus", "doseRule")
    VALUES ${brandRows.join(',')}
    ON CONFLICT (name, "countryId") DO NOTHING
  `);
    console.log(`✓ Brands (${brandRows.length})`);
    // medication edges — brand IDs from above might conflict if brand already existed
    // re-fetch brand IDs to be safe
    const brands = await prisma.brand.findMany({ select: { id: true, name: true, countryId: true } });
    const brandKey = new Map(brands.map(b => [`${b.name}|${b.countryId}`, b.id]));
    const safeEdgeRows = [];
    for (const m of MAPPINGS) {
        const country = countryByCode.get(m.c);
        const ingredient = ingByName.get(m.i);
        if (!country || !ingredient)
            continue;
        const brandId = brandKey.get(`${m.b}|${country.id}`);
        if (!brandId)
            continue;
        safeEdgeRows.push(`('${cuid()}','${ingredient.id}','${country.id}','${brandId}')`);
    }
    if (safeEdgeRows.length > 0) {
        await prisma.$executeRawUnsafe(`
      INSERT INTO "MedicationEdge" (id, "activeIngredientId", "countryId", "brandId")
      VALUES ${safeEdgeRows.join(',')}
      ON CONFLICT ("activeIngredientId","countryId","brandId") DO NOTHING
    `);
    }
    console.log(`✓ MedicationEdges (${safeEdgeRows.length})`);
    // --- Summary -----------------------------------------------
    const [cCount, iCount, bCount, eCount] = await Promise.all([
        prisma.country.count(),
        prisma.activeIngredient.count(),
        prisma.brand.count(),
        prisma.medicationEdge.count(),
    ]);
    console.log('\n═══════════════════════════════');
    console.log(`  Countries:          ${cCount}`);
    console.log(`  ActiveIngredients:  ${iCount}`);
    console.log(`  Brands:             ${bCount}`);
    console.log(`  MedicationEdges:    ${eCount}`);
    console.log('═══════════════════════════════');
    console.log('Seed complete ✓');
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map