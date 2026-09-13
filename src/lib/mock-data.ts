import type { Board } from "@/types/kanban";

function subtasks(
  titles: string[],
  completedCount: number
): Board["columns"][number]["tasks"][number]["subtasks"] {
  return titles.map((title, index) => ({
    id: `${title}-${index}`,
    title,
    isCompleted: index < completedCount,
  }));
}

export const mockBoards: Board[] = [
  {
    id: "platform-launch",
    name: "Platform Launch",
    columns: [
      {
        id: "todo",
        name: "Todo",
        tasks: [
          {
            id: "build-ui-onboarding",
            title: "Build UI for onboarding flow",
            description: "",
            status: "Todo",
            subtasks: subtasks(
              ["Sign up page", "Sign in page", "Welcome page"],
              0
            ),
          },
          {
            id: "build-ui-search",
            title: "Build UI for search",
            description: "",
            status: "Todo",
            subtasks: subtasks(["Search page"], 0),
          },
          {
            id: "build-settings-ui",
            title: "Build settings UI",
            description: "",
            status: "Todo",
            subtasks: subtasks(["Account page", "Billing page"], 0),
          },
          {
            id: "qa-major-journeys",
            title: "QA and test all major user journeys",
            description:
              "Once we feel confident with our MVP, we need to rigorously test it both internally and externally to identify any major gaps.",
            status: "Todo",
            subtasks: subtasks(["Internal testing", "External testing"], 0),
          },
        ],
      },
      {
        id: "doing",
        name: "Doing",
        tasks: [
          {
            id: "design-settings-search",
            title: "Design settings and search pages",
            description: "",
            status: "Doing",
            subtasks: subtasks(
              ["Settings page", "Search page", "Account page"],
              1
            ),
          },
          {
            id: "add-account-endpoints",
            title: "Add account management endpoints",
            description: "",
            status: "Doing",
            subtasks: subtasks(
              ["Upgrade plan", "Cancel plan", "Update payment method"],
              2
            ),
          },
          {
            id: "design-onboarding-flow",
            title: "Design onboarding flow",
            description: "",
            status: "Doing",
            subtasks: subtasks(
              ["Sign up page", "Sign in page", "Welcome page"],
              1
            ),
          },
          {
            id: "add-search-endpoints",
            title: "Add search endpoints",
            description: "",
            status: "Doing",
            subtasks: subtasks(["Add search endpoint", "Define filters"], 1),
          },
          {
            id: "add-auth-endpoints",
            title: "Add authentication endpoints",
            description: "",
            status: "Doing",
            subtasks: subtasks(["Define user model", "Add auth endpoint"], 1),
          },
          {
            id: "research-pricing",
            title:
              "Research pricing points of various competitors and trial different business models",
            description:
              "We know what we're planning to build for version one. Now we need to finalise the first pricing model we'll use. Keep iterating the subtasks until we have a coherent proposition.",
            status: "Doing",
            subtasks: subtasks(
              [
                "Research competitor pricing and business models",
                "Outline a business model that works for our solution",
                "Talk to potential customers about our proposed solution and ask for fair price expectancy",
              ],
              2
            ),
          },
        ],
      },
      {
        id: "done",
        name: "Done",
        tasks: [
          {
            id: "conduct-wireframe-tests",
            title: "Conduct 5 wireframe tests",
            description: "",
            status: "Done",
            subtasks: subtasks(["Complete wireframe testing"], 1),
          },
          {
            id: "create-wireframe-prototype",
            title: "Create wireframe prototype",
            description: "",
            status: "Done",
            subtasks: subtasks(["Create prototype"], 1),
          },
          {
            id: "review-usability-tests",
            title: "Review results of usability tests and iterate",
            description: "",
            status: "Done",
            subtasks: subtasks(
              ["Review usability tests", "Iterate on designs", "Re-test"],
              3
            ),
          },
          {
            id: "create-paper-prototypes",
            title:
              "Create paper prototypes and conduct 10 usability tests with potential customers",
            description: "",
            status: "Done",
            subtasks: subtasks(
              ["Create paper prototypes", "Conduct usability tests"],
              2
            ),
          },
          {
            id: "market-discovery",
            title: "Market discovery",
            description: "",
            status: "Done",
            subtasks: subtasks(["Write up research"], 1),
          },
          {
            id: "competitor-analysis",
            title: "Competitor analysis",
            description: "",
            status: "Done",
            subtasks: subtasks(["Analyse competitors", "Write up findings"], 2),
          },
          {
            id: "research-the-market",
            title: "Research the market",
            description: "",
            status: "Done",
            subtasks: subtasks(["Research competitors", "Write up research"], 2),
          },
        ],
      },
    ],
  },
  {
    id: "marketing-plan",
    name: "Marketing Plan",
    columns: [
      { id: "todo", name: "Todo", tasks: [] },
      { id: "doing", name: "Doing", tasks: [] },
      { id: "done", name: "Done", tasks: [] },
    ],
  },
  {
    id: "roadmap",
    name: "Roadmap",
    columns: [
      { id: "todo", name: "Todo", tasks: [] },
      { id: "doing", name: "Doing", tasks: [] },
      { id: "done", name: "Done", tasks: [] },
    ],
  },
];
