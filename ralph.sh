#!/bin/bash

# Ralph Execution Script
# Runs Claude Code with the current task context

set -e

echo "==================================="
echo "  Ralph - Iterative AI Development"
echo "==================================="
echo ""

# Check if required files exist
if [ ! -f "ralph_task.md" ]; then
    echo "Error: ralph_task.md not found!"
    exit 1
fi

if [ ! -f "guardrails.md" ]; then
    echo "Error: guardrails.md not found!"
    exit 1
fi

echo "Current Task:"
echo "-------------"
head -20 ralph_task.md
echo ""
echo "==================================="

# Run tests first if they exist
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    echo "Running tests before iteration..."
    npm test || {
        echo ""
        echo "WARNING: Tests failed. Please fix before proceeding."
        echo ""
    }
fi

echo ""
echo "Starting Claude Code session..."
echo "Context files: ralph_task.md, guardrails.md, progress.md"
echo ""

# Launch Claude Code with context
# The actual command depends on your Claude Code installation
# claude-code --context ralph_task.md --context guardrails.md --context progress.md

echo "Iteration complete. Remember to:"
echo "1. Update progress.md"
echo "2. Run tests: npm test"
echo "3. Commit changes if tests pass"
