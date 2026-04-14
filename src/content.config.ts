import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro:schema';

const levelSchema = z.enum(['beginner', 'intermediate', 'advanced']);
const difficultySchema = z.enum(['easy', 'medium', 'hard']);

const patterns = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/patterns' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    level: levelSchema,
    problem: z.string(),
    why_it_exists: z.string(),
    when_to_use: z.array(z.string()),
    when_not_to_use: z.array(z.string()),
    tradeoffs: z.array(z.string()),
    examples: z.array(z.string()),
    related_concepts: z.array(z.string().regex(/^concept_/)),
    related_patterns: z.array(z.string()),
    related_scenarios: z.array(z.string()),
    tags: z.array(z.string()),
    diagram_reference: z.string(),
    quiz_ids: z.array(z.string()),
    order: z.number(),
    importance: z.number().min(1).max(5),
    estimated_read_time: z.number(),
    complexity: z.enum(['low', 'medium', 'high']),
    best_for: z.string(),
    avoid_when: z.string(),
    main_tradeoff: z.string(),
    common_mistakes: z.array(z.string())
  })
});

const scenarios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/scenarios' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    level: levelSchema,
    system_type: z.string(),
    core_problem: z.string(),
    functional_requirements: z.array(z.string()),
    non_functional_requirements: z.array(z.string()),
    initial_design: z.string(),
    design_steps: z.array(z.string()),
    concept_links: z.array(z.string().regex(/^concept_/)),
    architecture_variants: z.array(z.string()),
    related_patterns: z.array(z.string()),
    quiz_ids: z.array(z.string()),
    estimated_time: z.number(),
    difficulty: difficultySchema,
    related_comparisons: z.array(z.string())
  })
});

const quizzes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/quizzes' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    related_pattern_ids: z.array(z.string()),
    related_scenario_ids: z.array(z.string()),
    difficulty: difficultySchema,
    questions: z.array(
      z.object({
        id: z.string(),
        prompt: z.string(),
        type: z.enum(['single_choice', 'multiple_choice', 'true_false', 'scenario_step']),
        options: z.array(z.string()),
        correct_answer: z.union([z.string(), z.array(z.string())]),
        explanation: z.string(),
        related_pattern_ids: z.array(z.string()),
        hint: z.string(),
        difficulty: difficultySchema
      })
    )
  })
});

const comparisons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparisons' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    compared_options: z.array(z.string()),
    dimensions: z.array(
      z.object({
        name: z.string(),
        option_scores: z.record(z.string(), z.string())
      })
    ),
    recommended_when: z.array(z.string()),
    anti_patterns: z.array(z.string()),
    related_patterns: z.array(z.string()),
    related_scenarios: z.array(z.string()),
    examples: z.array(z.string())
  })
});

const concepts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/concepts' }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    definition: z.string(),
    why_it_matters: z.array(z.string()),
    tradeoffs: z.array(z.string()),
    examples: z.array(z.string()),
    related_concepts: z.array(z.string()),
    related_patterns: z.array(z.string()),
    tags: z.array(z.string()),
    estimated_read_time: z.number(),
    order: z.number()
  })
});

export const collections = {
  patterns,
  scenarios,
  quizzes,
  comparisons,
  concepts
};
