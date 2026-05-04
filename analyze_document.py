#!/usr/bin/env python3
import json
import re
from openai import OpenAI

# Read the document
with open('/home/ubuntu/upload/dired_metaPost_rule.md', 'r') as f:
    doc_content = f.read()

# Initialize OpenAI client (uses pre-configured env vars)
client = OpenAI()

# Prompt the LLM to analyze the document
analysis_prompt = f"""You are an expert system architect analyzing a build configuration document.

Analyze this document and provide:
1. Dropdown menu structure with categories and options
2. Pipeline configuration templates
3. Suggested system architecture

Document content:
{doc_content}

Provide a structured JSON response with:
{{
  "dropdown_structure": {{
    "categories": [
      {{
        "name": "category_name",
        "description": "description",
        "options": [
          {{"label": "option_label", "value": "option_value", "description": "description"}}
        ]
      }}
    ]
  }},
  "pipeline_templates": [
    {{
      "name": "template_name",
      "description": "description",
      "stages": ["stage1", "stage2"],
      "configuration": {{}}
    }}
  ],
  "system_insights": {{
    "primary_transformation": "description",
    "key_parameters": ["param1", "param2"],
    "execution_flow": "description"
  }}
}}"""

response = client.chat.completions.create(
    model="gpt-4.1-mini",
    max_tokens=2000,
    messages=[
        {
            "role": "user",
            "content": analysis_prompt
        }
    ]
)

# Extract and parse the response
analysis_text = response.choices[0].message.content
print(analysis_text)

# Save to file
with open('/home/ubuntu/dired-metapost-system/system_analysis.json', 'w') as f:
    # Try to extract JSON from the response
    json_match = re.search(r'\{[\s\S]*\}', analysis_text)
    if json_match:
        json_str = json_match.group(0)
        try:
            parsed = json.loads(json_str)
            json.dump(parsed, f, indent=2)
        except:
            f.write(analysis_text)
    else:
        f.write(analysis_text)

print("\n✓ Analysis saved to system_analysis.json")
