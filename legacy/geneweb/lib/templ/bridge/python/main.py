import bridge
import jinjagen
import templates
import analyse
import lint
import os

OUTPUT_DIR = "./generated_templates"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def find_files_with_extension(directory: str, extension: str) -> list[tuple[str, str]]:
    matches = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(extension):
                path = os.path.join(root, file)
                name = path.removeprefix(directory + os.sep).removesuffix(extension)
                # if name != "home_full":
                #     continue
                matches.append((path, name))
    return matches

# name = sys.argv[1] if len(sys.argv) > 1 else "copyr"
# print(f"Generating template for: {name}")

files = find_files_with_extension("/home/maxime/EPITECH/G-ING-900-PAR-9-1-legacy-6/legacy/geneweb/hd/etc", ".txt")

# sample to test:
# files = files[:10]

def set_destination_directory(dir_path: str, extension: str, template_list: list[templates.Template]):
    for template in template_list:
            dest = f"{dir_path}/{template.name}.{extension}"
            dest = os.path.abspath(dest)
            directory = os.path.dirname(dest)
            os.makedirs(directory, exist_ok=True)
            template.filepath = dest

br = bridge.OcamlBridge("../bridge.so")

template_list = []

print(f"Found {len(files)} template files to process...")
for index, (filepath, name) in enumerate(files):
    print(f"Processing file {index + 1}/{len(files)}: {filepath}")
    tree = br.parse_path_ml(filepath)
    template = templates.Template(
        name=name,
        filepath=filepath,
        tree=tree
    )
    template.process()
    template_list.append(template)

set_destination_directory(OUTPUT_DIR, "html.j2", template_list)

print(f"Generating Jinja2 templates in '{OUTPUT_DIR}'...")
for index, template in enumerate(template_list):
    print(f"Generating template {index + 1}/{len(template_list)}: {template.name}")
    jinjaGen = jinjagen.JinjaGenerator(template)
    result = jinjaGen.render()

    dest = f"{OUTPUT_DIR}/{template.name}.html.j2"

    dest = os.path.abspath(dest)

    directory = os.path.dirname(dest)
    os.makedirs(directory, exist_ok=True)

    with open(dest, "w") as f:
        f.write(result)


print(f"Linting {len(template_list)} files...")
linter = lint.Linter()
for index, template in enumerate(template_list):
    print(f"Linting file {index + 1}/{len(template_list)}: {template.filepath}")
    try:
        linter.lint_jinja_file(template.filepath)
    except Exception:
        print(f"Error linting file {template.filepath}")

linter.write_report("lint_report.txt")

set_destination_directory(OUTPUT_DIR, "dot", template_list)

print("Analysing template dependencies...")
analyser = analyse.Analyser(template_list)
analyser.analyze()
dot_files = analyser.build_dot_files()