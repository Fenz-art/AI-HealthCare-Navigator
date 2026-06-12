import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const mappings = [
    // Paracetamol
    { ingredient: 'Paracetamol', country: 'US', brand: 'Tylenol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'IN', brand: 'Crocin', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'JP', brand: 'Bufferin Luna', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'GB', brand: 'Panadol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'DE', brand: 'Ben-u-ron', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'FR', brand: 'Doliprane', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'BR', brand: 'Tylenol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'IT', brand: 'Tachipirina', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'ES', brand: 'Gelocatil', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'MX', brand: 'Tempra', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'AU', brand: 'Panadol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'TH', brand: 'Sara', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'VN', brand: 'Efferalgan', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'KR', brand: 'Tylenol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'SE', brand: 'Alvedon', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'AE', brand: 'Panadol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'ZA', brand: 'Panado', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'NG', brand: 'Panadol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'TR', brand: 'Parol', status: 'FULL_OTC' },
    { ingredient: 'Paracetamol', country: 'EG', brand: 'Panadol', status: 'FULL_OTC' },
    // Ibuprofen
    { ingredient: 'Ibuprofen', country: 'US', brand: 'Advil', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'IN', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'JP', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'GB', brand: 'Nurofen', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'DE', brand: 'Dolormin', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'FR', brand: 'Advil', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'BR', brand: 'Advil', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'IT', brand: 'Moment', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'ES', brand: 'Neobrufen', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'MX', brand: 'Advil', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'AU', brand: 'Nurofen', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'TH', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'VN', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'KR', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'SE', brand: 'Ipren', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'AE', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'ZA', brand: 'Myprodol', status: 'FULL_OTC' },
    { ingredient: 'Ibuprofen', country: 'TR', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ibuprofen', country: 'EG', brand: 'Brufen', status: 'PHARMACY_ONLY' },
    // Loperamide
    { ingredient: 'Loperamide', country: 'US', brand: 'Imodium A-D', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'IN', brand: 'Eldoper', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'JP', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'GB', brand: 'Imodium', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'DE', brand: 'Imodium', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'FR', brand: 'Imodium', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'BR', brand: 'Imosec', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'IT', brand: 'Imodium', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'ES', brand: 'Fortasec', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'MX', brand: 'Diarstop', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'AU', brand: 'Gastro-Stop', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'TH', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'VN', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'KR', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'SE', brand: 'Imodium', status: 'FULL_OTC' },
    { ingredient: 'Loperamide', country: 'AE', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'TR', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loperamide', country: 'EG', brand: 'Imodium', status: 'PHARMACY_ONLY' },
    // Cetirizine
    { ingredient: 'Cetirizine', country: 'US', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'IN', brand: 'Cetzine', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'JP', brand: 'Zyrtec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Cetirizine', country: 'GB', brand: 'Piriteze', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'DE', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'FR', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'BR', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'IT', brand: 'Zirtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'ES', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'MX', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'AU', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'TH', brand: 'Zyrtec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Cetirizine', country: 'VN', brand: 'Zyrtec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Cetirizine', country: 'KR', brand: 'Zyrtec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Cetirizine', country: 'SE', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'AE', brand: 'Zyrtec', status: 'FULL_OTC' },
    { ingredient: 'Cetirizine', country: 'TR', brand: 'Zyrtec', status: 'FULL_OTC' },
    // Omeprazole
    { ingredient: 'Omeprazole', country: 'US', brand: 'Prilosec', status: 'FULL_OTC' },
    { ingredient: 'Omeprazole', country: 'IN', brand: 'Omez', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'JP', brand: 'Omepral', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'GB', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'DE', brand: 'Antra', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'FR', brand: 'Mopral', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'BR', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'IT', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'ES', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'MX', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'AU', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'TH', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'KR', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'SE', brand: 'Losec', status: 'PHARMACY_ONLY' },
    { ingredient: 'Omeprazole', country: 'AE', brand: 'Losec', status: 'PHARMACY_ONLY' },
    // Bismuth Subsalicylate
    { ingredient: 'Bismuth Subsalicylate', country: 'US', brand: 'Pepto-Bismol', status: 'FULL_OTC' },
    { ingredient: 'Bismuth Subsalicylate', country: 'GB', brand: 'Pepto-Bismol', status: 'FULL_OTC' },
    { ingredient: 'Bismuth Subsalicylate', country: 'AU', brand: 'Pepto-Bismol', status: 'FULL_OTC' },
    { ingredient: 'Bismuth Subsalicylate', country: 'MX', brand: 'Pepto-Bismol', status: 'FULL_OTC' },
    // Oral Rehydration Salts
    { ingredient: 'Oral Rehydration Salts', country: 'US', brand: 'Pedialyte', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'IN', brand: 'Electral', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'GB', brand: 'Dioralyte', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'JP', brand: 'OS-1', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'TH', brand: 'ORS', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'VN', brand: 'Oresol', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'MX', brand: 'Pedialyte', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'BR', brand: 'Rehidrat', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'EG', brand: 'Rehydra', status: 'FULL_OTC' },
    { ingredient: 'Oral Rehydration Salts', country: 'NG', brand: 'ORS', status: 'FULL_OTC' },
    // Dimenhydrinate
    { ingredient: 'Dimenhydrinate', country: 'US', brand: 'Dramamine', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'IN', brand: 'Avomine', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'GB', brand: 'Travel Calm', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'JP', brand: 'Aneron', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'DE', brand: 'Vomex A', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'FR', brand: 'Nausicalm', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'AU', brand: 'Travacalm', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'TH', brand: 'Dimen', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'MX', brand: 'Dramamine', status: 'FULL_OTC' },
    { ingredient: 'Dimenhydrinate', country: 'BR', brand: 'Dramin', status: 'FULL_OTC' },
    // Diphenhydramine
    { ingredient: 'Diphenhydramine', country: 'US', brand: 'Benadryl', status: 'FULL_OTC' },
    { ingredient: 'Diphenhydramine', country: 'IN', brand: 'Benadryl', status: 'FULL_OTC' },
    { ingredient: 'Diphenhydramine', country: 'GB', brand: 'Benadryl', status: 'FULL_OTC' },
    { ingredient: 'Diphenhydramine', country: 'JP', brand: 'Restamin', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diphenhydramine', country: 'AU', brand: 'Benadryl', status: 'FULL_OTC' },
    { ingredient: 'Diphenhydramine', country: 'MX', brand: 'Benadryl', status: 'FULL_OTC' },
    { ingredient: 'Diphenhydramine', country: 'BR', brand: 'Benadryl', status: 'FULL_OTC' },
    { ingredient: 'Diphenhydramine', country: 'FR', brand: 'Nautamine', status: 'FULL_OTC' },
    // Loratadine
    { ingredient: 'Loratadine', country: 'US', brand: 'Claritin', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'IN', brand: 'Lorfast', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'GB', brand: 'Clarityn', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'JP', brand: 'Claritin', status: 'PHARMACY_ONLY' },
    { ingredient: 'Loratadine', country: 'DE', brand: 'Claritin', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'FR', brand: 'Clarityne', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'AU', brand: 'Claratyne', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'MX', brand: 'Claritin', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'BR', brand: 'Claritin', status: 'FULL_OTC' },
    { ingredient: 'Loratadine', country: 'TH', brand: 'Claritin', status: 'PHARMACY_ONLY' },
    // Diclofenac
    { ingredient: 'Diclofenac', country: 'IN', brand: 'Voveran', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'JP', brand: 'Voltaren', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'DE', brand: 'Voltaren', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'GB', brand: 'Voltarol', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'US', brand: 'Voltaren', status: 'FULL_OTC' },
    { ingredient: 'Diclofenac', country: 'BR', brand: 'Voltaren', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'MX', brand: 'Voltaren', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'TH', brand: 'Voltaren', status: 'PHARMACY_ONLY' },
    { ingredient: 'Diclofenac', country: 'TR', brand: 'Voltaren', status: 'PHARMACY_ONLY' },
    // Naproxen
    { ingredient: 'Naproxen', country: 'US', brand: 'Aleve', status: 'FULL_OTC' },
    { ingredient: 'Naproxen', country: 'GB', brand: 'Feminax', status: 'FULL_OTC' },
    { ingredient: 'Naproxen', country: 'DE', brand: 'Dolormin Extra', status: 'FULL_OTC' },
    { ingredient: 'Naproxen', country: 'IN', brand: 'Naprosyn', status: 'PHARMACY_ONLY' },
    { ingredient: 'Naproxen', country: 'AU', brand: 'Naprogesic', status: 'FULL_OTC' },
    { ingredient: 'Naproxen', country: 'MX', brand: 'Flanax', status: 'FULL_OTC' },
    { ingredient: 'Naproxen', country: 'BR', brand: 'Flanax', status: 'FULL_OTC' },
    { ingredient: 'Naproxen', country: 'SE', brand: 'Pronaxen', status: 'FULL_OTC' },
    // Simethicone
    { ingredient: 'Simethicone', country: 'US', brand: 'Gas-X', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'IN', brand: 'Digene', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'GB', brand: 'WindSetlers', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'JP', brand: 'Gaason', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'DE', brand: 'Lefax', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'FR', brand: 'Meteosim', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'AU', brand: 'De-Gas', status: 'FULL_OTC' },
    { ingredient: 'Simethicone', country: 'MX', brand: 'Aero-OM', status: 'FULL_OTC' },
    // Hydrocortisone
    { ingredient: 'Hydrocortisone', country: 'US', brand: 'Cortizone-10', status: 'FULL_OTC' },
    { ingredient: 'Hydrocortisone', country: 'GB', brand: 'HC45', status: 'FULL_OTC' },
    { ingredient: 'Hydrocortisone', country: 'IN', brand: 'Caladryl', status: 'FULL_OTC' },
    { ingredient: 'Hydrocortisone', country: 'AU', brand: 'Dermaid', status: 'FULL_OTC' },
    { ingredient: 'Hydrocortisone', country: 'DE', brand: 'Hydrocutan', status: 'FULL_OTC' },
    { ingredient: 'Hydrocortisone', country: 'FR', brand: 'Cortisedermyl', status: 'FULL_OTC' },
    { ingredient: 'Hydrocortisone', country: 'JP', brand: 'Locoid', status: 'PHARMACY_ONLY' },
    // Clotrimazole
    { ingredient: 'Clotrimazole', country: 'US', brand: 'Lotrimin', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'GB', brand: 'Canesten', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'IN', brand: 'Candid', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'AU', brand: 'Canesten', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'DE', brand: 'Canesten', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'FR', brand: 'Canesten', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'MX', brand: 'Canesten', status: 'FULL_OTC' },
    { ingredient: 'Clotrimazole', country: 'BR', brand: 'Canesten', status: 'FULL_OTC' },
    // Guaifenesin
    { ingredient: 'Guaifenesin', country: 'US', brand: 'Mucinex', status: 'FULL_OTC' },
    { ingredient: 'Guaifenesin', country: 'GB', brand: 'Benylin', status: 'FULL_OTC' },
    { ingredient: 'Guaifenesin', country: 'IN', brand: 'Alex', status: 'FULL_OTC' },
    { ingredient: 'Guaifenesin', country: 'AU', brand: 'Robitussin', status: 'FULL_OTC' },
    { ingredient: 'Guaifenesin', country: 'MX', brand: 'Tukol', status: 'FULL_OTC' },
    { ingredient: 'Guaifenesin', country: 'BR', brand: 'Mucosolvan', status: 'FULL_OTC' },
    // Dextromethorphan
    { ingredient: 'Dextromethorphan', country: 'US', brand: 'Robitussin DM', status: 'FULL_OTC' },
    { ingredient: 'Dextromethorphan', country: 'GB', brand: 'Benylin DM', status: 'FULL_OTC' },
    { ingredient: 'Dextromethorphan', country: 'IN', brand: 'Benadryl DR', status: 'FULL_OTC' },
    { ingredient: 'Dextromethorphan', country: 'AU', brand: 'Bisolvon', status: 'FULL_OTC' },
    { ingredient: 'Dextromethorphan', country: 'MX', brand: 'Tukol DM', status: 'FULL_OTC' },
    { ingredient: 'Dextromethorphan', country: 'BR', brand: 'Vick 44E', status: 'FULL_OTC' },
    // Pseudoephedrine
    { ingredient: 'Pseudoephedrine', country: 'US', brand: 'Sudafed', status: 'PHARMACY_ONLY' },
    { ingredient: 'Pseudoephedrine', country: 'GB', brand: 'Sudafed', status: 'PHARMACY_ONLY' },
    { ingredient: 'Pseudoephedrine', country: 'AU', brand: 'Sudafed', status: 'PHARMACY_ONLY' },
    { ingredient: 'Pseudoephedrine', country: 'IN', brand: 'Sinarest', status: 'PHARMACY_ONLY' },
    { ingredient: 'Pseudoephedrine', country: 'MX', brand: 'Sudafed', status: 'PHARMACY_ONLY' },
    // Phenylephrine
    { ingredient: 'Phenylephrine', country: 'US', brand: 'Sudafed PE', status: 'FULL_OTC' },
    { ingredient: 'Phenylephrine', country: 'GB', brand: 'Sudafed PE', status: 'FULL_OTC' },
    { ingredient: 'Phenylephrine', country: 'IN', brand: 'Otrivin', status: 'FULL_OTC' },
    { ingredient: 'Phenylephrine', country: 'AU', brand: 'Demazin', status: 'FULL_OTC' },
    { ingredient: 'Phenylephrine', country: 'MX', brand: 'Sudafed PE', status: 'FULL_OTC' },
    // Meclizine
    { ingredient: 'Meclizine', country: 'US', brand: 'Bonine', status: 'FULL_OTC' },
    { ingredient: 'Meclizine', country: 'IN', brand: 'Vertin', status: 'PHARMACY_ONLY' },
    { ingredient: 'Meclizine', country: 'GB', brand: 'Stugeron', status: 'PHARMACY_ONLY' },
    { ingredient: 'Meclizine', country: 'AU', brand: 'Travacalm', status: 'FULL_OTC' },
    // Famotidine
    { ingredient: 'Famotidine', country: 'US', brand: 'Pepcid', status: 'FULL_OTC' },
    { ingredient: 'Famotidine', country: 'IN', brand: 'Famocid', status: 'PHARMACY_ONLY' },
    { ingredient: 'Famotidine', country: 'JP', brand: 'Gaster', status: 'PHARMACY_ONLY' },
    { ingredient: 'Famotidine', country: 'GB', brand: 'Pepcid', status: 'FULL_OTC' },
    { ingredient: 'Famotidine', country: 'AU', brand: 'Pepcidine', status: 'FULL_OTC' },
    { ingredient: 'Famotidine', country: 'MX', brand: 'Pepcid', status: 'FULL_OTC' },
    // Ketoconazole
    { ingredient: 'Ketoconazole', country: 'US', brand: 'Nizoral', status: 'FULL_OTC' },
    { ingredient: 'Ketoconazole', country: 'IN', brand: 'Nizral', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ketoconazole', country: 'GB', brand: 'Nizoral', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ketoconazole', country: 'AU', brand: 'Nizoral', status: 'PHARMACY_ONLY' },
    { ingredient: 'Ketoconazole', country: 'BR', brand: 'Nizoral', status: 'PHARMACY_ONLY' },
    // Mupirocin
    { ingredient: 'Mupirocin', country: 'US', brand: 'Bactroban', status: 'PRESCRIPTION_ONLY' },
    { ingredient: 'Mupirocin', country: 'IN', brand: 'T-Bact', status: 'PRESCRIPTION_ONLY' },
    { ingredient: 'Mupirocin', country: 'GB', brand: 'Bactroban', status: 'PRESCRIPTION_ONLY' },
    { ingredient: 'Mupirocin', country: 'AU', brand: 'Bactroban', status: 'PRESCRIPTION_ONLY' },
    // Fluticasone
    { ingredient: 'Fluticasone', country: 'US', brand: 'Flonase', status: 'FULL_OTC' },
    { ingredient: 'Fluticasone', country: 'GB', brand: 'Flixonase', status: 'FULL_OTC' },
    { ingredient: 'Fluticasone', country: 'IN', brand: 'Flomist', status: 'PHARMACY_ONLY' },
    { ingredient: 'Fluticasone', country: 'AU', brand: 'Flixonase', status: 'FULL_OTC' },
    { ingredient: 'Fluticasone', country: 'DE', brand: 'Avamys', status: 'PHARMACY_ONLY' },
    { ingredient: 'Fluticasone', country: 'MX', brand: 'Flonase', status: 'FULL_OTC' }
];
async function main() {
    const countries = await Promise.all([
        prisma.country.upsert({ where: { code: 'US' }, update: {}, create: { name: 'United States', code: 'US' } }),
        prisma.country.upsert({ where: { code: 'IN' }, update: {}, create: { name: 'India', code: 'IN' } }),
        prisma.country.upsert({ where: { code: 'JP' }, update: {}, create: { name: 'Japan', code: 'JP' } }),
        prisma.country.upsert({ where: { code: 'GB' }, update: {}, create: { name: 'United Kingdom', code: 'GB' } }),
        prisma.country.upsert({ where: { code: 'DE' }, update: {}, create: { name: 'Germany', code: 'DE' } }),
        prisma.country.upsert({ where: { code: 'FR' }, update: {}, create: { name: 'France', code: 'FR' } }),
        prisma.country.upsert({ where: { code: 'BR' }, update: {}, create: { name: 'Brazil', code: 'BR' } }),
        prisma.country.upsert({ where: { code: 'IT' }, update: {}, create: { name: 'Italy', code: 'IT' } }),
        prisma.country.upsert({ where: { code: 'ES' }, update: {}, create: { name: 'Spain', code: 'ES' } }),
        prisma.country.upsert({ where: { code: 'MX' }, update: {}, create: { name: 'Mexico', code: 'MX' } }),
        prisma.country.upsert({ where: { code: 'AU' }, update: {}, create: { name: 'Australia', code: 'AU' } }),
        prisma.country.upsert({ where: { code: 'TH' }, update: {}, create: { name: 'Thailand', code: 'TH' } }),
        prisma.country.upsert({ where: { code: 'VN' }, update: {}, create: { name: 'Vietnam', code: 'VN' } }),
        prisma.country.upsert({ where: { code: 'KR' }, update: {}, create: { name: 'South Korea', code: 'KR' } }),
        prisma.country.upsert({ where: { code: 'SE' }, update: {}, create: { name: 'Sweden', code: 'SE' } }),
        prisma.country.upsert({ where: { code: 'AE' }, update: {}, create: { name: 'UAE', code: 'AE' } }),
        prisma.country.upsert({ where: { code: 'ZA' }, update: {}, create: { name: 'South Africa', code: 'ZA' } }),
        prisma.country.upsert({ where: { code: 'NG' }, update: {}, create: { name: 'Nigeria', code: 'NG' } }),
        prisma.country.upsert({ where: { code: 'TR' }, update: {}, create: { name: 'Turkey', code: 'TR' } }),
        prisma.country.upsert({ where: { code: 'EG' }, update: {}, create: { name: 'Egypt', code: 'EG' } })
    ]);
    const ingredientNames = [
        'Paracetamol', 'Ibuprofen', 'Loperamide', 'Cetirizine', 'Omeprazole',
        'Simethicone', 'Bismuth Subsalicylate', 'Oral Rehydration Salts', 'Hydrocortisone', 'Clotrimazole',
        'Diclofenac', 'Naproxen', 'Diphenhydramine', 'Loratadine', 'Famotidine',
        'Ranitidine', 'Dimenhydrinate', 'Meclizine', 'Mupirocin', 'Bacitracin',
        'Neomycin', 'Polymyxin B', 'Tolnaftate', 'Ketoconazole', 'Guaifenesin',
        'Dextromethorphan', 'Pseudoephedrine', 'Phenylephrine', 'Salbutamol', 'Fluticasone'
    ];
    const ingredients = await Promise.all(ingredientNames.map((name) => prisma.activeIngredient.upsert({
        where: { name },
        update: {},
        create: { name }
    })));
    const countryByCode = new Map(countries.map((c) => [c.code, c]));
    const ingredientByName = new Map(ingredients.map((i) => [i.name, i]));
    let seeded = 0;
    for (const map of mappings) {
        const ingredient = ingredientByName.get(map.ingredient);
        const country = countryByCode.get(map.country);
        if (!ingredient || !country) {
            console.warn(`Skipping mapping: ${map.ingredient} / ${map.country}`);
            continue;
        }
        const brand = await prisma.brand.upsert({
            where: { name_countryId: { name: map.brand, countryId: country.id } },
            update: {},
            create: {
                name: map.brand,
                countryId: country.id,
                activeIngredientId: ingredient.id,
                otcStatus: map.status,
                doseRule: map.doseRule ?? 'STANDARD_OTC'
            }
        });
        await prisma.medicationEdge.upsert({
            where: {
                activeIngredientId_countryId_brandId: {
                    activeIngredientId: ingredient.id,
                    countryId: country.id,
                    brandId: brand.id
                }
            },
            update: {},
            create: {
                activeIngredientId: ingredient.id,
                countryId: country.id,
                brandId: brand.id
            }
        });
        seeded += 1;
    }
    console.log(`Seeded ${seeded} medication mappings across ${countries.length} countries`);
}
main()
    .then(async () => {
    await prisma.$disconnect();
    console.log('Seed complete');
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=seed.js.map