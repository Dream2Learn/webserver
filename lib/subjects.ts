export class Category {
	constructor(
		readonly label: string,
		readonly color: {
			readonly main: string,
			readonly dark: string,
			readonly accent: string,
		},
	) {}
}

class Subject {
	constructor(
		readonly internalId: string,
		readonly label: string,
	) {}
}

// TODO separate labels from internal ids
const subjectCategories: ReadonlyMap<Category, string[]> = new Map([
	[new Category("English", {
		main: "hsl(217 65% 54%)",
		dark: "hsl(237 54% 39%)",
		accent: "hsla(240 100% 80% / 0.5)",
	}), [
		"Essay Proofreading",
		"English K–8",
		"English 9–12",
		"World Literature",
		"AP Language and Composition",
		"AP Literature and Composition",
	]],
	[new Category("Social Studies", {
		main: "hsl(160 98% 30%)",
		dark: "hsl(118 94% 20%)",
		accent: "hsla(70 41% 70% / 0.5)",
	}), [
		"World History",
		"AP World History",
		"US History",
		"AP US History",
		"US Government",
		"AP US Government",
		"Psychology",
		"AP Psychology",
	]],
	[new Category("Mathematics", {
		main: "hsl(337 81% 53%)",
		dark: "hsl(337 81% 33%)",
		accent: "hsla(20 61% 80% / 0.5)",
	}), [
		"Math K–7",
		"Prealgebra",
		"Algebra",
		"Precalculus",
		"AP Calculus AB",
		"AP Calculus BC",
		"Statistics",
		"AP Statistics",
	]],
	[new Category("Science", {
		main: "hsl(31 100% 45%)",
		dark: "hsl(21 100% 25%)",
		accent: "hsla(350 61% 80% / 0.5)",
	}), [
		"Biology",
		"AP Biology",
		"Environmental Science",
		"Chemistry",
		"AP Chemistry",
		"Physics Level 1",
		"Physics Level 2",
		"Physics C: Mechanics",
		"Physics C: Electricity and Magnetism",
	]],
	[new Category("Language", {
		main: "hsl(192 96% 45%)",
		dark: "hsl(210 70% 33%)",
		accent: "hsla(200 61% 70% / 0.5)",
	}), [
		"Spanish",
		"French",
		"Latin",
	]],
	[new Category("In-person lessons", {
		main: "hsl(180 17% 71%)",
		dark: "hsl(192 29% 48%)",
		accent: "hsl(310 78% 82% / 0.5)",
	}), [
		"Ad-air",
		"Eye Level Berwyn",
		"Berwyn Music Conservatory",
	]],
]);
export default subjectCategories;

export const categoriesBySubject = new Map<string, Category>();
for (const [category, subjects] of subjectCategories) {
	for(const subject of subjects) {
		categoriesBySubject.set(subject, category);
	}
}