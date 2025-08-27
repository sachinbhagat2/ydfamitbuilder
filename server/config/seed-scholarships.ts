import { mockDatabase, pool } from './database';

export async function createDefaultScholarships() {
  try {
    const defaults = [
      {
        title: 'Merit Excellence Scholarship',
        description: 'Supporting academically excellent students',
        amount: '50000',
        currency: 'INR',
        eligibilityCriteria: ['CGPA above 8.5', 'Income < 5L'],
        requiredDocuments: ['Transcripts', 'Income certificate'],
        applicationDeadline: new Date(Date.now() + 1000*60*60*24*60),
        selectionDeadline: new Date(Date.now() + 1000*60*60*24*75),
        maxApplications: 1000,
        status: 'active',
        tags: ['Academic','Merit']
      },
      {
        title: 'Rural Girls Education Grant',
        description: 'Empowering rural girls through education',
        amount: '35000',
        currency: 'INR',
        eligibilityCriteria: ['Female candidates','Rural residence'],
        requiredDocuments: ['Income certificate','Residence proof'],
        applicationDeadline: new Date(Date.now() + 1000*60*60*24*45),
        selectionDeadline: null,
        maxApplications: 800,
        status: 'active',
        tags: ['Gender','Rural']
      },
      {
        title: 'Technical Innovation Fund',
        description: 'Funding innovative tech projects',
        amount: '75000',
        currency: 'INR',
        eligibilityCriteria: ['Engineering students','Project proposal'],
        requiredDocuments: ['Proposal','Transcripts'],
        applicationDeadline: new Date(Date.now() + 1000*60*60*24*90),
        selectionDeadline: new Date(Date.now() + 1000*60*60*24*120),
        maxApplications: 500,
        status: 'active',
        tags: ['Technology','Innovation']
      }
    ];

    if (!pool) return { success: true } as const;

    // Check and insert if missing
    for (const s of defaults) {
      const [rows]: any = await pool.execute('SELECT id FROM scholarships WHERE title = ? LIMIT 1', [s.title]);
      if (!rows[0]) {
        await createScholarship(s, 2);
      }
    }
    return { success: true } as const;
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Unknown error' } as const;
  }
}
export default createDefaultScholarships;
