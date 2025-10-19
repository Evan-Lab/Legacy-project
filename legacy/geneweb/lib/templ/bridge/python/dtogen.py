

import templates


class DtoGen:
    template: templates.Template

    def __init__(self, template: templates.Template):
        self.template = template

    def generate_dto(self, dto_name, fields):
        