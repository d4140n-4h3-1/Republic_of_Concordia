# A Constitution for Concordia (Fictional Draft)

![Flag](constitution/1c39deb5-4efc-4ec9-a588-920318794957.png)

This is a fictional constitution: the founding document of Concordia, an imagined nation, modeled on the Constitution of the United States and written as worldbuilding. It is a draft in progress. It is not legal advice and it does not propose real legislation.

The repository has five parts:

- **The Constitution**: a preamble and ten Articles, one file each.
- **Bills**: ordinary laws drafted under the Constitution to test how its rules work in practice.
- **Education**: a set of education acts, modeled on Singapore's system, that carry out the right to education in Article I, Section 2.
- **Economy**: a set of economic acts, drawing on the best policies of the Nordic countries.
- **Cases**: decisions of Concordia's courts, applying the Constitution to concrete disputes.

---

## Website

The repository is also a website: [d4140n-4h3-1.github.io/Republic_of_Concordia](https://d4140n-4h3-1.github.io/Republic_of_Concordia/). It reads the documents straight from this repository, so it is always current. Every citation links to the provision it names and shows a preview on hover, and the whole text is searchable. Typing a citation such as `IV.10.d` in the search box jumps straight to it.

The site's list of documents comes from the tables in this README. Adding a row to a table adds the document to the site. To preview the site locally, run `python3 -m http.server` from the repository root and open `http://localhost:8000`.

## The Articles

The Constitution opens with a short [Preamble](constitution/preamble.md) stating its purposes.

| Article | Title | What it covers |
|---|---|---|
| [I](constitution/article_1.md) | Fundamental Rights and Liberties | Shared definitions; speech, press, language, movement, association and unions, religion, freedom from slavery and servitude; no lockdowns within the country, limited closure of national borders, international flights and non-essential services in a disease emergency, and strict limits on individual quarantine; education; bodily autonomy; equal protection and the strict test for any exception to a right |
| [II](constitution/article_2.md) | Custody and Justice | Due process; just compensation for taken property; every category of custody, with common requirements and no back door to punishment; arrest and detention; rights of the accused; treatment in custody; search and privacy; sentencing, and a narrow definition of treason; rights after conviction; judicial remedies |
| [III](constitution/article_3.md) | Democratic Government and Elections | Voting rights; the independent Election Authority; a ban on gerrymandering; terms, term limits and age limits; disqualification for insurrection, found by a court; election integrity; campaign finance and foreign interference |
| [IV](constitution/article_4.md) | The Legislative Power | Congress (House and Senate); discipline and expulsion of members; legislative procedure; investigations and subpoenas; veto; ethics; impeachment; appropriations, with no government shutdowns; the National Wealth Fund |
| [V](constitution/article_5.md) | The Executive Power | The President and Vice President; national popular vote with ranked-choice counting; succession; presidential inability and how a dispute over it is settled; appointments; pardons; emergency powers, their end, and no route around them; armed forces and treaties |
| [VI](constitution/article_6.md) | The Judicial Power | Structure of the courts; the elected Supreme Court, one judge per circuit; the nine judicial circuits; Supreme Court jurisdiction; substitute judges and certification of amendments; judicial review; enforcement of court orders; judicial independence, ethics, discipline without retaliation, and incapacity |
| [VII](constitution/article_7.md) | Citizenship and the Union | Citizenship; states, territories and the capital district; a census every ten years; reserved powers; a single-subject rule for every state, territorial and local law; relations among the jurisdictions |
| [VIII](constitution/article_8.md) | Supremacy, Ratification, and Transition | Supremacy of the Constitution; ratification by referendum; transition to the first government, with inherited laws reviewed for hidden provisions |
| [IX](constitution/article_9.md) | Amendment of This Constitution | Proposal by Congress; national referendum; rights that no ordinary amendment may reduce; court review of amendments, before or after the vote, at the request of any voter; a narrow path for correcting drafting errors; a once-a-generation review convention; a locked Supreme Court, term limits, emergency limits and election independence |
| [X](constitution/article_10.md) | The Right to Keep and Bear Arms | Why it is last; the right and its conditions (a license to purchase, prohibited persons, places, storage, transfers); no general disarmament or registry; a limited right of resistance as the last resort |

## Key Features

- **Rights come first.** A right can be restricted only if the Constitution expressly allows it or if the restriction directly prevents harm to another person's fundamental rights. Even then, the restriction must pass a strict test: narrowly tailored, strictly necessary, proportional, and the least restrictive means (I.4.c, II.10.d).
- **Broad equal protection.** Protected statuses include race, sex, sexual orientation, gender identity, disability, age, religion, non-belief, and socioeconomic status (I.4.a).
- **Rights that cannot be amended away.** An ordinary amendment may not narrow any right in Articles I–III and X, directly or indirectly (IX.3.a). Only two narrow paths exist. A correction amendment may fix a single drafting error (IX.3.d). A Constitutional Review Convention, held at most once every twenty-five years, may revise the conditions, exceptions and details that apply a right (IX.3.f). Neither path may repeal a right, weaken the strict test for exceptions, or breach the structural safeguards of IX.3.e, and a convention may not touch the permanent core at all: the core statement of each right, the protected statuses, the rights of the accused and of people in custody, and the right to vote and the independence of elections. Every amendment on either path needs certification by seven of the nine Supreme Court judges and a supermajority in a national referendum.
- **An elected Supreme Court.** Nine judges, elected in nonpartisan, staggered elections. Each serves a single 18-year term (VI.2).
- **Direct presidential election.** The President is chosen by national popular vote with ranked-choice counting. There is no Electoral College (V.2).
- **Term and age limits.** Most elected offices have four-year terms and a limit of two terms. Candidates must be between 30 and 64 years old when elected; Supreme Court candidates must be between 35 and 46 (III.5, III.6, VI.2).
- **Elections run independently.** An independent Election Authority runs elections, neutral commissions draw districts, and campaign finance and foreign-interference rules are written into the Constitution itself (III.3, III.4, III.10).
- **No lockdowns within the country.** A disease emergency cannot justify a curfew or a stay-at-home order for the public. Only a specific infected or exposed person may be isolated or quarantined, at home where practicable, with government support, only while they can spread the disease, and with a court review within 48 hours. In a declared disease emergency, the national borders and international flights may be closed for up to thirty days at a time. Citizens may always return home, essential traffic continues, and travel within Concordia stays open. Non-essential businesses and services may also be closed or limited for up to thirty days at a time. Essential services, worship, the press and peaceful assembly stay open, schools close only with free remote instruction, and closed businesses and their workers are compensated (I.1.g).
- **No government shutdowns.** If Congress has not passed a budget when the fiscal year begins, last year's funding continues automatically until it does. Debt payments and court judgments are always paid (IV.10.e).
- **A settled process for presidential inability.** Declarations must be signed and made public, and a disputed one goes to Congress within 48 hours. The President returns unless two-thirds of each House confirm the inability within 21 days (V.3.d).
- **No fixed economic system.** The Constitution protects property, unions and a single national market, but leaves the choice between markets and public ownership to the voters. Congress may leave an industry to the market or run it publicly, and may set taxes at flat or progressive rates. A business taken into public ownership must be paid its market value, in money or in market-rate public bonds (IV.1.d, II.1.c).
- **No hidden provisions.** Every law, federal, state, territorial or local, must keep to one subject named in its title. A provision that doesn't relate to that subject has no effect until it is passed on its own. Laws inherited at the founding are reviewed too, with two years to re-enact anything unrelated (IV.5.c, VII.3.e, VIII.3.e).
- **Detailed custody rules.** Article II defines every type of government custody and limits each one, including use of force, solitary confinement, and independent oversight. Every category, including any created by law, must meet the same checklist: a lawful purpose, necessity, a limited duration, judicial review, and a remedy. Civil custody cannot be used as a back door to punishment (II.2.q).

## Bills

Bills live in [`constitution/bills/`](constitution/bills/). Each one is written as an act of Congress under this Constitution and cites the provisions it relies on.

| File | Act | Status |
|---|---|---|
| [b-01](constitution/bills/b-01.md) | Unlawful Possession With Intent to Profit Act | Draft |
| [b-02](constitution/bills/b-02.md) | Conversion Practices Prohibition Act | Draft |
| [b-03](constitution/bills/b-03.md) | Use of Force Act | Draft |
| [b-04](constitution/bills/b-04.md) | Custodial Oversight Act | Draft |
| [b-05](constitution/bills/b-05.md) | Personal Cultivation Licensing Act | Draft |
| [b-06](constitution/bills/b-06.md) | Bias-Motivated Crimes Act | Draft |
| [b-07](constitution/bills/b-07.md) | Defensive Use of Unlawful Weapons Act | Draft |
| [b-08](constitution/bills/b-08.md) | Firearm Definition Act | Draft |
| [b-09](constitution/bills/b-09.md) | Emergency Powers Act | Draft |
| [b-10](constitution/bills/b-10.md) | Judicial Enforcement Service Act | Draft |
| [b-11](constitution/bills/b-11.md) | Firearm Licensing Act | Draft |
| [b-12](constitution/bills/b-12.md) | Public Participation Protection Act | Draft |
| [b-13](constitution/bills/b-13.md) | Equal Treatment Act | Draft |
| [b-14](constitution/bills/b-14.md) | Freedom from Servitude Act | Draft |
| [b-15](constitution/bills/b-15.md) | Fair Competition Act | Draft |
| [b-16](constitution/bills/b-16.md) | Safe Driving Act | Draft |
| [b-17](constitution/bills/b-17.md) | Freedom of Information Act | Draft |
| [b-18](constitution/bills/b-18.md) | Single Subject Act | Draft |

## Education

The education acts live in [`constitution/education/`](constitution/education/). They are modeled on Singapore's system: high standards, a mastery approach to mathematics, bilingual education, a highly selected and well-paid teaching profession, subject-by-subject placement, and many routes to further study. They adapt it to Concordia's Constitution: free education at every level (free through secondary school under I.2.a, and through university by statute), language rights (I.1.f), equal protection (I.4.a), and schools run by the states (VII.3.a), with federal standards tied to federal funding.

| File | Act | What it covers |
|---|---|---|
| [e-01](constitution/education/e-01.md) | National Education System Act | Stages from early childhood to university; three post-secondary pathways; no dead ends; private and home education |
| [e-02](constitution/education/e-02.md) | Curriculum and Languages Act | An independent Curriculum Council; core curriculum; mastery mathematics; bilingual education; limits on hours and homework |
| [e-03](constitution/education/e-03.md) | Teaching Profession Act | Selective entry; paid training; professional pay; 100 hours of development a year; three career tracks; class sizes |
| [e-04](constitution/education/e-04.md) | Assessment and Pathways Act | Two national assessments; subject-based banding; no rankings; no exclusion by test; free extra help instead of paid tutoring |
| [e-05](constitution/education/e-05.md) | Learning Funding Act | Equal base funding plus funding for need; student Learning Accounts; Lifelong Learning Accounts; support for families in need |
| [e-06](constitution/education/e-06.md) | Constitutional Literacy Act | Teaching the full Constitution and how to use it; information literacy; strict neutrality; a free plain-language guide for everyone; training for officials; plain statements of authority and the right to refuse a search; no misstating rights |

## Economy

The economic acts live in [`constitution/economy/`](constitution/economy/). They combine the strongest policies of the Nordic countries: a market economy with sectoral collective bargaining and workers on company boards (Sweden, Norway), flexicurity (Denmark), universal health care and generous parental leave (Sweden), Housing First (Finland), a national wealth fund with a strict spending rule (Norway), pensions that balance themselves automatically (Sweden), and a broad, transparent tax system with an independent fiscal council. They rest on the freedom of association in I.1.h, the taxing and spending powers, and the commerce power. They are ordinary laws: the Constitution itself sets no economic system (IV.1.d), and a later Congress could replace them with market-based policies.

| File | Act | What it covers |
|---|---|---|
| [n-01](constitution/economy/n-01.md) | Work and Collective Bargaining Act | Sectoral bargaining; a National Bargaining Council; minimum wage where no agreement applies; the right to strike; workers on boards; works councils; a Labor Court; equal pay |
| [n-02](constitution/economy/n-02.md) | Flexicurity Act | Flexible hiring and dismissal with notice and severance; unemployment insurance at 90% of wages for two years; active help to train and find work |
| [n-03](constitution/economy/n-03.md) | Universal Health Care Act | Tax-funded care for every resident; free dental care to age 25; an annual ceiling on fees; regional delivery; guaranteed waiting times |
| [n-04](constitution/economy/n-04.md) | Family Support Act | 480 days of paid parental leave, 90 reserved for each parent; a right to childcare from age one with capped fees; a universal child benefit |
| [n-05](constitution/economy/n-05.md) | Pensions and National Wealth Fund Act | A guaranteed pension plus earnings-related and funded pensions; automatic balancing; a National Wealth Fund with a 3% spending rule and ethical guidelines |
| [n-06](constitution/economy/n-06.md) | Fiscal Responsibility and Taxation Act | A broad tax base; progressive tax on work and a flat tax on capital; public tax records for officials; pre-filled returns; a surplus target and debt anchor; an independent Fiscal Council; competition and open trade |
| [n-07](constitution/economy/n-07.md) | Housing Act | Housing First; nonprofit housing open to all; a revolving National Building Fund; housing allowances; tenant protections; planning for supply |

## Cases

The cases live in [`constitution/cases/`](constitution/cases/). Each one is a decision of a Concordian court on a concrete dispute, with the facts, the questions, the opinion of the court, and any separate opinions. They show how the Constitution's rules apply in practice, and where judges may disagree about them.

| File | Case | Question |
|---|---|---|
| [c-01](constitution/cases/c-01.md) | Okafor v. City of Westbrook | Whether a city may forbid a solid privacy fence around the yard of a home (II.6.a, I.4.c) |

## Reading the Text

- **Citations** use the form `Article.Section.subsection`. For example, `I.4.c` means Article I, Section 4, subsection c.
- **Section 0.** Where an Article has a Section 0, it holds framing material for the whole Article: shared definitions in Article I, and the reason for its placement in Article X.
- **Checking citations.** Run `python3 scripts/check_refs.py` after any edit. It confirms that every citation in the Articles, the bills, the education and economic acts, the cases, and this README points to a section or subsection that exists.
- **Draft notes.** A *Draft note* at the top of some Articles gives context for the drafting.
- **Open decisions.** A `[DECIDE: ...]` line in a bill or Article marks a policy choice that hasn't been made yet. None are open at present.
- **Placeholder names.** Some names are placeholders. For example, "the Founding Convention" in Article VIII can be renamed to fit the story.

## Status

This is a work in progress. Articles and bills are revised often, and some bill provisions have been moved into the Constitution itself (for example, the election fraud and campaign finance rules now in Article III, Sections 7 and 10).
