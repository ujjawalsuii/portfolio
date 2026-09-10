import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'

// Compare the extracted records with the source snapshot taken before the redesign.
const baseline = JSON.parse(fs.readFileSync('scripts/content-baseline.json', 'utf8'))
const source = fs.readFileSync('src/data/portfolio.ts', 'utf8')
const tree = ts.createSourceFile('portfolio.ts', source, ts.ScriptTarget.Latest, true)
let checked = 0
for (const statement of tree.statements) {
  if (!ts.isVariableStatement(statement)) continue
  for (const declaration of statement.declarationList.declarations) {
    const name = declaration.name.getText(tree)
    if (!(name in baseline)) continue
    assert.equal(declaration.initializer.getText(tree), baseline[name], `${name} content changed`)
    checked++
  }
}
assert.equal(checked, Object.keys(baseline).length)
const counts = { projects: 7, experiences: 11, skillCategories: 6, adventuresMedia: 8, momentsMedia: 4, familyMedia: 3, familyStories: 1 }
for (const [name, count] of Object.entries(counts)) {
  const statement = tree.statements.find(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations[0].name.getText(tree) === name)
  assert.equal(statement.declarationList.declarations[0].initializer.elements.length, count, name)
}
const strings = [...source.matchAll(/(?:src|image|cover): '([^']+)'/g)].map(match => match[1])
for (const asset of strings) assert(fs.existsSync(`public/${asset}`), `Missing original media: ${asset}`)
assert(fs.existsSync('public/CV.pdf'))
assert(fs.existsSync('public/Me.jpg'))
console.log(`Verified all ${checked} original data groups, ${new Set(strings).size} gallery assets, portrait and resume.`)
console.log('7 projects, 11 timeline entries, 6 skill categories and the complete family story preserved exactly.')
