import express from 'express';
import dotenv from 'dotenv';
import { prisma } from '@/lib/db';
import { createTravelHealthSession } from '@/lib/session/service';
import { findLocalEquivalents } from '@/lib/medications/repository';
import { findNearbyProviders } from '@/lib/providers/geoapify';
import { recordOutcome, OutcomeSchema } from '@/lib/outcomes/service';
import { buildInterpreterContext } from '@/lib/interpreter/builder';
dotenv.config();
const app = express();
app.use(express.json());
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.post('/sessions', async (req, res) => {
    try {
        const session = await createTravelHealthSession(req.body);
        res.status(201).json(session);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to create travel health session.' });
    }
});
app.get('/medications', async (req, res) => {
    try {
        const ingredient = String(req.query.ingredient || '');
        const countryCode = String(req.query.countryCode || '');
        if (!ingredient || !countryCode) {
            res.status(400).json({ error: 'ingredient and countryCode are required.' });
            return;
        }
        const results = await findLocalEquivalents(ingredient, countryCode);
        res.json(results);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch medication equivalents.' });
    }
});
app.get('/providers', async (req, res) => {
    try {
        const lat = Number(req.query.lat);
        const lng = Number(req.query.lng);
        const type = String(req.query.type || '');
        const radius = Number(req.query.radius || 5000);
        if (Number.isNaN(lat) || Number.isNaN(lng) || !type) {
            res.status(400).json({ error: 'lat, lng, and type are required.' });
            return;
        }
        const providerType = type.toUpperCase();
        if (!['PHARMACY', 'CLINIC', 'HOSPITAL'].includes(providerType)) {
            res.status(400).json({ error: 'type must be PHARMACY, CLINIC, or HOSPITAL.' });
            return;
        }
        const providers = await findNearbyProviders(lat, lng, providerType, radius);
        res.json(providers);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to fetch nearby providers.' });
    }
});
app.get('/sessions/:id/interpreter', async (req, res) => {
    try {
        const session = await prisma.travelHealthSession.findUnique({
            where: { id: req.params.id }
        });
        if (!session) {
            res.status(404).json({ error: 'Session not found.' });
            return;
        }
        const context = buildInterpreterContext(session);
        res.json({ interpreterContext: context });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to build interpreter context.' });
    }
});
app.post('/sessions/:id/outcome', async (req, res) => {
    try {
        const validated = OutcomeSchema.parse(req.body);
        const updated = await recordOutcome(req.params.id, validated);
        res.json(updated);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Invalid outcome payload.' });
    }
});
const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
    console.log(`Healthcare GLM backend listening on port ${port}`);
});
//# sourceMappingURL=index.js.map