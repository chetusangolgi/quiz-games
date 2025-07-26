# Implementation Plan

- [x] 1. Create score calculation utility function


  - Implement calculateWeightedScore function with proper TypeScript interfaces
  - Add comprehensive input validation and edge case handling
  - Include rounding logic for display-friendly scores
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_




- [ ] 2. Write unit tests for score calculation
  - Create test cases for standard scoring scenarios


  - Test edge cases (timeout, perfect score, zero score)
  - Validate rounding and precision handling
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_



- [ ] 3. Update TypeScript interfaces and types
  - Extend QuizResult interface to include new scoring fields
  - Create ScoreComponents interface for calculation results
  - Update webhook payload type definitions


  - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.4_

- [ ] 4. Enhance App component state management
  - Add timing state variables (startTime, endTime, timeUsed)


  - Implement quiz start time tracking
  - Calculate time used when quiz completes or times out
  - _Requirements: 1.1, 2.4, 3.3_

- [x] 5. Integrate weighted scoring into quiz completion flow


  - Replace simple score counting with weighted score calculation
  - Update handleAnswer function to use new scoring system
  - Update handleTimeUp function to calculate final weighted score
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_


- [ ] 6. Update QuizResults component display
  - Show final weighted score prominently (out of 10)
  - Display score breakdown (points component and time component)
  - Add time statistics display (time used, time remaining)


  - Maintain existing correct answers display
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 7. Update Supabase integration



  - Modify saveQuizResult function to store weighted score and timing data
  - Ensure backward compatibility with existing database schema
  - Handle new fields gracefully if database columns don't exist yet
  - _Requirements: 3.1, 3.3, 3.4_

- [ ] 8. Update webhook payload
  - Modify webhook data structure to include weighted score
  - Add correct answers count and time used to payload
  - Maintain existing payload structure for compatibility
  - _Requirements: 3.2, 3.4_

- [ ] 9. Write integration tests
  - Test complete quiz flow with weighted scoring
  - Validate database storage of new scoring data
  - Test webhook payload with new fields
  - _Requirements: 1.1, 2.1, 3.1, 3.2_

- [ ] 10. Handle edge cases and error scenarios
  - Test and handle quiz timeout scenarios
  - Validate behavior with zero correct answers
  - Test perfect score scenarios
  - Ensure graceful degradation if timing data is missing
  - _Requirements: 1.5, 2.1, 3.4_