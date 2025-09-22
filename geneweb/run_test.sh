#!/bin/bash

# Usage:
#   ./run_tests.sh empty
#   ./run_tests.sh db

BASE_URL="http://localhost:2317"

run_and_report () {
    CMD=$1
    echo "➡️ $2"
    OUTPUT=$(pytest $CMD --base-url $BASE_URL -q -rA --disable-warnings)
    echo "$OUTPUT"

    SUMMARY=$(echo "$OUTPUT" | grep -Eo '[0-9]+ (passed|failed|skipped|xfailed|xpassed)' | tr '\n' ' ')
    TOTAL=$(echo "$SUMMARY" | grep -Eo '[0-9]+' | awk '{s+=$1} END {print s}')
    PASSED=$(echo "$SUMMARY" | grep -Eo '[0-9]+ passed' | awk '{print $1}')
    if [ -z "$PASSED" ]; then PASSED=0; fi

    if [ "$TOTAL" -gt 0 ]; then
        PERCENT=$(( 100 * PASSED / TOTAL ))
        echo "✅ Success rate: $PASSED / $TOTAL = $PERCENT%"
    else
        echo "⚠️ No tests collected"
    fi
}

if [ "$1" = "empty" ]; then
    run_and_report "tests/test_languages.py" "Running EMPTY mode tests (test_languages.py)"

elif [ "$1" = "db" ]; then
    run_and_report "tests/test_welcomepage.py" "Running DB mode tests (test_welcomepage.py)"

else
    echo "Usage: $0 {empty|db}"
    exit 1
fi
