/**
 * Micode Command Adapter
 *
 * Formats commands for Micode following the same frontmatter specification as Claude Code.
 * Micode's skill system is fully compatible with Claude Code.
 */

import path from 'path';
import type { CommandContent, ToolCommandAdapter } from '../types.js';

/**
 * Escapes a string value for safe YAML output.
 * Quotes the string if it contains special YAML characters.
 */
function escapeYamlValue(value: string): string {
  // Check if value needs quoting (contains special YAML characters or starts/ends with whitespace)
  const needsQuoting = /[:\n\r#{}[\],&*!|>'"%@`]|^\s|\s$/.test(value);
  if (needsQuoting) {
    // Use double quotes and escape internal double quotes and backslashes
    const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n');
    return `"${escaped}"`;
  }
  return value;
}

/**
 * Formats a tags array as a YAML array with proper escaping.
 */
function formatTagsArray(tags: string[]): string {
  const escapedTags = tags.map((tag) => escapeYamlValue(tag));
  return `[${escapedTags.join(', ')}]`;
}

/**
 * Micode adapter for command generation.
 * File path: .micode/commands/opsx/<id>.md
 * Frontmatter: name, description, category, tags (Claude Code compatible)
 */
export const micodeAdapter: ToolCommandAdapter = {
  toolId: 'micode',

  getFilePath(commandId: string): string {
    return path.join('.micode', 'commands', 'opsx', `${commandId}.md`);
  },

  formatFile(content: CommandContent): string {
    return `---
name: ${escapeYamlValue(content.name)}
description: ${escapeYamlValue(content.description)}
category: ${escapeYamlValue(content.category)}
tags: ${formatTagsArray(content.tags)}
---

${content.body}
`;
  },
};
