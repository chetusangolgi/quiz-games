# Requirements Document

## Introduction

This feature implements a weighted scoring system for the quiz application that combines both correctness and time performance into a single score out of 10. The system will give equal weight (50%) to both the number of correct answers and the time efficiency, providing a more comprehensive assessment of quiz performance.

## Requirements

### Requirement 1

**User Story:** As a quiz participant, I want my final score to reflect both my accuracy and speed, so that I am rewarded for completing questions quickly and correctly.

#### Acceptance Criteria

1. WHEN a user completes the quiz THEN the system SHALL calculate a final score out of 10 that combines 50% points score and 50% time score
2. WHEN calculating the points component THEN the system SHALL use the formula: (correct_answers / total_questions) * 5
3. WHEN calculating the time component THEN the system SHALL use the formula: (time_remaining / total_time) * 5
4. WHEN both components are calculated THEN the system SHALL add them together to get the final score out of 10
5. WHEN the quiz times out completely THEN the time component SHALL be 0

### Requirement 2

**User Story:** As a quiz participant, I want to see my detailed score breakdown, so that I understand how my final score was calculated.

#### Acceptance Criteria

1. WHEN viewing quiz results THEN the system SHALL display the final weighted score out of 10
2. WHEN viewing quiz results THEN the system SHALL show the points component score (out of 5)
3. WHEN viewing quiz results THEN the system SHALL show the time component score (out of 5)
4. WHEN viewing quiz results THEN the system SHALL display the time taken to complete the quiz
5. WHEN viewing quiz results THEN the system SHALL show the number of correct answers

### Requirement 3

**User Story:** As a system administrator, I want the weighted score to be saved to the database and sent to external systems, so that the comprehensive scoring is preserved and transmitted.

#### Acceptance Criteria

1. WHEN saving quiz results to Supabase THEN the system SHALL store the weighted final score (out of 10)
2. WHEN sending results to the webhook THEN the system SHALL include the weighted final score
3. WHEN saving results THEN the system SHALL also store the time taken to complete the quiz
4. WHEN saving results THEN the system SHALL maintain backward compatibility with existing data structure