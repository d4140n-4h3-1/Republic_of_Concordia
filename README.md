# A Constitution for Concordia (Fictional Draft)

![Flag](constitution/1c39deb5-4efc-4ec9-a588-920318794957.png)

This is a fictional constitution: the founding document of Concordia, an imagined nation, modeled on the Constitution of the United States and written as worldbuilding. It is a draft in progress. It is not legal advice and it does not propose real legislation.

The repository has two parts:

- **The Constitution**: a preamble and ten Articles, one file each.
- **Bills**: ordinary laws drafted under the Constitution to test how its rules work in practice.

---

## The Articles

The Constitution opens with a short [Preamble](constitution/preamble.md) stating its purposes.

| Article | Title | What it covers |
|---|---|---|
| [I](constitution/article_1.md) | Fundamental Rights and Liberties | Shared definitions; speech, press, religion, freedom from slavery and servitude; education; bodily autonomy; equal protection and the strict test for any exception to a right |
| [II](constitution/article_2.md) | Custody and Justice | Due process; every category of custody; arrest and detention; rights of the accused; treatment in custody; search and privacy; sentencing; rights after conviction; judicial remedies |
| [III](constitution/article_3.md) | Democratic Government and Elections | Voting rights; the independent Election Authority; a ban on gerrymandering; terms, term limits and age limits; election integrity; campaign finance and foreign interference |
| [IV](constitution/article_4.md) | The Legislative Power | Congress (House and Senate); legislative procedure; investigations and subpoenas; veto; ethics; impeachment; appropriations |
| [V](constitution/article_5.md) | The Executive Power | The President and Vice President; national popular vote with ranked-choice counting; succession; appointments; pardons; emergency powers; armed forces and treaties |
| [VI](constitution/article_6.md) | The Judicial Power | Structure of the courts; the elected Supreme Court, one judge per circuit; the nine judicial circuits; Supreme Court jurisdiction; judicial review; enforcement of court orders; judicial independence, ethics and discipline |
| [VII](constitution/article_7.md) | Citizenship and the Union | Citizenship; states, territories and the capital district; reserved powers; relations among the jurisdictions |
| [VIII](constitution/article_8.md) | Supremacy, Ratification, and Transition | Supremacy of the Constitution; ratification by referendum; transition to the first government |
| [IX](constitution/article_9.md) | Amendment of This Constitution | Proposal by Congress; national referendum; rights that no amendment may reduce; a narrow path for correcting drafting errors; a locked Supreme Court, term limits, emergency limits and election independence |
| [X](constitution/article_10.md) | The Right to Keep and Bear Arms | Why it is last; the right and its conditions (a license to purchase, prohibited persons, places, storage, transfers); no general disarmament or registry; a limited right of resistance as the last resort |

## Key Features

- **Rights come first.** A right can be restricted only if the Constitution expressly allows it or if the restriction protects another person's fundamental rights. Even then, the restriction must pass a strict test: narrowly tailored, strictly necessary, proportional, and the least restrictive means (I.4.c, II.10.d).
- **Broad equal protection.** Protected statuses include race, sex, sexual orientation, gender identity, disability, age, religion, non-belief, and socioeconomic status (I.4.a).
- **Rights that cannot be amended away.** No amendment may narrow the rights in Articles I–III, either directly or indirectly (IX.3.a).
- **An elected Supreme Court.** Nine judges, elected in nonpartisan, staggered elections. Each serves a single 18-year term (VI.2).
- **Direct presidential election.** The President is chosen by national popular vote with ranked-choice counting. There is no Electoral College (V.2).
- **Term and age limits.** Most elected offices have four-year terms and a limit of two terms. Candidates must be between 30 and 64 years old when elected; Supreme Court candidates must be between 35 and 46 (III.5, III.6, VI.2).
- **Elections run independently.** An independent Election Authority runs elections, neutral commissions draw districts, and campaign finance and foreign-interference rules are written into the Constitution itself (III.3, III.4, III.10).
- **Detailed custody rules.** Article II defines every type of government custody and limits each one, including use of force, solitary confinement, and independent oversight.

## Bills

Bills live in [`constitution/bills/`](constitution/bills/). Each one is written as an act of Congress under this Constitution and cites the provisions it relies on.

| File | Act | Status |
|---|---|---|
| [b-01](constitution/bills/b-01.md) | Unlawful Possession With Intent to Profit Act | Draft: 1 open decision |
| [b-02](constitution/bills/b-02.md) | Conversion Practices Prohibition Act | Draft: 1 open decision |
| [b-03](constitution/bills/b-03.md) | Use of Force Act | Draft |
| [b-04](constitution/bills/b-04.md) | Custodial Oversight Act | Draft |
| [b-05](constitution/bills/b-05.md) | Personal Cultivation Licensing Act | Draft: 2 open decisions |
| [b-06](constitution/bills/b-06.md) | Bias-Motivated Crimes Act | Draft |
| [b-07](constitution/bills/b-07.md) | Defensive Use of Unlawful Weapons Act | Draft |
| [b-08](constitution/bills/b-08.md) | Firearm Definition Act | Draft: 1 open decision |
| [b-09](constitution/bills/b-09.md) | Emergency Powers Act | Draft |

## Reading the Text

- **Citations** use the form `Article.Section.subsection`. For example, `I.4.c` means Article I, Section 4, subsection c.
- **Section 0.** Where an Article has a Section 0, it holds framing material for the whole Article: shared definitions in Article I, and the reason for its placement in Article X.
- **Checking citations.** Run `python3 scripts/check_refs.py` after any edit. It confirms that every citation in the Articles, the bills, and this README points to a section or subsection that exists.
- **Draft notes.** A *Draft note* at the top of some Articles gives context for the drafting.
- **Open decisions.** A `[DECIDE: ...]` line in a bill marks a policy choice that hasn't been made yet. Penalties are usually left open this way.
- **Placeholder names.** Some names are placeholders. For example, "the Founding Convention" in Article VIII can be renamed to fit the story.

## Status

This is a work in progress. Articles and bills are revised often, and some bill provisions have been moved into the Constitution itself (for example, the election fraud and campaign finance rules now in Article III, Sections 7 and 10).
