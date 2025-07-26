# Design Document

## Overview

The weighted scoring system will transform the current simple correct-answer counting into a comprehensive scoring mechanism that evaluates both accuracy and speed. The system will calculate a final score out of 10 by combining 50% weight for correctness and 50% weight for time efficiency.

## Architecture

The scoring system will be implemented through:

1. **Score Calculation Service**: A utility function that computes weighted scores
2. **Enhanced State Management**: Modified App component to track timing data
3. **Updated Results Display**: Enhanced QuizResults component to show score breakdown
4. **Data Model Updates**: Extended types and database schema to support new scoring

## Components and Interfaces

### Score Calculation Utility

```typescript
interface ScoreComponents {
  pointsScore: number;      // Out of 5
  timeScore: number;        // Out of 5
  finalScore: number;       // Out of 10
  correctAnswers: number;
  totalQuestions: number;
  timeUsed: number;         // In seconds
  totalTime: number;        // In seconds
}

function calculateWeightedScore(
  correctAnswers: number,
  totalQuestions: number,
  timeRemaining: number,
  totalTime: number
): ScoreComponents
```

### Enhanced App Component State

The App component will track additional timing information:
- `startTime`: When the quiz began
- `endTime`: When the quiz completed
- `timeUsed`: Calculated time spent on quiz

### Updated QuizResults Component

The results component will display:
- Final weighted score (prominently)
- Score breakdown (points vs time components)
- Time statistics
- Traditional correct answers count

### Enhanced Data Models

```typescript
interface QuizResult {
  email: string;
  game: string;
  score: number;           // Weighted score out of 10
  correctAnswers: number;  // Raw correct count
  timeUsed: number;        // Time in seconds
  completed_at: string;
}

interface WebhookPayload {
  email: string;
  element_id: string;
  game_name: string;
  location: string;
  score: number;           // Weighted score
  correct_answers: number;
  time_used: number;
}
```

## Data Models

### Score Calculation Logic

**Points Component (50% weight):**
- Formula: `(correctAnswers / totalQuestions) * 5`
- Range: 0 to 5
- Example: 7/10 correct = 3.5 points

**Time Component (50% weight):**
- Formula: `(timeRemaining / totalTime) * 5`
- Range: 0 to 5
- Example: 60s remaining out of 120s = 2.5 points

**Final Score:**
- Formula: `pointsScore + timeScore`
- Range: 0 to 10
- Example: 3.5 + 2.5 = 6.0 final score

### Edge Cases

1. **Quiz Timeout**: timeRemaining = 0, so timeScore = 0
2. **Perfect Speed**: timeRemaining = totalTime, so timeScore = 5
3. **Zero Correct**: correctAnswers = 0, so pointsScore = 0
4. **Perfect Accuracy**: correctAnswers = totalQuestions, so pointsScore = 5

## Error Handling

### Invalid Input Handling
- Negative time values default to 0
- Correct answers exceeding total questions capped at total
- Division by zero protection for empty question sets

### Calculation Safeguards
- Round final scores to 1 decimal place for display
- Ensure components never exceed their maximum values
- Handle floating-point precision issues

### Backward Compatibility
- Maintain existing webhook structure with additional fields
- Preserve existing Supabase schema with new optional columns
- Ensure existing score displays continue to work during transition

## Testing Strategy

### Unit Tests
- Score calculation function with various input combinations
- Edge case handling (timeouts, perfect scores, zero scores)
- Rounding and precision validation

### Integration Tests
- End-to-end quiz completion with score calculation
- Database storage of weighted scores
- Webhook payload validation

### User Experience Tests
- Score display accuracy and clarity
- Performance impact of additional calculations
- Results screen layout with new information

### Test Cases

1. **Standard Performance**: 7/10 correct, 60s remaining → 6.0 score
2. **Perfect Performance**: 10/10 correct, 120s remaining → 10.0 score
3. **Time Pressure**: 8/10 correct, 10s remaining → 4.4 score
4. **Timeout Scenario**: 5/10 correct, 0s remaining → 2.5 score
5. **Poor Performance**: 2/10 correct, 30s remaining → 2.25 score