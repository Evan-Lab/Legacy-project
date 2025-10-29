import functools
import signal
from djlint import settings
from djlint.lint import lint_file
from pathlib import Path

lint_config = settings.Config(
    lint=True
)


def timeout(seconds=5, error_message="Function call timed out"):
    def decorator(func):
        def _handle_timeout(signum, frame):
            raise TimeoutError(error_message)

        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            # Set the signal handler and alarm
            signal.signal(signal.SIGALRM, _handle_timeout)
            signal.alarm(seconds)
            try:
                return func(*args, **kwargs)
            finally:
                signal.alarm(0)  # cancel alarm
        return wrapper
    return decorator

class Linter:
    def __init__(self, config: settings.Config = lint_config):
        self.config = config
        self.report: dict[str, list] = {}

    @timeout(seconds=300)
    def lint_jinja_file(self, filepath: str) -> None:
        if not Path(filepath).is_file():
            raise FileNotFoundError(f"File not found: {filepath}")
        
        if filepath in self.report:
            print(f"File already linted: {filepath}")
            return  # Already linted

        report = lint_file(self.config, Path(filepath))
        for file in report:
            self.report[file] = report[file]

    def write_report(self, output_path: str) -> None:
        with open(output_path, "w") as f:
            for filepath, errors in self.report.items():
                if not errors:
                    f.write(f"No issues found in {filepath}\n")
                    continue
                f.write(f"Issues found in {filepath}:\n")
                for error in errors:
                    f.write(f"  {error['code']}: Line {error['line']}: {error['message']} (Match: {error['match']})\n")

    def print_report(self) -> None:
        for filepath, errors in self.report.items():
            if not errors:
                print(f"No issues found in {filepath}")
                continue
            print(f"Issues found in {filepath}:")
            for error in errors:
                print(f"  {error['code']}: Line {error['line']}: {error['message']} (Match: {error['match']})")