# Design Document

## Overview

This design document outlines the architecture and implementation approach for upgrading the Transrify Admin Dashboard to a professional, enterprise-grade interface. The upgrade focuses on introducing a cohesive navigation system, tabbed data organization, improved visual design, and enhanced user experience while preserving all existing functionality.

The design follows a component-based architecture using React and Next.js, leveraging existing patterns while introducing new reusable UI components for navigation, tabs, and data visualization. The solution maintains the current real-time polling mechanism and API integration while reorganizing the presentation layer for better usability and scalability.

## Architecture

### High-Level Architecture

The application follows Next.js App Router architecture with the following layers:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Pages, Layouts, Navigation, Tabs)     │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Component Layer                 │
│  (NavBar, Tabs, Tables, Cards, Pills)   │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         Data Layer                      │
│  (SWR hooks, API routes, fetchers)      │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│         External Services               │
│  (Transrify API, S3, Ledger)           │
└─────────────────────────────────────────┘
```

### Navigation Architecture

A new shared layout component will wrap all pages, providing:
- Persistent navigation bar across all routes
- Active route highlighting
- Responsive mobile menu
- Branding and logo display

### Tab Architecture

The admin page will implement a client-side tab system:
- Tab state managed via React useState
- All data fetched simultaneously via SWR
- Tab switching is instant (no re-fetching)
- URL hash fragments for deep linking (optional)

## Components and Interfaces

### New Components

#### 1. NavBar Component

```typescript
interface NavBarProps {
  currentPath?: string;
}

export function NavBar({ currentPath }: NavBarProps): JSX.Element
```

**Responsibilities:**
- Render navigation links (Home, Demo, Admin)
- Highlight active route
- Responsive mobile menu toggle
- Display Transrify branding

**Styling:**
- Fixed or sticky positioning at top
- Dark background with light text
- Hover and active states for links
- Mobile hamburger menu below 768px

#### 2. TabContainer Component

```typescript
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabContainerProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
}

export function TabContainer({ tabs, activeTab, onTabChange, children }: TabContainerProps): JSX.Element
```

**Responsibilities:**
- Render tab navigation
- Handle tab switching
- Display active tab indicator
- Support badge counts for tabs
- Render active tab content

#### 3. OverviewCard Component

```typescript
interface OverviewCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function OverviewCard({ title, value, icon, trend, trendValue, variant }: OverviewCardProps): JSX.Element
```

**Responsibilities:**
- Display metric summary
- Show trend indicators
- Apply semantic color variants
- Responsive sizing

#### 4. DataTable Component (Enhanced)

```typescript
interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  maxHeight?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, data, emptyMessage, maxHeight, onRowClick }: DataTableProps<T>): JSX.Element
```

**Responsibilities:**
- Render tabular data with custom columns
- Handle empty states
- Support row click handlers
- Scrollable with max height
- Responsive table layout

#### 5. LoadingState Component

```typescript
interface LoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse';
  message?: string;
}

export function LoadingState({ type, message }: LoadingStateProps): JSX.Element
```

**Responsibilities:**
- Display loading indicators
- Support multiple loading patterns
- Show optional loading message

#### 6. ErrorState Component

```typescript
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  details?: string;
}

export function ErrorState({ message, onRetry, details }: ErrorStateProps): JSX.Element
```

**Responsibilities:**
- Display error messages
- Provide retry action
- Show expandable error details

### Modified Components

#### AdminTable Component

The existing AdminTable will be refactored into separate view components:
- `SessionsTable`: Dedicated sessions view
- `IncidentsTable`: Dedicated incidents view
- `EventLogsTable`: Dedicated event logs view
- `OverviewDashboard`: New overview with summary cards

Each table component will use the new DataTable component for consistency.

### Layout Structure

#### Root Layout

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <NavBar />
        <main className="pt-16"> {/* Account for fixed navbar */}
          {children}
        </main>
      </body>
    </html>
  );
}
```

#### Admin Page Structure

```typescript
// src/app/admin/page.tsx
export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { data, isLoading, error } = useSWR('/api/admin/state', fetcher, { refreshInterval: 2000 });
  
  const tabs = [
    { id: 'overview', label: 'Overview', badge: data?.incidents.filter(i => i.status === 'OPEN').length },
    { id: 'sessions', label: 'Sessions', badge: data?.sessions.length },
    { id: 'incidents', label: 'Incidents', badge: data?.incidents.length },
    { id: 'eventLogs', label: 'Event Logs', badge: data?.eventLogs.length },
  ];
  
  return (
    <TabContainer tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && <OverviewDashboard data={data} />}
      {activeTab === 'sessions' && <SessionsTable sessions={data?.sessions} />}
      {activeTab === 'incidents' && <IncidentsTable incidents={data?.incidents} />}
      {activeTab === 'eventLogs' && <EventLogsTable logs={data?.eventLogs} />}
    </TabContainer>
  );
}
```

## Data Models

The existing data models remain unchanged:

```typescript
// From src/lib/types.ts
export type SessionResult = 'NORMAL' | 'FAIL' | 'DURESS';
export type IncidentStatus = 'OPEN' | 'CLOSED';

export interface TransrifySession {
  id: string;
  tenant_id: string;
  customer_id: string;
  result: SessionResult;
  created_at: string;
}

export interface TransrifyIncident {
  id: string;
  session_id: string;
  tenant_id: string;
  customer_id: string;
  status: IncidentStatus;
  lat: string;
  lng: string;
  created_at: string;
}

export interface TransrifyEventLog {
  id: string;
  tenant_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  created_at: string;
}
```

### New View Models

```typescript
// Overview metrics
export interface DashboardMetrics {
  totalSessions: number;
  normalSessions: number;
  duressSessions: number;
  failedSessions: number;
  openIncidents: number;
  closedIncidents: number;
  recentEvents: number;
}

// Tab configuration
export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Navigation Properties

**Property 1: Navigation link activation**
*For any* navigation link in the navbar, clicking it should navigate to the corresponding route and mark that link as active while unmarking others.
**Validates: Requirements 1.3**

### Tab Interface Properties

**Property 2: Tab switching displays correct content**
*For any* tab in the admin interface, clicking it should display the corresponding data view and mark that tab as active.
**Validates: Requirements 2.2**

**Property 3: Polling persistence across tab switches**
*For any* sequence of tab switches, the real-time polling mechanism should continue without interruption or reset.
**Validates: Requirements 2.3**

**Property 4: Empty state display**
*For any* tab with empty data, the system should display an appropriate empty state message instead of an empty table.
**Validates: Requirements 2.4**

### Overview Dashboard Properties

**Property 5: Metric calculation accuracy**
*For any* set of sessions, incidents, and events, the overview summary cards should display counts that match the actual data length and filtered subsets.
**Validates: Requirements 3.1**

**Property 6: Real-time metric updates**
*For any* metric displayed in overview cards, when the underlying data changes, the displayed value should update to reflect the new data.
**Validates: Requirements 3.2**

**Property 7: Recent items limit**
*For any* set of sessions and incidents, the overview should display only the 5 most recent items of each type, sorted by creation timestamp descending.
**Validates: Requirements 3.3**

**Property 8: Visual highlighting for critical items**
*For any* session with DURESS result or incident with OPEN status, the overview should apply visual highlighting to distinguish it from normal items.
**Validates: Requirements 3.4**

### Status Indicator Properties

**Property 9: Status-to-color mapping**
*For any* status value (NORMAL, DURESS, FAIL, OPEN, CLOSED), the status pill component should render with the semantically correct color variant.
**Validates: Requirements 4.3**

### Sessions View Properties

**Property 10: Complete session display**
*For any* set of sessions, the sessions table should display all sessions with columns for ID, Customer, Tenant, Result, and Created timestamp.
**Validates: Requirements 5.1**

**Property 11: Session result visual distinction**
*For any* session result type (NORMAL, DURESS, FAIL), the system should render a distinct visual indicator that differs from other result types.
**Validates: Requirements 5.2**

**Property 12: Tooltip display for truncated IDs**
*For any* truncated identifier in the sessions table, hovering over it should display the complete identifier value in a tooltip.
**Validates: Requirements 5.4**

**Property 13: Scroll position preservation on update**
*For any* scroll position in the sessions table, when new data arrives via polling, the scroll position should remain unchanged.
**Validates: Requirements 5.5**

### Incidents View Properties

**Property 14: Complete incident display**
*For any* set of incidents, the incidents table should display all incidents with columns for Time, Status, Session, Customer, and Location.
**Validates: Requirements 6.1**

**Property 15: Coordinate formatting precision**
*For any* latitude and longitude values, the system should format them to exactly 4 decimal places.
**Validates: Requirements 6.2**

**Property 16: Open incident highlighting**
*For any* incident with OPEN status, the table row should have visual highlighting that distinguishes it from closed incidents.
**Validates: Requirements 6.3**

**Property 17: Incident sort order**
*For any* set of incidents, they should be displayed in descending order by creation timestamp (newest first).
**Validates: Requirements 6.4**

**Property 18: Session link presence**
*For any* incident displayed, there should be a clickable link to the associated session information.
**Validates: Requirements 6.5**

### Event Logs Properties

**Property 19: Complete event log display**
*For any* set of event logs, the table should display all events with columns for Time, Event Type, Tenant, and Payload.
**Validates: Requirements 7.1**

**Property 20: Payload truncation with expansion**
*For any* event payload exceeding a defined character limit, the system should truncate the display and provide a mechanism to expand and view the full payload.
**Validates: Requirements 7.2**

**Property 21: Timezone localization**
*For any* event timestamp, the system should display it in the user's local timezone.
**Validates: Requirements 7.4**

### Demo Page Properties

**Property 22: Scenario button color coding**
*For any* quick test scenario button, it should display with a color that semantically matches the scenario type (success for normal, danger for duress, neutral for invalid).
**Validates: Requirements 8.3**

**Property 23: JSON syntax highlighting**
*For any* API response displayed on the demo page, the JSON output should be formatted with syntax highlighting.
**Validates: Requirements 8.4**

### Error Handling Properties

**Property 24: Error message with retry**
*For any* API error that occurs, the system should display an error message and provide a retry action.
**Validates: Requirements 9.2**

### Accessibility Properties

**Property 25: Focus indicator visibility**
*For any* interactive element, when it receives keyboard focus, it should display a visible focus indicator.
**Validates: Requirements 10.1**

**Property 26: ARIA label presence**
*For any* navigation or data element, it should have appropriate ARIA labels for screen reader accessibility.
**Validates: Requirements 10.2**

**Property 27: Status text labels**
*For any* color-coded status indicator, it should include a text label in addition to the color.
**Validates: Requirements 10.3**

**Property 28: Semantic table structure**
*For any* data table, it should use proper semantic HTML table elements including thead, tbody, and th elements.
**Validates: Requirements 10.4**

**Property 29: Touch target sizing**
*For any* interactive element, it should have a minimum touch target size of 44x44 pixels.
**Validates: Requirements 10.5**

## Error Handling

### Client-Side Error Handling

**API Errors:**
- All API calls wrapped in try-catch blocks
- Error states displayed via ErrorState component
- Retry mechanisms provided for transient failures
- Error details logged to console for debugging

**Network Errors:**
- SWR handles network failures automatically
- Offline detection via navigator.onLine
- Warning banner displayed when offline
- Polling paused during network outage

**Data Validation Errors:**
- Type checking via TypeScript
- Runtime validation for API responses
- Graceful degradation for missing data
- Empty states for null/undefined data

### Loading States

**Initial Load:**
- Skeleton loaders for table structures
- Spinner for full-page loading
- Progressive rendering as data arrives

**Polling Updates:**
- Subtle "last updated" indicator
- No disruptive loading states during refresh
- Optimistic UI updates where appropriate

### Error Recovery

**Automatic Retry:**
- SWR automatic retry with exponential backoff
- Manual retry buttons in error states
- Session recovery after auth failures

**Graceful Degradation:**
- Partial data display if some API calls fail
- Cached data shown during network issues
- Feature flags for optional functionality

## Testing Strategy

### Unit Testing

The testing approach will use **Vitest** as the testing framework and **React Testing Library** for component testing.

**Component Tests:**
- NavBar: Verify links render, active state highlighting, mobile menu toggle
- TabContainer: Verify tab switching, active tab marking, badge display
- OverviewCard: Verify metric display, trend indicators, variant styling
- DataTable: Verify column rendering, empty states, row click handlers
- StatusPill: Verify color mapping for different status values
- LoadingState: Verify different loading patterns render correctly
- ErrorState: Verify error message display and retry functionality

**View Component Tests:**
- SessionsTable: Verify all sessions render with correct columns
- IncidentsTable: Verify incident display and formatting
- EventLogsTable: Verify event log display and payload truncation
- OverviewDashboard: Verify metric calculations and recent items display

**Integration Tests:**
- Admin page: Verify tab switching with real data
- Demo page: Verify form interactions and API calls
- Navigation: Verify routing between pages

### Property-Based Testing

The testing approach will use **fast-check** for property-based testing in TypeScript.

**Property Test Configuration:**
- Minimum 100 iterations per property test
- Each property test tagged with format: `**Feature: professional-dashboard-upgrade, Property {number}: {property_text}**`
- Tests focus on universal behaviors across all valid inputs

**Key Property Tests:**
- Status color mapping: Generate random status values, verify correct colors
- Coordinate formatting: Generate random lat/lng, verify 4 decimal places
- Sort order: Generate random incident sets, verify descending timestamp order
- Metric calculations: Generate random data sets, verify count accuracy
- Truncation behavior: Generate strings of varying lengths, verify truncation logic
- ARIA label presence: Generate random component props, verify labels exist
- Touch target sizing: Generate random interactive elements, verify minimum size

**Generator Strategies:**
- Session generators: Random IDs, tenant IDs, customer IDs, results, timestamps
- Incident generators: Random statuses, coordinates, session references
- Event log generators: Random event types, tenants, payloads
- UI state generators: Random tab selections, viewport sizes, data sets

### Testing Best Practices

**Test Organization:**
- Co-locate tests with components using `.test.tsx` suffix
- Group related tests using describe blocks
- Use descriptive test names explaining what is being tested

**Test Data:**
- Use factory functions for generating test data
- Avoid hardcoded test data where possible
- Use realistic data that matches production patterns

**Mocking Strategy:**
- Mock API calls using MSW (Mock Service Worker)
- Mock SWR hooks for controlled data states
- Avoid mocking internal component logic

**Coverage Goals:**
- 80%+ code coverage for new components
- 100% coverage for critical paths (auth, data display)
- Property tests for all universal behaviors

## Implementation Phases

### Phase 1: Foundation Components
- Create NavBar component with routing
- Create TabContainer component
- Create LoadingState and ErrorState components
- Update root layout to include NavBar

### Phase 2: Data Display Components
- Create enhanced DataTable component
- Create OverviewCard component
- Update StatusPill with new variants
- Create table-specific components (SessionsTable, IncidentsTable, EventLogsTable)

### Phase 3: Admin Page Refactor
- Implement tab state management
- Create OverviewDashboard component
- Integrate all table components with tabs
- Add empty states and error handling

### Phase 4: Demo Page Enhancement
- Improve layout and styling
- Add syntax highlighting for JSON
- Enhance button styling and organization
- Improve responsive behavior

### Phase 5: Accessibility & Polish
- Add ARIA labels to all components
- Implement keyboard navigation
- Add focus indicators
- Verify touch target sizes
- Final styling and visual polish

### Phase 6: Testing
- Write unit tests for all components
- Write property-based tests for universal behaviors
- Integration tests for page flows
- Accessibility testing with automated tools
