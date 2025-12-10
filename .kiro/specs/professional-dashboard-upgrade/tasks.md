# Implementation Plan

- [x] 1. Create foundation UI components
  - Create reusable NavBar component with routing and active state
  - Create TabContainer component with tab switching logic
  - Create LoadingState component with multiple loading patterns
  - Create ErrorState component with retry functionality
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 9.1, 9.2_

- [x] 1.1 Write property test for navigation link activation
  - **Property 1: Navigation link activation**
  - **Validates: Requirements 1.3**

- [x] 2. Create enhanced data display components
  - Create generic DataTable component with column configuration
  - Create OverviewCard component for metric display
  - Enhance StatusPill component with additional variants
  - _Requirements: 4.3, 5.1, 6.1, 7.1_

- [x] 2.1 Write property test for status-to-color mapping
  - **Property 9: Status-to-color mapping**
  - **Validates: Requirements 4.3**

- [x] 2.2 Write property test for status text labels
  - **Property 27: Status text labels**
  - **Validates: Requirements 10.3**

- [x] 3. Update root layout with navigation
  - Modify src/app/layout.tsx to include NavBar component
  - Add proper spacing for fixed navbar
  - Ensure NavBar appears on all pages
  - _Requirements: 1.1, 1.4_

- [x] 4. Create specialized table components
  - Create SessionsTable component using DataTable
  - Create IncidentsTable component with location formatting
  - Create EventLogsTable component with payload truncation
  - Add empty state handling to all tables
  - _Requirements: 5.1, 5.2, 6.1, 6.2, 7.1, 7.2_

- [x] 4.1 Write property test for complete session display
  - **Property 10: Complete session display**
  - **Validates: Requirements 5.1**

- [x] 4.2 Write property test for session result visual distinction
  - **Property 11: Session result visual distinction**
  - **Validates: Requirements 5.2**

- [x] 4.3 Write property test for coordinate formatting precision
  - **Property 15: Coordinate formatting precision**
  - **Validates: Requirements 6.2**

- [x] 4.4 Write property test for complete incident display
  - **Property 14: Complete incident display**
  - **Validates: Requirements 6.1**

- [x] 4.5 Write property test for incident sort order
  - **Property 17: Incident sort order**
  - **Validates: Requirements 6.4**

- [x] 4.6 Write property test for payload truncation with expansion
  - **Property 20: Payload truncation with expansion**
  - **Validates: Requirements 7.2**

- [x] 4.7 Write property test for complete event log display
  - **Property 19: Complete event log display**
  - **Validates: Requirements 7.1**

- [x] 5. Create overview dashboard component
  - Create OverviewDashboard component with metric cards
  - Implement metric calculation logic (total sessions, duress count, open incidents)
  - Display recent 5 sessions and 5 incidents
  - Add visual highlighting for duress sessions and open incidents
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 5.1 Write property test for metric calculation accuracy
  - **Property 5: Metric calculation accuracy**
  - **Validates: Requirements 3.1**

- [x] 5.2 Write property test for real-time metric updates
  - **Property 6: Real-time metric updates**
  - **Validates: Requirements 3.2**

- [x] 5.3 Write property test for recent items limit
  - **Property 7: Recent items limit**
  - **Validates: Requirements 3.3**

- [x] 5.4 Write property test for visual highlighting for critical items
  - **Property 8: Visual highlighting for critical items**
  - **Validates: Requirements 3.4**

- [x] 6. Refactor admin page with tabs
  - Implement tab state management in admin page
  - Integrate TabContainer with Overview, Sessions, Incidents, and Event Logs tabs
  - Add badge counts to tabs showing data counts
  - Wire up all table components to respective tabs
  - Maintain existing SWR polling functionality
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 6.1 Write property test for tab switching displays correct content
  - **Property 2: Tab switching displays correct content**
  - **Validates: Requirements 2.2**

- [x] 6.2 Write property test for polling persistence across tab switches
  - **Property 3: Polling persistence across tab switches**
  - **Validates: Requirements 2.3**

- [x] 6.3 Write property test for empty state display
  - **Property 4: Empty state display**
  - **Validates: Requirements 2.4**

- [ ] 7. Enhance demo page layout and styling
  - Improve demo page layout with centered max-width container
  - Enhance two-column layout for desktop
  - Add distinct colors to scenario buttons
  - Implement JSON syntax highlighting for API responses
  - Improve responsive behavior for mobile
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ] 7.1 Write property test for scenario button color coding
  - **Property 22: Scenario button color coding**
  - **Validates: Requirements 8.3**

- [ ] 7.2 Write property test for JSON syntax highlighting
  - **Property 23: JSON syntax highlighting**
  - **Validates: Requirements 8.4**

- [x] 8. Implement advanced table features
  - Add tooltip display for truncated IDs in sessions table
  - Implement scroll position preservation on data updates
  - Add session links to incidents table
  - Add open incident row highlighting
  - Implement timezone localization for timestamps
  - _Requirements: 5.4, 5.5, 6.3, 6.5, 7.4_

- [x] 8.1 Write property test for tooltip display for truncated IDs
  - **Property 12: Tooltip display for truncated IDs**
  - **Validates: Requirements 5.4**

- [x] 8.2 Write property test for scroll position preservation on update
  - **Property 13: Scroll position preservation on update**
  - **Validates: Requirements 5.5**

- [x] 8.3 Write property test for open incident highlighting
  - **Property 16: Open incident highlighting**
  - **Validates: Requirements 6.3**

- [x] 8.4 Write property test for session link presence
  - **Property 18: Session link presence**
  - **Validates: Requirements 6.5**

- [x] 8.5 Write property test for timezone localization
  - **Property 21: Timezone localization**
  - **Validates: Requirements 7.4**

- [x] 9. Add accessibility features
  - Add ARIA labels to navigation elements
  - Add ARIA labels to tab components
  - Add ARIA labels to data tables
  - Implement visible focus indicators for all interactive elements
  - Ensure minimum 44x44px touch targets for all buttons and links
  - _Requirements: 10.1, 10.2, 10.4, 10.5_

- [x] 9.1 Write property test for focus indicator visibility
  - **Property 25: Focus indicator visibility**
  - **Validates: Requirements 10.1**

- [x] 9.2 Write property test for ARIA label presence
  - **Property 26: ARIA label presence**
  - **Validates: Requirements 10.2**

- [x] 9.3 Write property test for semantic table structure
  - **Property 28: Semantic table structure**
  - **Validates: Requirements 10.4**

- [x] 9.4 Write property test for touch target sizing
  - **Property 29: Touch target sizing**
  - **Validates: Requirements 10.5**

- [x] 10. Implement error handling and loading states
  - Add error boundaries to main page components
  - Implement error state display with retry in admin page
  - Add loading skeletons for initial data load
  - Add "last updated" indicator for polling
  - Implement offline detection and warning banner
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 10.1 Write property test for error message with retry
  - **Property 24: Error message with retry**
  - **Validates: Requirements 9.2**

- [x] 11. Apply professional styling and visual polish
  - Define and apply consistent color scheme across all components
  - Add proper spacing, borders, and shadows to cards and panels
  - Implement hover states for interactive elements
  - Add smooth transitions for tab switching and state changes
  - Ensure responsive breakpoints work correctly at 768px
  - _Requirements: 4.1, 4.2, 4.4, 4.5, 1.4, 2.5, 8.5_

- [x] 12. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
