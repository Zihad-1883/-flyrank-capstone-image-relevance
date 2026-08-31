/**
 * Top-1 Precision Evaluation Script
 * 
 * Runs matching engine on hand-labeled evaluation dataset (10 posts mapped to ground truth animal categories)
 * and calculates overall Top-1 Precision score percentage.
 * 
 * Run with: npm run eval
 */

import { createPost } from '../../src/modules/posts/posts.service.js';
import { suggestImagesForPost } from '../../src/modules/matching/matching.service.js';
import { pool } from '../../src/db/pool.js';

interface EvalCase {
    id: number;
    title: string;
    body: string;
    expectedSubject: string;
}

const EVAL_SET: EvalCase[] = [
    {
        id: 1,
        title: 'Red Fox in Autumn Woodlands',
        body: 'Red foxes are versatile predators known for their reddish coat and bushy tail in forest environments.',
        expectedSubject: 'fox',
    },
    {
        id: 2,
        title: 'Vixen Resting in Forest Canopy',
        body: 'A quiet vixen curled up asleep under dense tree roots and fallen leaves.',
        expectedSubject: 'fox',
    },
    {
        id: 3,
        title: 'The Silent Pack: Grey Wolf Behaviour',
        body: 'Grey wolves hunt in coordinated pack formations across tundra and snowy mountain regions.',
        expectedSubject: 'wolf',
    },
    {
        id: 4,
        title: 'Alpha Wolf Howling at Dusk',
        body: 'A majestic wolf howling into the cold winter air surrounded by pine trees.',
        expectedSubject: 'wolf',
    },
    {
        id: 5,
        title: 'Golden Retriever Playing Outdoors',
        body: 'A friendly golden retriever dog chasing tennis balls in a grassy park setting.',
        expectedSubject: 'dog',
    },
    {
        id: 6,
        title: 'Loyal Canine Companion in the Yard',
        body: 'A domestic dog sitting alertly on green lawn grass looking attentively at its owner.',
        expectedSubject: 'dog',
    },
    {
        id: 7,
        title: 'Grizzly Bear Fishing for Salmon',
        body: 'A massive brown grizzly bear standing in river rapids catching migrating wild salmon.',
        expectedSubject: 'bear',
    },
    {
        id: 8,
        title: 'Black Bear Foraging in National Parks',
        body: 'A wild black bear roaming through woodland terrain searching for berries and vegetation.',
        expectedSubject: 'bear',
    },
    {
        id: 9,
        title: 'Red Deer Stag in Forest Clearing',
        body: 'A magnificent red deer stag with large antlers grazing peacefully in a meadow.',
        expectedSubject: 'deer',
    },
    {
        id: 10,
        title: 'Spotted Fawn Resting in Meadow',
        body: 'A young spotted fawn lying camouflage in tall woodland grass.',
        expectedSubject: 'deer',
    },
];

async function runEvaluation() {
    console.log('================================================================');
    console.log('         EVALUATION RUNNER: TOP-1 PRECISION METRIC');
    console.log('================================================================\n');

    let correctMatches = 0;
    const totalCases = EVAL_SET.length;

    console.log(`Evaluating ${totalCases} hand-labeled benchmark post test cases...\n`);

    for (const testCase of EVAL_SET) {
        const postId = await createPost(testCase.title, testCase.body);
        const candidates = await suggestImagesForPost(postId, 5);

        const top1 = candidates[0];

        let isCorrect = false;
        let details = '';

        if (!top1) {
            details = 'NO CANDIDATES RETURNED';
        } else if (top1.status === 'REJECTED') {
            details = `REJECTED top candidate (#${top1.image_id}): ${top1.rejection_reason}`;
        } else {
            const topSubject = (top1.subject ?? '').toLowerCase();
            const topCaption = (top1.caption ?? '').toLowerCase();
            const exp = testCase.expectedSubject.toLowerCase();

            if (topSubject.includes(exp) || topCaption.includes(exp)) {
                isCorrect = true;
                correctMatches++;
                details = `MATCHED Correct Subject: '${top1.subject}' (Score: ${top1.similarity_score.toFixed(3)})`;
            } else {
                details = `MISMATCH Expected '${exp}' but got '${top1.subject}'`;
            }
        }

        console.log(`Test #${testCase.id}: "${testCase.title}"`);
        console.log(`  Expected: ${testCase.expectedSubject.toUpperCase()}`);
        console.log(`  Result:   ${isCorrect ? '✅ PASS' : '❌ FAIL'} | ${details}\n`);
    }

    const precision = (correctMatches / totalCases) * 100;

    console.log('================================================================');
    console.log(` EVALUATION COMPLETE: Top-1 Precision = ${precision.toFixed(1)}% (${correctMatches}/${totalCases})`);
    console.log('================================================================');

    await pool.end();
}

runEvaluation().catch((err) => {
    console.error('Evaluation failed:', err);
    process.exit(1);
});
