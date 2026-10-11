# MobFix State-Transition Design

## Booking lifecycle

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
~~~mermaid
flowchart TD
    Pending["Pending"]
    Quoted["Quoted"]
    Confirmed["Confirmed"]
    Progress["In Progress"]
    Ready["Ready for Pickup"]
    Completed["Completed"]
    Cancelled["Cancelled"]

    Pending -->|"staff issues quote"| Quoted
    Pending -->|"customer or staff cancels"| Cancelled
    Quoted -->|"customer approves quote"| Confirmed
    Quoted -->|"customer or staff cancels"| Cancelled
    Confirmed -->|"technician starts work"| Progress
    Confirmed -->|"customer or staff cancels"| Cancelled
    Progress -->|"repair is ready"| Ready
    Ready -->|"customer collects device"| Completed
~~~

## Transition rules

| From | To | Actor | Required condition |
|---|---|---|---|
| Pending | Quoted | Administrator | Quote range or quote details are supplied |
| Pending | Cancelled | Customer or staff | Cancellation is allowed and recorded |
| Quoted | Confirmed | Customer | Quote exists and has not already been approved |
| Confirmed | In Progress | Assigned technician or administrator | Technician is assigned |
| In Progress | Ready for Pickup | Assigned technician or administrator | Repair work is marked ready |
| Ready for Pickup | Completed | Assigned technician or administrator | Completion is confirmed |
| Quoted or Confirmed | Cancelled | Customer or staff | Cancellation policy allows the operation |

Every accepted transition appends an event to the booking status history. Every
rejected transition returns a client-safe error and leaves the current state
unchanged.
