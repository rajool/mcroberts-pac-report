/* McRoberts PAC — 2025–26 financial report data.
   Every figure carries a status and a source so the report can show what is
   confirmed and what still waits on documents.
   status: "confirmed" = matches the PAC's bank record (Coast Capital online banking, read Oct 9, 2026; labels live in meta.statuses)
           "reported"  = reported at a PAC meeting or in the PAC's records; not shown on the bank record
           "derived"   = worked out from confirmed or reported figures
           "pending"   = not yet known; waiting on documents
   mode:   "draft" shows the draft strip, the documents still awaited and the source chips;
           "public" hides them in index.html (data.js still ships them).
   This file is public. People are named only after they agree (preparedBy and reviewer take an
   optional name), and review notes and questions for the treasurers stay in the private
   working record, never here. */
window.REPORT = (function () {
// Each fact is written once here; text and derived figures below refer to these.
const GRANT = 20700, WISH_APPROVED = 19428.36, WISH_PAID = 22929, DAG_SUPPORT = 2040,
      SCHOLAR_PAID = 1250, BREAKFAST_GIFTS = 435,
      CHEQUE_2425 = 18453.12, GAMING_CLOSING = 2865.41, FAMILY_IN = 1732.74;
// After the year this report covers; not part of the period's figures.
const GRANT_NEXT = 20780;     // Bank record, gaming account: deposit on Oct 1, 2026
const GAMING_OCT9 = 23651.18; // Bank record, gaming account: balance on Oct 9, 2026
const DAG_SOURCE = "Treasurer report, Apr 8, 2026 minutes. No separate payment to the Dry After Grad committee shows in either PAC account between September 2025 and August 2026.";
const WJ = "\u2060"; // word joiner: keeps "2026–27" on one line
const RATES = { gamingPerStudent: 20, dagPerGrad: 10, scholarship: 500 };
const round2 = n => Math.round(n * 100) / 100;
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
      bankRead: "October 9, 2026",
      // short: one sentence for the draft banner; long: for the cover note and footer
      short: "Both PAC accounts, the gaming account and the family fund, are checked against the PAC's bank record for the whole year.",
      long: "Gaming account and family fund: every transaction from September 1, 2025 to August 31, 2026, from the PAC's online banking, read October 9, 2026. The Dry After Grad committee keeps its own account, which is not part of this report."
    },
    // status key: label shown on chips, mark printed in the PDF, one-line description for tooltips and the PDF key
    statuses: [
      { key: "confirmed", label: "Bank record", mark: "", description: "Matches the PAC's bank record (online banking, read October 9, 2026)" },
      { key: "reported", label: "Reported", mark: "R", description: "Reported at a PAC meeting; not shown on the bank record" },
      { key: "derived", label: "Worked out", mark: "W", description: "Worked out from other figures" },
      { key: "pending", label: "Pending", mark: "", description: "Waiting for documents" }
    ],
    basis: "Not audited · Money is counted when it entered or left the bank · Canadian dollars",
    preparedBy: { role: "2026–27 Co-Treasurer" },
    reviewer: { role: "Treasurer" },
    edition: "Draft for review · October 2026"
  },

  headline: [
    { key: "grant", value: GRANT, label: "BC Community Gaming Grant received", note: `${usd(RATES.gamingPerStudent)} for each student counted by the Province`, status: "confirmed",
      source: "Bank record, gaming account: deposit on Oct 3, 2025; grant letter not yet seen" },
    { key: "wishlist", value: WISH_PAID, label: "Paid to the school for the wish list and the Dry After Grad bus", note: "One cheque, written July 20, 2026, cashed August 22, 2026", status: "confirmed",
      source: "Bank record, gaming account: cheque 0099 to the school for the 2025–26 wish list and the Dry After Grad bus, written Jul 20, 2026, cashed Aug 22, 2026" },
    { key: "dag", value: DAG_SUPPORT, label: "Promised to Dry After Grad", note: `About ${usd(RATES.dagPerGrad)} for each graduate`, status: "reported",
      source: DAG_SOURCE },
    { key: "scholar", value: SCHOLAR_PAID, label: "Paid for Grade 12 scholarships", note: "One cheque to the school, June 2026", status: "confirmed",
      source: "Bank record, family fund: cheque 0188 to the school for Grade 12 scholarships, written Jun 1, 2026, cashed Jun 10, 2026; the number of awards is to be confirmed" }
  ],

  timeline: [
    { date: "2025-09-10", when: "Sep 10", label: "New executive elected", detail: "First meeting of the year", kind: "meeting" },
    { date: "2025-10-03", when: "Oct 3", label: "Gaming grant arrived", detail: `${usd(GRANT)} from the Province of BC`, kind: "money" },
    { date: "2025-10-15", when: "Oct 15–21", label: "Samosa pre-order sale", detail: "17 family orders · 129 pieces", kind: "fundraiser" },
    { date: "2025-11-12", when: "Nov 12", label: "Wish list approved", detail: `${usd(WISH_APPROVED)} for school groups' requests · vote to be confirmed`, kind: "decision" },
    { date: "2025-12-15", when: "December", label: "Purdys chocolate sale", detail: "$516.74, deposited February 12", kind: "fundraiser" },
    { date: "2026-02-11", when: "Feb 11", label: "Dry After Grad support", detail: `About ${usd(RATES.dagPerGrad)} per graduate agreed`, kind: "decision" },
    { date: "2026-02-20", when: "Feb 20–Mar 5", label: "Bubble tea sale", detail: "39 orders · 45 drinks", kind: "fundraiser" },
    { date: "2026-05-19", when: "May 19–28", label: "Staff breakfast donations", detail: `${usd(BREAKFAST_GIFTS)} from 15 families`, kind: "fundraiser" },
    { date: "2026-06-01", when: "Jun 1", label: "Scholarships", detail: `${usd(SCHOLAR_PAID)} paid to the school`, kind: "fundraiser" },
    { date: "2026-06-22", when: "Jun 22–23", label: "Grad dinner & Dry After Grad", detail: "210 graduates reported in February", kind: "event" },
    { date: "2026-06-24", when: "Jun 24", label: "Staff thank-you breakfast", detail: "Planned for 76 staff", kind: "event" },
    { date: "2026-07-20", when: "Jul 20", label: "Wish list paid", detail: `${usd(WISH_PAID)} cheque to the school (cashed Aug 22)`, kind: "money" }
  ],

  accounts: {
    gaming: {
      name: "Gaming account",
      funds: "The BC Community Gaming Grant: $20 for each student, plus bank interest",
      pays: "The wish list, clubs, teams, trips and events outside regular classes",
      rules: "Provincial rules: spend within 24 months, a yearly report to the Province, two signatures on every cheque",
      opening: { value: 22954.79, date: "2025-08-31", status: "confirmed", source: "Bank record, gaming account, Aug 31, 2025; also the PAC ledger and the Sep 10, 2025 treasurer report" },
      carriedCheque: { value: CHEQUE_2425, number: "0098", written: "2025-07-14", writtenLabel: "July 14, 2025", cleared: "2025-09-16", clearedLabel: "September 16, 2025", status: "confirmed", source: "Bank record, gaming account: cheque 0098 to the school for the 2024–25 wish list, cashed Sep 16, 2025" },
      grant: { value: GRANT, date: "2025-10-03", dateLabel: "October 3, 2025", status: "confirmed", source: "Bank record, gaming account: deposit on Oct 3, 2025; grant letter not yet seen" },
      // Interest in three parts (the statement rows); derive() checks they add to the year's interest.
      interestSepJan: { value: 243.84, label: "September to January", status: "confirmed", source: "Bank record: interest paid Sep 2025 to Jan 2026" },
      interestFebApr: { value: 152.31, label: "February to April", status: "confirmed", source: "Bank record: interest paid Feb, Mar, Apr" },
      interestMayAug: { value: 196.59, label: "May to August", status: "confirmed", source: "Bank record: interest paid May to Aug 2026" },
      interest: { value: 592.74, status: "confirmed", source: "Bank record, gaming account: monthly interest, Sep 2025 to Aug 2026" },
      wishCheque: { value: WISH_PAID, number: "0099", written: "2026-07-20", writtenLabel: "July 20, 2026", cleared: "2026-08-22", clearedLabel: "August 22, 2026", status: "confirmed", source: "Bank record, gaming account: cheque 0099 to the school for the 2025–26 wish list and the Dry After Grad bus, cashed Aug 22, 2026" },
      closing: { value: GAMING_CLOSING, date: "2026-08-31", status: "confirmed", source: "Bank record, gaming account, Aug 31, 2026" },
      monthly: [
        { m: "2025-08", label: "Aug", v: 22954.79, status: "confirmed" },
        { m: "2025-09", label: "Sep", badge: 1, v: 4534.56, status: "confirmed", note: `The 2024–25 wish-list cheque was cashed (−${usd(CHEQUE_2425)})` },
        { m: "2025-10", label: "Oct", badge: 2, v: 25289.02, status: "confirmed", note: `BC gaming grant +${usd(GRANT, 2)} (October 3)` },
        { m: "2025-11", label: "Nov", v: 25339.94, status: "confirmed" },
        { m: "2025-12", label: "Dec", v: 25392.67, status: "confirmed" },
        { m: "2026-01", label: "Jan", v: 25445.51, status: "confirmed" },
        { m: "2026-02", label: "Feb", v: 25493.33, status: "confirmed" },
        { m: "2026-03", label: "Mar", v: 25546.38, status: "confirmed" },
        { m: "2026-04", label: "Apr", v: 25597.82, status: "confirmed" },
        { m: "2026-05", label: "May", v: 25651.08, status: "confirmed" },
        { m: "2026-06", label: "Jun", v: 25702.73, status: "confirmed" },
        { m: "2026-07", label: "Jul", v: 25756.21, status: "confirmed" },
        { m: "2026-08", label: "Aug", badge: 3, v: GAMING_CLOSING, status: "confirmed", note: `The 2025–26 wish-list cheque was cashed (−${usd(WISH_PAID, 2)}); it also covers the Dry After Grad bus` }
      ],
      // Where the year's gaming money went: the money the account had (opening balance, grant, interest)
      // split into the two wish-list cheques and what was left on Aug 31, 2026. derive() fills the values.
      commitments: {
        asOf: "Opening balance, grant and interest",
        balance: null,
        parts: [
          { label: "2024–25 wish list, paid in September", value: null, status: "confirmed" },
          { label: "2025–26 wish list and a Dry After Grad bus, paid in August", value: null, status: "confirmed" },
          { label: "Left on August 31, 2026", value: null, status: "confirmed" }
        ],
        note: "The school buys the items and the PAC pays the school back with one cheque near the end of the school year. The August cheque also covers a Dry After Grad bus; the school's request to be paid back will show the amount for each item.",
        cashed: `After the year this report covers, the 2026${WJ}–${WJ}27 grant of ${usd(GRANT_NEXT, 2)} arrived on October 1, 2026; the balance on October 9, 2026 was ${usd(GAMING_OCT9, 2)}.`
      }
    },
    operating: {
      name: "Family fund",
      funds: "Fundraisers and donations from McRoberts families",
      pays: "Scholarships, staff thank-yous and other things the grant cannot pay for",
      rules: "No provincial rules. How it is spent is shared at PAC meetings",
      // Month-end balances from the bank record.
      snapshotNote: "Every balance the treasurer reported at the 2025–26 meetings matches the bank record.",
      snapshots: [
        { date: "2025-08-31", label: "Aug", v: 1854.00, status: "confirmed" },
        { date: "2025-09-30", label: "Sep", v: 1854.00, status: "confirmed" },
        { date: "2025-10-31", label: "Oct", v: 2120.00, status: "confirmed", note: "Samosa pre-order +$266.00" },
        { date: "2025-11-30", label: "Nov", v: 2120.00, status: "confirmed" },
        { date: "2025-12-31", label: "Dec", v: 1931.00, status: "confirmed", note: "A cheque for $189.00 was cashed" },
        { date: "2026-01-31", label: "Jan", v: 1931.00, status: "confirmed" },
        { date: "2026-02-28", label: "Feb", v: 2687.74, status: "confirmed", note: "Purdys deposit +$516.74 · bubble tea orders" },
        { date: "2026-03-31", label: "Mar", v: 2897.74, status: "confirmed", note: "Bubble tea orders · a deposit of $120.00" },
        { date: "2026-04-30", label: "Apr", v: 2722.74, status: "confirmed", note: "A cheque paying back a volunteer −$175.00" },
        { date: "2026-05-31", label: "May", v: 3157.74, status: "confirmed", note: "Donations for the staff breakfast +$435.00" },
        { date: "2026-06-30", label: "Jun", v: 1922.74, status: "confirmed", note: "Scholarships −$1,250.00 · an e-Transfer +$15.00" },
        { date: "2026-07-31", label: "Jul", v: 1172.74, status: "confirmed", note: "A cheque paying back a volunteer −$800.00 · a deposit of $50.00" },
        { date: "2026-08-31", label: "Aug", v: 1172.74, status: "confirmed" }
      ],
      opening: { value: 1854.00, date: "2025-08-31", status: "confirmed", source: "Bank record, family fund, Aug 31, 2025" },
      closing: { value: 1172.74, date: "2026-08-31", status: "confirmed", source: "Bank record, family fund, Aug 31, 2026" },
      // Money in, as the bank shows it: what came into the bank, before any costs.
      raised: [
        { name: "Samosa pre-order", when: "October 15–21, 2025", value: 266.00, volume: "17 e-Transfers · before costs", status: "confirmed" },
        { name: "Purdys chocolates", when: "December 2025 sale", value: 516.74, volume: "Deposited February 12, 2026", status: "confirmed" },
        { name: "Bubble tea", when: "February 20 – March 5, 2026", value: 330.00, volume: "39 e-Transfers · before costs", status: "confirmed" },
        { name: "Staff breakfast donations", when: "May 19–28, 2026", value: BREAKFAST_GIFTS, volume: "15 family donations for the June 24 breakfast", status: "confirmed" }
      ],
      otherIn: { value: 185.00, label: "from two other deposits (March 12 and July 14) and one other e\u2011Transfer (June 7) with no description", status: "confirmed", source: "Bank record, family fund: deposits of $120.00 (Mar 12, 2026) and $50.00 (Jul 14, 2026) and an e-Transfer of $15.00 (Jun 7, 2026), with no description" },
      salesNote: "Sale amounts are what came into the bank; what each sale cost is not on the bank record yet.",
      moneyIn: { value: FAMILY_IN, status: "confirmed", source: "Bank record, family fund: every deposit from Sep 1, 2025 to Aug 31, 2026" },
      raisedThrough: "in 2025–26",
      spent: [
        { name: "Scholarships 2026", value: SCHOLAR_PAID, detail: "Cheque to the school, June 2026 · number of awards to be confirmed", status: "confirmed" },
        { name: "Paid back to volunteers", value: 975, detail: "Two cheques, April and July 2026 · what they paid for is to be confirmed", status: "confirmed" },
        { name: "Other cheque", value: 189, detail: "Cashed in December 2025 · what it paid for is to be confirmed", status: "confirmed" },
        { name: "Staff thank-you breakfast", value: null, detail: `June 24 · families gave ${usd(BREAKFAST_GIFTS)} · what it cost and how it was paid are still to be confirmed`, status: "pending" }
      ]
    }
  },

  // Dry After Grad: what the PAC promised. A parent committee runs it and keeps its own bank account,
  // which is not a PAC account and not part of this report. The PAC's support comes from the gaming account.
  dag: {
    grads: 210,
    committed: { value: DAG_SUPPORT, status: "reported", source: DAG_SOURCE },
    eventDate: `June 22${WJ}–${WJ}23, 2026`,
    note: "A parent committee runs Dry After Grad and keeps its own bank account. No separate payment to the committee shows in either PAC account between September 2025 and August 2026."
  },

  wishlist: {
    approved: { value: WISH_APPROVED, date: "2025-11-12", status: "reported", source: "Motion at the Nov 12, 2025 meeting; the minutes record the motion but not the vote" },
    requested: { value: 21428.36, status: "reported", source: "Wish list 2025–26 first-round requests as sent in (the sum of its rows); the final list is still to come" },
    requests: 16,
    groups: 10,
    note: `These are the requests as sent in. The PAC paid the school ${usd(WISH_PAID, 2)} for the list and the Dry After Grad bus; the amount for each item will come from the school's request to be paid back.`,
    departments: [
      { name: "Athletics & PE", requested: 6548.36, items: [`Dance instructors for about 600 Grade 8${WJ}–${WJ}10 students`, "Volleyball carts", "Senior volleyball uniforms", "Floor hockey goalie pads", "Guest speakers on healthy relationships"] },
      { name: "Grade 8", requested: 4000.00, items: ["Grade 8 activity days for 200+ students"] },
      { name: "Math contests", requested: 2000.00, items: ["Contest fees for 80+ students"] },
      { name: "Dry After Grad", requested: 2000.00, items: ["Bus between the grad venue and school"] },
      { name: "Music", requested: 1570.00, items: ["Portable power station for outdoor performances", "Pop-up tents (not funded in the first round)", "Laptop for music composition (not funded in the first round)"] },
      { name: "First Responders", requested: 1500.00, items: ["Emergency medical team equipment fee"] },
      { name: "Social Studies", requested: 1500.00, items: ["Grade 10 Victoria trip, keeping cost at $50 a student"] },
      { name: "Library", requested: 1160.00, items: ["A reading challenge (Reading Riot): books, prizes and a celebration lunch"] },
      { name: "Student Council", requested: 1000.00, items: ["Spring dance and year-end food trucks"] },
      { name: "Debate Club", requested: 150.00, items: ["Tournament registration"] }
    ]
  },

  history: {
    note: "Grant years run February to January. Each year matches the PAC's bank record. Spending counts cheques in the year they were cashed.",
    // Why spending since Feb 2019 is higher than the grants (bank record, Feb 2019 – Jan 2026: interest and two linked accounts closed into this one).
    whyMore: "Spending was higher than the grants because the account also earned interest and received money when older linked accounts were closed into it.",
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
      "Two accounts at Coast Capital Savings: the gaming account and the family fund",
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
      { text: `In 2025–26 families made ${usd(SCHOLAR_PAID)} in scholarships possible. With your help, we can fund five ${usd(RATES.scholarship)} scholarships in 2026${WJ}–${WJ}27.` }
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
    `The school's request to be paid back for the August cheque, showing whether it includes the ${usd(DAG_SUPPORT, 2)} the PAC promised to Dry After Grad`,
    `The final wish list with the amount paid for each item (the PAC paid the school ${usd(WISH_PAID, 2)})`,
    "What three cheques from the family fund paid for (December 2025, April and July 2026), with receipts",
    `How many Grade 12 scholarships the ${usd(SCHOLAR_PAID, 2)} paid for`,
    "The cost of each sale and of the June 24 staff breakfast",
    "Cheques written but not cashed on August 31, 2026",
    `The grant letter for the ${usd(GRANT, 2)} and the gaming report to the Province for the year ending January 31, 2026`,
    "The recorded result of the November 12 wish-list motion",
    "Confirmation of the donation address and whether the PAC can give tax receipts"
  ]
};

// Figures worked out from the facts above: where the year's gaming money went, and a check that both accounts add up.
(function derive(R) {
  const G = R.accounts.gaming, c = G.commitments, O = R.accounts.operating;
  c.balance = round2(G.opening.value + G.grant.value + G.interest.value);
  c.parts[0].value = G.carriedCheque.value;
  c.parts[1].value = G.wishCheque.value;
  c.parts[2].value = G.closing.value;
  const gap = round2(c.balance - c.parts.reduce((a, p) => a + p.value, 0));
  const intGap = round2(G.interestSepJan.value + G.interestFebApr.value + G.interestMayAug.value - G.interest.value);
  const stmtGap = round2(G.opening.value - G.carriedCheque.value + G.grant.value + G.interestSepJan.value + G.interestFebApr.value + G.interestMayAug.value - G.wishCheque.value - G.closing.value);
  const inFam = round2(O.raised.reduce((a, r) => a + r.value, 0) + O.otherIn.value);
  const outFam = round2(O.spent.reduce((a, s) => a + (s.value || 0), 0));
  const famGap = round2(O.opening.value + O.moneyIn.value - outFam - O.closing.value);
  if (gap || intGap || stmtGap || famGap || inFam !== O.moneyIn.value) console.error("data.js: the accounts do not add up", { gap, intGap, stmtGap, famGap, inFam });
})(R);

return R;
})();
