const fs = require('fs');

module.exports = function(inputFile) {
  const foods = parseFile(inputFile)

  const ingredients = Object.fromEntries(foods.map(l => l.ingredients).flat().map(i => [i, new Set()]));
  const allergens = Object.fromEntries(foods.map(l => l.allergens).flat().map(a => [a, new Set()]));

  Object.keys(allergens).forEach((allergen) => {
    const presentIn = foods.filter(f => f.allergens.includes(allergen));
    const possibleIngredients = [...new Set(presentIn.map(f => f.ingredients).flat())];

    possibleIngredients.forEach((ingredient) => {
      if (presentIn.every(food => food.ingredients.includes(ingredient))) {
        ingredients[ingredient].add(allergen);
        allergens[allergen].add(ingredient);
      }
    });
  });

  const solved = () => Object.values(allergens).every(a => a.size == 1);

  while (!solved()) {
    Object.keys(allergens).forEach((key) => {
      const allergen = allergens[key];

      if (allergen.size == 1) {
        const ingredient = allergen.values().next().value;
        Object.keys(allergens).filter(k => k != key).map(k => allergens[k]).forEach(a => a.delete(ingredient));
      }
    })
  }

  const ingredientsWithoutAllergens = Object.keys(ingredients).filter(i => ingredients[i].size == 0);
  const appereances = foods.map(f => f.ingredients).flat().filter(i => ingredientsWithoutAllergens.includes(i)).length;
  const canonicalList = Object.keys(allergens).sort().map(k => allergens[k]).map(a => a.values().next().value).join(',')

  console.log(
    'The number of apperances of ingredients that cannot possibly contain any of the allergens is:',
    appereances
  );
  console.log('The canonical dangerous ingredient list is:', canonicalList)
};

function parseFile(file) {
  return fs.readFileSync(file)
    .toString()
    .split("\n")
    .filter(l => l != '')
    .map(l => {
      const [part1, part2] = l.split('(contains ');

      const ingredients = part1.split(' ').filter(i => i != '');
      const allergens = part2.split(')')[0].split(', ');

      return { allergens, ingredients };
    });
}
