import { ChatOpenAI } from "@langchain/openai";
import { StateGraph, START, END } from "@langchain/langgraph";
import { AIMessage, HumanMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";
import { z } from "zod";
import {
  simSwapTool,
  numberVerificationTool,
} from "../tools";

// State schema for onboarding
const OnboardingStateSchema = z.object({
  phoneNumber: z.string(),
  userName: z.string().optional(),
  language: z.string().default("en"),
  messages: z.array(z.record(z.string(), z.any())).default([]),
  simSwapChecked: z.boolean().default(false),
  numberVerified: z.boolean().default(false),
  deviceChecked: z.boolean().default(false),
  locationVerified: z.boolean().default(false),
  riskScore: z.number().default(0),
  status: z.enum(["pending", "in_progress", "approved", "rejected"]).default("pending"),
  nextStep: z.string().optional(),
});

type OnboardingState = z.infer<typeof OnboardingStateSchema>;

export class OnboardingAgent {
  private model: any;
  private graph: any;

constructor() {
  // Initialize LLM
  this.model = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.3,
  }).bindTools([
    simSwapTool,
    numberVerificationTool,
  ]);

  // Build the graph
  this.graph = this.buildGraph();
}

private buildGraph() {
  const graph = new StateGraph<OnboardingState>(OnboardingStateSchema as any);

  // Nodes
  graph.addNode("greet_user", this.greetUser.bind(this));
  graph.addNode("check_sim_swap", this.checkSimSwap.bind(this));
  graph.addNode("verify_number", this.verifyNumber.bind(this));
//   graph.addNode("check_device", this.checkDevice.bind(this));
//   graph.addNode("verify_location", this.verifyLocation.bind(this));
//   graph.addNode("calculate_risk", this.calculateRisk.bind(this));
  graph.addNode("make_decision", this.makeDecision.bind(this));

  // Edges
  graph.addEdge("__start__", "greet_user"  as any);
  graph.addEdge("greet_user" as any , "check_sim_swap" as any );
  graph.addEdge("check_sim_swap" as any, "verify_number" as any);
  graph.addEdge("verify_number" as any, "check_device" as any);
  graph.addEdge("make_decision" as any, "__end__" as any);

  return graph;
}


  private async greetUser(state: OnboardingState) {
    const greeting = new SystemMessage(
      `You are a helpful AI assistant for FinSentinel, a rural fintech security platform. 
       Greet the user warmly in ${state.language === "hi" ? "Hindi" : "English"}.
       User's name: ${state.userName || "User"}
       Explain that you'll guide them through a secure onboarding process.`
    );

    const response = await this.model.invoke([
      greeting,
      new HumanMessage(`Start onboarding for phone: ${state.phoneNumber}`),
    ]);

    return {
      ...state,
      messages: [...state.messages, response],
      nextStep: "Checking SIM swap status...",
    };
  }

  private async checkSimSwap(state: OnboardingState) {
    console.log("🔍 Checking SIM swap status...");

    const toolCall = await simSwapTool.invoke({
      phoneNumber: state.phoneNumber,
      maxAge: 240,
    });

    const result = JSON.parse(toolCall);

    return {
      ...state,
      simSwapChecked: true,
      messages: [
        ...state.messages,
        new AIMessage(`SIM Swap Check: ${result.message}`),
      ],
      nextStep: "Verifying phone number...",
    };
  }

  private async verifyNumber(state: OnboardingState) {
    console.log("📱 Verifying phone number...");

    const toolCall = await numberVerificationTool.invoke({
      phoneNumber: state.phoneNumber,
      mode: "verify",
    });

    const result = JSON.parse(toolCall);

    return {
      ...state,
      numberVerified: result.verified,
      messages: [
        ...state.messages,
        new AIMessage(`Number Verification: ${result.message}`),
      ],
      nextStep: "Checking device status...",
    };
  }

//   private async checkDevice(state: OnboardingState) {
//     console.log("📲 Checking device status...");

//     const toolCall = await deviceStatusTool.invoke({
//       phoneNumber: state.phoneNumber,
//     });

//     const result = JSON.parse(toolCall);

//     return {
//       ...state,
//       deviceChecked: true,
//       messages: [
//         ...state.messages,
//         new AIMessage(`Device Status: ${result.message}`),
//       ],
//       nextStep: "Verifying location...",
//     };
//   }

//   private async verifyLocation(state: OnboardingState) {
//     console.log("📍 Verifying location...");

//     const toolCall = await locationVerificationTool.invoke({
//       phoneNumber: state.phoneNumber,
//     });

//     const result = JSON.parse(toolCall);

//     return {
//       ...state,
//       locationVerified: result.locationMatch,
//       messages: [
//         ...state.messages,
//         new AIMessage(`Location Verification: ${result.message}`),
//       ],
//       nextStep: "Calculating risk score...",
//     };
//   }

//   private async calculateRisk(state: OnboardingState) {
//     console.log("🎯 Calculating risk score...");

//     const toolCall = await riskCalculatorTool.invoke({
//       simSwapStatus: state.simSwapChecked ? "safe" : "unknown",
//       numberVerified: state.numberVerified,
//       locationMatch: state.locationVerified,
//     });

//     const result = JSON.parse(toolCall);

//     return {
//       ...state,
//       riskScore: result.riskScore,
//       messages: [
//         ...state.messages,
//         new AIMessage(`Risk Assessment: ${result.message}`),
//       ],
//       nextStep: "Making final decision...",
//     };
//   }

  private async makeDecision(state: OnboardingState) {
    console.log("✅ Making onboarding decision...");

    let status: "approved" | "rejected";
    let message: string;

    if (state.riskScore < 40) {
      status = "approved";
      message = `🎉 Onboarding approved! Welcome to FinSentinel, ${
        state.userName || "User"
      }!`;
    } else if (state.riskScore < 70) {
      status = "approved";
      message = `⚠️ Onboarding approved with monitoring. Additional verification may be required for transactions.`;
    } else {
      status = "rejected";
      message = `❌ Onboarding rejected. Risk score too high (${state.riskScore}/100). Please contact support for manual verification.`;
    }

    return {
      ...state,
      status: status,
      messages: [...state.messages, new AIMessage(message)],
      nextStep: "Complete",
    };
  }

  async execute(input: {
    phoneNumber: string;
    userName?: string;
    language?: string;
  }) {
    const compiled = this.graph.compile();

    const initialState: OnboardingState = {
      phoneNumber: input.phoneNumber,
      userName: input.userName,
      language: input.language || "en",
      messages: [],
      simSwapChecked: false,
      numberVerified: false,
      deviceChecked: false,
      locationVerified: false,
      riskScore: 0,
      status: "pending",
    };

    const result = await compiled.invoke(initialState);
    return result;
  }
}