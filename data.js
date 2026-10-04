/* McRoberts PAC — 2025–26 financial report data.
   Every figure carries a status and a source so the report can show what is
   confirmed and what still waits on documents.
   status: "confirmed" = matches the PAC ledger and the treasurer reports (labels live in meta.statuses)
           "reported"  = stated in a treasurer report in the minutes; bank statement not yet seen
           "derived"   = worked out from confirmed or reported figures
           "pending"   = not yet known; waiting on documents
   mode:   "draft" shows the draft strip, the documents still awaited and the source chips;
           "public" hides them in index.html (data.js still ships them).
   This file is public. People are named only after they agree (preparedBy and reviewer take an
   optional name), and review notes and questions for the treasurers stay in the private
   working record, never here. */
window.REPORT = (function () {
// Each fact is written once here; text and derived figures below refer to these.
const GRANT = 20700, WISH_APPROVED = 19428.36, DAG_SUPPORT = 2040, SCHOLAR_SET_ASIDE = 1500,
      CHEQUE_2425 = 18453.12, GAMING_BALANCE_MAY13 = 25597.82;
const RATES = { gamingPerStudent: 20, dagPerGrad: 10, scholarship: 500 };
const usd = (v, dp) => "$" + v.toLocaleString("en-CA", { minimumFractionDigits: dp == null ? (v % 1 ? 2 : 0) : dp, maximumFractionDigits: dp == null ? (v % 1 ? 2 : 0) : dp });
const R = {
  rates: RATES,
  meta: {
    mode: "draft",
    title: "2025–26 Financial Report",
    org: "Hugh McRoberts Secondary Parent Advisory Council (PAC)",
    orgShort: "McRoberts PAC",
    period: "School year September 1, 2025 – August 31, 2026",
    coverage: {
      ledgerThrough: "January 2026",
      reportsThrough: "May 13, 2026",
      bankStatements: "not yet received",
      // short: one sentence for the draft banner; long: for the cover note and footer
      short: "PAC ledger through January 2026; treasurer reports through May 13, 2026; bank statements not yet received.",
      long: "PAC ledger through January 2026; treasurer reports through May 13, 2026; bank statements not yet received. May to August 2026 will be added from the bank statements."
    },
    // status key: label shown on chips, mark printed in the PDF, one-line description for tooltips and the PDF key
    statuses: [
      { key: "confirmed", label: "In PAC ledger", mark: "", description: "Matches the PAC ledger and the treasurer reports" },
      { key: "reported", label: "Reported", mark: "R", description: "Reported at a PAC meeting, not yet checked against a bank statement" },
      { key: "derived", label: "Worked out", mark: "W", description: "Worked out from other figures" },
      { key: "pending", label: "Pending", mark: "", description: "Waiting for documents" }
    ],
    basis: "Not audited · Money is counted when it entered or left the bank · Canadian dollars",
    preparedBy: { role: "2026–27 Co-Treasurer" },
    reviewer: { role: "Treasurer" },
    edition: "Draft for review · September 2026"
  },

  headline: [
    { key: "grant", value: GRANT, label: "BC Community Gaming Grant received", note: `${usd(RATES.gamingPerStudent)} for each student counted by the Province`, status: "confirmed",
      source: "PAC ledger, October 2025 deposit; grant letter not yet seen" },
    { key: "wishlist", value: WISH_APPROVED, label: "Approved (to be confirmed) for the teachers' wish list", note: "From 16 requests by 10 school groups", status: "reported",
      source: "Motion at the Nov 12, 2025 meeting; the minutes record the motion but not the vote, and later treasurer reports treat it as approved" },
    { key: "dag", value: DAG_SUPPORT, label: "Promised to Dry After Grad", note: `About ${usd(RATES.dagPerGrad)} for each graduate`, status: "reported",
      source: "Treasurer report, Apr 8, 2026 minutes" },
    { key: "scholar", value: SCHOLAR_SET_ASIDE, label: "Set aside for Grade 12 scholarships", note: `${SCHOLAR_SET_ASIDE / RATES.scholarship} awards of ${usd(RATES.scholarship)}`, status: "reported",
      source: "Treasurer reports, Apr 8 and May 13, 2026 minutes; payment not yet seen" }
  ],

  timeline: [
    { date: "2025-09-10", when: "Sep 10", label: "New executive elected", detail: "First meeting of the year", kind: "meeting" },
    { date: "2025-10-15", when: "Oct 15–20", label: "Samosa pre-order sale", detail: "17 family orders · 129 pieces", kind: "fundraiser" },
    { date: "2025-10-31", when: "October", label: "Gaming grant arrived", detail: `${usd(GRANT)} from the Province of BC`, kind: "money" },
    { date: "2025-11-12", when: "Nov 12", label: "Wish list approved (to be confirmed)", detail: `${usd(WISH_APPROVED)} for school groups' requests`, kind: "decision" },
    { date: "2025-12-15", when: "December", label: "Purdys chocolate sale", detail: "$516.74 raised", kind: "fundraiser" },
    { date: "2026-02-11", when: "Feb 11", label: "Dry After Grad support", detail: "About $10 per graduate agreed", kind: "decision" },
    { date: "2026-02-20", when: "Feb 20–Mar 2", label: "Bubble tea sale", detail: "39 orders · 45 drinks", kind: "fundraiser" },
    { date: "2026-06-22", when: "Jun 22–23", label: "Grad dinner & Dry After Grad", detail: "210 graduates reported in February", kind: "event" },
    { date: "2026-06-24", when: "Jun 24", label: "Staff thank-you breakfast", detail: "Planned for 76 staff", kind: "event" }
  ],

  accounts: {
    gaming: {
      name: "Gaming account",
      funds: "The BC Community Gaming Grant: $20 for each student, plus bank interest",
      pays: "The wish list, clubs, teams, trips and events outside regular classes",
      rules: "Provincial rules: spend within 24 months, a yearly report to the Province, two signatures on every cheque",
      opening: { value: 22954.79, date: "2025-08-31", status: "confirmed", source: "PAC ledger; Sep 10, 2025 treasurer report" },
      carriedCheque: { value: CHEQUE_2425, number: "0098", written: "2025-07-14", writtenLabel: "July 14, 2025", status: "reported", source: "PAC ledger shows it in the September statement; the Oct 8 minutes said it was not yet withdrawn. September and October statements needed." },
      grant: { value: GRANT, status: "confirmed", source: "PAC ledger, October 2025; grant letter not yet seen" },
      interestToJan: { value: 243.84, status: "confirmed", source: "PAC ledger, September to January" },
      interestFebApr: { value: 152.31, status: "derived", source: "Change in the balances reported at meetings, Jan 31 to May 13; no other activity was reported" },
      closing: { value: null, date: "2026-08-31", status: "pending", source: "August 2026 bank statement" },
      monthly: [
        { m: "2025-08", label: "Aug", v: 22954.79, status: "confirmed" },
        { m: "2025-09", label: "Sep", badge: 1, v: 4534.56, status: "reported", note: `The 2024–25 wish-list cheque was cashed (−${usd(CHEQUE_2425)})` },
        { m: "2025-10", label: "Oct", badge: 2, v: 25289.02, status: "confirmed", note: `BC gaming grant +${usd(GRANT)}` },
        { m: "2025-11", label: "Nov", v: 25339.94, status: "confirmed" },
        { m: "2025-12", label: "Dec", v: 25392.67, status: "confirmed" },
        { m: "2026-01", label: "Jan", v: 25445.51, status: "confirmed" },
        { m: "2026-02", label: "Feb", v: null, status: "pending" },
        { m: "2026-03", label: "Mar", v: 25546.38, status: "reported", note: "Reported at the April 8 meeting" },
        { m: "2026-04", label: "Apr", v: GAMING_BALANCE_MAY13, status: "reported", note: "Reported at the May 13 meeting" },
        { m: "2026-05", label: "May", v: null, status: "pending" },
        { m: "2026-06", label: "Jun", v: null, status: "pending" },
        { m: "2026-07", label: "Jul", v: null, status: "pending" },
        { m: "2026-08", label: "Aug", v: null, status: "pending" }
      ],
      commitments: {
        balanceLabel: "Balance reported at the May 13, 2026 meeting, covering April",
        asOf: "Reported at the May 13, 2026 meeting, covering April",
        balance: GAMING_BALANCE_MAY13,
        balanceStatus: "reported",
        parts: [
          { label: "2025–26 wish list", value: null, status: "reported" },
          { label: "Dry After Grad", value: null, status: "reported" },
          { label: "Not yet promised", value: null, status: "derived" }
        ],
        note: "This assumes Dry After Grad is paid from the gaming account, as in 2024–25. The May 13 report said some late wish-list requests could still be added.",
        cashed: "The bank statements will show if the 2025–26 wish-list and Dry After Grad cheques were cashed before August 31, 2026."
      }
    },
    operating: {
      name: "Family fund",
      funds: "Fundraisers and donations from McRoberts families",
      pays: "Scholarships, staff thank-yous and other things the grant cannot pay for",
      rules: "No provincial rules. How it is spent is shared at PAC meetings",
      snapshots: [
        { date: "2025-09-10", label: "Sep", v: 1854.00, status: "reported" },
        { date: "2025-10-08", label: "Oct", v: 1854.00, status: "reported" },
        { date: "2025-11-12", label: "Nov", v: 2120.00, status: "reported" },
        { date: "2026-01-14", label: "Jan", v: 1931.00, status: "reported" },
        { date: "2026-02-11", label: "Feb", v: 1931.00, status: "reported" },
        { date: "2026-04-08", label: "Apr", v: 2897.74, status: "reported" },
        { date: "2026-05-13", label: "May", v: 2722.74, status: "reported" }
      ],
      closing: { value: null, date: "2026-08-31", status: "pending", source: "August 2026 bank statement" },
      raised: [
        { name: "Samosa pre-order", when: "October 2025", value: 74.50, volume: "17 orders · 129 pieces", status: "reported" },
        { name: "Purdys chocolates", when: "December 2025", value: 516.74, volume: "Holiday order", status: "reported" },
        { name: "Bubble tea", when: "Feb 20 – Mar 2, 2026", value: 269.00, volume: "39 orders · 45 drinks", status: "reported" },
        { name: "Donation", when: "Reported April 8, 2026", value: 250.00, volume: "From a parent", status: "reported" }
      ],
      raisedThrough: "through April 8, 2026",
      raisedReportedTotal: { value: 1216.14, status: "reported", source: "Treasurer report, Apr 8, 2026 minutes" },
      spent: [
        { name: "Grade 12 scholarships (set aside)", value: SCHOLAR_SET_ASIDE, detail: `${SCHOLAR_SET_ASIDE / RATES.scholarship} × ${usd(RATES.scholarship)} · payment to be confirmed from the bank statement`, status: "reported" },
        { name: "Staff thank-you breakfast", value: null, detail: "June 24 · planned for 76 staff · catered", status: "pending" },
        { name: "Smaller costs during the year", value: null, detail: "The balance dropped a little in January and May; the bank statements will show why", status: "pending" }
      ]
    },
    dag: {
      name: "Dry After Grad account",
      funds: "Dry After Grad committee fundraising, plus PAC support",
      pays: "A safe, alcohol-free celebration for graduates",
      rules: "Run by the Dry After Grad committee",
      grads: 210,
      committed: { value: DAG_SUPPORT, status: "reported", source: "Treasurer report, Apr 8, 2026 minutes" },
      eventDate: "June 22–23, 2026",
      balance: { value: null, status: "pending", source: "Dry After Grad account statements" }
    }
  },

  wishlist: {
    approved: { value: WISH_APPROVED, date: "2025-11-12", status: "reported" },
    requested: { value: 21428.36, status: "reported", source: "Wish list 2025–26 first-round draft; the rows add to $21,428.36 (the sheet's typed total says $21,430.36); the final list is not yet in Drive" },
    requests: 16,
    groups: 10,
    note: "These are the requests as sent in. Some were funded in part or not at all. Final amounts will come from the school's request to be paid back.",
    departments: [
      { name: "Athletics & PE", requested: 6548.36, items: ["Dance instructors for about 600 Grade 8–10 students", "Volleyball carts", "Senior volleyball uniforms", "Floor hockey goalie pads", "Guest speakers on healthy relationships"] },
      { name: "Grade 8", requested: 4000.00, items: ["Grade 8 activity days for 200+ students"] },
      { name: "Math contests", requested: 2000.00, items: ["Contest fees for 80+ students"] },
      { name: "Dry After Grad", requested: 2000.00, items: ["Bus between the grad venue and school (not needed: parents carpooled)"] },
      { name: "Music", requested: 1570.00, items: ["Portable power station for outdoor performances", "Pop-up tents (not funded in the first round)", "Laptop for music composition (not funded in the first round)"] },
      { name: "First Responders", requested: 1500.00, items: ["Emergency medical team equipment fee"] },
      { name: "Social Studies", requested: 1500.00, items: ["Grade 10 Victoria trip, keeping cost at $50 a student"] },
      { name: "Library", requested: 1160.00, items: ["A reading challenge (Reading Riot): books, prizes and a celebration lunch"] },
      { name: "Student Council", requested: 1000.00, items: ["Spring dance and year-end food trucks"] },
      { name: "Debate Club", requested: 150.00, items: ["Tournament registration"] }
    ]
  },

  history: {
    note: "Grant years run February to January. Figures are from the PAC's records. Spending counts cheques in the year they were cashed.",
    years: [
      { y: "to Jan 2020", s: "’20", grant: 18300, spent: 23291.99 },
      { y: "to Jan 2021", s: "’21", grant: 17860, spent: 19305.95 },
      { y: "to Jan 2022", s: "’22", grant: 0, spent: 3400, note: "The grant arrived after the year ended" },
      { y: "to Jan 2023", s: "’23", grant: 36420, spent: 33163.41, note: "Two grants arrived in this year" },
      { y: "to Jan 2024", s: "’24", grant: 19380, spent: 14086.53 },
      { y: "to Jan 2025", s: "’25", grant: 20600, spent: 29390.35 },
      { y: "to Jan 2026", s: "’26", grant: 20700, spent: 20637.66, note: "Paid the 2024–25 wish list and the June 2025 Dry After Grad cheque" }
    ],
    totals: { grant: 133260, spent: 143275.89 }
  },

  stewardship: {
    meetings: ["2025-09-10", "2025-10-08", "2025-11-12", "2026-01-14", "2026-02-11", "2026-04-08", "2026-05-13"],
    controls: [
      "Gaming money is kept in its own bank account, as the Province requires",
      "Three accounts at Coast Capital Savings: gaming, family fund and Dry After Grad",
      "Rule: every cheque needs two signatures",
      "A treasurer's report at every PAC meeting"
    ],
    nextYear: [
      { title: "A budget in the fall", body: "A 2026–27 budget for the gaming account and the family fund, shared at a PAC meeting." },
      { title: "A monthly check", body: "Each account is checked against its bank statement every month." },
      { title: "A yearly report", body: "A report like this one after each school year." },
      { title: "New cheque signers", body: "The people who can sign cheques are updated for each new executive." }
    ]
  },

  appeal: {
    headline: "Help us fund 2026–27",
    why: [
      { text: "School budgets are tight this year, so extras like scholarships and staff thank-yous depend more on families." },
      { lead: "The gaming grant cannot pay for scholarships or for thanking our staff.", text: "Only family fundraising and donations can." },
      { text: "In 2025–26 we aimed for five scholarships, and families made three possible. With your help, we can reach five." }
    ],
    goalsLabel: "Proposed goals for 2026–27 (to be confirmed at a PAC meeting)",
    goals: [
      { label: "Grade 12 scholarships", target: 2500, detail: "5 × $500" },
      { label: "Staff thank-yous", target: 1000, detail: "Thank-you events for staff during the year" }
    ],
    impact: [
      { amount: 50, text: "One tenth of a $500 scholarship" },
      { amount: 100, text: "One fifth of a $500 scholarship" },
      { amount: 250, text: "Half of one Grade 12 scholarship" },
      { amount: 500, text: "One full scholarship for a graduating student" }
    ],
    howToGive: {
      method: "Interac e-Transfer",
      to: "hughmcrobertspac@gmail.com",
      message: "PAC donation",
      status: "pending"
    },
    otherWays: [
      "Come to a PAC meeting. Everyone is welcome. The dates are on the school calendar.",
      "Volunteer for a fundraiser or the staff thank-you breakfast.",
      "Order from our next fundraiser."
    ]
  },

  pendingDocs: [
    "Bank statements for all three accounts, September 2025 to August 2026",
    "The cheque list and the cheques not yet cashed on August 31, 2026 (the 2025–26 wish list and Dry After Grad)",
    "The final wish list with the amount paid for each item, and the school's request to be paid back",
    "The grant letter for the " + usd(GRANT) + " and the gaming report to the Province for the year ending January 31, 2026",
    "Deposits and costs for each sale (samosa, Purdys, bubble tea), to match the total in the April 8 minutes",
    "The cost of the June 24 staff breakfast and proof of the three scholarship payments",
    "Dry After Grad account statements, the committee's income and costs, and which account paid the " + usd(DAG_SUPPORT),
    "The recorded result of the November 12 wish-list motion",
    "Confirmation of the donation address and whether the PAC can give tax receipts"
  ]
};

// Figures worked out from the facts above: the split of the May 13 balance.
(function derive(R) {
  const c = R.accounts.gaming.commitments, round2 = n => Math.round(n * 100) / 100;
  c.parts[0].value = R.wishlist.approved.value;
  c.parts[1].value = R.accounts.dag.committed.value;
  c.parts[2].value = round2(c.balance - c.parts[0].value - c.parts[1].value);
})(R);

return R;
})();
