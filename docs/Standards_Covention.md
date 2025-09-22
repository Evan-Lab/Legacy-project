# Standards & Coding Conventions
## AWKWARD LEGACY Project Guidelines


## Communication & Workflow

### Discord Channels
- **#general** - Project updates and announcements
- **#development** - Code discussions and technical issues
- **#testing** - QA updates and bug reports
- **#documentation** - Docs reviews and updates

### GitHub Project Board
- **Backlog/To be Done** - All project tasks and user stories
- **In Progress** - Currently active work
- **Review** - Code review and testing phase
- **Done** - Completed and merged features

### Daily Workflow
1. Check Discord for updates
2. Review GitHub project board assignments
3. Create feature branch from `main`
4. Work on assigned tasks
5. Commit with conventional commits
6. Create PR when ready
7. Update Discord with progress

---

## Git Workflow

### Branch Strategy
```
main            # Production-ready code
dev             # Integration branch
feature/xyz     # Feature development
```

### Conventional Commits
Use conventional commit format for all commits:

```bash
# Format: type(scope): description

# Examples:
feat(genealogy): add heir calculation function
fix(database): resolve person lookup error
docs(readme): update setup instructions
test(heirs): add unit tests for inheritance
refactor(calculator): simplify relationship logic
style(format): apply black formatting
```

#### Commit Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `test` - Adding/updating tests
- `refactor` - Code refactoring
- `style` - Formatting, no logic change


### Pull Request Process
1. **Create PR** with descriptive title
2. **Fill template** with changes summary
3. **Request review** from team member
4. **Address feedback** if needed
5. **Merge** after approval


---

## Code Standards


### Naming Conventions
```python
# Variables and functions
person_id = "john_1820"
heir_count = 5

def calculate_inheritance():
    pass

# Constants
MAX_GENERATIONS = 10
DEFAULT_INHERITANCE_RULES = {}

# Classes
class FamilyTree:
    pass

class InheritanceCalculator:
    pass
```


### Error Handling


---
TO BE DONE

## Testing Standards



### Test Categories
- **Unit tests** - Individual functions
- **Integration tests** - Component interaction
- **E2E tests** - Complete workflows
- **Performance tests** - Speed and memory usage



## Documentation Standards

### README Structure
```markdown
Clear documentation with anything suitable and markdown
```

### Code Comments
```bash
## Doxygen 
## Comment with CLEAR Explanation
```



---

## Activity Reporting

### Daily Updates (Discord #general)
```
📅 Daily Update - [Date]
👤 [Your Name]

✅ Completed:
- Implemented heir calculation for noble titles
- Fixed database connection issue
- Updated test coverage to 94%

🔄 In Progress:
- Working on inheritance percentage calculations
- Debugging OCaml comparison discrepancies

⚠️ Blockers:
- Waiting for test data from legacy system
- Need clarification on inheritance laws for adopted children

📋 Next:
- Complete inheritance algorithm
- Add unit tests for edge cases
```

### Weekly Summary (Discord #general)
```

```

### Issue Reporting (GitHub Issues)
```markdown
**Bug Report Template**

## Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Error occurs

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: Windows 10
- Branch: feature/heir-calc

## Additional Context
Any other relevant information
```

---

## Quality Checklist

### Before Committing ✅
- [ ] Code follows Python style guidelines
- [ ] Functions have docstrings
- [ ] Tests added for new functionality
- [ ] All tests pass locally
- [ ] No debug print statements left
- [ ] Conventional commit message format

### Before Pull Request ✅
- [ ] Feature branch up to date with develop
- [ ] Code reviewed by at least one team member
- [ ] Documentation updated if needed
- [ ] Manual testing completed
- [ ] OCaml baseline comparison (if applicable)


---

## Tool Configuration

### Required Tools
```bash
# Development
pip install black isort flake8 pytest


# Testing
pip install pytest-cov pytest-mock
```

### GitHub Settings
- Branch protection on `main` and `dev`
- Require PR reviews before merge
- Require status checks to pass
- Auto-delete head branches after merge

---

## Quick References

### Useful Commands
```bash
# Format code
black .

# Run tests
pytest
pytest 

# Check style


# Git workflow
git checkout -b feature/new-feature
git add .
git commit -m "feat(genealogy): add new feature"
git push origin feature/new-feature
```


---

